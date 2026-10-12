# SIRAJ — Social Media System v1.0

The social feed follows the same order as every other SIRAJ layout: **architecture first, information second, silk as the signature gesture, logo as the final identifier.** It should read as SIRAJ even when the logo is small. Four constants make that work:

1. **One logo zone.** The wordmark always sits bottom-start (bottom-left in English, bottom-right in Arabic), on the margin, at the same size per format.
2. **Lumen ◆ markers.** Every eyebrow, fact list, bullet and counter is marked with the Stone Lumen.
3. **One silk gesture per post.** Use a Silk Horizon, a Silk Corner window, a Portal, a Blade, a Silk Line or a silk still. Pick one.
4. **Quiet type in a maroon and ivory palette.** Headlines are Jost 300 / Tajawal 300 and never bold. Digits are Western (0–9) in both languages.

All copy and project data in the exports is demo content for the fictional projects in `00-Brand-Foundation/brand.config.json`.

---

## 1. Folder

```
11-Social/
  Templates/                 one HTML per template (source of truth) + shared engine
    social.css · social.js   layout engine (formats, environments, blocks, QA)
    brand-data.js            GENERATED from 00-Brand-Foundation/brand.config.json
    highlight-icons.js       GENERATED from 07-Icon-System/sprite/siraj-icons.svg
    Property-Launch.html … Reel-Cover.html, Highlight-Cover.html, Profile-*.html
  Exports/                   84 PNGs  SIRAJ_Social_<Template>_<Format>_<EN|AR>_v1.0.png
  Highlights/                8 highlight covers + overview board
  Profile/                   avatar (1080 copy), avatar usage board, 9-tile grid preview EN + AR
```

**Rebuild everything:** `node tools/build-social.js`. **Rebuild part of it:** `node tools/build-social.js Quote Event`. A filter matches template names, `Highlight` or `Profile`.
The build is deterministic. It regenerates `brand-data.js` and `highlight-icons.js`, then renders every export listed in each template's `exports` block. Before each screenshot it runs layout QA, which checks for text overlapping the logo zone, text outside the margins or story safe zones, clipping and missing images. Any warning gives a non-zero exit code.

### Editing a template
Each HTML file opens with a JSON block (`<script id="data">`):

```json
{ "name": "Property-Launch",
  "exports": { "post": ["en","ar"], "story": ["en","ar"], "li": ["en","ar"] },
  "layout": "hero", "env": "photo", "photo": "Residential-Tower-Golden-Hour", "overlay": "horizon",
  "en": { "eyebrow": "Now launching", "title": "{noor.en}", "lead": "…", "blocks": [ … ], "end": "{contact.post_line}" },
  "ar": { … },
  "formats": { "li": { "layout": "split", "env": "deep" } } }
```

- **Tokens** pull data from `brand.config.json`, so contact details are never hard-coded:
  - `{contact.phone}` and `{noor.units}` insert the value as written.
  - `{n:noor.from_price_omr}` inserts a grouped number, e.g. `145,000`.
  - `{q:noor.handover}` inserts `Q4 2027` in English and `الربع الرابع 2027` in Arabic.
  - `{sum:noor.units+harir.units}` inserts the total.
  - `[[…]]` isolates a left-to-right run (a phone number, handle or URL) inside Arabic.
- **Preview in a browser:** `Templates/<Name>.html?format=post|square|story|reel|carousel|li|x&lang=en|ar` (add `&slide=n` for a carousel, `&guide=1` for the reel crop guide).
- **Blocks:**
  - `facts` is a row of Lumen-separated facts.
  - `stats` is numerals over hairlines.
  - `progress` is a large % with a Lumen bar.
  - `details` holds key / value rows.
  - `list` is a Lumen bullet list.
  - `quote` uses the Silk Blade as its quotation mark.
  - `partners` is SIRAJ × a partner slot.
  - `index` is a series numeral.

---

## 2. Formats, grid and safe zones

