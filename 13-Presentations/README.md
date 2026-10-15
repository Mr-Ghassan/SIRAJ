# 13 · Presentations — SIRAJ Presentation System v1.0

The formal presentation language of SIRAJ Real Estate Development (سراج للتطوير العقاري), shown through a sample
investor presentation for **Noor Residences**. Noor Residences is a fictional demonstration project, and all of its figures are illustrative.

```
13-Presentations/
├── deck/
│   ├── siraj-deck.html        English master deck · 21 slides
│   ├── siraj-deck-ar.html     Arabic RTL deck · 11 key slides
│   ├── deck.css               layout system (grid, type, components, RTL)
│   └── deck.js                viewer + footer + data-driven charts, map, site plan, floor plan
├── Exports/
│   ├── PNG/                   one 1920×1080 PNG per slide (EN_01…21, AR_01…11)
│   ├── SIRAJ_Presentation_Noor-Residences_EN_v1.0.pdf
│   ├── SIRAJ_Presentation_Noor-Residences_AR_v1.0.pdf
│   └── SIRAJ_Presentation_Noor-Residences_{EN,AR}_Contact-Sheet_v1.0.png
└── PPTX/
    └── SIRAJ_Presentation-Template_v1.0.pptx   editable PowerPoint · 13 slides
```

Build:

```bash
# v1.0 presentation (Arabic): npm run build:presentations  (tools/build-presentation-v1.py)
# The commands below belong to the earlier template kit, archived in 99-Archive/Demo-Isolated/13-Presentations/
node tools/build-presentations.js          # PNG + PDF + contact sheets (EN and AR)
node tools/build-presentations.js --lang=AR --preview=/tmp/x --slides=3,7 --grid   # quick check with the grid overlay
python3 tools/build-pptx.py                 # editable PowerPoint
```

---

## 1. Grid

| | |
|---|---|
| Canvas | 1920 × 1080 px (16:9) |
| Columns | 12 · column 110.67 px · gutter 32 px |
| Margins | 120 px left/right · 96 px top/bottom (content area 1680 × 888) |
| Footer band | 48 px, 24 px above the bottom edge: Lumen ◆ + section on the start side, page number + 96 px wordmark on the end side |
| Baseline | 8 px |

- Each content slide is a `.frame`, a 12-column CSS grid. Elements snap to columns with `.c-[start]-[end]` classes, for example `.c-7-12`.
- Text never sits in the outer 120 px margin. Images may bleed off the page edges.
- Press **G** in the browser to show the column overlay.

## 2. Type

| Role | Latin (Jost) | Arabic (Tajawal) |
|---|---|---|
| Display (cover, divider) | 112 px · Light 300 · −1.5% | 116 px · Light |
| Slide title | **56–64 px** (60) · Light 300 · leading 1.08 | 64 px · Light · leading 1.3 |
| Lead | 32 px · Light | 32 px · Light · leading 1.7 |
| Body | **24–28 px** (26) · Regular | 25–27 px · leading 1.75 |
| Caption / eyebrow | **16 px** · Medium 500 · UPPERCASE · 0.16em | 19–20 px · Medium · never tracked or uppercased |
| Numerals (KPI) | 96–132 px · ExtraLight 200 | same Jost figures |
| Folio (footer) | 14 px · Medium · 0.16em | 17 px |

- Display and titles are always light. SIRAJ never uses bold headlines.
- **Western digits (0–9) everywhere.** The `SIRAJ Digits` face draws Arabic-context numbers with Jost figures.
- Write currency as `OMR 212,000` in English and `212,000 ر.ع.` in Arabic. Write areas as `136 m²` / `136 م²` and dates as `Q4 2027` / `الربع الرابع 2027`.
- In the Arabic deck, `deck.js` isolates percentages such as `40%` so that they read identically in both languages.

## 3. Layouts

| # | Layout | Variant | Notes |
|---|---|---|---|
| 01 | Cover | dark | Wordmark top-start. Portal-masked hero image on columns 8–12. Bilingual project name. |
| 02 | Agenda | light | Title on columns 1–5, numbered list on columns 7–12. |
| 03 | Executive summary | light | Lumen-bulleted statements and one progress figure. |
| 04 / 10 / 15 | Section divider | dark silk · **light silk** · dark silk | Number in 240 px ExtraLight. Silk still with a start-side scrim. |
| 05 | Project overview | light | Image bleeds to the start edge with **one Silk Corner**. Spec grid. |
| 06 | Full-bleed image | dark | Text sits in the calm, dark third. Scrim gradient. |
| 07 | Location | light | Stylised SVG map of the Muscat coast. Lumen pins, 2/5 km rings, drive-time table. |
| 08 | Masterplan | linen | Stylised SVG site plan with numbered keys. The tower footprint carries the Silk Corner. |
| 09 | Floor plan | light | Architectural SVG of a two-bedroom residence: walls, doors, glazing, dimensions, room areas in m². |
| 11 | Key numbers | dark | 3 × 2 KPI grid. One Lumen marks the key figure. |
| 12 | Charts: bar + line | light | Sales velocity and price per m². |
| 13 | Chart: stacked bar | light | 100% stacked bars replace a donut (unit mix by count and by value). |
| 14 | Timeline | light | Filled Maroon Lumen = done, outline = upcoming, Stone = key milestone. Dashed *Today* marker. |
| 16 | Financial table | light | Hairline table, right-aligned light figures, inline progress bars, returns column. |
| 17 | Investment proposition | maroon (G1) | Four pillars. A Sand Silk Line connects the layout. |
| 18 | Payment plan | light | Proportional instalment bar, worked example, terms. |
| 19 | Team | light | Monogram tiles, role, firm, scope. |
| 20 | Quote | deep | Lumen halo, a single sentence. |
| 21 | Closing / contact | dark silk | Wordmark, brand line, contact details, disclaimer. |

