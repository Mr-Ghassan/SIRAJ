# SIRAJ — Design Language Quick Reference (v1.0)

This is the condensed working spec for everyone producing SIRAJ material: designers, developers, agencies.
The full rationale lives in `20-Brand-Guidelines/`. If this file and the guidelines disagree, the guidelines win.

---

## 1. The idea in one line

**SIRAJ (سراج, "the lamp") — architecture shaped with the elegance, continuity and controlled movement of silk.**

- **The Lumen (◆)** is the light. It's the 45° stone-coloured diamond above the *I* and *J* of the wordmark. In the system it becomes the marker, bullet, indicator and "light source".
- **Silk** is the surface that carries the light. Deep maroon silk is the brand's signature *behaviour*: it reveals, frames, connects and transitions.
- **The grid** is the architecture. It's rigid, calm and generous.

> Hierarchy on every layout: **Architecture first · Information second · Silk as the signature gesture · Logo as the final identifier.**

---

## 2. Fixed assets (never redraw)

| Asset | Source |
|---|---|
| Wordmark (official) | `01-Logos/Master/SIRAJ_Logo_Master_v1.0.svg` (exact geometry of the supplied Illustrator master) |
| Colour variants | `01-Logos/SVG/` |
| Bilingual lockups | `01-Logos/Lockups/` (Arabic is set in Tajawal, English in Jost, outlined) |
| Monogram (S, derived) | `01-Logos/SVG/SIRAJ_Monogram-S_*` (avatars and favicons only) |

- Clear space is **½ H** on all sides (H = wordmark height).
- Minimum size is **96 px** wide on screen and **25 mm** in print.

---

## 3. Colour

| Role | Name | HEX |
|---|---|---|
| Primary | SIRAJ Maroon | `#602733` |
| Dark base | SIRAJ Deep | `#2C0F12` |
| Cinema black | SIRAJ Shadow | `#170608` |
| Lumen accent | Architectural Stone | `#AA9180` |
| Light on dark | SIRAJ Sand | `#D6C0B2` |
| Light background | Warm Ivory | `#F7F2ED` |
| Light surface 2 | Linen | `#EFE7E0` |
| Body text | Graphite | `#3B3436` |
| Secondary text | Ash | `#6B625E` |
| Headline black | Near Black | `#140E10` |
| Silk only | Highlight `#C79A9C` · Midtone `#81404C` · Dark `#45161F` | |

- **Stone `#AA9180` is never used for text on light backgrounds** (2.7:1). Use it only for the Lumen, rules and fine graphic detail.
- The official gradient is **G1 `linear-gradient(51deg, #2C0F12, #602733)`**, from the master artboard.
- Tokens live in `09-Design-System/tokens/build/siraj-tokens.css`. Always use the variables; never hard-code hex values in components.

---

## 4. Typography

- **Latin: Jost** (300 Light for display and headings, 400 for body, 500 for labels and captions).
- **Arabic: Tajawal** (300 / 400 / 500 / 700).
- **Numerals: Western digits (0–9) everywhere, including Arabic text.** The `SIRAJ Digits` face maps Jost figures onto digits, so Arabic and English numbers are identical. Never use Arabic-Indic digits (٠١٢٣).
- Captions and eyebrows are uppercase Jost 500 with 0.16em tracking. **Arabic is never tracked or uppercased.**
- Display sizes are light weights, never bold. SIRAJ speaks quietly.
- Include fonts with `09-Design-System/css/siraj.css` (it imports the tokens and @font-face rules).
- Currency is written `OMR 145,000` in English and `145,000 ر.ع.` in Arabic. Areas are written `245 m²` / `245 م²`, and dates as `Q4 2027` / `الربع الرابع 2027`.

---

## 5. Shape language

- **Square corners by default** (architectural). Inputs and chips may use 2 px.
- **Silk Corner:** one large radius on the **top-end** corner only (top-right in LTR, top-left in RTL) of an image container or hero card. Use it at most once or twice per view.
- **Hairline rules** are 1 px in Stone at 70% opacity.
- **Lumen ◆** is a 45° rotated square in Stone, used as a bullet, active indicator, step marker or map pin head.
- No pill buttons, no drop-shadow cards stacked everywhere, no glassmorphism, no generic SaaS rounded-card look.

---

## 6. Iconography (summary)

- 24 px grid with 2 px padding, a **1.25 px stroke** (1.5 px at 20 px and below), and square caps with mitred joins on architectural elements.
- **One continuous "silk" curve** per icon where it makes sense, drawn with round joins on that curve only.
- The **Lumen** diamond is the accent detail (filled, 3 px).
- Colour is `currentColor`. The default is Graphite on light and Sand on dark.

---

## 7. Motion (summary)

Motion follows seven principles: **FLOW · DRAPE · REVEAL · WRAP · FOLD · GLIDE · SETTLE**.

- Default easing is `--siraj-motion-easing-flow` (`cubic-bezier(.45,.05,.15,1)`).
- Settling uses `--siraj-motion-easing-drape` (`cubic-bezier(.16,1,.3,1)`).
- No bounce, no elastic overshoot, no spin, no flashy glitch.
- Image reveal: a mask wipe along a curved silk edge plus a scale from 1.04 to 1.0.

---

## 8. Voice

- Calm, precise, confident. Short sentences. No superlatives stacked ("the most luxurious ever").
- English example: *"Light, built."* / *"A residence shaped by light and silence."*
- Arabic example: *«نورٌ يُبنى»* / *«مساكن تتشكّل بالضوء والسكينة»*