| Format | Key | Size (px) | Margin | Safe top / bottom | Logo width | Notes |
|---|---|---|---|---|---|---|
| Instagram Post | `post` | 1080 × 1350 | 72 | 72 / 72 | 168 | 6 col · 24 gutter. Grid crop 3:4 trims 34 px per side, so keep nothing critical in the outer 40 px. |
| Square | `square` | 1080 × 1080 | 72 | 72 / 72 | 160 | Drop the lead line if the headline needs the room. |
| Carousel | `carousel` | 1080 × 1350 × 3–5 | 72 | 72 / 72 | 168 | Counter `01 / 05` sits bottom-end. The last slide carries the lockup. |
| Story | `story` | 1080 × 1920 | 72 | **250 / 340** | 184 | Imagery may run under the platform UI. Text and logo may not. |
| Reel cover | `reel` | 1080 × 1920 | 72 | **312 / 312** | 184 | All type and the logo stay inside the centre **1080 × 1440** (y 240–1680) grid crop. See `Reel-Guide`. |
| LinkedIn | `li` | 1200 × 627 | 56 | 56 / 56 | 116 | Split layout: text on start, image on end. |
| X | `x` | 1600 × 900 | 80 | 80 / 80 | 156 | Split or full-bleed hero. |

The 6-column grid (portrait) has columns of 136 px with 24 px gutters. Column edges sit at 72 · 208/232 · 368/392 · 528/552 · 688/712 · 848/872 · 1008. The Project Feature portal starts on column 3 (x 392).

### Type sizes (px)

| Role | Post | Square | Story / Reel | LinkedIn | X | Spec |
|---|---|---|---|---|---|---|
| Display (launch, cover) | 96 | 86 | 104 | 60 | 82 | Jost 300, −1.5% tracking · Tajawal 300, line 1.26 |
| Title | 70 | 62 | 78 | 46 | 62 | Jost 300 · Tajawal 300, line 1.3 |
| Lead | 30 | 28 | 33 | 20 | 26 | Jost 300 · Tajawal 400, line 1.65 |
| Stat numeral | 80 | 72 | 88 | 50 | 68 | Jost 200, lining figures |
| Progress numeral | 210 | 180 | 240 | 120 | 160 | Jost 200 |
| Eyebrow | 20 | 19 | 22 | 13 | 16 | Jost 500 UPPERCASE +0.16em · Arabic ×1.26, Tajawal 500, **no tracking, no case** |
| Caption / label | 18 | 17 | 19 | 12 | 15 | Jost 500 UPPERCASE +0.14em · Arabic ×1.26 |

Headlines shrink automatically (5% steps) when a translation runs long, so they never collide with the logo zone. Never set display type in a bold weight.

---

## 3. Layouts (the four archetypes)

| Layout | Use | Silk gesture | Logo |
|---|---|---|---|
| **Hero:** full-bleed architecture, text bottom-start | Launch, Event, Carousel cover, Reel cover | **Silk Horizon** (the silk becomes the ground the building stands on) *or* a deep scrim when the photo already contains silk | Sand on silk, White on photo |
| **Window:** field colour + image window, text below (or above) | Construction, Sold, Investment, Feature, Corporate, Carousel 02 | **Silk Corner** on the top-end corner, or the **Portal** arch | Primary on ivory/linen, Sand on deep/maroon |
| **Split:** text column on start, image window on end | LinkedIn and X versions | Silk Corner on the image | as above |
| **Type:** typographic, no photograph | Quote, Statistics, Hiring, Partnership, Carousel 03–05 | One of: silk still (Drape / Horizon), **Silk Line**, **Silk Line Pair**, **Silk Blade** | as above |

**Environments:** Ivory `#F7F2ED`, Linen `#EFE7E0`, Deep `#2C0F12`, Shadow `#170608`, Maroon (G1 gradient `51°, #2C0F12 → #602733`), Photo.
**Feed rhythm:** alternate dark and light tiles (see the grid preview). Avoid more than two dark or two light posts in a row, and keep at least one architecture photograph in every row of three.

