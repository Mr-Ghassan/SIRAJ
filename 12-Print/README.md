# 12 · Print & Corporate Collateral — v1.0

Stationery, identity items and business documents for **SIRAJ Real Estate Development · سراج للتطوير العقاري**.
Everything here is built from HTML templates by one deterministic script, and every company detail is read from
`00-Brand-Foundation/brand.config.json` (plus print-only placeholders in `Source/print.config.json`).

> **All contact data, CR, VATIN and bank details are PLACEHOLDERS.** Confirm them in the two JSON files, then rebuild.
> Demo projects, people, clients and amounts are fictional and exist only to show the templates working.

```
node tools/build-print.js                 # everything (≈ 2 min)
node tools/build-print.js invoice card    # only jobs whose name contains a filter
```

```
12-Print/
  Source/                 HTML templates (edit these) · css/siraj-print.css · print.config.json
    Stationery/ Identity/ Documents/
  PDF/<Category>/         SIRAJ_<Item>_<Variant>_v1.0.pdf   vector text, fonts embedded, exact page size
  PNG/<Category>/         SIRAJ_<Item>_<Variant>_v1.0.png   presentation preview (studio backdrop + captions)
```

Templates share the document kit in `19-Templates/docs/` (CSS, runtime, generated config). Open any template directly
in Chrome to edit it; add `?preview` to the URL for the presentation view, `?marks` for bleed + crop marks.

---

## 1 · Inventory

| Item | Size (trim) | Files (`PDF/` + `PNG/`) | Pages |
|---|---|---|---|
| Business card — English / Arabic | 85 × 55 mm | `Business-Card_EN-AR` · `…_EN-AR-Print` (bleed + marks) | A English · B Arabic |
| Business card — Executive | 85 × 55 mm | `Business-Card_Brand` · `…_Brand-Print` | A G1 brand face · B bilingual details |
| Letterhead | A4 | `Letterhead_EN` · `Letterhead_AR` · `Letterhead_Bilingual` | blank master (PNG also shows a sample letter, not in the PDF) |
| Continuation sheet | A4 | `Continuation-Sheet_EN-AR` | EN · AR |
| Compliments slip | DL 210 × 99 mm | `Compliments-Slip_Bilingual` · `…-Print` | 1 |
| Envelope DL | 220 × 110 mm | `Envelope_DL` | front · back flap |
| Envelope C4 | 229 × 324 mm | `Envelope_C4` | front · back flap |
| Presentation folder (A4 pocket) | flat 468 × 430 mm | `Presentation-Folder_Flat` (proof + die) · `…_Print` (artwork + marks) · `…_Dieline` (artwork + die + marks) | outside · inside |
| Employee ID card | CR80 54 × 85.6 mm, portrait | `ID-Card_CR80` · `…-Print` | front · back |
| Visitor & event badge | 100 × 140 mm | `Badge_Visitor-Event` · `…-Print` | visitor · event |
| Quotation | A4 | `Quotation_EN-AR` | 2 |
| Tax invoice (VAT 5 %, OMR) | A4 | `Tax-Invoice_EN-AR` | 1 |
| Sale & Purchase Agreement cover | A4 | `Contract-Cover_SPA-Bilingual` | cover · particulars |
| Report | A4 | `Report_EN` · `Report_AR` | cover · inner page |
| Memo | A4 | `Memo_EN` · `Memo_AR` | 1 |
| Receipt & payment voucher | A4 | `Receipt-Payment-Voucher_EN-AR` | سند قبض · سند صرف |

Email signature (EN / AR) and the reusable A4 document kit live in `19-Templates/` — see its README.

---

## 2 · Design decisions

- **One wordmark size per format.** A4 documents: wordmark **38 mm** wide, top 18 mm, on the binding side (left in EN,
  right in AR). Continuation / inner pages: 24 mm. Cards 25 mm (just above the 25 mm print minimum). Lockups are
  cropped to their artwork so the visible mark — not the clear-space box — sits on the grid.
- **Grid.** `04-Grids` Editorial-A4: 12 columns, 4 mm gutter, margins top 18 / bottom 22 / inner 20 / outer 15 mm,
  baseline 3 mm. Inner = binding side, so Arabic documents mirror the margins. Bilingual letterhead/contract use
  symmetric 20 mm margins around a shared centre axis.
- **Bilingual with equal dignity.** Official documents carry English at the start and Arabic at the end of the same
  line (titles, labels, table heads, footers) or as side-by-side columns (contract particulars, terms). Separate
  EN / AR versions are given for letterhead, memo and report. Arabic is Tajawal, never tracked or uppercased, one
  point larger than the Latin it partners. **Western digits everywhere** (the `SIRAJ Digits` face).
