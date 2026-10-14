# SIRAJ Digital Experience v1.0 — website

Arabic-first, native RTL, static website for SIRAJ Real Estate Development, built **on** the frozen Brand Identity,
Design System and Motion System v1.0 (no identity change). Source: `website/`. Status: `../../DIGITAL_EXPERIENCE_STATUS.md`.

| Doc | Purpose |
|---|---|
| this file | architecture, routes, components, content, assets, motion, SEO, accessibility, performance |
| [`QA_REPORT_v1.0.md`](QA_REPORT_v1.0.md) | design review against the guidelines + automated test results + screenshots |
| [`forms-contract.md`](forms-contract.md) | Register Interest + Contact: payload, validation, disabled transport, how to enable |
| [`deployment-runbook.md`](deployment-runbook.md) | build, host settings, redirects, headers, DNS (owner action), checks, rollback |
| [`email-signature.md`](email-signature.md) | stable hosted paths for the signature images |
| `screens/` | full-page screenshots at 390 px and 1920 px, produced by `npm run verify:web` |

## Architecture

- **Astro 7 + TypeScript (strict)**, static output (`website/dist/`), `trailingSlash: 'always'`, directory URLs.
- **Zero framework runtime.** One bundled module (~11 KB, ~4 KB gzip): Design System JS (drawer), motion observer, form validation.
- **CSS chain** (in `src/layouts/Base.astro`): fonts → `design-system/build/siraj-ds.css` (tokens) → `siraj-ds-typography.css`
  → `design-system/css/siraj-ds-base.css` → `design-system/components/siraj-ds.css` → `motion-system/tokens/build/siraj-motion.css`
  → `src/styles/site.css` (page composition only, tokens only, logical properties).
- **Assets** are read from the repository at build time; nothing is copied by hand:
  `scripts/prepare-assets.mjs` → fonts (Tajawal Arabic 300–800, Jost Latin 200–500, WOFF2), official logo SVGs, favicons + manifest,
  email-signature images, 4 Open Graph images (1200 × 630, built from the approved renders with the Sand logo bottom-right).
  Photos go through `astro:assets` `<Picture>` → AVIF + WebP, responsive widths, explicit width/height, lazy below the fold.
- **Icons:** the official `07-Icon-System` sprite, inlined once per page, pruned at build to the icons the site uses.

## Routes

| Route | Content |
|---|---|
| `/` | hero (Lantern key visual, «أوّلُ الضوء.»), the company in one paragraph + light · material · detail, one silk ribbon gesture, the project in Muscat, Silk & Light (curtain line, Reveal key visual), register-interest CTA |
| `/about/` | approach (render + text), how we work (place & light · architecture & material · life & detail), current project teaser |
| `/project/` | «مسقط» + «شقق سكنية ومحلات تجارية», confirmed facts only, architecture text + 6 approved renders, Silk & Light story (4 key visuals), CTA |
| `/contact/` | channels (phone 7771 4404, Instagram icon + SIRAJPROPERTIES), Register Interest form, Contact form |
| `/404.html` | Arabic not-found page (noindex) |

## Content rules applied (frozen v1.0)

- Arabic only; Latin only for the logo, `SIRAJPROPERTIES`, the phone and `WWW.SIRAJPROPERTIES.NET`.
- Brand/project name is **the logo only**: «سراج» is never typed, not even in `alt` (logo alt = "SIRAJ").
  The postponed project lettering is not used; the project is identified by the logo, «مسقط» and «شقق سكنية ومحلات تجارية».
- Phone always `7771 4404` (links keep `77714404` / `+96877714404`); Instagram always icon + `SIRAJPROPERTIES`, never «@».
- No email address, street address, prices, areas, unit counts or dates. Unknown data is hidden, not shown as «—».
- WhatsApp is hidden until its number is confirmed (`brand.config.json → contact.whatsapp_status`).
- No internal strategy lines, no self-praise, no fictional projects, no «في الأعلى / في الأرض / في الطابق الأرضي».
- Approved images only: `14-Property-Marketing/12-Project-Siraj/Source/Clean` renders, `…/Key-Visuals`, `06-SIRAJ-Silk` stills.
- Silk restraint: one ribbon gesture between sections, silk in key visuals and the CTA panel only; never over information.