### Logo placement
- Wordmark only (`01-Logos/SVG/SIRAJ_Logo_<Primary|Sand|White>_v1.0.svg`), bottom-start, on the margin. The bottom edge of the letters sits on the bottom safe line.
- Primary (maroon) on ivory/linen. Sand on deep, maroon and silk. White only on photography.
- The **end slide** of a carousel uses the lockup instead: `Lockup_Descriptor_Reversed` (EN) or `Lockup_Arabic_Reversed` (AR), aligned optically to the same corner.
- Bottom-end holds one quiet caption only: website, handle, opening hours, carousel counter or the investment disclaimer. Never a second logo.

### Arabic (RTL)
- Arabic versions are full mirrors. Text, logo zone, Silk Corner and Portal flip to the other side, and so do the silk elements and the Horizon. **Photographs are never mirrored.**
- Tajawal is never tracked or uppercased. Digits stay Western (rendered in Jost through `SIRAJ Digits`).
- Currency is written `145,000 ر.ع.`, dates `الربع الرابع 2027`, and areas `245 م²`.
- Wrap phone numbers, handles and URLs in `[[…]]` so the `+` and dots stay in place.

---

## 4. Template catalogue

| Template | Layout (post) | Exports (EN + AR) |
|---|---|---|
| Property Launch: Noor Residences | Hero + Silk Horizon | Post · Square · Story · LinkedIn · X |
| Sold Announcement: Harir Villas | Window (maroon) | Post · Square · Story |
| Construction Update: 62% progress | Window (ivory) + progress bar | Post · Story · LinkedIn |
| Investment Opportunity: Mishkat | Window (deep) + 2×2 stats + disclaimer | Post · Story · LinkedIn |
| Project Feature: Qandeel amenity | Portal window + series index | Post · Story |
| Corporate Announcement: sales centre | Window, image below text | Post · Story · LinkedIn · X |
| Quote | Type on Drape-Deep silk | Post · Square · LinkedIn |
| Statistics | Type on G1 + Silk Line | Post · Square · LinkedIn · X |
| Event Invitation: Harir private preview | Hero (Silk Gateway photo) + details | Post · Story · LinkedIn |
| Hiring | Type + Silk Blade resting on a hairline | Post · Story · LinkedIn |
| Partnership | Type + Silk Line Pair + partner slot | Post · LinkedIn |
| Noor Carousel (5) | Cover → Residences → Amenities → Key facts → Register (end card) | Carousel-01…05 |
| Reel Cover: Harir film | Hero, centre-safe | Reel + Reel-Guide |

**Investment posts** must always carry the disclaimer line in the footer: *"Projected figures are indicative only and not guaranteed…"*. Yields, prices and payment plans in the samples are illustrative.
**Partnership:** replace the hairline `Partner` slot with the partner's approved logo, at the same height as the SIRAJ wordmark. Never lock up a partner without written approval.

### Highlights and profile
- `Highlights/`: 8 covers (Projects, Noor, Harir, Updates, Investment, Events, Careers, Contact) at 1080 × 1920. Each has a Sand line icon (`07-Icon-System` sprite: `sj-community`, `sj-apartment`, `sj-villa`, `sj-construction`, `sj-investment`, `sj-calendar`, `sj-team`, `sj-call`) at 300 px on a centred Lumen glow, inside the Ø 420 px circular-safe centre.
- `Profile/`: the avatar is `01-Logos/Dark/SIRAJ_Social-Avatar_Circle_v1.0.png` (1080 px master, copied here). Use the same avatar and handle on every platform. Never add rings or text, and never use photography or project logos as the avatar. The grid preview shows the 9-tile rhythm in the platform's 3:4 crop.

---

## 5. Captions and hashtags

Captions should be calm, precise and short. Use no more than one emoji, and only when it is ◆-like and quiet (preferably none). No stacked superlatives, no exclamation marks, no "DM for price". Write the Arabic as a native caption, not a word-for-word translation.

