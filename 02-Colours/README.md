# 02 · Colour — SIRAJ Colour System v1.0

> ✅ **Status: APPROVED** by SIRAJ on 2026-10-11 (HEX, RGB, CMYK, Pantone).

The four official colours are taken directly from the master artboards (`Logo.ai`, artboard 5). Every other colour is an extension built around them.

| Tier | Name | HEX | RGB | CMYK (FOGRA39) | Pantone | Role |
|---|---|---|---|---|---|---|
| Official | **SIRAJ Maroon** | `#602733` | 96 39 51 | 34 89 58 47 | 7421 C · alt. 504 C | Primary: logo, headlines, key surfaces |
| Official | **SIRAJ Deep** | `#2C0F12` | 44 15 18 | 50 85 70 80 | 4975 C | Dark environment, gradient base |
| Official | **SIRAJ Sand** | `#D6C0B2` | 214 192 178 | 14 24 27 0 | 4755 C · alt. 7604 C | Reversed logo, light text on dark |
| Official | **Architectural Stone** | `#AA9180` | 170 145 128 | 31 41 49 7 | 7530 C | Lumen, rules, fine detail |
| Extended | **SIRAJ Shadow** | `#170608` | 23 6 8 | 60 80 70 88 | Black 5 C | Cinema black, deepest silk shadow |
| Silk | Silk Highlight | `#C79A9C` | 199 154 156 | 18 42 30 4 | 5005 C | Sheen on silk only |
| Silk | Silk Midtone | `#81404C` | 129 64 76 | 30 80 52 30 | 7650 C | Lit fold |
| Silk | Silk Dark | `#45161F` | 69 22 31 | 42 90 65 62 | — | Turning fold |
| Neutral | **Warm Ivory** | `#F7F2ED` | 247 242 237 | 2 4 6 0 | 9224 C | Default light background |
| Neutral | Linen | `#EFE7E0` | 239 231 224 | 5 8 11 0 | 7527 C 30% | Secondary light surface |
| Neutral | Warm Grey | `#8E837D` | 142 131 125 | 42 43 45 15 | Warm Gray 9 C | Borders, large secondary type |
| Neutral | Ash | `#6B625E` | 107 98 94 | 50 50 52 35 | 405 C | Secondary text |
| Neutral | **Graphite** | `#3B3436` | 59 52 54 | 62 64 58 62 | 432 C | Body text |
| Neutral | Near Black | `#140E10` | 20 14 16 | 70 70 65 85 | Black 6 C | Headlines, dark UI chrome |
| Neutral | Pure White | `#FFFFFF` | 255 255 255 | 0 0 0 0 | — | Paper, UI surfaces |

The official black artboard colour is `#020202` (logo on black).

> **Print production:** the values are approved. As standard practice, match each new print supplier's output to a physical drawdown of these references.

## Files

- `SIRAJ_Colour-Palette_v1.0.json`: full specification, including contrast values.
- `SIRAJ_Colours_RGB_v1.0.ase` and `SIRAJ_Colours_CMYK_v1.0.ase`: Adobe swatches.
- `SIRAJ_Colours_v1.0.gpl`: GIMP, Inkscape and Krita.
- `SIRAJ_Colours_v1.0.csv`: spreadsheet.
- Tokens: `09-Design-System/tokens/` (CSS, SCSS, JS, Swift, Kotlin, Tailwind).

## Accessibility (WCAG 2.2)

| Pair | Ratio | Use |
|---|---|---|
| Graphite on Ivory | **10.9 : 1** | Body text ✔ AAA |
| Maroon on Ivory | **10.3 : 1** | Headlines, links, buttons ✔ AAA |
| Near Black on Ivory | 17.2 : 1 | Headlines ✔ |
| Ash on Ivory | **5.3 : 1** | Secondary text ✔ AA |
| Warm Grey on Ivory | 3.3 : 1 | Large text (≥ 24 px) and non-text only |
| Stone on Ivory | 2.7 : 1 | ✖ **Never for text**: decorative and Lumen only |
| Sand on Deep | **10.2 : 1** | Text on dark ✔ AAA |
| Sand on Maroon | **6.6 : 1** | Text on maroon ✔ AA |
| Ivory on Maroon | 10.3 : 1 | Buttons ✔ |
| Stone on Deep | 6.0 : 1 | Captions on dark ✔ AA |
| Silk Highlight on Deep | 7.2 : 1 | Accents on dark ✔ |

## Proportion (hierarchy)

| Light environment | % | Dark environment | % |
|---|---|---|---|
| Warm Ivory / White | 60 | Shadow / Deep | 55 |
| SIRAJ Maroon | 18 | Maroon (incl. silk) | 25 |
| Graphite (text) | 12 | Sand | 12 |
| Linen / Sand | 7 | Ivory (text) | 5 |
| Stone | 3 | Stone | 3 |

## Gradients: light travelling across silk

| ID | Name | Definition | Use |
|---|---|---|---|
| **G1** | Silk Light (official) | `linear-gradient(51deg, #2C0F12 0%, #602733 100%)` | Avatars, covers, cards, end cards |
| G2 | Silk Sheen | `118deg: #2C0F12 0, #602733 42, #81404C 54, #602733 66, #2C0F12 100` | Hero bands, motion sweeps |
| G3 | Lumen Glow | `radial 120% at 78% 18%: #81404C → #602733 32% → #2C0F12 78% → #170608` | Intro, covers, dark heroes |
| G4 | Deep Fall | `180deg: #602733 → #2C0F12 62% → #170608` | Stories, signage, lower thirds |
| G5 | Ivory Light | `51deg: #EFE7E0 → #F7F2ED 70% → #FBF8F5` | Light environment wash |

**Rules**

- The light source is always at the **upper end** (upper right in LTR). The **51° Silk Axis** comes from the official artboard.
- Use at most **3 hues**, all from the maroon family. Never mix ivory and maroon in one gradient.
- **Prohibited:** rainbow or "SaaS" gradients, gold or metallic gradients, gradients inside the logo, gradients behind small text, and banding (always dither, as the silk engine does).
- **Motion:** gradients move only as light travelling (the stop position shifts 10 to 15% over 2 s or more, easing *glide*). They never cycle or pulse.
