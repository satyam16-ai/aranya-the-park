# Aranya The Park — marketing site

Single-page React 19 + Vite 8 + Tailwind CSS v4 site for *Aranya The Park*, Malad West, Mumbai (Zaveri Realty × BKM Mindspace). Deployed on Vercel (`vercel.json` SPA rewrite).

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # tsc -b && vite build → dist/
npm run lint      # oxlint
```

## Design system

Everything lives in `src/index.css` (Tailwind v4 CSS-first config):

- **Colour** — `gold-*` anchored on the logo gold `#A68A5D`, `forest-*` anchored on the brochure's sage green, `linen-*` warm neutrals. Every section sets `data-surface="white|linen|gold|sage|deep|deepest"`; components use the semantic utilities (`text-fg`, `text-fg-muted`, `text-accent-text`, `bg-card`, `border-rule`, …) so one component works on every surface. Adjacent sections never share a surface.
- **Type** — Bodoni Moda (display; `t-display`, `t-h1`, `t-h2`, `t-h3`, `t-stat`, `t-foil`) and Jost (text/UI; `t-lead`, `t-body`, `t-small`, `t-micro`, `t-eyebrow`). Bodoni Moda is pinned to its text optical size (`font-variation-settings: "opsz" 6` on `body`) so hairlines stay solid on 1× screens — never re-enable `font-optical-sizing`. Jost never goes below weight 450. The script wordmark is only ever the logo artwork.
- **Devices** — `frame` (brochure double gold rule), `watermark` (crest), `pinstripe`, `botanical`, `icon-ring`.
- **Motion** — framer-motion only (`src/lib/motion.ts`), `<MotionConfig reducedMotion="user">` in `App.tsx`.

Primitives are in `src/components/common/` (`Button`, `SectionIntro`, `Tabs`, `Frame`, `Card`, `Stat`, `Reveal`, `ImageReveal`, `Modal`, `Lightbox`, `IntentPrompt`, …).

## Images

- Client photography goes in `JPGs/` (git-ignored). Run `python scripts/optimize-photos.py` to produce responsive WebP sets in `public/assets/opt/` and `src/data/photoManifest.ts`. Renders that only exist inside the brochure PDF (the aerial, the fitness pavilion) are pulled out at native resolution via the `EMBEDDED` table in the same script.
- Brochure pages (floor plans, map) come from `python scripts/extract-brochure-assets.py` → `src/data/imageManifest.ts`.
- `<Img>` merges both manifests to emit `srcSet`, `width` and `height`.

Both scripts need Pillow; the brochure crops also need PyMuPDF (`pip install pillow pymupdf`).

## Content

All copy and data sit in `src/data/*.ts` (`projectData`, `heroSlides`, `residencesData`, `amenitiesData`, `locationData`, `specificationsData`, `floorPlansData`, `galleryData`, `developerData`). The hero carousel (`heroSlides`) auto-advances every 6 s while on screen, pauses on hover / when paused / under reduced motion, and keeps the first slide as the preloaded LCP image. Carpet areas are omitted from `residencesData` until the client supplies them — adding `carpetArea` to a unit renders it automatically.

## Leads

`src/services/enquiryService.ts` is still a local mock (writes to `localStorage['aranya_the_park_enquiries']`). Replace `submitEnquiry` with a real endpoint before launch. The enquiry prompt (`IntentPrompt`) shows once per session after 20 s on 60 % scroll depth or desktop exit-intent, and never if the enquiry modal was already used.
