# SIRAJ Brand Identity v1.0 — CLOSED / PRODUCTION READY

**Status:** closed on 13 October 2026 · version `v1.0` · branch `claude/optimistic-hopper-mykv42`
**QA:** `node tools/qa-brand.js` → report in `docs/qa/BRAND_QA_REPORT.md` (public material must show 0 failures).

## What is official

| Element | Rule | Source |
|---|---|---|
| Brand mark | The English SIRAJ wordmark (official files only; never redrawn, recoloured or stretched; bottom-right in Arabic layouts). «سراج» is never typeset as a name in Tajawal. | `01-Logos/` |
| Project name | «سراج» is never typeset as a name. A project-name lettering is **postponed** (client 2026-10-13; the «مشروع سراج» draft is archived in `99-Archive/Postponed/Project-Lettering`). Until a new one is approved: the logo + «مسقط» + the description. | `brand.config.json → founding_project` |
| Description | «شقق سكنية ومحلات تجارية», word for word; city «مسقط». No floor-by-floor wording. | `brand.config.json` |
| Language | Arabic only in public communication. Latin only for the logo, `SIRAJPROPERTIES`, `WWW.SIRAJPROPERTIES.NET` and the phone. English is dormant. | `00-Brand-Foundation/` |
| Contact | Phone always **7771 4404** (groups of four, non-breaking space). Instagram = Instagram icon + **SIRAJPROPERTIES**, never «@». Posts, stories and video outros: phone + Instagram only. Stationery, presentations, email signature, documents: + **WWW.SIRAJPROPERTIES.NET** (in full, in capitals). | `brand.config.json → contact` |
| Colour | Maroon `#602733`, Deep, Shadow, Stone, Sand, Ivory, Linen; light is ivory-rose, never yellow or gold. | `02-Colours/` |
| Type | Tajawal (Arabic) + Jost (Latin), Western digits, no Arabic letter-spacing. Arabic line height: display ≥ 1.3, headings ≥ 1.4, body ≥ 1.6; lines never touch, also in Bold. | `03-Typography/` |
| Silk | Real, pressed silk only (photographs or 4K footage), maroon, one gesture per layout; never wrinkled or creased; it veils, wraps, reveals, frames or passes the architecture and never replaces it. | `06-SIRAJ-Silk/` |
| Air | Wind moves the silk and the trees and plants: one direction (right → left), slow travelling waves, at most one gust, then settle; the building never moves. | `motion-system/tokens/siraj-wind.json` |
| Imagery | Only the real project: six 4K renders and the Silk & Light key visuals, finished with the SIRAJ Luxe Grade (less yellow, deeper blacks). | `14-Property-Marketing/12-Project-Siraj/Source/` |
| Artwork | No side notes, footnotes or disclaimers on designs (disclaimers go in captions). Unconfirmed prices, areas, unit counts and dates are «—» slots and are omitted from public material. | `AGENTS.md` |
| Internal only | Strategy lines, pillar names and internal project labels never appear publicly. | `AGENTS.md` |

## Deliverables (v1.0)

- Logos, lockups, monogram
- Colour, type, grids, graphic system, icons (incl. Instagram, WhatsApp, Email, Shop)
- Pressed-silk library: 11 formations (5 re-shot at 4K on 2026-10-13; Drape-Lumen re-shot deep on 2026-10-14), alpha cut-outs, 4K footage (16:9, 9:16). Highlights stay maroon and restrained (`tools/siraj-silk-deepen.py`)
- Social: 16 briefs → posts, stories, carousels, reel cover, quote, contact story; 5 real-estate templates with «—» slots
- The project (مسقط): 5 Silk & Light key visuals (post + story), hero, facade and wrap posts
- Print: business cards, letterhead, compliments slip, continuation sheet, envelopes, presentation folder, memo, ID card, email signature
- Presentation: 10-slide PPTX + PDF + PNG
- Brand guidelines PDF, the SIRAJ brand skill, Claude Design kick-off pack, brand kit ZIPs (one per Drive folder)

## Open items that need a person

0. A new project-name treatment for the project (the «مشروع سراج» lettering was cancelled and postponed on 13 October 2026).
1. Legal/commercial data: CR number, VATIN, full address, bank details → quotation, tax invoice, receipt and contract cover stay isolated (`99-Archive/Demo-Isolated/12-Print-Pending-Legal-Data`).
2. Real names and titles for business cards and signatures (templates show «الاسم / المسمى الوظيفي»).
3. Prices, areas, unit mix and dates for the project (templates show «—»).
4. Email signature images must be hosted on the company mail server/CDN, then `email.logo_url` set.
5. Binary uploads to Google Drive (see the final report: text/index files were uploaded; large binaries go as ZIPs).
