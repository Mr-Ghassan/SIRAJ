# SIRAJ UI Components v1.0

The official digital interface library for **SIRAJ Real Estate Development (سراج للتطوير العقاري)**.
Architectural, quietly premium, fully bilingual. Every component consumes the brand tokens, mirrors in
Arabic (RTL) and works in light and dark.

| File | What it is |
|---|---|
| `siraj-components.css` | All components, class prefix `sj-` |
| `siraj-components.js` | Optional vanilla behaviour (tabs, accordion, dialog, drawer, dropdown, toast, sortable tables, theme and direction toggles). No dependencies. |
| `index.html` | Component library documentation: live examples, code, usage notes, do/don't. Has LTR/RTL and light/dark toggles. |
| `examples/` | Full-page reference screens (see below) |
| `screenshots/` | PNG renders produced by `tools/build-ui.js` |

## 1. Usage

```html
<link rel="stylesheet" href="09-Design-System/css/siraj.css">   <!-- fonts, tokens, type -->
<link rel="stylesheet" href="10-UI-Components/siraj-components.css">
…
<script src="10-UI-Components/siraj-components.js" defer></script> <!-- optional -->
```

`siraj.css` must load first: it brings in Jost, Tajawal, the "SIRAJ Digits" face and every `--siraj-*` token.

**Icons** come from the sprite in `07-Icon-System`:

```html
<svg class="sj-icon" aria-hidden="true"><use href="07-Icon-System/sprite/siraj-icons.svg#sj-key"/></svg>
```

Sizes are `.sj-icon--sm` (16), default (20), `--lg` (24) and `--xl` (32). The stroke follows the icon spec:
1.5 px at 20 px and below, 1.25 px from 24 px. Add `.sj-icon--dir` to arrows and chevrons so they mirror in RTL.
External `<use href>` needs the page to be served over http(s), not opened from `file://`.

**Viewing locally:** serve the repo root, e.g. `npx http-server . -p 8899`, then open
`http://localhost:8899/10-UI-Components/index.html`.