- **One signature element per piece.** Card: Silk Blade blind deboss. Slip: a Silk Line joining the two greetings.
  Folder: the vector Silk Ribbon running across back cover, spine and front cover, and a Silk-curve pocket edge.
  SPA cover: the Portal (as a vector clip). Report and quotation: one Silk Corner image. Everything else: the Lumen ◆.
- **Calculated, not typed.** Invoice and quotation line amounts, subtotal, VAT, totals, instalments and the English
  amount-in-words are computed by the template from `data-qty` / `data-rate` (OMR, 3 decimals = baisa).
- **Paper is not ink.** PDFs leave the paper unprinted (white); the warm-white stock is simulated only in the PNG
  previews. Never print an Ivory tint flood to imitate the stock.

---

## 3 · Paper stock

| Item | Recommended stock | Notes |
|---|---|---|
| Business cards | Uncoated warm-white, **400 gsm** single, or **2 × 350 gsm duplexed** (≈ 700 gsm) for the Executive card | Duplex keeps the deboss crisp on face A without an emboss on face B. Suggested: GF Smith Colorplan *Natural White* / Arena *Natural Smooth* / Munken *Pure* class. |
| Letterhead, continuation | Uncoated warm-white **120 gsm**, laser/inkjet-guaranteed | Same sheet for compliments slips. Watermarked stock optional. |
| Compliments slip | **120 gsm**, matching letterhead | |
| Envelopes DL / C4 | Converted warm-white **120 gsm** wallet (DL) / pocket (C4), peel & seal | Over-printed one colour + Stone; keep ink 12 mm from edges and flaps. |
| Presentation folder | Uncoated warm-white **400 gsm** board (or 350 gsm + soft-touch laminate on the outside only) | Grain direction parallel to the spine. |
| Contract cover | Uncoated warm-white **300 gsm**; inner pages 120 gsm letterhead stock | |
| Report cover / inner | 300 gsm cover / 120–150 gsm text | Digital print acceptable. |
| ID card | White PVC **0.76 mm** CR80, matte overlay | Variable data by the card printer. |
| Visitor / event badge | 350 gsm uncoated or 0.5 mm PVC | Lanyard slot die-cut. |

## 4 · Finishes

- **Blind deboss of the Silk Blade** (no ink, no foil) — business cards, folder front (optional). Die artwork:
  `05-Graphic-System/SVG/SIRAJ_Silk-Blade_Maroon_v1.0.svg`, scaled as placed in the template (card A: 17 mm wide,
  top-end corner; Executive card: 44 mm, bleeding off the lower-end corner). Supplied as a separate die; the deboss
  is hidden in `-Print` PDFs on purpose.
- **Foil: Stone only, and only for the Lumen ◆** (the two diamonds of the wordmark, Lumen markers). Use a matte
  warm metallic matched to Stone `#AA9180` / PANTONE 7530 C. **No gold, no silver, no holographic foil.**
- Optional soft-touch matte laminate on folder exterior and Executive card face A. No gloss, no spot UV.
- No rounded corners except where the product requires them (CR80 radius 3.18 mm, lanyard slot ends).

## 5 · Colour

Print values from `02-Colours/SIRAJ_Colour-Palette_v1.0.json` (CMYK = FOGRA39 starting points; approve against a
drawdown / proof before the first run):

| Name | HEX | CMYK | Pantone (spot) | Print role |
|---|---|---|---|---|
| SIRAJ Maroon | `#602733` | 34 89 58 47 | 7421 C (alt. 504 C) | Logo, rules, headings — the stationery spot colour |
| SIRAJ Deep | `#2C0F12` | 50 85 70 80 | 4975 C | G1 base, dark panels |
| SIRAJ Shadow | `#170608` | 60 80 70 88 | Black 5 C | Deepest silk shadow (avoid as a large flood on uncoated) |
| SIRAJ Sand | `#D6C0B2` | 14 24 27 0 | 4755 C (alt. 7604 C) | Reversed wordmark / type on dark |
| Architectural Stone | `#AA9180` | 31 41 49 7 | 7530 C | Lumen, hairlines, foil match. **Never small text on light.** |
| Warm Ivory | `#F7F2ED` | 2 4 6 0 | 9224 C — or the warm-white stock itself | Panels (callouts) only |
| Linen | `#EFE7E0` | 5 8 11 0 | 7527 C @ 30 % | Secondary panels |
| Graphite | `#3B3436` | 62 64 58 62 | 432 C (warm alt. Black 7 C) | Body text |
| Ash | `#6B625E` | 50 50 52 35 | 405 C | Secondary text |
| Near Black | `#140E10` | 70 70 65 85 | Black 6 C | Titles, values |

