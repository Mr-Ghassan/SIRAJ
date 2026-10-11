# 14 · Property Marketing

The SIRAJ system applied to selling real estate: the brochure, the sales kit, the site and the street.
Every item here is a **concept built on a fictional demo project, Noor Residences** (Al Khuwair, 24 floors, 168 residences, from OMR 145,000, handover Q4 2027). Data comes from `00-Brand-Foundation/brand.config.json`. Values marked `[PLACEHOLDER]` must be confirmed before release.

Everything is generated from source. Do not edit the exports by hand:

```bash
node tools/build-property.js              # everything (≈ 6 min)
node tools/build-property.js brochure     # one section: lockup plans brochure docs outdoor event digital campaign mockups
```

The templates live in `_build/*.js`. Each one writes its HTML source into the item's `Source/` folder and then renders the PNG and PDF exports with headless Chromium (`tools/lib/render.js`). Floor plans and lockups are written as outlined SVG with HarfBuzz (`tools/lib/textpath.js`). The hoarding and sales-centre silk comes from the SIRAJ Silk engine (`06-SIRAJ-Silk/engine`), projected to vector by `_build/silk.js`.

---

## 1 · Hierarchy

The brand order holds for every property piece:

1. **Architecture first.** The building, the plan or the view leads, and it takes the largest area on the layout.
2. **Information second.** Name, facts and price come next, set on the grid in Jost or Tajawal.
3. **Silk as the signature gesture.** Use one gesture per layout: a Silk Corner window, one ribbon, an Architectural Cut, or a silk still. Never use two.
4. **SIRAJ as the final identifier.** The wordmark signs off the layout. It never competes with the project name.

The project name is the hero of the campaign and SIRAJ is the endorser. Use the copy voice from `DESIGN-LANGUAGE.md §8`. Keep sentences short and don't stack superlatives. The campaign line is *"Light, given a place to live." / «نورٌ وجد مكانًا ليسكن فيه.»*

## 2 · Project sub-brand + endorsement lockup

`00-Endorsement-Lockup/` holds the outlined SVGs and PNGs, plus `SIRAJ_Endorsement-Lockup_Sheet_v1.0.png`.

| Element | Rule |
|---|---|
| Project name | Latin: **Jost Light 300, uppercase, tracking .18em**. Arabic: **Tajawal Light 300**, never tracked. Projects get no bespoke logotypes. |
| Descriptor | Jost Medium at 16% of the name size, letter-spaced to the name width. Tracking stays between .12em and .62em. A shorter descriptor is centred. |
| Rule | A 1.2 px Stone hairline at the name width (in the bilingual version, 36% of the name width, centred). |
| Endorsement | "BY" (Jost Medium) or «من تطوير» (Tajawal Medium), followed by the **official SIRAJ wordmark** at 30% of the name size. The wordmark is never wider than 30% of the name and never larger than the name. |
| Clear space | ½ the name cap height on all sides. |
| Minimum size | 40 mm wide in print, 160 px on screen. |
| Colour | **Primary:** Deep name, Maroon descriptor and wordmark on Ivory or Linen. **Reversed:** Ivory name, Sand descriptor and wordmark on Deep, Shadow or G1. **White:** for photography only. |

The available layouts are `Stacked-EN`, `Horizontal-EN` (for narrow bands, nav bars and fascias), `Stacked-Bilingual` and `Arabic`, each in Primary, Reversed and White. Harir Villas, Qandeel Square and Mishkat Business Centre use the same construction, so the whole portfolio reads as one family.

**Outdoor split rule.** When the endorsement wordmark would fall below 96 px on screen or 25 mm in print at viewing size, the lockup splits. The project name (name and descriptor) leads, and the SIRAJ wordmark signs separately at ≥ 10% of the artwork width. This applies to billboards, hoardings, the mega-banner, the van, the site office and the step-and-repeat.

## 3 · Print documents

| Item | Format | Grid | Files |
|---|---|---|---|
| Brochure | A4 landscape, 16 pp (cover, 7 spreads, back) | 12 col · 15 mm margins · 4 mm gutter · folio 8 mm | `01-Brochure/` EN + full AR (RTL) PDF, page PNGs, spread PNGs, contact sheets |
| Fact sheet | A4 portrait, 2 pp | 12 col · 15 mm | `02-Fact-Sheet/` EN + AR |
| Floor plan sheets | A3 landscape, **true scale 1:75** | plan field + 96 mm info column | `03-Floor-Plans/` Type B 2BR and Type C 3BR, EN + AR, plus plan and key-plan SVGs |
| Investor brief | A4 portrait, 6 pp | 12 col · 15 mm | `04-Investor-Document/` (all figures are labelled *illustrative*) |
| Price list | A4 portrait | table of 40 units with status badges | `05-Sales-Kit/` |
| Sales folder | A4 presentation folder, flat with dieline | 220 × 307 mm panels, 6 mm spine, 100 mm pocket | `05-Sales-Kit/` outside + inside |

