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

- **Typography** — one family only: Cormorant Garamond at weights 500/600/700. The
  roles (display / body / UI) differ by weight, case and tracking, not by family.
  `src/index.css` ends with a hardening block that clamps every Tailwind weight
  utility to >= 500 and nudges the 10-11px UI sizes up; Cormorant is a light-set
  serif and renders as hairlines below that. Do not lower those values.
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
