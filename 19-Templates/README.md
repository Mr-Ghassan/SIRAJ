# 19 · Templates — v1.0

Reusable templates for everyday SIRAJ documents. Built and previewed by `node tools/build-print.js`
(same build as `12-Print`). Company data comes from `00-Brand-Foundation/brand.config.json` — never type it into a
template. Values marked PLACEHOLDER there must be confirmed before anything is sent out.

```
19-Templates/
  docs/                         HTML document kit for A4
    css/siraj-doc.css           base CSS: fonts, tokens, page geometry, header, footer, tables, callouts…
    js/siraj-doc.js             runtime: config binding, calculations, page numbers, preview / print marks
    js/brand-config.js          GENERATED from brand.config.json (+ 12-Print/Source/print.config.json) — do not edit
    SIRAJ_Doc-Kit_Specimen_EN.html / _AR.html   every component, labelled with its class
    SIRAJ_Doc-Kit_Flow_EN.html  auto-paginating template for long text (policies, guidelines, minutes)
    PDF/ PNG/                   rendered specimens
  email-signature/
    signature.template.js       source (table-based, inline CSS)
    SIRAJ_Email-Signature_EN_v1.0.html / _AR_v1.0.html   GENERATED, ready to paste
    SIRAJ_Email-Signature_Preview_v1.0.png
    assets/SIRAJ_Email-Logo_v1.0.png   264 × 76 px (2×) logo to host
```

Real documents built on the kit: `12-Print/Source/Documents/` (quotation, tax invoice, SPA cover, report, memo,
vouchers) and the letterheads in `12-Print/Source/Stationery/`.

---

## 1 · HTML document kit (`docs/`)

### Start a document
1. Copy a specimen (fixed pages) or the flow template (long text) next to your file and fix the three relative
   paths in `<head>` (`css/siraj-doc.css`, `js/brand-config.js`, `js/siraj-doc.js`).
2. **Fixed pages** — one `<section class="page" lang="en" dir="ltr">` per A4 page; header, body, footer inside.
   Use for designed documents (invoice, quotation, cover, memo). Nothing reflows between pages.
   **Flow** — put everything in `<main class="flow">` with `<body data-flow data-running-title="…">`. Chrome
   paginates; page 1 carries the full header, pages 2+ get the running wordmark + title and the footer
   *Company · website · Page n of N* from `@page` margin boxes.
3. Open in Chrome/Edge → Print → *Save as PDF*, paper A4, margins *Default* (fixed pages use zero margins
   automatically), *Background graphics* on. Or add the file to `JOBS` in `tools/build-print.js`.

### Arabic
Set `lang="ar" dir="rtl"` on the page (or on `<html>` for flow). Margins, header order, Silk Corner, lists, tables,
bars and the footer mirror automatically. Wrap Latin runs inside Arabic in `<bdi dir="ltr">…</bdi>` (phones, e-mails,
references). Every `[lang="ar"]` element is an isolated RTL run, so mixed lines such as `14 نوفمبر 2026` keep their
order inside English layouts. Digits are always Western (the `SIRAJ Digits` face).

### Components (`css/siraj-doc.css`)
| Area | Classes |
|---|---|
| Page | `.page` (A4, grid margins) · `.page--sym` (20/20 margins) · `.marks-fold` + `<i class="marks-punch">` (fold/punch marks) |
| Logo | `.lk.lk--word` wordmark · `.lk--desc` descriptor · `.lk--ar` Arabic · `.lk--hz` horizontal · `.lk--stack` stacked — `--lw` = wordmark width (default 38 mm) |
| Header | `.doc-head` + `.co` (company block) · `.run-head` (inner pages) · `.title-bi` (EN title start / AR title end) |
| Type | `.eyebrow-d` · `.h1` `.h2` `.h3` · `.lead` · `.body-text` · `.small` `.muted` `.maroon` |
| Lists | `ul.lumen-list` · `ol.clauses` |
| Data | `.meta` + `.k-bi` (key/value grid) · `.party` · `.blk-k` · `.kpi__n` `.kpi__l` · `.bar` (`--v:58%`) |
| Tables | `table.doc-table` · `th.num` / `td.num` · `.idx` · `td .sub` · `td [lang=ar]` (Arabic twin line) · `.doc-table--1l` (twin on one line) · `.totals .row` / `.row--grand` · `.cur` |
| Callouts | `.callout` (Ivory + Lumen) · `.callout--rule` (Maroon rule) · `.callout--deep` (G1, once per document) |
| Bilingual | `.bi-cols` / `.bi-cols--ruled` (EN left · AR right) · `.bi-line` |
| Forms | `.fill` · `.tick` / `.tick.on` · `.sig` `.sig__line` `.sig__lbl` · `.stamp` |
| Footer | `.doc-foot` · `.doc-foot__bar` + `.folio` · `.doc-foot__cols` (4 × 3 columns) · `.bi4` (EN · EN · AR · AR) |
| Grid | `.g12` + `.c1`…`.c12`, `.s2`…`.s9` · spacing `.mt-1`…`.mt-4` (3 mm steps) · `.hair` `.hair-m` |