The brochure runs: Cover · Vision | Architecture · Location map | Distances · Amenity image | Amenities · Interior | Unit types · Type B | Type C · Specifications | Payment plan · Developer image | Developer · Back cover.

**Floor plans** are drawn from data in `_build/plans.js`. Rooms are rectangles in metres and walls are poché (300 mm external, 120 mm internal). The drawings show door swings, glazing and sliding doors, hairline furniture in Stone, room names in Jost Medium caps with areas in Maroon, outer dimensions, and an entrance Lumen. Areas are measured to the inside face of external walls. Every plan sheet carries a north arrow, a key plan, a scale bar and the "indicative" note.

**Status badges:** *Available* is a Maroon outline with a Lumen. *Reserved* is an Ash dashed outline. *Sold* is solid Graphite, and the sold row is greyed with its price withheld.

## 4 · Outdoor legibility rules

| Rule | Value |
|---|---|
| Headline | **≤ 7 words**, plus one information line (price or URL). Phone numbers and URLs don't count as words. |
| SIRAJ wordmark | **≥ 10% of the artwork width** (billboard: 260 / 2400 px). |
| Minimum cap height | 25 mm per 10 m of viewing distance. A 48-sheet seen at 50 m needs ≥ 125 mm capitals. |
| Elements | At most 3 (image · message · identifier). No body copy, no bullet lists, no QR codes on roadside formats. |
| Imagery | One render, never a collage. The building is shown whole or in a clear, deliberate crop. |
| Contrast | Type on a flat Deep, G1 or Ivory field, or over a scrim of ≥ 60% Shadow. Never set type over a busy part of a render. |
| Arabic | Equal standing with English. On bilingual boards, English sits start-aligned and Arabic end-aligned, at the same weight. |
| Grid | 48-sheet (6096 × 3048 mm): 12 col, 300 mm margins, 120 mm gutter. Hoarding panel (6000 × 2400 mm): 12 col, 240 mm margins. |

Large-format PDFs are exported at a stated reduction: the billboard at 1:10 and the hoarding run at 1:20. Final production files are rebuilt at 100% with 50 mm bleed by the printer.

## 5 · Hoarding continuity rules

The construction hoarding is one long image, not four posters (`06-Outdoor/Hoarding/`).

1. **One silk ribbon, unbroken.** It is generated as a single Silk-engine ribbon across the full run (24 m) and sliced into panels afterwards. Its tangent and phase are continuous across every joint.
2. **Shared horizon.** The ribbon occupies the lower 45% of the run. Type and image sit above it on one common top margin (240 mm). The ribbon may cross the bottom of an image window (the "wrap" gesture), but never the type.
3. **No type within 240 mm of a panel joint.** Every panel must read on its own if a neighbour is missing.
4. **Panel roles, in order:** ① project name (EN + AR) · ② headline + render in a Silk Corner window · ③ facts (residences · floors · handover · price) · ④ call to action + SIRAJ wordmark. Longer runs repeat ①–④. The SIRAJ wordmark appears at least once per run and at every gate.
5. **Gate and corner panels** take the project board, site safety signs and wayfinding, never campaign copy.
6. Mandatory legal text (§7) sits on panel ① at the bottom-start, ≥ 11 px on the 1:4 canvas (≈ 45 mm cap height in reality).

## 6 · Site, wayfinding, vehicle, event, digital

- **Site project board** (4 × 3 m): bilingual table of developer, architect, structural engineer, MEP consultant, supervision consultant, main contractor, project manager, building permit no., plot no. and start/completion. Placeholders are marked `[PLACEHOLDER]`.
- **Safety signage** (A2): **ISO 7010 colours and pictograms are never re-coloured or restyled.** The brand frames them with a white field, Jost/Tajawal text, a Deep footer and the SIRAJ wordmark.
- **Wayfinding:** directional totem 600 × 2000 mm, lift-lobby floor directory 900 × 1200 mm, unit plate 200 × 200 mm. Arrows are the only pictograms. The Lumen marks "you are here".
- **Vehicle:** Ivory van with one Maroon silk line rising to the front and a Deep sill band. The project name sits on the load area and the SIRAJ wordmark on the cab door. Type is never mirrored on the offside.
- **Site office:** 40 ft container painted Deep, Sand vinyl, SIRAJ wordmark ≥ 10% of the elevation length, bilingual door plate.
- **Sales centre:** a 12 × 4 m SEG feature wall carrying the engine ribbon, and a travertine reception backdrop with a halo-lit maroon wordmark.
- **Launch:** 16:9 LED backdrop (Horizon-Deep still + bilingual lockup), A5 invitation (EN front / AR back), and a step-and-repeat that alternates the SIRAJ wordmark with the NOOR name.
- **Digital:** Google display 300×250, 728×90, 300×600 and 160×600 (EN + AR), and a landing hero at 1440×800 (EN + AR). Each unit carries one photograph, one line and one action. CTAs use square corners: Ivory on Deep, or Maroon on Ivory.
- **Campaign "SIRAJ Silk × Architecture":** Silk Wrap (Noor), Silk Reveal (Harir Villas), Silk Foundation and Silk Gateway (SIRAJ masterbrand), each in 16:9, 4:5 and 9:16. Portrait photographs become a split layout at 16:9 rather than being cropped through the building.

