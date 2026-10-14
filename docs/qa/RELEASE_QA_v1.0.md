# SIRAJ Brand System v1.0 — Final release QA

**Date:** 14 October 2026 · **Baseline:** `3d07509` on `claude/optimistic-hopper-mykv42` · **Environment:** Node 22, Chromium (Playwright), Python 3

## Commands

| Command | Result |
|---|---|
| `npm ci` | Clean install · 0 vulnerabilities |
| `npm run qa` → `node tools/qa-brand.js` | **0 failures** · 373 text + 753 binary files scanned (`BRAND_QA_REPORT.md`) |
| `npm run qa` → `node tools/build-design-system-docs.js` | **0 issues** · 19 page views (`DESIGN_SYSTEM_QA.md`) |
| `python3 tools/qa-silk.py` | **0 failures** · 22 silk stills |
| `pdfinfo` on the guidelines | 82 pages |
| `unzip -t` on all 10 release ZIPs | All OK (see the release manifest) |

## Checklist

| Check | How | Result |
|---|---|---|
| Brand QA = 0 failures | `qa-brand.js` | ✅ 0 |
| Design System regressions | `build-design-system-docs.js`: JS errors, broken images, horizontal overflow at 390 px, tight Arabic line height, «@» | ✅ 0 on all 19 views |
| Broken images / missing assets | DS page QA (above); guidelines render 82/82 pages | ✅ |
| JavaScript errors | DS page QA; motion renders (45 jobs, no page errors) | ✅ |
| Horizontal overflow | DS page QA at 390 px; social layout QA (content vs. logo zone) on every format | ✅ |
| Tight Arabic line height | DS page QA; type tokens: display ≥ 1.36, headings ≥ 1.42, body ≥ 1.6 | ✅ |
| «@» before the Instagram handle | `qa-brand.js` rule | ✅ none |
| Old / ungrouped phone | `qa-brand.js` rule (77714404 outside `tel:`/WhatsApp/data) | ✅ none |
| Cancelled project lettering | `qa-brand.js` rule (`01-Logos/Project/`, `Project-Siraj_Lettering`, `[lettering]`) | ✅ none |
| Typed «سراج» as brand/project name in public artwork | Grep of every public source (social, print, presentations, project posts, motion, intro/outro, DS, templates) | ✅ only the legal name «سراج للتطوير العقاري» (part of the approved bilingual lockup), data fields, code comments and the approved copy line «حين يحلّ المساء، يُضيء سراج.» (kept as approved; decision pending with the client) |
| Internal strategy in public assets | `qa-brand.js` rules (Founding Project, strategy lines, PROVE→EXPAND→SCALE) | ✅ none |
| Fictional projects | `qa-brand.js` rules (Noor, Harir) | ✅ none |
| Website form | `qa-brand.js` (only `WWW.SIRAJPROPERTIES.NET` or the https URL) | ✅ |
| Creased silk | Visual review of all formations; re-shot stills checked at 100 % crops; creased/soft sets archived (`99-Archive/Silk-Creased-v1.0`, `Silk-Footage-Soft-v1.0`) | ✅ |
| Yellow / gold cast, washed sheen | `qa-silk.py`: brightest-3 % hue ≤ 24° (maroon ≈ 14°), L99.5 ≤ 76, chroma ≥ 18; washed/spotlit stills archived (`99-Archive/Silk-Washed-v1.0`) | ✅ 22/22 |

## Notes

- `npm run qa` re-captures the Design System PNG exports. Those re-captures differ only by rasterisation noise, so they were not committed; the baseline exports stay as released.
- No regressions were found, so no fixes were made in this pass. The frozen baseline is unchanged.
