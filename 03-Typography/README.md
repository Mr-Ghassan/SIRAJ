# 03 · Typography — Jost × Tajawal v1.0

| Script | Typeface | Licence | Weights supplied |
|---|---|---|---|
| Latin | **Jost** (indestructible type*) | SIL OFL 1.1 | 200, 300, 400, 500, 600, 700 + 300/400 italic |
| Arabic | **Tajawal** (Boutros) | SIL OFL 1.1 | 200, 300, 400, 500, 700, 800, 900 |
| Digits | **SIRAJ Digits**: Jost figures mapped to `0–9 % + , . / : ² ³` via `unicode-range` | (Jost) | same as Jost |

The fonts are in `fonts/` (TTF), and the web `@font-face` rules are in `siraj-fonts.css`, imported by `09-Design-System/css/siraj.css`.

## Why this pairing

We compared seven pairings: Plex Arabic + Plex, Alexandria, Readex Pro, Noto Kufi + Jost, El Messiri + Marcellus, Tajawal + Manrope, and Naskh + Cormorant.

**Jost** was chosen for its geometric, Futura-lineage construction. Its light weights echo the monoline stems and stencil precision of the wordmark: architectural, quiet and international.

**Tajawal** is the client-directed Arabic face. It is a contemporary, open, highly legible sans that shares Jost's geometry and calm proportions, so the two read as one family.

**Western digits** are mandated in every language (client direction). SIRAJ Digits makes numbers identical in Arabic and English.

## Type scale

| Style | Latin (desktop / mobile) | Arabic (desktop / mobile) | Weight | Line height | Tracking |
|---|---|---|---|---|---|
| Display | 88 / 52 | 92 / 52 | Light 300 | 1.04 · AR 1.25 | −0.01em · AR 0 |
| H1 | 60 / 40 | 64 / 42 | Light 300 | 1.08 · AR 1.30 | −0.005em |
| H2 | 42 / 30 | 45 / 32 | Regular 400 | 1.14 · AR 1.38 | 0 |
| H3 | 30 / 24 | 32 / 25 | Regular 400 | 1.22 · AR 1.45 | 0 |
| H4 | 22 / 20 | 24 / 21 | Medium 500 | 1.30 · AR 1.55 | 0 |
| Lead | 21 / 18 | 22 / 19 | Light 300 | 1.55 · AR 1.75 | 0 |
| Body | 16 | 17 | Regular 400 | 1.60 · AR 1.85 | +0.005em · AR 0 |
| Small | 14 | 15 | Regular 400 | 1.50 · AR 1.75 | +0.01em |
| Caption / Eyebrow | 12 / 11 | 13 | Medium 500 | 1.40 · AR 1.60 | **+0.16em, UPPERCASE** · AR none |
| Numeral | 72 / 48 | 72 / 48 (Jost) | ExtraLight 200 | 1.0 | −0.02em, tabular lining |

**Paragraph spacing** is 0.75 × line height after paragraphs, and 1.5 × line height before H2 and H3. **Measure** is 60–75 characters for Latin and 50–65 for Arabic.

**Print equivalents (A4):** Display 48 pt, H1 32 pt, H2 22 pt, H3 16 pt, Body 9.5/14 pt (Arabic 10.5/17 pt), Caption 7 pt with +160 tracking. The baseline grid is 3 mm.

## Rules

1. **Display type is light, never bold.** SIRAJ speaks quietly; hierarchy comes from size and space.
2. **Arabic is never letter-spaced, never "uppercased", and never condensed.** Kashida stretching is allowed only for display justification, sparingly.
3. **Arabic is set about 8% larger than Latin** for optical parity. Align the Latin cap height with the top of the Arabic letter bodies, and share baselines.
4. **Bilingual layouts:** Latin on the left and Arabic on the right, each aligned to its own start edge, with equal visual weight. Never mirror Latin text alignment.
5. **Mixed runs:** wrap phone numbers, URLs, emails, Latin names and units inside Arabic text in `<bdi>` or `dir="ltr"` spans.
6. **Numbers:** always Western digits, with a comma as thousands separator and a point as decimal mark. Use tabular lining figures in tables. Write `OMR 145,000` / `145,000 ر.ع.`, `245 m²` / `245 م²`, `Q4 2027` / `الربع الرابع 2027`.
7. **Never use** Arabic-Indic digits, faux bold or italic Arabic, outline text, justified Latin text with rivers, or all-caps headlines larger than 18 px.
8. **Fallbacks:** Latin falls back to Helvetica Neue and then Arial. Arabic falls back to Geeza Pro and then Tahoma.

The specimen is in `specimen/` (PDF plus PNG pages). Build it with `node tools/build-type.js`.
