# AGENTS.md — rules for anyone (human or AI) producing SIRAJ work

SIRAJ Real Estate Development · سراج للتطوير العقاري. Read this before you change or produce anything in this repository.

## Sources of truth
- Brand data: `00-Brand-Foundation/brand.config.json`. Never hard-code contact data; read it from here.
- Brand rules and voice: `.claude/skills/siraj-brand-system/SKILL.md`. Official guidelines: `20-Brand-Guidelines/`.
- Status of each system: `BRAND_STATUS.md`, `DESIGN_SYSTEM_STATUS.md`, `MOTION_SYSTEM_STATUS.md`.
- Operational file store (Google Drive): the «سراج» folder, organised as `01 ـ الهوية البصرية الرسمية` … `07 ـ العروض والمستندات الرسمية`. Never touch `ملفات سراج الهندسية`.

## Non-negotiables
1. **Arabic only** for public communication. Latin only for the logo, `SIRAJPROPERTIES`, `WWW.SIRAJPROPERTIES.NET` and the phone number. English is dormant (`99-Archive/English-Dormant`).
2. **Contact.** Never write «@»: Instagram is always the **Instagram icon + `SIRAJPROPERTIES`** (`07-Icon-System/svg/…/siraj-icon-instagram.svg`, `contact.social_icon_svg`). The website is always written in full and in capitals: **`WWW.SIRAJPROPERTIES.NET`**.
   - Posts, stories and video outros: `7771 4404` + Instagram icon/handle only.
   - Stationery, presentations, email signature, documents: phone + Instagram icon/handle + `WWW.SIRAJPROPERTIES.NET`.
   - Never the email address, street address or other data unless explicitly requested.
3. **No side notes, footnotes or disclaimers on artwork.** Disclaimers go in captions.
4. **Public naming:** the SIRAJ brand mark is the English logo; never typeset «سراج» as a name in Tajawal. A project-name lettering is **postponed** (client 2026-10-13; the «مشروع سراج» draft is archived in `99-Archive/Postponed/Project-Lettering` and is never used). Until a new one is approved, layouts carry no typeset project name: the logo, «مسقط» and the description identify it. In running copy say «المشروع» or «مسقط» instead of the bare name. Describe it exactly as «شقق سكنية ومحلات تجارية». Never write «في الأعلى / في الأرض / في الطابق الأرضي».
5. **Internal only, never public:** «المشروع المؤسِّس / The Founding Project», «سراج لا تبدأ بالانتشار، بل تبدأ بمعيار», «إثبات ← توسّع ← نمو», pillar names, and self-praising "standard" lines.
6. **Copy:** depth without pretension. Write about place, light, architecture, material, life and detail. Not about the company's greatness, leadership or "the standard".
7. **No fictional projects.** «مساكن نور» and «حرير» are isolated in `99-Archive/Demo-Isolated/`. Use only the real project, its approved renders (`14-Property-Marketing/12-Project-Siraj/Source/Clean`) and its key visuals (`…/Key-Visuals`).
8. **Unknown facts are never invented.** Prices, areas, unit counts and dates are unconfirmed. Templates show labelled data slots («—»), and public material omits them.
9. **Silk is real silk** (photographs or footage), maroon, one gesture per layout. **Always pressed silk: smooth, liquid folds and a clean sheen. Never wrinkled, crinkled, crushed or creased (un-ironed) silk** (client rule 2026-10-13). **Close-ups use high-resolution footage**: generate close-up video at the highest resolution available (4K, at least 1080p) and never upscale a soft clip into a close-up. It interacts with the architecture (veil, reveal, wrap, frame, pass) but never replaces it. The building is never made of fabric.
10. **Logo:** official files only; never redrawn, recoloured outside its variants, or stretched. Bottom-right in Arabic layouts.
11. **People:** women only in hijab with modest dress; Omani men in dishdasha + massar; no intimate poses. Prefer no people.
12. **Type:** Tajawal (Arabic) + Jost (Latin), Western digits, no Arabic letter-spacing. Display lines may pair 200 with 800. **Arabic line spacing: display ≥ 1.3, headings ≥ 1.4, body ≥ 1.6. Lines never touch or overlap, especially in Bold.**
13. **Motion:** FLOW · DRAPE · REVEAL · WRAP · FOLD · GLIDE · SETTLE. No bounce, elastic, glitch, flashy zooms, random 3D or gold clichés.
15. **Light is ivory-rose, never yellow.** Reduce yellow/amber light everywhere: lamps, windows, sun haze and light sweeps read warm ivory-rose, not gold. Every final scene must feel quiet and luxurious: deep clean blacks, soft highlight roll-off, one sheen. Grade images with `tools/siraj-luxe-grade.py`.
14. **Air / wind moves everything soft.** In all motion and every video we produce, the silk moves because a breeze passes through it, and so do the trees, palms and plants in and around the project wherever they appear. One prevailing direction per scene (right → left), slow travelling waves, at most one gentle gust per film, then SETTLE. Never a storm, flapping, jitter or looping wobble, and the architecture never moves. Values and video-prompt lines: `motion-system/tokens/siraj-wind.json`.

## Working rules
- Generated files carry the version `v1.0`. Keep sources editable (HTML/CSS/JS/JSON), and render with the scripts in `tools/`.
- Don't commit secrets. Don't touch `node_modules/`. Large binaries go through `tools/build-kit.sh` packages.
