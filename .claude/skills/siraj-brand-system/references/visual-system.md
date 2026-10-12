# SIRAJ · Visual system

Contents: 1. Colour · 2. Typography · 3. Logo · 4. Grid & formats · 5. Shapes, Lumen, icons · 6. Silk formations · 7. Photography & people · 8. Motion

## 1. Colour

| Role | Name | HEX | Notes |
|---|---|---|---|
| Primary | SIRAJ Maroon | `#602733` | logo colour, hero colour |
| Dark base | SIRAJ Deep | `#2C0F12` | dark environment, G1 start |
| Cinema black | SIRAJ Shadow | `#170608` | deepest dark, photo falls |
| Accent | Architectural Stone | `#AA9180` | Lumen ◆, hairlines — **never text on light** (2.7:1) |
| Light on dark | SIRAJ Sand | `#D6C0B2` | text and logo on dark/photos |
| Light background | Warm Ivory | `#F7F2ED` | default light environment |
| Light surface | Linen | `#EFE7E0` | secondary light |
| Body text | Graphite | `#3B3436` | on light |
| Secondary text | Ash | `#6B625E` | on light (AA) |
| Headline black | Near Black | `#140E10` | |
| Silk only | Highlight `#C79A9C` · Midtone `#81404C` · Dark `#45161F` | | never as UI/text colours |

Gradient **G1** `linear-gradient(51deg, #2C0F12 0%, #602733 100%)`. Environments: ivory · linen · deep · shadow · maroon (G1) · photo. Contrast WCAG AA. Tokens: `assets/tokens/siraj.tokens.json`, CSS variables in `assets/tokens/siraj-tokens.css` (`--siraj-color-*`).

## 2. Typography

- Arabic **Tajawal**: 300 Light (display, headings), 400 (body), 500 (labels/eyebrows), 700 rarely (small UI emphasis). Latin **Jost** 300/400/500 for Latin runs only.
- Western digits in Arabic text (the repo's `SIRAJ Digits` face maps Jost figures; outside the repo, Tajawal's Latin digits are acceptable).
- Arabic scale (desktop / mobile, line-height): display 92/52 (1.25) · h1 64/42 (1.3) · h2 45/32 (1.38) · h3 32/25 (1.45) · h4 24/21 (1.55) · lead ~26 · body 18–20 (1.6–1.7).
- Social posts at 1080 px: display title ~110–130 px Tajawal 300; title 64–80 px; lead 28–32 px; eyebrow 19–22 px Tajawal 500; footer 18–20 px.
- Arabic: letter-spacing 0, no uppercase, no kashida stretching for justification. Latin eyebrows: Jost 500 uppercase, tracking 0.16–0.22em.
- Fonts are bundled in `assets/fonts/` (OFL). On the web, Tajawal and Jost are also on Google Fonts.

## 3. Logo

Files (`assets/logo/`): Primary (Maroon), Sand, White, Deep, Mono-Black, Mono-White, Mono-Maroon; S monogram variants; square avatar PNG.

| Background | Variant |
|---|---|
| Ivory, Linen, white | Primary (Maroon) or Deep |
| Deep, Shadow, Maroon, G1 | Sand |
| Photography | Sand on darker areas; White only on very busy imagery |
| One-colour production | Mono variants |

- Clear space ½ H all round (H = wordmark height). Minimum 96 px wide (25 mm print).
- One logo zone, **bottom-start**: bottom-right in Arabic, on the margin, same size per format (post ~168 px, story 184 px). Bottom-end carries one quiet caption only (website, handle, disclaimer). Centred on covers and end cards. The wordmark itself is never mirrored.
- Never: redraw, retype, recolour, stretch, rotate, outline, add shadow/glow, place on silk folds that cut through it, put in a box.
- The S monogram is for avatars/favicons only, never next to the full wordmark. Profile picture: Sand wordmark on G1 (`assets/logo/SIRAJ_Social-Avatar_Square_v1.0.png`).

## 4. Grid & formats

| Format | Size | Margins | Notes |
|---|---|---|---|
| Post | 1080×1350 | 72 px all round | logo zone ~168 px wide |
| Square | 1080×1080 | 72 | |
| Story / Reel | 1080×1920 | sides 72; top 250, bottom 340 free of copy (app UI) | reel: 312/312 |
| LinkedIn | 1200×627 | 56 | |
| X | 1600×900 | 80 | |

12-column logic, 24 px gutter. Copy aligns to the start side (right in Arabic). One title per layout.

## 5. Shapes, Lumen, icons

- Square corners. **Silk Corner**: one large radius on the top-end corner (top-left in RTL) of an image container, max once or twice per view.
- Hairlines: 1 px Stone at 70%.
- **Lumen ◆**: a 45° rotated Stone square — bullet, separator between facts, active marker, map pin head. Usually 8–10 px on posts.
- Icons: 24 px grid, 1.25 px stroke, square caps, one continuous silk curve, a filled Lumen accent, `currentColor`.
- No pill buttons, glassmorphism, stacked drop-shadow cards, neon, gold foil, marble textures, script fonts.

## 6. Silk formations (real photographs)

| Formation | Look | Best for | Env |
|---|---|---|---|
| Drape-Deep | quiet dark folds | statements, quotes, numbers, title slides | deep |
| Drape-Lumen | lit maroon surface | covers, end cards | maroon/deep |
| Drape-Fall | vertical folds | stories, portrait | deep |
| Horizon-Deep | silk dunes as ground, dark sky | architecture above / info below | deep/photo |
| Horizon-Ivory | silk dunes on ivory | light layouts with info below | ivory |
| Ribbon-Sweep | single ribbon on dark | signature gesture, transitions | deep |
| Ribbon-Ivory | single ribbon on ivory | light covers, print | ivory |
| Ribbon-Pair | two ribbons | campaign key visuals | deep |
| Fold-Corner-Ivory | silk corner entering diagonally | dividers, light covers | ivory |
| Gateway | two silk curtains framing an opening | reveals, launches | deep |
| Wrap | spiral ribbon on a vertical axis | composites around towers | deep |

Arabic layouts are full mirrors (text, logo zone, Silk Corner, silk stills and Horizon flip); photographs are never mirrored.

Rules: one gesture per layout; ≤ 35% coverage where architecture/information is shown; never over the logo; never hides the property; enters lower-start → upper-end; warm light from the upper end; no other colours of silk, no plastic/metallic/iridescent sheen.

## 7. Photography & people

- Architecture first: real buildings, honest perspective, golden or blue hour, calm desaturated skies, Omani context (Hajar mountains, date palms, Muscat streetscape). No fake flares, no HDR, no oversaturated teal-orange.
- Grade: warm, slightly lifted shadows toward Shadow `#170608`, highlights toward Ivory.
- People: see SKILL.md §2.3 — hijab and modest dress for women, mixed Omani/international cast, Omani men in dishdasha + massar, no intimacy. Applies to background and scale figures too.
- AI or render imagery is labelled with the render disclaimer.

## 8. Motion

Principles FLOW · DRAPE · REVEAL · WRAP · FOLD · GLIDE · SETTLE. Easing flow `cubic-bezier(.45,.05,.15,1)`, settle `cubic-bezier(.16,1,.3,1)`. No bounce, elastic, spin or glitch. Image reveal = curved silk-edge mask + scale 1.04 → 1.0. Moving silk is real footage only. Official intro 6 s, outro 5 s (Arabic default).