**Screenshots:** `node tools/build-ui.js` (or with `library`, `examples`, or one example's name). It starts its own
static server, renders with headless Chromium and writes to `screenshots/`:

- `library/<section>_{light,dark,rtl}.png` — every documentation section in three variants
- `library/_full-page_{light,dark}.png` (half scale) and `_mobile-top_light.png`
- `examples/<page>_desktop-1440.png` (full page) and `_desktop-1440_fold.png`
- `examples/<page>_mobile-390.png` (full page) and `_mobile-390_fold.png`

## 2. Component inventory

| Group | Components (classes) |
|---|---|
| Layout | `sj-container` (1280 max), `sj-grid` 12-col + `sj-span-*`/`sj-start-*`, `sj-section`, `sj-section-head`, `sj-kicker` (Lumen eyebrow), `sj-stack`, `sj-cluster`, `sj-divider` |
| Actions | `sj-btn` + `--primary` `--secondary` `--ghost` `--light` `--outline-light`, sizes `--sm` `--lg`, `--block`, states `:disabled`, `.is-loading`; `sj-icon-btn` (`--sm` `--plain` `--solid`, `aria-pressed`); `sj-link` (`--caps` `--quiet`) with animated underline |
| Inputs | `sj-field`, `sj-label`, `sj-help`, `sj-input`, `sj-textarea`, `sj-input-group` (+ affix), `sj-search`, `sj-select` (native), `sj-dropdown` + `sj-menu` (listbox), `sj-check`, `sj-radio` (Lumen diamond), `sj-switch`, `sj-segmented`, `sj-choice-group` |
| Navigation | `sj-tabs` (`sj-tab`, Lumen active marker), `sj-nav` (+ `--overlay`, `--compact`, `--sticky`), `sj-mobile-nav`, `sj-breadcrumbs`, `sj-pagination` / `sj-page` |
| Content | `sj-card`, `sj-media` (+ ratios), `sj-property-card` + `sj-specs`, `sj-project-card` + `sj-meta`, `sj-stat` (+ `--card` `--compact`) + `sj-delta` + `sj-spark`, `sj-table` (+ `sj-sort`, `--compact`), `sj-accordion`, `sj-badge` (`--ready` `--offplan` `--reserved` `--sold` `--new` `--info` `--error` `--plain` `--on-image`), `sj-tag`, `sj-avatar` (+ group, status), `sj-person`, `sj-facts`, `sj-list` |
| Overlays | `sj-dialog` (native `<dialog>`), `sj-drawer` (+ `--start`, `--static`), `sj-scrim`, `sj-tooltip` |
| Feedback | `sj-banner` (`--success` `--warning` `--error`, default info), `sj-toast` (+ region, timer), `sj-alert`, `sj-loader` (Lumen sheen), `sj-loader-line`, `sj-skeleton`, `sj-loading-block`, `sj-progress`, `sj-stepper` / `sj-step` (`--vertical`, `.is-done` `.is-current` `.is-upcoming`), `sj-empty` |
| Brand | `sj-silk` (Silk Corner on cards, 72 px), `sj-silk--hero` (160 px), `sj-silk--sm`, `sj-logo`, `sj-footer` |

### Example screens (`examples/`)

| File | Screen |
|---|---|
| `corporate-home.html` | Corporate homepage, English LTR: split hero with bleeding silk-campaign image, statement, featured projects, numbers, investment band on Drape-Lumen silk with a projection chart, journal, sales-centre CTA, footer |
| `corporate-home-ar.html` | The same page in Arabic, RTL, Tajawal, Arabic lockup in the footer |
| `property-detail.html` | "Noor Residences — Al Khuwair, Muscat": gallery, key facts, amenities, sortable residences table, floor-plan drawing, payment-plan stepper, construction progress, brand-styled map, sticky enquiry form |
| `sales-dashboard.html` | Internal sales dashboard, dark theme: KPIs, monthly sales bars, inventory donut, 148-unit availability grid, sales by type, consultants, reservations table |
| `customer-portal-mobile.html` | 390 px customer portal, Arabic RTL: my unit, handover status, next payment, payment schedule, construction timeline, documents, support, tab bar |

`examples/corporate.css` holds the page-level composition shared by the two homepages (prefix `ch-`). Other pages keep
their composition inline (`pd-`, `db-`, `cp-` prefixes). Composition classes are never components: if a pattern repeats
across products, promote it into `siraj-components.css` with the `sj-` prefix.

## 3. Visual rules the library enforces

- **Square by default.** Buttons 0 px, inputs/badges/tags 2 px. No pills, no rounded cards.
- **Hairlines over shadows.** Cards rest on a 1 px `--siraj-border` (Linen hairline `#E3D6CC`). Only floating layers
  (menus, dialogs, drawers, toasts) and hovered cards use `--siraj-shadow-*`.
- **The Lumen ◆** is the marker: kicker bullets, active tab/nav, selected menu item, radio, breadcrumb separators,
  pagination, progress lead, step markers, avatar presence, tooltip pointer, list bullets.
- **The Silk Corner** is one large radius on the top-end corner (`border-start-end-radius`), used once or twice per
  view: a hero image and one featured card.
- **Type:** light display weights (Jost 300 / 200 numerals), tracked uppercase eyebrows (Jost 500, .12–.16em).
- **Motion:** `--siraj-motion-easing-flow` for state changes, `--siraj-motion-easing-drape` for things that settle
  (menus, dialogs, drawers, markers). Button fills "drape" in from the start edge and leave through the end edge.
  No bounce, no spin. Everything stops under `prefers-reduced-motion`.

## 4. Accessibility

Contrast pairs (verified): Graphite on Ivory **10.9:1**, Maroon on Ivory **10.3:1**, Ash on Ivory **5.3:1**,
Sand on Deep **10.2:1**. **Stone `#AA9180` is decorative only** (2.7:1 on Ivory) — it is used for the Lumen, rules,
icons in decorative positions and chart marks, never for text.

- Input boundaries use Warm Grey (`--siraj-border-strong`) so fields meet the 3:1 non-text contrast requirement;
  the Linen hairline is reserved for structural rules.
- Focus: 2 px `--siraj-focus` outline with 3 px offset on every interactive element (`:focus-visible`).
- Native elements first: `<dialog>` (focus trap, Escape), native checkbox/radio/select restyled, `<button>` for
  actions, `<a>` for navigation.
- ARIA: tabs use `role="tablist|tab|tabpanel"` + `aria-selected` with arrow-key navigation that follows reading
  direction; accordion triggers use `aria-expanded`/`aria-controls`; dropdown uses `role="listbox"`/`option` +
  `aria-selected`; sortable headers expose `aria-sort`; progress bars use `role="progressbar"`; steppers mark
  `aria-current="step"`; toasts live in an `aria-live="polite"` region.
- Status is never colour-alone: badges carry a label, banners an icon + title, deltas an arrow + context.
- Charts (dashboard): every chart has a legend, direct labels on key values, an `aria-label` summary and a hover
  tooltip layer; the reservations table is the table view. Chart colours (dark): Silk Highlight `#C79A9C` (sold),
  Maroon midtone `#81404C` (reserved), Warm Grey `#8E837D` (available, outlined) and a Stone hatch (blocked). This
  order passes CVD and normal-vision separation (ΔE ≥ 15); the low-contrast Maroon mark always carries a label.
- Minimum targets: 36 × 36 px (small icon buttons), 44–48 px elsewhere.

## 5. RTL rules

- Set `dir="rtl" lang="ar"` on `<html>` (or on a region). The foundation switches to Tajawal and **removes tracking
  and uppercase** for Arabic automatically; every `sj-` class that tracks text has a `:lang(ar)` override.
- Components use only logical properties (`margin-inline`, `padding-inline`, `inset-inline-*`, `border-start-end-radius`,
  `text-align: start`). Where a physical value is unavoidable (transform origins, gradients, translate) the library
  reads `--sj-start` / `--sj-end` / `--sj-dir`, which flip under `[dir="rtl"]`.
- Directional icons need `.sj-icon--dir`. Drawers slide from the end edge; the switch knob and progress fill travel
  from the start edge; the Silk Corner moves to the top-left.
- **Western digits everywhere** (0–9) — the "SIRAJ Digits" face renders them in Jost inside Arabic text.
  Currency: `OMR 145,000` / `145,000 ر.ع.`; area `245 m²` / `245 م²`; dates `Q4 2027` / `الربع الرابع 2027`.
- Isolate LTR fragments inside Arabic with `.sj-ltr` (phone numbers, emails, unit references, time ranges such as
  `9:00–18:00`, signed values such as `+32%`).
- Charts keep a left-to-right time axis in both languages (`direction="ltr"` on the SVG); only their labels translate.

## 6. Theming

Components never hard-code colours: they read the semantic tokens (`--siraj-bg`, `--siraj-surface`,
`--siraj-surface-alt`, `--siraj-text`, `--siraj-text-strong`, `--siraj-text-muted`, `--siraj-accent`,
`--siraj-accent-strong`, `--siraj-on-accent`, `--siraj-lumen`, `--siraj-border`, `--siraj-border-strong`,
`--siraj-focus`).

- **Dark:** `data-theme="dark"` on `<html>` or any element (Shadow `#170608` background, Deep surfaces, Sand accent).
- **Scoped themes:** the attribute works on any region — the footer and the investment band carry `data-theme="dark"`
  inside light pages. `siraj-components.css` also defines `[data-theme="light"]` so a light region can sit inside a
  dark page.
- `.sj-only-light` / `.sj-only-dark` swap theme-specific assets (for example Primary vs Sand logo).
- The JS exposes `SIRAJ.setTheme('dark')`, `SIRAJ.setDir('rtl')` and `SIRAJ.toast(title, text)`.

### Token mapping

| Component property | Token |
|---|---|
| Primary button fill / hover fill | `--siraj-accent` → `--siraj-accent-strong` (Ivory in dark) |
| Button heights / padding / radius | `--siraj-component-button-height-{sm,md,lg}`, `--siraj-component-button-padding-x`, `--siraj-component-button-radius` |
| Input height / radius | `--siraj-component-input-height`, `--siraj-component-input-radius` |
| Focus ring | `--siraj-focus`, `--siraj-component-state-focus-ring-width/offset` |
| Hairlines / field borders | `--siraj-border` / `--siraj-border-strong` |
| Lumen marks | `--siraj-lumen` |
| Zebra rows, hover, tag fills | `--siraj-surface-alt` |
| Disabled | `--siraj-opacity-disabled` |
| Motion | `--siraj-motion-duration-*`, `--siraj-motion-easing-{flow,drape,glide}` |
| Elevation (floating layers only) | `--siraj-shadow-mid`, `--siraj-shadow-high`, `--siraj-shadow-drape` |
| Layers | `--siraj-z-{raised,sticky,overlay,dialog,toast,tooltip}` |
| Hero gradient / silk | `--siraj-gradient-silk-light` |

### Component-level variables (no token exists yet)

Declared at the top of `siraj-components.css`; candidates for the next token release:

| Variable | Value | Why |
|---|---|---|
| `--sj-max`, `--sj-margin`, `--sj-gutter` | 1280 px, `clamp(20px, 5.56vw, 80px)`, 24 px | Grid container (no layout tokens) |
| `--sj-silk-card` / `--sj-silk-hero` | 72 px / 160 px | Silk Corner sizes for cards and full-width heroes (token has only 96 px) |
| `--sj-rule` | Stone at 70% | Hairline rule colour from the brand spec |
| `--sj-scrim` | `rgb(23 6 8 / .56)` (dark: `rgb(2 2 2 / .64)`) | Modal scrim |
| `--sj-ink-inverse` / `--sj-on-ink-inverse` | Near Black / Ivory (inverted in dark) | Tooltip and toast surfaces |
| `--sj-success/warning/error/info` (dark) | `#9DB89E` `#DDB06C` `#E4949B` `#A5BECD` | Functional colours lifted for contrast on Shadow/Deep — the token set has no dark variants |
| `--sj-start`, `--sj-end`, `--sj-dir` | left / right / 1 (flipped in RTL) | Physical edges for transforms and gradients |
| `[data-theme="light"]` block | light semantic values | Nested light regions inside dark pages |

## 7. Do / don't (summary)

| Do | Don't |
|---|---|
| One Maroon primary action per view | Pill buttons, rounded cards, glassmorphism |
| Hairlines and whitespace for structure | Stacked drop-shadow cards |
| Lumen as the only marker shape | Dots, check circles or generic bullets |
| Silk Corner once or twice per view, top-end only | Silk Corner on every card in a grid |
| Light display type, quiet copy | Bold display type, stacked superlatives |
| Arabic in Tajawal, untracked, Western digits | Uppercase/tracking on Arabic, Arabic-Indic digits |
