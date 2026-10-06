# Aranya The Park — WordPress + Elementor

The approved React site (`../src`), rebuilt for WordPress so every word, image and list
can be edited in **Elementor** (free) and the SEO team controls titles, descriptions,
schema and tracking. Each section is a custom Elementor widget that prints the **same
HTML with the same styles** as the React component it replaces. The build is checked
section by section against the React site with pixel comparisons (see *Verification*).

| Package | What it is | Install it at |
|---|---|---|
| `aranya-theme.zip` | Thin theme: page shell, blog/page/404 templates | Appearance → Themes → Add New → Upload |
| `aranya-core.zip` | The site: design system, 15 Elementor widgets, enquiries, settings, SEO helpers, installer | Plugins → Add New → Upload |
| `aranya-media.zip` | The optimised images and the location film (~65 MB) | Aranya → Install Content → Upload media pack |

Build them with `npm install && npm run package` in this folder (output in `dist/`).

---

## 1. Installing (for the developer)

**Requirements:** WordPress 6.5+ (tested on 7.1), PHP 8.1+, Elementor 3.25+ free
(tested on 4.3), and a host that allows ~65 MB uploads (or FTP access).

1. Install and activate **Elementor**.
2. Upload and activate **Aranya Core**, then the **Aranya** theme.
3. **Aranya → Install Content → Upload media pack:** choose `aranya-media.zip`. It is
   unpacked into `wp-content/uploads/aranya-import/` (only image and film files are kept).
   *Or* extract it there yourself by FTP, so you have `…/aranya-import/opt/`, `…/branding/`,
   `…/video/`. *Or* type the address of a live copy of the React site into the installer to
   download from — only if that copy is the **current** build: a single-page app answers
   missing files with its home page, and the installer reports those files as failed.
4. **Aranya → Install Content → Install content.** It imports the media into the Media
   Library, creates the *Aranya Header* and *Aranya Footer* templates and the *Home*
   page, sets Home as the front page, switches Elementor's default colours/fonts off, and
   registers the brand colours and font as Elementor globals.
   WP-CLI alternative: `wp aranya install`.
5. Install **Rank Math** (recommended) or **Yoast**. Home's title, description and
   social-share fields are already filled in from the React site for both.
6. **Aranya → Site Settings → Enquiries:** add the sales team's email address(es),
   and a CRM webhook URL if there is one (see §4).
7. Once live: delete `wp-content/uploads/aranya-import/` (everything is in `uploads/aranya/` now).

Running the installer again rebuilds Home, the header and the footer from the defaults
(it asks nothing — **edits made to those three in Elementor are replaced**). Media are
reused, never duplicated; a file that is missing or not a real image is fetched again.

**Hostinger: always work on the real domain.** Hostinger also serves the site on a
preview address (`…hostingersite.com`). Its must-use plugin `hostinger-preview-domain.php`
rewrites that address to the real domain on every save and, doing so, strips one layer
of backslashes from any value holding it — which breaks Elementor's page data (JSON).
The installer detects and writes around this, but **open wp-admin and Elementor at
`https://aranyathepark.com/wp-admin`, never at the preview address.**

**Hostinger's CDN keeps images for 7 days.** If a bad copy of a file was ever served, the
CDN goes on serving it after the file is fixed. Every Aranya image and film URL carries
a media version (`?v=…`) and **running Install Content changes it**, so the CDN fetches
everything afresh. (hPanel → Websites → Performance → CDN → *Flush cache* does the same
for the whole site.)

**Site loader.** On a page with the Aranya Hero, a full-screen crest-and-wordmark screen
covers the page until the hero's first frame has loaded and decoded, then fades out;
the hero's entrance and slideshow wait behind it. It lifts anyway if that image fails,
after 8 s at most, and — should its script never run — after 12 s by CSS alone; it is
never shown in the Elementor editor. (`includes/overlays.php`,
`assets/js/site-loader-gate.js`; the React `index.html` carries the same markup and gate.)

---

## 2. Editing the site (for the content team)

Everything below is done in the browser. Nothing needs a developer.

### Page content — Pages → Home → *Edit with Elementor*

The page is ten sections, one widget each, from top to bottom:

| Widget | On the site | What you can change |
|---|---|---|
| **Aranya Hero** | The Lushury Life, full-screen | Headline, address line, the frames (image, phone image, crop, optional statement), timing, partner logo |
| **Aranya Story — Greens** | Luxury, Made Lush | Heading, the four figures, the showcase image and captions |
| **Aranya Residences** | Room to Breathe | Heading; each configuration's tab, area, name, image, description, features, which floor plans it opens |
| **Aranya Amenities** | Life Beyond Four Walls | Heading and note; each amenity's name, group, icon, photo, label and lightbox text |
| **Aranya Location** | A Neighbourhood of Quick Access | Cards, transit times, the route film, the approach text, the map; the location pop-up's places (with their map positions), infrastructure and labels |
| **Aranya Specifications** | Crafted in Every Detail | Rows of *category / feature / detail* (each category becomes a tab) |
| **Aranya Floor Plans** | Find Your Space | Heading and tabs; every plan (tower, floor label, title, image, description, highlights); lock and pop-up texts |
| **Aranya Gallery** | A Closer Look | Filter tabs; each image, title, category, caption and crop focus |
| **Aranya Developers** | The Partnership Behind Aranya | All copy, the photograph, logos, MahaRERA card, project team |
| **Aranya Site Visit Form** | Begin Your Lushury Life | All copy, form labels, configuration choices, thank-you message |

Click a section on the canvas, and its fields open in the left panel. Lists (amenities,
floor plans, gallery images, places…) are *repeaters*: **Add Item**, drag to reorder,
duplicate or delete.

- **Move or remove a whole section:** drag its container in the Navigator
  (the layers icon), or right-click → Delete / Duplicate.
- **Hide a section on phones:** select it → *Advanced* → *Responsive* → Hide On Mobile.
- **Add something new between sections:** drop in any Elementor widget. Brand colours
  (*Champagne*, *Forest*, *Ivory*…) and the *Source Serif 4* font are in the global
  pickers, and the **Aranya Section Heading** widget gives any new block the site's heading style.
- **Images:** choose from the Media Library. The alt text is taken from the Media Library;
  each image field also has an *Alt text* override.
- **Anchor links:** each section's *Section ID* is what the menu's `#links` point at. Change
  both together, if ever.

### Header and footer — Templates → Saved Templates

- **Aranya Header** holds the navbar: logos, menu links (each link can scroll to a section
  or open the Floor Plans / Location pop-up), and the Enquire button.
- **Aranya Footer** holds the footer, the floating contact button (Call / WhatsApp /
  Enquire) and the **enquiry pop-up** (every label and message of the form).

Edit with Elementor, then *Update*. They appear on every page.

### Facts used in many places — Aranya → Site Settings

Phone, WhatsApp number, address, MahaRERA number / QR / portal link, developer and
joint-venture names, Zaveri Realty link, social links, Google Business link and map pin:
enter them once here and every section that shows them updates.
Also here: the timed enquiry pop-up (on/off, delay), enquiry email/webhook, OTP provider,
tracking code and SEO fallbacks.

---

## 3. SEO (for the SEO team)

- **Titles, meta descriptions, Open Graph/Twitter, canonical, robots, sitemap, redirects:**
  your SEO plugin (Rank Math or Yoast), per page, as usual. The theme prints no titles or
  meta of its own while one of them is active.
- **Headings:** every heading field in the Aranya widgets has an **HTML tag** setting
  (H1–H6, p, div). The look never changes with the tag. The hero headline is the page's H1;
  its hidden full form ("Aranya The Park — The Lushury Life") is editable in the Hero widget.
- **Image alt text:** Media Library (all imported images already carry the React site's alt
  text) or the per-widget override.
- **Structured data:** an `ApartmentComplex` JSON-LD block (name, address, phone, amenities,
  developer, social profiles) is printed on the home page from Site Settings. Turn it off in
  *Aranya → Site Settings → SEO & Code* if your SEO plugin outputs its own.
- **Tracking:** GTM / GA4 / Meta Pixel / Search Console tags go into *Site Settings → SEO & Code*
  (head, after `<body>`, before `</body>`). Administrators only.
- **Enquiry attribution:** each enquiry stores the page URL, referrer and `utm_*` parameters.
- **Content pages and blog:** create Posts as normal (block editor) — they use the site's
  type and colours. For a landing page, create a Page and *Edit with Elementor*.
