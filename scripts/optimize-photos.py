#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Optimise the client-supplied photography in JPGs/ into responsive WebP sets.

Every source file is renamed to a semantic slug, resized to a small set of
widths and written to public/assets/opt/, plus a manifest the app merges with
the brochure manifest (see scripts/extract-brochure-assets.py) so <Img> can
emit srcSet and intrinsic width/height for layout stability.

It also takes the client's landing-page pack in company_assets/: the project
renders and terrace-landscape renders as photos, and the architect's floor plan
PDFs, each rendered as one plan per image. A plan is turned to read level, its
frame and title block are cut away, and the architect's disclaimer is set again
in a legible band under the drawing, so every plan carries it in full.

Every photo carries a credit the site prints on it: 'artist' for renders of the
project (an artist's impression) and 'representative' for stock lifestyle
photography. Plans carry none.

Sets whose files already exist are not re-encoded; pass --force to redo them.

Usage:  python scripts/optimize-photos.py            (all photos)
        python scripts/optimize-photos.py hero-tower  (only slugs containing the text)
        python scripts/optimize-photos.py --force     (re-encode everything)
Needs:  Pillow, NumPy and PyMuPDF (for the plans)
"""

import io
import os
import sys

from PIL import Image, ImageDraw, ImageFont, ImageOps

Image.MAX_IMAGE_PIXELS = None  # some sources are > 100 MP

SRC = 'JPGs'
OUT = 'public/assets/opt'
MANIFEST = 'src/data/photoManifest.ts'
OG_IMAGE = 'public/assets/og-image.jpg'

# Responsive widths per placement.
#   photo — card / half-width imagery
#   hero  — the tower render; full column height on desktop, full-bleed mobile
WIDTHS = {
    'photo': [640, 1280, 2000],
    'hero':  [800, 1400, 2000, 2600],
    'plan':  [800, 1600, 2600],
}

PACK = 'company_assets/Data for Landing Page'
RENDERS = PACK + '/Renders'
TERRACE = PACK + '/Terrace Landscape'
PLANS_DIR = PACK + '/Floor Plans'

# slug -> (source file in JPGs/, or a path containing '/', kind)
PHOTOS = {
    # architectural renders
    'render-tower-dusk':        ('ra_pa_01 copy.jpg', 'hero'),
    'render-tower-day':         ('tower-elevation-day.jpg', 'hero'),
    'render-grand-lobby':       ('Lobby 2.jpg', 'photo'),
    'render-lift-lobby':        ('Ground Floor Lobby 3.jpg', 'photo'),
    'render-entrance-drive':    ('Lobby 4 copy.jpg', 'photo'),
    'render-gym':               ('Gym 3D 2.jpg', 'photo'),
    # amenities
    'amenity-games-lounge':     ('pool-poker-games-room-decorated-with-luxurious-planned-designed-furniture copy.jpg', 'photo'),
    'amenity-banquet-hall':     ('shutterstock_2472597195.jpg', 'photo'),
    'amenity-parking':          ('cars-parked-underground-parking-lot copy.jpg', 'photo'),
    'amenity-pickleball-play':  ('freepik__enhance__81056 copy.jpg', 'photo'),
    'amenity-seniors-terrace':  ('freepik__enhance__53474.tif', 'photo'),
    'amenity-kids-swing':       ('freepik__enhance__99528.jpg', 'photo'),
    'amenity-yoga-deck':        ('freepik__enhance__96501.jpg', 'photo'),
    'amenity-rooftop-pergola':  ('freepik__enhance__26814 copy.jpg', 'photo'),
    # lifestyle
    'life-garden-walk':         ('freepik__enhance__33571_ copy.jpg', 'photo'),
    'life-family-garden':       ('freepik__a-cheerful-young-south-indian-white-family-walking__47922 copy.jpg', 'photo'),
    'life-family-living':       ('freepik_58038_2 use copy.jpg', 'photo'),
    'life-family-sofa':         ('freepik__enhance__71012 copy.jpg', 'photo'),
    'life-sunset-terrace':      ('freepik__two-people-average-age-25-average-race-indain-sitt__41183 copy.jpg', 'photo'),
    'life-skyline-night':       ('freepik__enhance__80134 copy.jpg', 'photo'),
    'life-lobby-arrival':       ('freepik__upload__61429 copy.jpg', 'photo'),
    # neighbourhood / connectivity
    'city-shopping':            ('freepik__enhance__78482 copy.jpg', 'photo'),
    'city-school':              ('schoolboy-raising-hand-class.jpg', 'photo'),
    'city-hospital':            ('logo_make_11_06_2023_295.jpg', 'photo'),
    'city-local-train':         ('shutterstock_715863751 copy.jpg', 'photo'),
    'city-metro':               ('moving-train copy.jpg', 'photo'),
    'city-airport':             ('airport-interior-with-airplane-outside-window-sunset-empty-seats-waiting-area-modern (2).jpg', 'photo'),
    'city-highway':             ('shutterstock_337172573 copy.jpg', 'photo'),
    # the client's project renders
    'render-tower-a-dusk':      (RENDERS + '/Tower A_01.jpg', 'photo'),
    'render-tower-a-evening':   (RENDERS + '/Tower A_02.jpg', 'photo'),
    'render-tower-a-day':       (RENDERS + '/Tower A_03.jpg', 'photo'),
    'render-tower-b-dusk':      (RENDERS + '/Tower B_01.jpg', 'photo'),
    'render-tower-b-evening':   (RENDERS + '/Tower B_02.jpg', 'photo'),
    'render-aerial-top':        (RENDERS + '/Top Back View.JPEG', 'photo'),
    'render-main-gate':         (RENDERS + '/Main gate.png', 'photo'),
    'render-entrance-gate':     (RENDERS + '/Entrance Gate.png', 'photo'),
    'render-compound-wall':     (RENDERS + '/Compound wall.jpg', 'photo'),
    'render-fitness-club':      (RENDERS + '/FINAL VEIW.png', 'hero'),
    'render-clubhouse':         (RENDERS + '/perspective -1.jpg.jpeg', 'photo'),
    # terrace landscape renders
    'render-terrace-a20-day':   (TERRACE + '/Tower A/20th Floor/D3.png', 'photo'),
    'render-terrace-a20-night': (TERRACE + '/Tower A/20th Floor/N3.png', 'photo'),
    'render-terrace-a21-day':   (TERRACE + '/Tower A/21st Floor/D2.png', 'photo'),
    'render-terrace-a21-night': (TERRACE + '/Tower A/21st Floor/N2.png', 'photo'),
    'render-terrace-b-day':     (TERRACE + '/Tower B/D3.png', 'photo'),
    'render-terrace-b-garden':  (TERRACE + '/Tower B/D5.png', 'photo'),
    'render-terrace-b-night':   (TERRACE + '/Tower B/N1.png', 'photo'),
}

# Anything rendered from the project is an artist's impression; the rest is
# stock photography standing in for the lifestyle.
def credit_for(slug):
    return 'artist' if slug.startswith('render-') else 'representative'

# How a plan sheet is laid out, which decides how it is cut down to the drawing.
SIDEWAYS = 'sideways'   # drawn across a portrait page, title block down the left edge
UPRIGHT = 'upright'     # framed, title block along the bottom
PLAIN = 'plain'         # the drawing alone: no frame, no title block

# The architect's drawings, one plan per sheet: slug -> (PDF under PLANS_DIR, layout).
PLANS = {
    'fp-master-layout': ('../MASTER LAYOUT.pdf', PLAIN),
    'fp-club-ground':   ('CLUB HOUSE GR FLOOR.pdf', PLAIN),
    'fp-club-first':    ('CLUB HOUSE FIRST FLOOR.pdf', PLAIN),
    'fp-a-ground':      ('Tower A/TOWER-A-GROUND FLOOR.pdf', PLAIN),
    'fp-a-roof':        ('Tower A/Terrace Layout-A.pdf', SIDEWAYS),
    'fp-a-jodi':        ('Tower A/JODI FLAT .pdf', UPRIGHT),
    'fp-b-ground':      ('Tower B/TOWER-B GROUND FLOOR.pdf', PLAIN),
    'fp-b-first':       ('Tower B/TOWER-B FIRST FLOOR.pdf', PLAIN),
    'fp-b-typical':     ('Tower B/03-R1-TYPICAL FLOOR PLAN.pdf', SIDEWAYS),
    'fp-b-roof':        ('Tower B/Terrace Layout-B.pdf', SIDEWAYS),
    'fp-b-2bhk':        ('Tower B/2BHK-1.pdf', UPRIGHT),
    'fp-b-3bhk':        ('Tower B/3BHK.pdf', UPRIGHT),
    'fp-b-5bhk':        ('Tower B/5BHK.pdf', UPRIGHT),
}
# Tower A has a sheet per floor. The 3rd is the 2nd drawn again, so it is
# left out and the site shows the pair as one. The refuge floors (8th, 15th)
# are not shown on the site.
_ORD = {1: 'ST', 2: 'ND'}
for _n in [1, 2] + [n for n in range(4, 21) if n not in (8, 15)]:
    PLANS['fp-a-%02d' % _n] = ('Tower A/%02d-R1-%d%s-FP-ARANYA-061025.pdf' % (
        _n, _n, _ORD.get(_n, 'TH')), SIDEWAYS)

# The architect's disclaimer, word for word from the sheets. On a sheet it is a
# hairline of type above the title block; every plan here carries it legibly.
DISCLAIMER = (
    'Disclaimer: The designs, plans, elevation, specifications, facilities, images etc. '
    'are only indicative and subject to the approval of the respective authorities. '
    'The owner / developer reserves the right to change the specifications or features. '
    'This does not constitute an offer and / or contract of any such type between the '
    'owner / developer and the recipient.'
)
FONT = 'scripts/fonts/SourceSerif4[opsz,wght].ttf'   # the site's one family (OFL)

QUALITY = 80
PLAN_QUALITY = 86   # line work smears at the photo setting


def load(path, max_width):
    """Open a source image, honour EXIF rotation and pre-shrink JPEGs cheaply."""
    im = Image.open(path)
    if im.format == 'JPEG':
        # Let libjpeg decode at 1/2, 1/4, 1/8 scale when the target is much smaller.
        im.draft('RGB', (max_width * 2, max_width * 2))
    im = ImageOps.exif_transpose(im)
    return im.convert('RGB')


def _runs(flags, gap):
    """(first, last) index of each run of true flags, bridging gaps up to `gap`."""
    runs = []
    for i in flags.nonzero()[0]:
        if runs and i - runs[-1][1] <= gap:
            runs[-1][1] = i
        else:
            runs.append([i, i])
    return runs


def _long_lines(ink):
    """(first, last) column of each vertical line inked down half the sheet.

    Columns are found in narrow bands, since a frame drawn a few pixels off
    true never fills a single column, then narrowed to the line's own pixels:
    type can sit a hair above the title block's rule.
    """
    h, w = ink.shape
    b = max(1, round(w * 0.006))
    bands = ink[:, :w // b * b].reshape(h, w // b, b).any(axis=2).mean(axis=0) > 0.5
    share = ink.mean(axis=0)
    lines = []
    for r0, r1 in _runs(bands, 2):
        own = (share[r0 * b:r1 * b + b] > 0.15).nonzero()[0] + r0 * b
        lines.append([own[0], own[-1]] if len(own) else [r0 * b, r1 * b + b - 1])
    return lines


def strip_title_block(im):
    """Keep what lies inside a sheet's frame and above its title block.

    The frame and the rule over the title block are the lines that run across
    most of the sheet: the first and last each way are the frame, and the
    one before the last across tops the title block.
    """
    import numpy as np
    ink = np.asarray(im.convert('L')) < 128
    h, w = ink.shape
    rows, cols = _long_lines(ink.T), _long_lines(ink)
    if len(rows) < 3 or len(cols) < 2 or rows[-2][0] < h * 0.6:
        raise ValueError('no frame and title block found')
    m = round(w * 0.002)
    return im.crop((cols[0][1] + m, rows[0][1] + m, cols[-1][0] - m, rows[-2][0] - m))


def erase_sheet_disclaimer(im):
    """White out the architect's disclaimer, the two lines of type above the
    title block, so it is not printed twice once add_disclaimer sets it again.

    It is the widest run of ink in the lowest line; a key plan may sit beside
    it, so only that run is erased.
    """
    import numpy as np
    ink = np.asarray(im.convert('L')) < 200
    h, w = ink.shape
    inked = ink.any(axis=1).nonzero()[0]
    if not len(inked):
        return im
    bottom = inked[-1]
    last_line = ink[bottom - round(h * 0.008):bottom + 1].any(axis=0)
    c0, c1 = max(_runs(last_line, round(w * 0.03)), key=lambda r: r[1] - r[0])
    if c1 - c0 < w * 0.2:
        return im   # no disclaimer on this sheet
    # Its two lines are the last two runs of inked rows under it. The area
    # table can sit close above, so count lines rather than look for a gap.
    lines = _runs(ink[:bottom + 1, c0:c1 + 1].any(axis=1), 1)[-2:]
    top = lines[0][0]
    if bottom - top > h * 0.03:
        raise ValueError('disclaimer not found where expected')
    # The first line may run wider than the last.
    runs = _runs(ink[top:bottom + 1].any(axis=0), round(w * 0.03))
    c0, c1 = next(r for r in runs if r[0] <= c1 and r[1] >= c0)
    pad = round(h * 0.003)
    ImageDraw.Draw(im).rectangle((c0 - pad, top - pad, c1 + pad, bottom + pad), fill='white')
    return im


def trim(im, pad):
    """Crop to the drawing, keeping `pad` px of white around it."""
    # Anything darker than near-white is drawing.
    box = ImageOps.invert(im.convert('L')).point(lambda v: 255 if v > 12 else 0).getbbox()
    if not box:
        return im
    return im.crop((max(box[0] - pad, 0), max(box[1] - pad, 0),
                    min(box[2] + pad, im.width), min(box[3] + pad, im.height)))


def add_disclaimer(im):
    """Set DISCLAIMER in a band under the drawing, sized to read with it."""
    w, h = im.size
    size = round(max(w, h) * 0.011)
    font = ImageFont.truetype(FONT, size)
    # Weight 500 and the small-text optical size: on screen the band reads
    # at 10-13px, however many pixels it has in the file. Axes: wght, opsz.
    font.set_variation_by_axes([500, 10])
    measure = min(w * 0.9, size * 58)   # about 110 characters a line

    lines, line = [], ''
    for word in DISCLAIMER.split():
        trial = (line + ' ' + word).strip()
        if line and font.getlength(trial) > measure:
            lines.append(line)
            line = word
        else:
            line = trial
    lines.append(line)

    leading = round(size * 1.5)
    rule_gap = round(size * 1.1)
    band = rule_gap * 2 + leading * len(lines) + round(size * 0.6)
    out = Image.new('RGB', (w, h + band), 'white')
    out.paste(im, (0, 0))
    d = ImageDraw.Draw(out)
    text_w = max(font.getlength(l) for l in lines)
    x0 = round((w - text_w) / 2)
    d.line((x0, h, x0 + text_w, h), fill=(200, 196, 188), width=max(2, size // 18))
    y = h + rule_gap
    for l in lines:
        d.text((w / 2, y), l, font=font, fill=(64, 64, 64), anchor='ma')
        y += leading
    return out


def render_drawing(pdf, width, layout):
    """Render a one-sheet plan PDF with the sheet `width` px across, turned to
    read level and cut down to the drawing."""
    import fitz  # PyMuPDF
    page = fitz.open(pdf)[0]
    across = page.rect.height if layout == SIDEWAYS else page.rect.width
    zoom = width / across
    pm = page.get_pixmap(matrix=fitz.Matrix(zoom, zoom), alpha=False)
    im = Image.frombytes('RGB', (pm.width, pm.height), pm.samples)
    if layout == SIDEWAYS:
        im = im.transpose(Image.Transpose.ROTATE_90)   # a quarter-turn anticlockwise
    if layout != PLAIN:
        im = erase_sheet_disclaimer(strip_title_block(im))
    return trim(im, round(width * 0.012))


def render_plan(pdf, width, layout):
    """The drawing on a plan sheet with the disclaimer set under it, never
    narrower than the largest plan width, so every plan has its full set."""
    min_w = WIDTHS['plan'][-1]
    im = render_drawing(pdf, width, layout)
    if im.width < min_w:   # a small drawing on a large sheet: render it bigger
        im = render_drawing(pdf, width * min_w / im.width * 1.02, layout)
    return add_disclaimer(im)


def set_paths(slug, width, height, kind):
    """The (width, path) pairs a set will have, without decoding anything."""
    out = []
    for w in WIDTHS[kind]:
        w = min(w, width)
        out.append((w, '%s/%s-%d.webp' % (OUT, slug, w)))
        if w == width:
            break
    return out


def write_set(slug, im, kind, quality=QUALITY):
    """Write the responsive WebP set for one image; returns (manifest entry, bytes)."""
    srcset = []
    size = 0
    pairs = set_paths(slug, im.width, im.height, kind)
    for w, path in pairs:
        h = round(im.height * w / im.width)
        im.resize((w, h), Image.Resampling.LANCZOS).save(path, 'WEBP', quality=quality, method=6)
        size += os.path.getsize(path)
        srcset.append('/assets/opt/%s-%d.webp %dw' % (slug, w, w))
    w = pairs[-1][0]
    entry = ('/assets/opt/%s-%d.webp' % (slug, w), ', '.join(srcset), w, round(im.height * w / im.width))
    return entry, size


def existing_set(slug, kind):
    """Rebuild the manifest entry from files already on disk, or None."""
    import glob
    files = sorted(glob.glob('%s/%s-[0-9]*.webp' % (OUT, slug)),
                   key=lambda p: int(p.rsplit('-', 1)[1].split('.')[0]))
    # Only the slug's own width variants, never a longer slug that shares its prefix.
    files = [p for p in files if os.path.basename(p)[len(slug) + 1:].split('.')[0].isdigit()]
    if not files:
        return None
    w, h = Image.open(files[-1]).size
    srcset = ', '.join('/assets/opt/%s %dw' % (os.path.basename(p), Image.open(p).size[0]) for p in files)
    return ('/assets/opt/%s' % os.path.basename(files[-1]), srcset, w, h)


def main():
    args = [a for a in sys.argv[1:] if a != '--force']
    force = '--force' in sys.argv
    only = args[0] if args else None
    if not os.path.isdir(SRC):
        sys.exit('Cannot find %s/ — run from the project root.' % SRC)
    os.makedirs(OUT, exist_ok=True)

    entries = []   # (src, srcset, w, h, kind, credit)
    total = 0
    for slug, (filename, kind) in PHOTOS.items():
        credit = credit_for(slug)
        cached = None if force else existing_set(slug, kind)
        if cached and not (only and only in slug):
            entries.append(cached + ('photo', credit))
            continue
        if only and only not in slug:
            continue
        src = filename if '/' in filename else os.path.join(SRC, filename)
        if not os.path.exists(src):
            print('  !! missing %s' % src)
            continue

        im = load(src, WIDTHS[kind][-1])
        entry, size = write_set(slug, im, kind)
        entries.append(entry + ('photo', credit))
        total += size
        print('  %-26s %-5s %dx%d' % (slug, kind, im.width, im.height))

        if slug == 'render-tower-dusk':
            # 1200x630 social card: centre on the tower, keep the dusk sky.
            ow, oh = 1200, 630
            scale = ow / im.width
            scaled = im.resize((ow, round(im.height * scale)), Image.Resampling.LANCZOS)
            top = int(scaled.height * 0.58 - oh / 2)
            scaled.crop((0, top, ow, top + oh)).save(OG_IMAGE, 'JPEG', quality=84, optimize=True)

    # The architect's plans, one sheet per image
    for slug, (rel, layout) in PLANS.items():
        cached = None if force else existing_set(slug, 'plan')
        if cached and not (only and only in slug):
            entries.append(cached + ('plan', None))
            continue
        if only and only not in slug:
            continue
        pdf = os.path.normpath(os.path.join(PLANS_DIR, rel))
        if not os.path.exists(pdf):
            print('  !! missing %s' % pdf)
            continue
        # Rendered at twice the largest width, so a drawing that fills only part
        # of its sheet still has the pixels once the margin is trimmed away.
        im = render_plan(pdf, WIDTHS['plan'][-1] * 2, layout)
        entry, size = write_set(slug, im, 'plan', PLAN_QUALITY)
        entries.append(entry + ('plan', None))
        total += size
        print('  %-26s plan  %dx%d' % (slug, im.width, im.height))

    if only:
        print('\n  partial run — manifest not rewritten')
        return

    with io.open(MANIFEST, 'w', encoding='utf-8', newline='\n') as fh:
        fh.write('// AUTO-GENERATED by scripts/optimize-photos.py — do not edit.\n')
        fh.write('// Re-run the script after adding photos to JPGs/ or company_assets/.\n\n')
        fh.write("import type { ManifestEntry } from './imageManifest';\n\n")
        fh.write('export const photoManifest: Record<string, ManifestEntry> = {\n')
        for src, srcset, w, h, kind, credit in entries:
            fh.write("  '%s': {\n" % src)
            fh.write("    srcSet: '%s',\n" % srcset)
            fh.write('    width: %d,\n    height: %d,\n' % (w, h))
            fh.write("    kind: '%s',\n" % kind)
            if credit:
                fh.write("    credit: '%s',\n" % credit)
            fh.write('  },\n')
        fh.write('};\n')

    print('\n  %d images, %.1f MB of new WebP' % (len(entries), total / 1048576.0))
    print('  manifest -> %s' % MANIFEST)


if __name__ == '__main__':
    main()