**Rhythm.** Alternate light and dark slides so the deck breathes. Do not run more than three dense data slides in a row without an image or a divider.

## 4. Image and silk usage

- **Silk appears only on the cover, section dividers and closing slide.** On content slides, use at most one vector gesture: a Silk Line, the Silk Corner or the Lumen.
- Use photographs only from `08-Photography/Library` and silk stills only from `06-SIRAJ-Silk/Stills`. Do not use stock imagery that breaks the warm, graded palette.
- Containers are square-cornered. The **Silk Corner** (one radius, top-end) appears at most once per slide. The **Portal** arch is reserved for project reveals on the cover.
- Put captions under images in caption style. Mark visualisations as *Visualisation*.
- In RTL, mirror image containers and scrims. Never mirror the logo, photographs that contain text, or architectural drawings.

## 5. Chart rules

- **Palette (in order):** Maroon `#602733` · Stone `#AA9180` · Graphite `#3B3436` · Silk Highlight `#C79A9C` · Warm Grey `#8E837D` · Deep `#2C0F12`.
- Highlight one thing in Maroon and keep the rest in Stone. Mark the key data point with a **Lumen ◆**.
- Gridlines are 1 px Stone hairlines at 55% opacity. Draw a solid Graphite baseline. Do not draw axis boxes.
- Set numerals in light Jost and give values thousands separators.
- **Label directly** (series names at line ends, categories above segments) instead of using legends.
- No 3D, no shadows, no gradients and no donuts. Use 100% stacked bars for composition.
- Every chart has a title, a unit line, and a source note when the data is external.
- In Arabic, charts read right-to-left: the time axis is mirrored and the y-axis moves to the right.

## 6. Do / Don't

| Do | Don't |
|---|---|
| Write one idea per slide, with a sentence-style title that states the takeaway. | Write titles like "Chart 3" or stack superlatives. |
| Leave generous negative space and align everything to the 12 columns. | Fill every column or centre body text. |
| Use Lumen ◆ bullets and hairline rules. | Use pill buttons, shadows, rounded cards or glassmorphism. |
| Use Stone for rules, the Lumen and chart fills. | Set text in Stone on light backgrounds (2.7:1 contrast). |
| Use Western digits, also in Arabic. | Use Arabic-Indic digits (٠١٢٣). |
| Use light display weights. | Use bold headlines or track Arabic text. |

## 7. Editing the HTML deck

1. Open `deck/siraj-deck.html` in Chrome. The deck scales to the window. Keys: **P** present, **← / →** navigate, **G** toggle the grid, **Esc** exit.
2. Each slide is a `<section class="slide …">`. Edit its text in place.
   - Slide variants: `slide--dark`, `slide--deep`, `slide--maroon`, `slide--linen`.
   - Footer attributes: `data-section="02 · Performance"` sets the footer label. `data-foot="none"` hides the footer. `data-foot-from="8"` starts the footer at column 8.
3. **Charts** are drawn from the JSON in the `data-chart` attribute (`type: bar | line | stack`). Change values and labels there. Gridlines, highlights and Lumen markers update automatically.
4. **Map, site plan and floor plan** use `data-draw="map|site|plan"` with options in `data-opts`. Map landmarks take `lon`/`lat` and a label side and offset (`side`, `dy`). Site keys take metre coordinates.
5. Keep paths relative. The deck loads fonts and tokens from `09-Design-System/css/siraj.css`.
6. Re-export with `node tools/build-presentations.js`. The script warns about any text that overflows a slide.

## 8. Editing the PowerPoint

`PPTX/SIRAJ_Presentation-Template_v1.0.pptx` is built by `tools/build-pptx.py`. It contains 13 slides: cover, divider, title + text, two-column, key numbers, native charts, timeline, image + caption, native table, quote, closing, Arabic cover and Arabic title + text.

- **Install the fonts first.** On the presenting machine, install Jost (Light, ExtraLight, Regular, Medium) and Tajawal (Light, Regular, Medium) from `03-Typography/fonts/`. The text boxes reference them by name, for example `Jost Light` and `Tajawal Light`. Without them, PowerPoint substitutes another font and the layouts shift.
- **Text and theme.** Every element is native and editable: text boxes, shapes, Lumen diamonds (rotated squares), pictures, the table and the charts. The theme fonts are Jost and Tajawal, and the theme colours are set to the SIRAJ palette, so new text and shapes start on-brand.
- **Charts.** Right-click a chart and choose **Edit Data**. The highlight colour is applied per data point.
- **Pictures.** Right-click and choose **Change Picture**. The Silk Corner and Portal are picture shapes, so the crop and corner are kept.
- **Arabic slides.** Arabic paragraphs are set right-to-left (`rtl="1"`) and use Tajawal as the complex-script font. Numbers stay Western.
- **Layouts.** python-pptx cannot create true slide masters or layouts. Each layout is therefore approximated on its own slide with native shapes on the branded master (Ivory background, SIRAJ theme). Duplicate a slide to reuse a layout. Speaker notes on every slide name the layout and its rules.
- **Scale.** The slide is 13.333 × 7.5 in, and the 1920 px design grid maps at 1 px = 0.5 pt. Title text is 30 pt (60 px), body 12–14 pt and captions 8 pt.

Rebuild with `python3 tools/build-pptx.py`. It requires python-pptx 1.0.2 and Pillow.