Copy lives in the `.astro` pages; shared facts in `src/data/site.ts` (read from `00-Brand-Foundation/brand.config.json`),
images and Arabic alt text in `src/data/media.ts`.

## Design System reuse

| Website part | Design System v1.0 |
|---|---|
| Header, nav, mobile drawer | `.siraj-header`, `.siraj-nav`, `.siraj-drawer` + `siraj-ds.js` |
| Hero | `.siraj-hero`, `.siraj-hero__title`, `.siraj-t-light` / `.siraj-t-heavy` display pairing |
| Buttons | `.siraj-btn--primary / --secondary / --ghost / --link`, `.siraj-btn-row` |
| Eyebrows, lumen mark | `.siraj-eyebrow`, `.siraj-lumen` |
| Sections, container, themes | `.siraj-section(--alt)`, `.siraj-container`, `data-theme="dark"` |
| Silk corner / CTA panel | `.siraj-silk-corner`, `.siraj-cta`, `.siraj-cta__silk` |
| Contact channels | `.siraj-contact__channels`, `.siraj-channel` |
| Form fields, alerts | `.siraj-field`, `.siraj-input`, `.siraj-select`, `.siraj-textarea`, `.siraj-check`, `.siraj-alert` |
| Footer | `.siraj-footer` (dark) |
| Skip link, focus ring | `.siraj-skip`, DS focus tokens |

Website-only composition classes are prefixed `sj-` (`site.css`) and use DS tokens exclusively.

## Motion (Motion System v1.0)

- Classes from `siraj-motion.css`: `.m-enter` (SETTLE), `.m-reveal` (REVEAL from the start side), `.m-line` (line rise), levels
  `.m-standard`, `.m-emphasis`, `.m-hero`, `.m-cinematic`; stagger via `--m-i`.
- `src/scripts/motion.ts`: elements in view on load animate at once (hero); others settle as they enter the viewport
  (IntersectionObserver; masked REVEAL elements are observed through their parent).
- The ribbon gesture glides in right → left and settles (one direction, no loop, no bounce).
- **Reduced motion:** everything is shown immediately (tokens reduce to a 120 ms opacity change), the ribbon does not move,
  smooth scrolling is off. **No JavaScript:** nothing is hidden (`html:not(.sj-js)` override + 2.5 s safety fallback).

## SEO

- Canonical `https://www.sirajproperties.net/…` on every page; `<html lang="ar" dir="rtl">`; one `<h1>` per page.
- Title pattern «Page — SIRAJ»; home «SIRAJ — شقق سكنية ومحلات تجارية في مسقط».
- Open Graph + Twitter card with page-specific 1200 × 630 images, `og:locale ar_OM`.
- JSON-LD `RealEstateAgent` (name SIRAJ, telephone +96877714404, Instagram `sameAs`, `areaServed` Muscat). No address or email.
- `sitemap-index.xml` (404 excluded), `robots.txt`, SVG + PNG favicons, Apple touch icon, `site.webmanifest`.

## Accessibility

WCAG 2.1 AA target: skip link first in tab order, visible focus, landmarks, labelled forms with linked Arabic errors, focus to
the first invalid field, 44 px touch targets on mobile, functional Arabic alt text (decorative silk `alt=""`), Arabic line
heights (display ≥ 1.3, headings ≥ 1.4, body ≥ 1.6), reduced motion honoured. axe-core reports **0 violations** on every page.

## Performance (mobile, 390 px @2×, first view)

| Page | Transfer | of which JS | LCP (local) |
|---|---|---|---|
| `/` | 528 KB | 13 KB | 0.08 s (hero image) |
| `/about/` | 381 KB | 13 KB | 0.74 s (h1, includes its 640 ms SETTLE entrance) |
| `/project/` | 636 KB | 13 KB | 0.09 s |
| `/contact/` | 181 KB | 13 KB | 0.72 s (h1, as above) |

Budgets enforced by `verify-browser.mjs`: ≤ 900 KB initial transfer, ≤ 30 KB JS. Hero image is `fetchpriority="high"`;
Tajawal 300/400 preloaded; fonts subset to Arabic / Latin; hashed assets cached immutable (`public/_headers`).

## Commands

```bash
npm run web:install   # once
npm run dev:web       # http://localhost:4321
npm run build:web     # → website/dist
npm run test:web      # content QA on dist
npm run verify:web    # build + content QA + browser QA + screenshots
```