### Runtime (`js/siraj-doc.js`)
- **Config tokens** in text or attributes: `{{contact.phone}}`, `{{demo_projects.noor.handover|qar}}`.
  Filters: `omr` (145,000) · `omr3` (145,000.000) · `upper` · `tel` · `nbsp` · `lines` / `first` / `last`
  (split an address at its last comma) · `qar` (`Q4 2027` → `الربع الرابع 2027`).
- **Calculations**: `<table data-calc data-vat="5">`, rows `<tr data-qty="2" data-rate="2500">` (`data-vat="0"` for an
  exempt line); cells `[data-out="rate|vat|amount"]`; anywhere in the scope `[data-total="subtotal|vatable|vat|total"]`,
  `[data-pct="20"]` (instalment = 20 % of total) and `[data-words="total"]` (English amount in words, rials and baisa).
  The scope is the nearest `[data-calc-scope]` or the whole document.
- **Page numbers**: `<span data-page></span> / <span data-pages></span>` (add `data-pad` for 01 / 02).
- **URL switches**: `?preview` presentation view · `?marks` bleed + crop marks for `.sheet` items · `?dieline=0`.
  `.preview-only` blocks appear only in the preview (e.g. a sample letter on a blank letterhead); `.pv-only` elements too.

---

## 2 · Email signature (`email-signature/`)

- Two versions: **EN** (left-to-right) and **AR** (right-to-left, logo on the right). Tables only, inline CSS, no web
  fonts required (Jost / Tajawal when installed, then Helvetica/Arial or Tahoma), no background images, 520 px max.
- **Logo**: upload `assets/SIRAJ_Email-Logo_v1.0.png` to the URL in `12-Print/Source/print.config.json →
  email.logo_url` (currently a PLACEHOLDER, `https://sirajproperties.net/email/…`). It is shown at 132 × 38 px from a 2× file.
- **Personalise**: change `print.people.card` in `print.config.json` and rebuild, or edit name/title/mobile directly
  in the generated HTML. Contact lines come from `brand.config.json`.
- **Install**: open the HTML in a browser → select all → copy → paste into Outlook (*Signatures*), Apple Mail or
  Gmail (*Settings → Signature*). In Outlook for Windows, paste with *Keep source formatting*.
- Rules: no banners, no quotes, no social icons stack; the Lumen ◆ separates items; the disclaimer stays below a
  Sand hairline in Ash.

---

## 3 · Google Docs — working spec

Google Docs cannot load this kit, but it can reproduce the essentials. Word templates are out of scope for v1.0.

| Setting | Value |
|---|---|
| Page | A4 portrait. Margins: top **1.8 cm**, bottom **2.2 cm**, left **2.0 cm**, right **1.5 cm** (Arabic documents: swap left/right). |
| Fonts | *Fonts → More fonts*: add **Jost** and **Tajawal** (both on Google Fonts). Never substitute Arial/Calibri in brand documents. |
| Title | Jost **Light 24 pt**, colour `#140E10`, line spacing 1.1, space after 12 pt |
| Heading 1 | Jost Light 15 pt `#140E10`, space before 18 pt |
| Heading 2 | Jost Regular 10.5 pt `#140E10` |
| Normal text | Jost Regular **9.5 pt** `#3B3436`, line spacing 1.4, space after 6 pt |
| Eyebrow / labels | Jost Medium 7 pt, UPPERCASE, colour Maroon `#602733` (Docs has no tracking: keep them short) |
| Arabic text | Tajawal Regular **10.5 pt**, *Right-to-left* paragraph button, line spacing 1.6, never bold for emphasis — use Medium 500. Type Western digits (0–9); never Arabic-Indic. |
| Colours | Custom colours: Maroon `#602733`, Deep `#2C0F12`, Stone `#AA9180` (rules only, never text), Sand `#D6C0B2`, Graphite `#3B3436`, Ash `#6B625E`, Ivory `#F7F2ED` |
| Header | *Insert → Headers*: wordmark PNG from `01-Logos/PNG/SIRAJ_Logo_Primary_v1.0_1024px.png` at **3.8 cm** wide, aligned to the left margin (right for Arabic). Tick *Different first page* and use a 2.4 cm wordmark on following pages. |
| Footer | One-row, 4-column table, no borders except a top border 0.5 pt `#AA9180`; Jost 6.5 pt Ash: head office · contact · Arabic contact · page number (*Insert → Page numbers*, bottom right; Arabic: bottom left). |
| Tables | Header row: Jost Medium 7 pt uppercase Maroon, bottom border 0.75 pt `#602733`; rows: bottom border 0.5 pt `#D6C0B2`, no fills, numbers right-aligned. |
| Callouts | One-cell table, fill `#F7F2ED`, no border, 10 pt padding. |
| Export | *File → Download → PDF*. Check that Jost/Tajawal are embedded (they are when installed via *More fonts*). |

Keep the same naming as print: `SIRAJ_<Document>_<Variant>_v1.0`.