**Launch (EN)**
> Noor Residences. A residence shaped by light and silence in Al Khuwair, Muscat.
> 168 residences · 24 floors · from OMR 145,000.
> Register your interest: call [phone] or message @SIRAJPROPERTIES
> #SIRAJ #NoorResidences #Muscat #Oman #Architecture

**Launch (AR)**
> مساكن نور. مساكن تتشكّل بالضوء والسكينة في الخوير، مسقط.
> 168 وحدة سكنية · 24 طابقاً · ابتداءً من 145,000 ر.ع.
> سجّلوا اهتمامكم: اتصلوا على [رقم الهاتف] أو راسلونا على ‎@SIRAJPROPERTIES
> #سراج #مساكن_نور #مسقط #عمان #عمارة

**Construction update (EN):** "Noor Residences has reached level 18 of 24. The façade installation is under way. Handover remains on track for Q4 2027."
**Construction update (AR):** «بلغت أعمال مساكن نور الطابق 18 من 24، وبدأ تركيب الواجهات. التسليم في موعده: الربع الرابع 2027.»

**Hashtag set:** 3–5 per post. Always include `#SIRAJ` / `#سراج`, then the project, the city and one theme. Use the project tag consistently (`#NoorResidences` `#HarirVillas` `#QandeelSquare` `#MishkatBusinessCentre` / `#مساكن_نور` `#فلل_حرير` `#ساحة_قنديل` `#مركز_مشكاة`). Don't use trending tags unrelated to the post.
**LinkedIn:** write full sentences, put the facts first and skip hashtags beyond `#SIRAJ` and the project. **X:** one sentence and one link.

---

## 6. Do / Don't

**Do**
- Let the architecture lead. Images take at least 40% of the frame on photo templates.
- Keep a single silk gesture and a single headline per post.
- Use Lumen markers for every list or fact row, and hairlines (Stone 70%) for structure.
- Keep the logo, size and corner identical across a series.
- Put every number in Western digits, including in Arabic.

**Don't**
- Don't cover the whole post with silk or stack two silk elements, e.g. a Horizon plus a Blade.
- Don't round corners other than the single Silk Corner or Portal, and don't use pills, drop shadows, glassmorphism or gradient text.
- Don't use bold or condensed headlines, all-caps Arabic, tracked Arabic or Arabic-Indic digits (٠١٢٣).
- Don't place type in the story UI zones (top 250 / bottom 340) or outside the reel's 1080 × 1440 centre.
- Don't mirror photography, stretch the logo or recolour it outside Primary / Sand / White.
- Don't add stickers, starbursts, "SOLD" stamps, price badges or emoji to artwork.

---

## 7. File naming

`SIRAJ_Social_<Template>_<Format>_<EN|AR>_v<major.minor>.png`

- `<Format>` is one of `Post`, `Square`, `Story`, `Reel`, `Reel-Guide`, `LinkedIn`, `X` or `Carousel-01`…`Carousel-05`.
- Highlights are named `SIRAJ_Social_Highlight_<Name>_v1.0.png`. Profile boards are named `SIRAJ_Social_Profile_<Board>_v1.0.png`.
- Bump the version when the system changes, not when copy changes. For live campaign posts, append a date: `…_EN_v1.0_2026-11-12.png`.

> Contact details (website, email, phone, handle) are marked **PLACEHOLDER** in `brand.config.json`. Confirm them there and rerun `node tools/build-social.js` before anything is published.

## Contact line (client rule, 2026-10-12)

Every post shows the **phone number and `@SIRAJPROPERTIES` only — never the website**. The default footer is the token `{contact.post_line}`. While `contact.phone` in `00-Brand-Foundation/brand.config.json` is a placeholder, the phone shows as «[رقم الهاتف]». Set the real number, change `phone_status` to `CONFIRMED`, then rebuild (`node tools/build-social.js` and the Project Siraj builds).
