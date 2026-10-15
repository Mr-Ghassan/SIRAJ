# 03 · Typography — Jost × Tajawal v1.0 (library v1.0.1)

| Script | Typeface | Licence | Weights supplied | Weights in the approved type scale |
|---|---|---|---|---|
| Latin | **Jost** (indestructible type*) | SIL OFL 1.1 (`fonts/Jost/OFL.txt`) | 200, 300, 400, 500, 600, 700 + 300/400 italic | 200 (numerals), 300, 400, 500 |
| Arabic | **Tajawal** (Boutros International) | SIL OFL 1.1 (`fonts/Tajawal/OFL.txt`) | 200, 300, 400, 500, 700, 800, 900 | 300, 400, 500 · display pairing 200 ↔ 800 |
| Digits | **SIRAJ Digits**: Jost figures mapped to `0–9 % + , . / : ² ³` via `unicode-range` | (Jost) | same as Jost | same as Jost |

Only Jost and Tajawal are approved. No other typeface may be added without written approval (the cancelled project
lettering font is archived in `99-Archive/Postponed/Project-Lettering` and is not a brand font). Tajawal Black (900)
and Jost SemiBold/Bold (600/700) are supplied for completeness and fallback; they are not part of the type scale.

## Files

| File | Status | Use |
|---|---|---|
| `fonts/Jost/*.ttf`, `fonts/Tajawal/*.ttf` | MASTER | Desktop installation, print, PDF, motion |
| `fonts/WOFF2/<Family>/*.woff2` | PRODUCTION EXPORT (v1.0.1) | Web; lossless WOFF2 of the TTF masters (same glyphs, metrics and names), built by `python3 -I tools/build-webfonts.py` |
| `siraj-fonts.css` | SOURCE | `@font-face` set (TTF), imported by `09-Design-System/css/siraj.css` |
| `siraj-fonts-woff2.css` | PRODUCTION EXPORT (v1.0.1) | Same set, WOFF2 first with TTF fallback |
| `fonts/*/OFL.txt` | LICENCE | SIL Open Font License 1.1. Tajawal's file was corrected in v1.0.1 to the official text from Google Fonts (copyright Boutros International) |
| `specimen/` | PREVIEW | Type specimen PDF + PNG pages, `node tools/build-type.js` |

## Why this pairing

We compared seven pairings: Plex Arabic + Plex, Alexandria, Readex Pro, Noto Kufi + Jost, El Messiri + Marcellus, Tajawal + Manrope, and Naskh + Cormorant.

**Jost** was chosen for its geometric, Futura-lineage construction. Its light weights echo the monoline stems and stencil precision of the wordmark: architectural, quiet and international.

**Tajawal** is the client-directed Arabic face. It is a contemporary, open, highly legible sans that shares Jost's geometry and calm proportions, so the two read as one family.

**Western digits** are mandated in every language (client direction). SIRAJ Digits makes numbers identical in Arabic and English.

## Type scale

Source of truth: `design-system/tokens/siraj-ds.tokens.json → typography` (Design System v1.0, frozen). The table below
mirrors it (v1.0.1 corrects the Arabic line heights that this README still showed from before the 2026-10-13 rule).

| Style | Arabic px (desktop / mobile) | Arabic weight | **Arabic line height** | Latin px (desktop / mobile) | Latin weight | Latin line height | Latin tracking |
|---|---|---|---|---|---|---|---|
| Display | 92 / 52 | Light 300 (may pair 200 ↔ 800) | **1.36** | 88 / 50 | Light 300 | 1.04 | −0.01em |
| H1 | 64 / 40 | Light 300 | **1.42** | 60 / 38 | Light 300 | 1.08 | −0.005em |
| H2 | 45 / 30 | Regular 400 | **1.45** | 42 / 29 | Regular 400 | 1.14 | 0 |
| H3 | 28 / 23 | Regular 400 | **1.50** | 27 / 22 | Regular 400 | 1.22 | 0 |
| Lead | 22 / 19 | Light 300 | **1.75** | 21 / 18 | Light 300 | 1.55 | 0 |
| Body | 18 / 17 | Regular 400 | **1.80** | 17 / 16 | Regular 400 | 1.60 | 0 |
| Small | 15 / 14 | Regular 400 | **1.70** | 14 / 13 | Regular 400 | 1.50 | 0 |
| Caption | 14 / 13 | Regular 400 | **1.65** | 13 / 12 | Regular 400 | 1.45 | +0.01em |
| Label / Eyebrow | 15 / 14 | Medium 500 | **1.42** | 12 / 12 | Medium 500 | 1.40 | +0.16em, UPPERCASE |
| Numbers (Jost) | 72 / 46 | ExtraLight 200 | 1.42 | 72 / 46 | ExtraLight 200 | 1.0 | −0.02em, tabular lining |
| Pricing (Jost) | 40 / 30 | Light 300 | 1.42 | 40 / 30 | Light 300 | 1.10 | −0.01em |
| Data | 15 / 14 | Regular 400 | **1.65** | 14 / 13 | Regular 400 | 1.45 | +0.01em |

**Arabic line-height minimums (client rule 2026-10-13):** display and H1 ≥ 1.3 (also with 700+ weights and 200 ↔ 800
pairs), H2/H3 ≥ 1.4, body, small, caption and data ≥ 1.6, labels ≥ 1.4. Arabic lines never touch or overlap, in any weight.

**Paragraph spacing** is 0.75 × line height after paragraphs, and 1.5 × line height before H2 and H3. **Measure** is 60–75 characters for Latin and 50–65 for Arabic.

**Print equivalents (A4):** Display 48 pt, H1 32 pt, H2 22 pt, H3 16 pt, Body 9.5/14 pt (Arabic 10.5/17 pt), Caption 7 pt with +160 tracking. The baseline grid is 3 mm.

## Rules

1. **Display type is light.** SIRAJ speaks quietly; hierarchy comes from size and space. The one approved exception is the Arabic display pairing of ExtraLight 200 with ExtraBold 800 in a single line (Design System token `typography.display`).
2. **Arabic is never letter-spaced, never "uppercased", and never condensed.** Kashida stretching is allowed only for display justification, sparingly.
3. **Arabic is set about 8% larger than Latin** for optical parity. Align the Latin cap height with the top of the Arabic letter bodies, and share baselines.
4. **Direction:** Arabic is the communication language (English is dormant). Arabic layouts are right-to-left and start on the right; the logo sits bottom-right. **Bilingual layouts** (only the approved exceptions: business card, quotation, tax invoice, receipt, contract cover): Latin on the left and Arabic on the right, each aligned to its own start edge, with equal visual weight. Never mirror Latin text alignment.
5. **Mixed runs:** wrap phone numbers, URLs, emails, Latin names and units inside Arabic text in `<bdi>` or `dir="ltr"` spans.
6. **Numbers:** always Western digits, with a comma as thousands separator and a point as decimal mark. Use tabular lining figures in tables. Format examples (not project data): `OMR 000,000` / `000,000 ر.ع.`, `000 m²` / `000 م²`, `Q0 0000` / `الربع الأول 0000`.
7. **Never use** Arabic-Indic digits, faux bold or italic Arabic, outline text, justified Latin text with rivers, or all-caps headlines larger than 18 px.
8. **Fallbacks:** Latin falls back to Helvetica Neue and then Arial. Arabic falls back to Geeza Pro and then Tahoma.

The specimen is in `specimen/` (PDF plus PNG pages). Build it with `node tools/build-type.js`.
