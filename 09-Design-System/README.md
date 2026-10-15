# SIRAJ Design System — Digital

| Layer | Location | Contents |
|---|---|---|
| Tokens | `tokens/siraj.tokens.json` → `tokens/build/` | Colour, type, space, radius, shadow, motion and component tokens, exported to CSS, SCSS, JS/TS, Tailwind, Swift and Kotlin. Do not edit the build output by hand. |
| Foundation CSS | `css/siraj.css` | Imports fonts (Jost, Tajawal, "SIRAJ Digits") and tokens; base typography (`.t-display` … `.t-caption`, `.eyebrow`), Arabic overrides, and the signature utilities `.lumen`, `.silk-corner`, `.rule`, `.env-*`. |
| Components | `../design-system/components/` (Design System v1.0). The earlier `10-UI-Components` kit was archived with the demo content in `99-Archive/Demo-Isolated/10-UI-Components/` | `siraj-components.css` (`sj-` prefix), `siraj-components.js`, the documentation page `index.html`, full-page examples and screenshots. See its README for usage, accessibility, RTL and theming rules. |
| Icons | `../07-Icon-System/sprite/siraj-icons.svg` | `#sj-<name>` (outline) and `#sj-<name>-filled` symbols, `currentColor`. |

Load order on any page:

```html
<link rel="stylesheet" href="09-Design-System/css/siraj.css">
<link rel="stylesheet" href="10-UI-Components/siraj-components.css">
```

Theme with `data-theme="dark"` (any element), and set `dir="rtl" lang="ar"` for Arabic. Components only read
semantic tokens (`--siraj-bg`, `--siraj-surface`, `--siraj-text`, `--siraj-accent`, `--siraj-border` …), so both
work everywhere, including nested regions.

**Dark borders (decision D3, 2026-10-15):** `--siraj-border` `#4A2228` (hairlines, dividers) and `--siraj-border-strong`
`#8C6B64` (input outlines, selected cards, table heads) — the same values as Design System v1.0
(`color.dark-ui.border` / `border-strong`). The former `#7A5A55` had no consumer and no role of its own, so it was retired
rather than kept as a third border level.

The earlier UI screenshots were rendered by `build-ui.js`, now archived in `99-Archive/Demo-Isolated/10-UI-Components/`. Design System v1.0 screenshots: `npm run build:ds` → `design-system/exports/`.