- **Stationery in spot colours**: Maroon 7421 C + Stone 7530 C (or the Stone foil). Small Graphite text may run in
  the Maroon or as 100 K if the job is two-colour.
- **G1 gradient** (`linear-gradient(51deg, #2C0F12 → #602733)`): two-spot blend 4975 C → 7421 C or CMYK; ask for a
  smooth-gradient proof (no banding) on uncoated board.
- Text under 9 pt prints in a **single ink** (Maroon spot or 100 K) — never rich black, never four-colour Graphite.
- Recommended output intent: **PSO Uncoated v3 (FOGRA52)** for uncoated stocks, PSO Coated v3 (FOGRA51) for coated;
  total area coverage ≤ 300 % uncoated.

## 6 · Bleed, safe zone, marks

| Item | Bleed | Safe zone (inside trim) | Notes |
|---|---|---|---|
| Business card | 3 mm | 4 mm (text ≥ 6.5 mm from trim in the templates) | `-Print`: page = trim + 3 mm bleed + 10 mm slug, crop marks offset 1 mm beyond bleed |
| Compliments slip | 3 mm | 8 mm | |
| ID card | 3 mm | 4.5 mm (3 mm clear of the 3.18 mm corner radius) | Radius drawn only on the proof; the PVC die defines it |
| Badge | 3 mm | 9 mm | Lanyard slot shown as a blue die path in print files |
| Folder | 3 mm beyond every cut edge | 15 mm from folds, 22 mm from cut edges | Flood artwork outside the die is waste; die colour `#0093C9` (not printed) |
| A4 documents | none (office print) | margins as grid | Cover/report images stay inside the margins so office printers work |
| Envelopes | none (over-print) | 12 mm from edges and flaps | |

- Crop marks: registration black, 0.25 pt; slug line names the file, page, trim and bleed.
- The PDFs here are **layout masters**: vector text (fonts embedded and subset), exact trim/bleed geometry, but
  **RGB** (Chromium output). For press: convert to CMYK / spot in Acrobat Preflight → PDF/X-4 with the output intent
  above, map Maroon and Stone to their Pantone spots where the job is spot colour, and put the die line on its own
  spot layer named `Dieline` (overprint, not printed).
- Photography in the templates is the 2048-px library set — fine for proofs and office print; **replace with
  high-resolution files (300 ppi at final size) before offset printing** the folder, report cover and badges.

## 7 · File naming

`SIRAJ_<Item>_<Variant>_v<major.minor>.<ext>` — Item in Title-Case-With-Hyphens, Variant states language and/or
production state (`EN`, `AR`, `EN-AR`, `Bilingual`, `-Print` = bleed + marks, `Flat` = proof with die, `Dieline`).
Personalised files add the person or job after the variant, e.g. `SIRAJ_Business-Card_EN-AR-Print_Khalid-Al-Balushi_v1.0.pdf`.
Bump the version for any artwork change; never overwrite an approved version.

## 8 · Approval checklist

**Content**
- [ ] All PLACEHOLDER values replaced in `brand.config.json` / `print.config.json`; build re-run
- [ ] Names, titles, phone numbers and e-mails checked in **both** languages by a native Arabic reader
- [ ] Western digits only (no ٠١٢٣); `+968` numbers read left-to-right inside Arabic lines
- [ ] Currency `OMR 1,234.500` / `1,234.500 ر.ع.`; VAT rate and VATIN confirmed by Finance; legal text by Legal

**Brand**
- [ ] Official artwork only (`01-Logos`), never redrawn or re-typed; wordmark ≥ 25 mm wide; clear space ½ H
- [ ] One signature element per piece; Lumen and hairlines in Stone; no Stone text on light backgrounds
- [ ] Square corners (Silk Corner only on the one hero image); no drop shadows, no gold

**Production**
- [ ] Trim size, bleed, safe zone and fold/punch marks verified on the `-Print` PDF
- [ ] Fonts embedded (Jost, Tajawal) — `pdffonts` shows no fallback fonts
- [ ] Images 300 ppi at final size, CMYK / spot conversion and output intent per §5
- [ ] Deboss die, foil (Stone, Lumen only) and dieline supplied as separate layers/files
- [ ] Wet proof / drawdown signed for Maroon 7421 C and the G1 gradient on the chosen stock
- [ ] Final sign-off: Brand · Marketing · Legal / Finance (business documents)