- **Core Web Vitals:** the hero's first image is preloaded with `fetchpriority="high"`, the
  font is self-hosted and preloaded, images carry `srcset`/`sizes`/dimensions, the film loads
  only when scrolled to, and scripts are deferred.
- All section text is in the page HTML (tabs, pop-ups and all residences included), so it
  is crawlable; the React site rendered it only in the browser.

---

## 4. Enquiries

Every form (the pop-up, the timed pop-up, the site-visit form) saves the lead under
**Aranya → Enquiries** with a reference like `ATP-MG3K2L8Q`: name, mobile, email,
configuration, contact preference, message, purpose (which button), page, referrer, UTM
tags. **Export CSV** is above the list.

Delivery, all optional (*Site Settings → Enquiries*):
- **Email** — comma-separated addresses. Uses the site's mail; install an SMTP plugin
  (e.g. WP Mail SMTP) so mail is delivered reliably.
- **CRM webhook** — each lead is POSTed as JSON to the URL (LeadSquared, HubSpot, Zoho,
  Salesforce, Zapier/Make…).
- **Mobile verification (OTP)** — *Demo* accepts any 6-digit code, exactly like the React
  site. **Switch to MSG91 (auth key + template ID) before taking live leads.** Other providers:
  hook `aranya_otp_send` / `aranya_otp_verify`.

Spam protection: hidden honeypot field and per-IP rate limits.

---

## 5. For developers

```
wordpress/
  build/                 build scripts (Node 22.6+)
    build-css.mjs        Tailwind v4 build — input generated from ../src/index.css
    wp-additions.css     x-cloak, Elementor compatibility layer, blog reading styles
    extract-icons.mjs    lucide-react → includes/icons.php (identical SVG markup)
    build-manifest.mjs   React image manifests → includes/media-manifest.php
    export-defaults.mjs  src/data/*.ts → includes/defaults.php (widget default content)
    fetch-fonts.mjs      self-hosts the exact Google Fonts files for Source Serif 4
    package.mjs          → dist/*.zip
  plugin/aranya-core/
    includes/            settings, media, assets, leads (REST), seo, overlays, importer,
                         elementor.php, widgets/class-*.php (one per section)
    assets/js/aranya.js  Alpine.js components — one per React component
  theme/aranya/          header/footer shell, blog/page/404 templates
```

- **The design is shared with the React site.** `npm run build:css` compiles
  `src/index.css` itself, retargeted at the PHP/JS, plus `build/wp-additions.css`. A token or
  typography change made in `src/index.css` reaches WordPress on the next build.
- **Widget defaults come from `src/data`.** Change the React data, run
  `npm run build:defaults`, and new widgets / a re-run of the installer pick it up.
- **Class strings must stay literal** in PHP/JS so Tailwind can see them (same rule as React).
- **Elementor's frontend CSS is unlayered and would beat Tailwind's layered utilities.**
  `wp-additions.css` hands the clashing properties back with `revert-layer` inside
  `.aranya-w` (every Aranya widget's wrapper). Audited against Elementor 4.3 — re-audit after a
  major Elementor upgrade.
- Behaviour is Alpine.js (`aranya.js`), mirroring each React component's state and timings;
  public API `window.Aranya.openLead / openLightbox / openFloorPlans / openLocation`.

### Verification

Each section was screenshotted on the React build and on WordPress (Playwright, Chromium,
reduced motion, fonts loaded) at 1920×923, 1440×900, 768×1024 and 390×844 and pixel-diffed;
a scripted run covers the interactive behaviour (hero timer and dots, tabs, pop-ups, ESC and
scroll lock, filters, lightbox navigation, zoom, the enquiry flow end to end, plan unlock,
contact closet, mobile menu, timed pop-up).

### Changes from the React site

- The Location section's *Transit & Highways* link opened the map filtered to a category
  (`transit`) that no place has, so every marker was dimmed. It now opens *Transit &
  Highways* (`connectivity`).
- Enquiries are stored and delivered (React kept them only in the visitor's browser).
- The floor-plan lock is, as before, a blur for the session — the full images are still
  reachable by a determined visitor.
