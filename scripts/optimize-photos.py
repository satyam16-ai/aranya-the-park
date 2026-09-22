#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Optimise the client-supplied photography in JPGs/ into responsive WebP sets.

Every source file is renamed to a semantic slug, resized to a small set of
widths and written to public/assets/opt/, plus a manifest the app merges with
the brochure manifest (see scripts/extract-brochure-assets.py) so <Img> can
emit srcSet and intrinsic width/height for layout stability.

Usage:  python scripts/optimize-photos.py            (all photos)
        python scripts/optimize-photos.py hero-tower  (only slugs containing the text)
Needs:  Pillow
"""

import io
import os
import sys

from PIL import Image, ImageOps

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
}

# slug -> (source file in JPGs/, kind)
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
}

# Renders that exist only inside the brochure PDF. The embedded raster is
# pulled out at its native resolution (no page frame, no printed caption).
# slug -> (1-based PDF page, kind); the largest raster on that page is used.
BROCHURE = 'Aranya _E_Brochure 2.pdf'
EMBEDDED = {
    'render-fitness-pavilion': (15, 'photo'),
    'render-aerial-towers':    (30, 'hero'),
}

QUALITY = 80


def load(path, max_width):
    """Open a source image, honour EXIF rotation and pre-shrink JPEGs cheaply."""
    im = Image.open(path)
    if im.format == 'JPEG':
        # Let libjpeg decode at 1/2, 1/4, 1/8 scale when the target is much smaller.
        im.draft('RGB', (max_width * 2, max_width * 2))
    im = ImageOps.exif_transpose(im)
    return im.convert('RGB')


def write_set(slug, im, kind):
    """Write the responsive WebP set for one image; returns (manifest entry, bytes)."""
    srcset = []
    biggest = None
    size = 0
    for w in WIDTHS[kind]:
        if w >= im.width:
            w = im.width
        h = round(im.height * w / im.width)
        path = '%s/%s-%d.webp' % (OUT, slug, w)
        im.resize((w, h), Image.Resampling.LANCZOS).save(path, 'WEBP', quality=QUALITY, method=6)
        size += os.path.getsize(path)
        srcset.append('/assets/opt/%s-%d.webp %dw' % (slug, w, w))
        biggest = (w, h)
        if w == im.width:
            break
    entry = ('/assets/opt/%s-%d.webp' % (slug, biggest[0]), ', '.join(srcset), biggest[0], biggest[1])
    return entry, size


def main():
    only = sys.argv[1] if len(sys.argv) > 1 else None
    if not os.path.isdir(SRC):
        sys.exit('Cannot find %s/ — run from the project root.' % SRC)
    os.makedirs(OUT, exist_ok=True)

    entries = []
    total = 0
    for slug, (filename, kind) in PHOTOS.items():
        if only and only not in slug:
            continue
        src = os.path.join(SRC, filename)
        if not os.path.exists(src):
            print('  !! missing %s' % src)
            continue

        im = load(src, WIDTHS[kind][-1])
        entry, size = write_set(slug, im, kind)
        entries.append(entry)
        total += size
        print('  %-26s %-5s %dx%d' % (slug, kind, im.width, im.height))

        if slug == 'render-tower-dusk':
            # 1200x630 social card: centre on the tower, keep the dusk sky.
            ow, oh = 1200, 630
            scale = ow / im.width
            scaled = im.resize((ow, round(im.height * scale)), Image.Resampling.LANCZOS)
            top = int(scaled.height * 0.58 - oh / 2)
            scaled.crop((0, top, ow, top + oh)).save(OG_IMAGE, 'JPEG', quality=84, optimize=True)

    # Renders embedded in the brochure PDF
    if os.path.exists(BROCHURE) and EMBEDDED:
        import fitz  # PyMuPDF
        doc = fitz.open(BROCHURE)
        for slug, (pno, kind) in EMBEDDED.items():
            if only and only not in slug:
                continue
            page = doc[pno - 1]
            # (xref, smask, width, height, ...) -> keep the largest raster on the page
            xref = max(page.get_images(full=True), key=lambda info: info[2] * info[3])[0]
            im = Image.open(io.BytesIO(doc.extract_image(xref)['image']))
            im = ImageOps.exif_transpose(im).convert('RGB')
            entry, size = write_set(slug, im, kind)
            entries.append(entry)
            total += size
            print('  %-26s p%-3d %dx%d (brochure raster)' % (slug, pno, im.width, im.height))

    if only:
        print('\n  partial run — manifest not rewritten')
        return

    with io.open(MANIFEST, 'w', encoding='utf-8', newline='\n') as fh:
        fh.write('// AUTO-GENERATED by scripts/optimize-photos.py — do not edit.\n')
        fh.write('// Re-run the script after adding photos to JPGs/ or changing the width presets.\n\n')
        fh.write("import type { ManifestEntry } from './imageManifest';\n\n")
        fh.write('export const photoManifest: Record<string, ManifestEntry> = {\n')
        for src, srcset, w, h in entries:
            fh.write("  '%s': {\n" % src)
            fh.write("    srcSet: '%s',\n" % srcset)
            fh.write('    width: %d,\n    height: %d,\n' % (w, h))
            fh.write("    kind: 'photo',\n  },\n")
        fh.write('};\n')

    print('\n  %d photos, %.1f MB of WebP' % (len(entries), total / 1048576.0))
    print('  manifest -> %s' % MANIFEST)


if __name__ == '__main__':
    main()
