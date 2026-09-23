# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.

## Client revision round — 22 Sep 2026

- **Hero is The Arrival** — the standalone tower-render hero was removed at the
  client's request on 23 Sep and the pinned arrival sequence took the first fold
  (`src/components/sections/Hero.tsx`, `id="overview"`, `StoryArrival.tsx` deleted).
  Layer one is deliberately bare — the positioning line in champagne gold over
  its address, and nothing else. The wordmark, the crest, the supporting
  paragraph and both CTAs were all removed from the first fold on 23-09 at the
  client's request, so above-the-fold enquiry now runs through the navbar's
  ENQUIRE button and the sticky action bar; do not assume a hero CTA exists.
  The headline sets itself one letter at a time (`.hero-letter` in `index.css`,
  delays scheduled once at module scope in `Hero.tsx`): every letter holds its
  final box from the first frame and only opacity, blur and a small rise animate,
  so a centred display line never reflows mid-reveal. The animated letters are
  `aria-hidden` and an `sr-only` copy carries the full line, and
  `prefers-reduced-motion` drops the reveal entirely.
- **Hero slideshow** — the frames behind the statement cross-fade on a timer
  (`HERO_SLIDES` in `Hero.tsx`: garden walk, aerial, lobby; 6s dwell, 1.4s fade,
  a slow `heroSlideZoom` push). This replaced the pinned GSAP sequence that
  revealed the second frame on scroll, so the hero costs exactly one viewport
  instead of 1.55. The timer stops when the hero is off-screen or the tab is
  hidden, the dots take manual control, and `prefers-reduced-motion` holds the
  first frame with the dots still working. Frames past the first stay unmounted
  for 1.2s so the LCP image has the network to itself. **`gsap` and
  `@types/gsap` are now imported nowhere** — the bundle already tree-shook them
  out (539 kB -> 425 kB), and they can be uninstalled whenever convenient. Two rules to keep: GSAP must target
  wrappers, never elements carrying `.hero-animate-*` (those CSS animations use
  `fill-mode: both`, so their final keyframe outranks inline styles), and the
  retiring layer must fade with `autoAlpha`, not `opacity` — it holds the enquiry
  button, and a transparent button still swallows clicks. The scrims over both
  frames are **neutral black**: the client rejected the green wash on 23-09, so
  `dark-950` appears only in the top/bottom seams that blend the frame into the
  page, never as a tint across the photography. The left editorial rail and the
  large crest watermark were removed in the same note.
- **Typography** — one family only: **Playfair Display** (weights 500/600/700;
  Cormorant Garamond was replaced on 23 Sep). The roles (display / body / UI)
  differ by weight, case and tracking, not by family — that rule is the client's
  and should survive any future family change. `src/index.css` ends with a
  hardening block that clamps every Tailwind weight utility to >= 500 and nudges
  the smallest UI sizes up; Playfair is a high-contrast display face whose thin
  strokes drop out below that. Do not lower those values.
- **Section headings** — every section renders its header through
  `src/components/common/SectionHeading.tsx`. It is left-aligned and deliberately
  small (`.heading-serif` caps at 40px), and its `aside` prop puts the section's
  own controls on the heading's row instead of in a second band beneath it (see
  `FloorPlans.tsx` for the pattern). Sizing lives in `.eyebrow` /
  `.heading-serif` / `.prose-editorial`, so the whole site retunes from one
  place. Do not reintroduce per-section hand-rolled headers.
- **Palette is unchanged** — deep forest green #071510 with champagne gold
  #C8A96B. A light-sage version and a mid-dark #41584E version were both built
  on 23 Sep and reverted at the client's direction; both are recoverable from
  the git stash named `session-23-09` if they are ever wanted again.
- **Amenities** — a tile raises its photograph on hover (a fixed-position panel
  anchored to the tile, flipping below it when the navbar zone would clip it),
  and the click still opens the full lightbox. The hover path is gated on
  `(hover: hover) and (pointer: fine)`, so on touch the tap goes straight to the
  lightbox — the preview must never be the only route to the image.
- **OTP** — `sendOtp` / `verifyOtp` in `src/services/enquiryService.ts` are stubs that
  accept any 6-digit code. Replace both bodies with real provider calls before the
  site takes live leads; the UI needs no changes.
- **Floor plans** — Tower A/B plates are blurred until an enquiry is submitted
  (`hasUnlockedPlans` / `unlockPlans`, session-scoped). The master plan never locks.
- **RERA** — the registration number appears only in the footer's legal disclaimer;
  everywhere else it is a QR code (`public/assets/rera-qr.png`, generated from
  `projectData.reraUrl` by `scripts/` — replace with the client's official QR if supplied).

### Waiting on the client
`projectData.socials` (thank-you screen), `projectData.googleBusinessUrl` (Get
Directions currently falls back to a maps address search), the low-density stat
wording, a hi-res tower render, and from Parth: electrical-fittings spec, master
plan image, location AV video.
