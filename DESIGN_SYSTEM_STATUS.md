# SIRAJ Design System v1.0 — CLOSED / PRODUCTION READY

**Status:** closed on 13 October 2026 · `design-system/` · build `npm run build:ds` · QA `docs/qa/DESIGN_SYSTEM_QA.md`

## Scope delivered

| Area | Contents | Files |
|---|---|---|
| Tokens | Colours (core, maroon scale, silk, functional, data, dark UI), two themes (ivory, deep), typography, spacing (8 px), grids (web 12/8/4 + social, presentation, A4/A3 property), layout, radius (square + 96 px silk corner), borders, shadows, opacity, z-index, breakpoints, motion hooks, component tokens | `tokens/siraj-ds.tokens.json` → `build/siraj-ds.{css,js,ts,d.ts,json}` |
| Typography | 12 bilingual roles: Display, H1–H3, Lead, Body, Small, Caption, Label, Numbers, Pricing, Data. Arabic line height display ≥ 1.36, headings ≥ 1.42, body ≥ 1.6 | `build/siraj-ds-typography.css` |
| Components | Header, nav, drawer, breadcrumb, pagination, sidebar, footer, buttons, contact line (phone 7771 4404 · Instagram icon), fields, select, search, filters, tabs, accordion, table, stats, charts, alerts, banner, empty, skeleton, CTA, dialog, drawer | `components/siraj-ds.{css,js}`, `src/components.js` |
| Real-estate components | Property, shop, project and unit cards; hero; overview; unit details; price; area; availability; floor plan; amenities; location map; construction steps; metrics; payment plan; gallery; download; contact sales; lead form — every unconfirmed figure is a «—» slot | `src/components.js` |
| Project name | «مشروع سراج» ribbon lettering component (`LETT`), ivory on dark, maroon on light | `src/components.js` |
| Icons | 07-Icon-System sprite (outline + filled), incl. Instagram, WhatsApp, Email, Shop | `07-Icon-System/` |
| Motion hooks | Six levels (`.m-micro` … `.m-cinematic`), reduced motion, wind levels | `motion-system/tokens/build/siraj-motion.css` |
| Templates | Social, marketing (Silk & Light), real-estate («—» slots), corporate | `docs/templates.html` |
| Docs | 11 bilingual pages (AR/EN toggle, light/dark) + 4 Arabic example screens (home, unit, register interest, customer portal) | `index.html`, `docs/`, `examples/` |
| Exports | PNG captures of every page (desktop; examples also at 390 px) | `exports/` |

## Test results

- Contrast: 28/28 pairs pass in the ivory theme and 28/28 in the deep theme (`build/contrast.json`).
- Page QA (`node tools/build-design-system-docs.js`): 19 page views — 0 JS errors, 0 broken images, 0 horizontal overflow at 390 px, 0 tight Arabic lines, 0 «@».
- The legacy v0 UI library (`10-UI-Components`, built on a fictional project) is isolated in `99-Archive/Demo-Isolated/10-UI-Components`.