## 7 · Mandatory legal lines

These appear on every sales document, and in short form on all outdoor items. The text lives in `_build/common.js → LEGAL` in EN and AR.

1. **Imagery:** "Images are artist's impressions for illustration only…" (on any render).
2. **Offer:** "Areas are approximate. Prices, specifications and availability are indicative… This material does not constitute an offer or contract."
3. **Registration and escrow:** "Project registration no. [PLACEHOLDER] · Ministry of Housing and Urban Planning, Sultanate of Oman. Off-plan payments are held in a dedicated project escrow account at [BANK — PLACEHOLDER]."
4. **Price lists** add a validity date and "subject to availability".
5. **Investor material** adds "not investment advice", "past performance…" and "illustrative figures" notices on every page that shows numbers.
6. **Demo notice** (this repository only): "Noor Residences is a fictional demonstration project of the SIRAJ brand system."

Legal text is set no smaller than 5.6 pt in print or 11 px on screen, in Ash on light grounds or `#B9A69A` on dark grounds.

## 8 · Arabic / English rules

- **RTL is a mirror of the layout, not a translation laid into an LTR page.** Arabic documents use `dir="rtl"`, logical CSS properties and a mirrored grid. The Silk Corner moves to the top-left. Spreads bind on the right, so page *n+1* sits to the left of page *n*.
- Maps, plans, photographs and charts are **never mirrored**. Geography, north and buildings stay true.
- **Western digits (0–9) everywhere**, including Arabic text, through the `SIRAJ Digits` face. Write currency as `OMR 145,000` / `145,000 ر.ع.`, areas as `152 m²` / `152 م²`, and dates as `Q4 2027` / `الربع الرابع 2027`.
- Arabic is never tracked, never uppercased and never set in Jost. It runs one step larger and with more leading (body 9.2 pt / 1.85 against Latin 8.4 pt / 1.6).
- Phone numbers, URLs and unit codes (L22–23, Type B) stay LTR inside Arabic runs.
- On bilingual single-surface items (boards, hoardings, signs), English leads at the start edge and Arabic follows at the end edge, at equal size. Neither language is a footnote to the other.

## 9 · Mockups

`11-Mockups/` holds six composites. Each places the flat artwork into a scene through a true perspective transform (a CSS `matrix3d` homography), with lighting overlays, contact shadows and grain: billboard by a road at dusk (rendered scene), hoarding in front of the construction site (photograph), brochure spread on a stone table, project board and safety signs at the site entrance, the site van, and the launch stage. A contact sheet sits alongside.

## Folder map

```
00-Endorsement-Lockup/   SVG/ PNG/ sheet
01-Brochure/             PDF (EN, AR) · PNG/{EN,AR} pages · Spreads/{EN,AR} · contact sheets · Source/
02-Fact-Sheet/           PDF + PNG (EN, AR)
03-Floor-Plans/          A3 sheets PDF + PNG · SVG/ plans + key plans
04-Investor-Document/    PDF + PNG + contact sheet
05-Sales-Kit/            price list · sales folder (outside / inside flat)
06-Outdoor/              Billboard · Mega-Banner · Hoarding (+Panels) · Site-Signage · Safety-Signage · Wayfinding · Vehicle · Site-Office
07-Sales-Centre/         elevations sheet + items
08-Launch-Event/         stage 16:9 · invitation · step-and-repeat
09-Digital/              Display/ (8 units) · Landing/ (EN, AR) · overview
10-Campaign-Key-Visuals/ 4 concepts × 16:9 · 4:5 · 9:16 + overview
11-Mockups/              6 composites + contact sheet
_build/                  templates (JS)    _shared/property.css
```


## 12 · Project Siraj (the Founding Project)

Official façade posts, the city-centre hero and the 3D Silk Wrap key visual for **سراج · Siraj**. See `12-Project-Siraj/README.md`.

> "Noor Residences", used across sections 01–11, is a **fictional demonstration project**. It is not the Founding Project.
