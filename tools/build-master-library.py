#!/usr/bin/env python3
"""SIRAJ Brand Master Library v1.0.1 — writes the authoritative asset manifest and index from ONE declaration.

  python3 -I tools/build-master-library.py          → brand-master-manifest.json + BRAND_MASTER_ASSET_INDEX.md
  python3 -I tools/build-master-library.py --check  → exit 1 if a declared path is missing or the outputs are stale

Every entry names an asset family member with its canonical source and production exports. Paths are globs relative
to the repository root; each glob must match at least one existing file, or the build stops. Statuses:
  MASTER             the canonical original of an asset (edit/derive from here)
  SOURCE             editable or generating source (build scripts, HTML compositions, green-screen masters, AI file)
  PRODUCTION EXPORT  ready-to-use files derived from a master
  PREVIEW            specimen, contact sheet or reference render — never a deliverable
  REFERENCE          art-direction reference, not for publication
  SPECIAL PRODUCTION restricted use: only where a production process technically needs it (decision D2)
  ARCHIVE            not approved for production (99-Archive)
  POSTPONED          cancelled/postponed by the client; never use until re-approved
"""
import glob, hashlib, json, os, sys
from PIL import Image

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
LIB_VERSION = '1.0.1'
CHECK = '--check' in sys.argv

DECISIONS = {  # owner decisions, resolved by SIRAJ on 2026-10-15
    'D1': 'Arabic-name lockups WITHDRAWN. Every lockup that typeset «سراج للتطوير العقاري» in Tajawal (Horizontal, Stacked, Arabic-led; all colours) is archived in 99-Archive/Withdrawn/Arabic-Name-Lockups. The official English artwork is the brand mark; the Descriptor lockup stays. The registered Arabic name appears only as normal legal/administrative text where required, never as a logo or substitute lockup.',
    'D2': 'Vector silk KEPT as SPECIAL PRODUCTION / RESTRICTED USE: vinyl cutting, embroidery, special printing, fabrication, plotter/cutting workflows and other cases that technically require vectors. It never replaces the realistic pressed-maroon silk in normal marketing visuals.',
    'D3': 'Dark border-strong = #8C6B64 in both token sets (09-Design-System tokens + platform exports regenerated). #7A5A55 had no consumer and no distinct role, so it was retired rather than kept as a third border level.',
    'D4': 'Project name REMAINS POSTPONED. No project-name lettering is created, designed or restored.',
    'D5': 'Missing legal/project data stays unresolved. «—» exists only in editable/internal templates; every publish-ready export hides an unresolved field (doc runtime ?export, social publish briefs) instead of showing a placeholder, dash or invented value.',
    'D6': 'Ribbon key visual re-graded (colour only) to the family grade with tools/siraj-warmth-match.py --strength 1.4: warm environment 16.3 % → 2.5 %, yellow light 1.6 % → 0 %; composition unchanged; derived posts, stories, slide and carousel rebuilt.',
}

def E(id, category, name, status, paths, use, version='1.0', kind=None, notes=None, decision=None, sources=None):
    return dict(id=id, category=category, name=name, status=status, paths=paths, use=use, version=version,
                kind=kind, notes=notes, decision=decision, sources=sources or [])

L = '01-Logos/'
VARIANTS = [('Primary', 'Maroon letters, Stone Lumen — default on Ivory, White, Linen'),
            ('Deep', 'Deep letters, Stone Lumen — on Sand, Stone and light photography'),
            ('Sand', 'Reversed (default dark): Sand letters, Stone Lumen — on Maroon, Deep, Shadow, black, G1, silk'),
            ('White', 'Reversed white: White letters, Sand Lumen — dark or mid-tone photography only'),
            ('Mono-Black', 'Single colour #020202 (official artboard black) — emboss, foil, engraving, fax, stamps'),
            ('Mono-White', 'Single colour white — single-colour production on dark'),
            ('Mono-Maroon', 'Single colour Maroon #602733'),
            ('Mono-Deep', 'Single colour Deep #2C0F12'),
            ('Mono-Sand', 'Single colour Sand #D6C0B2')]

ENTRIES = [
    # ------------------------------------------------------------------------------------------------ LOGOS
    E('logo.master.ai', 'Logos', 'Official wordmark — Illustrator master (5 artboards)', 'MASTER', [L + 'Master/Source/SIRAJ_Logo_Master_v1.0.ai'],
      'The supplied original. Every logo file is derived from its path geometry, unchanged.', kind='editable'),
    E('logo.master.svg', 'Logos', 'Official wordmark — SVG master (Primary)', 'MASTER', [L + 'Master/SIRAJ_Logo_Master_v1.0.svg'],
      'Canonical scalable source for every raster export. Identical to SVG/SIRAJ_Logo_Primary_v1.0.svg.', kind='vector'),
    E('logo.master.pdf', 'Logos', 'Official wordmark — PDF vector master', 'MASTER', [L + 'Master/SIRAJ_Logo_Master_v1.0.pdf'], 'Print vector master.', kind='vector'),
    E('logo.master.reversed', 'Logos', 'Official wordmark — reversed SVG master (Sand)', 'MASTER', [L + 'Master/SIRAJ_Logo_Master-Reversed_v1.0.svg'],
      'Canonical reversed source. Identical to SVG/SIRAJ_Logo_Sand_v1.0.svg (PDF and PNG exports under the Sand variant).', kind='vector'),
    E('logo.source.artboards', 'Logos', 'Supplied artboards (SVG exports of the AI file)', 'SOURCE', [L + 'Master/Source/SIRAJ_Logo_Source_0*.svg'],
      'Untouched supplied artwork: primary transparent, stone mock-up, maroon gradient, black. Reference only.'),
] + [
    E(f'logo.{v.lower()}', 'Logos', f'Wordmark — {v}', 'PRODUCTION EXPORT',
      [L + f'SVG/SIRAJ_Logo_{v}_v1.0.svg', L + f'SVG/SIRAJ_Logo_{v}_v1.0_ClearSpace.svg', L + f'PDF/SIRAJ_Logo_{v}_v1.0.pdf',
       L + f'PNG/SIRAJ_Logo_{v}_v1.0_*px.png', L + f'PNG/SIRAJ_Logo_{v}_v1.0_ClearSpace_2048px.png'],
      use, sources=['logo.master.svg'], notes='PNG matrix 512 · 1024 · 2048 · 4096 px (transparent) + 2048 px clear-space; SVG canonical.')
    for v, use in VARIANTS
] + [
    E('logo.monochrome.folder', 'Logos', 'Monochrome set (by-use folder)', 'PRODUCTION EXPORT', [L + 'Monochrome/SIRAJ_Logo_Mono-*_v1.0.svg'],
      'Byte-identical copies of SVG/SIRAJ_Logo_Mono-*.svg for quick access (checked by tools/qa-library.py).'),
] + [
    E(f'logo.monogram.{v.lower()}', 'Logos', f'Monogram S — {v}', 'PRODUCTION EXPORT',
      [L + f'SVG/SIRAJ_Monogram-S_{v}_v1.0.svg', L + f'PDF/SIRAJ_Monogram-S_{v}_v1.0.pdf', L + f'PNG/SIRAJ_Monogram-S_{v}_*px.png'],
      'App icons, favicons and avatars only, where the wordmark would fall below 96 px. Never replaces the wordmark.',
      notes='PNG 512 · 1024 · 2048 · 4096 px; PDF and 512/2048/4096 added in v1.0.1 (tools/build-logo-matrix.js).')
    for v in ('Sand-on-G1', 'Maroon-on-Ivory', 'Ivory-on-Maroon', 'Maroon-Transparent')
] + [
    E('logo.favicon', 'Logos', 'Favicon set', 'PRODUCTION EXPORT', [L + 'PNG/Favicon/SIRAJ_Favicon*'], 'Web favicons 16–512 px + SVG.'),
    E('logo.avatar', 'Logos', 'Social avatars (official artboard 03)', 'PRODUCTION EXPORT', [L + 'Dark/SIRAJ_Social-Avatar_*'], 'Profile pictures: wordmark at 57.2% width on G1.'),
    E('logo.backgrounds', 'Logos', 'Logo on approved backgrounds', 'PRODUCTION EXPORT', [L + 'Light/SIRAJ_Logo_On-*', L + 'Dark/SIRAJ_Logo_On-*'],
      'Ready compositions on Ivory, White, Linen, Sand (light) and Maroon, Deep, Shadow, Black, G1 (dark); landscape and square.'),
] + [
    E('logo.lockup.descriptor', 'Logos', 'Lockup — Descriptor', 'PRODUCTION EXPORT', [L + 'Lockups/SIRAJ_Lockup_Descriptor_*'],
      'Wordmark over «REAL ESTATE DEVELOPMENT» (English-only contexts). The only approved lockup.', decision='D1',
      notes='Descriptor in Jost Regular, tracked and outlined. PNG 2400 px; PDF for Primary/Reversed. The Arabic-name lockups are withdrawn (D1).')
] + [
    E('logo.construction', 'Logos', 'Construction and clear-space diagram', 'PREVIEW', [L + 'Construction/*'], 'Explains proportion (3.49 : 1), grid unit and clear space (½ H).'),
    E('logo.spec', 'Logos', 'Logo specification', 'SOURCE', [L + 'README.md'], 'Anatomy, variants, clear space, minimum size, incorrect use.'),
    E('logo.build', 'Logos', 'Logo build scripts', 'SOURCE', ['tools/build-logos.js', 'tools/build-logo-matrix.js', 'tools/lib/logo.js', 'tools/lib/logo-paths.json'],
      'Regenerate every logo file from the master geometry (verified reproducible in v1.0.1).'),

    # ------------------------------------------------------------------------------------------------ COLOURS
    E('colour.palette', 'Colours', 'Colour palette — 15 named colours (HEX · RGB · CMYK · Pantone · contrast)', 'MASTER', ['02-Colours/SIRAJ_Colour-Palette_v1.0.json'],
      'Canonical colour specification (approved 2026-10-11).', sources=['09-Design-System/tokens/siraj.tokens.json']),
    E('colour.ase', 'Colours', 'Adobe swatches (RGB + CMYK)', 'PRODUCTION EXPORT', ['02-Colours/SIRAJ_Colours_RGB_v1.0.ase', '02-Colours/SIRAJ_Colours_CMYK_v1.0.ase'], 'Illustrator, InDesign, Photoshop.'),
    E('colour.gpl', 'Colours', 'GIMP / Inkscape / Krita palette', 'PRODUCTION EXPORT', ['02-Colours/SIRAJ_Colours_v1.0.gpl'], 'Open-source design tools.'),
    E('colour.csv', 'Colours', 'Spreadsheet palette', 'PRODUCTION EXPORT', ['02-Colours/SIRAJ_Colours_v1.0.csv'], 'Suppliers, procurement, print specs.'),
    E('colour.css', 'Colours', 'CSS variables (one canonical name per colour + gradients G1–G5)', 'PRODUCTION EXPORT', ['02-Colours/SIRAJ_Colours_v1.0.css'],
      'Web and HTML documents. Added in v1.0.1.', version='1.0.1'),
    E('colour.spec', 'Colours', 'Colour specification, accessibility and gradients', 'SOURCE', ['02-Colours/README.md', 'tools/build-colours.py'], 'Rules, contrast pairs, proportions, gradients.'),

    # ------------------------------------------------------------------------------------------------ TYPOGRAPHY
    E('type.jost', 'Typography', 'Jost (Latin + SIRAJ Digits) — TTF', 'MASTER', ['03-Typography/fonts/Jost/*.ttf', '03-Typography/fonts/Jost/OFL.txt'], 'SIL OFL 1.1. Latin and all digits.'),
    E('type.tajawal', 'Typography', 'Tajawal (Arabic) — TTF', 'MASTER', ['03-Typography/fonts/Tajawal/*.ttf', '03-Typography/fonts/Tajawal/OFL.txt'], 'SIL OFL 1.1 (Boutros International). Arabic.'),
    E('type.woff2', 'Typography', 'Web fonts — WOFF2', 'PRODUCTION EXPORT', ['03-Typography/fonts/WOFF2/*/*.woff2', '03-Typography/fonts/WOFF2/*/OFL.txt', '03-Typography/siraj-fonts-woff2.css'],
      'Lossless WOFF2 of the TTF masters + @font-face set. Added in v1.0.1 (tools/build-webfonts.py).', version='1.0.1'),
    E('type.css', 'Typography', '@font-face set (TTF)', 'SOURCE', ['03-Typography/siraj-fonts.css'], 'Imported by 09-Design-System/css/siraj.css.'),
    E('type.spec', 'Typography', 'Typography README: scale, Arabic line heights, digits, RTL', 'SOURCE', ['03-Typography/README.md'], 'Usage hierarchy and rules.'),
    E('type.specimen', 'Typography', 'Type specimen', 'PREVIEW', ['03-Typography/specimen/*'], 'Specimen PDF and pages (npm run build:type).'),

    # ------------------------------------------------------------------------------------------------ GRIDS
    E('grid.all', 'Grids', 'Layout grids (12 formats)', 'MASTER', ['04-Grids/SVG/SIRAJ_Grid_*_v1.0.svg'], 'Overlay masters for web, social, print, presentation, outdoor.'),
    E('grid.png', 'Grids', 'Layout grids — PNG overlays', 'PRODUCTION EXPORT', ['04-Grids/PNG/SIRAJ_Grid_*_v1.0.png'], 'Raster overlays for tools without SVG.'),
    E('grid.spec', 'Grids', 'Grid specification', 'SOURCE', ['04-Grids/README.md', '04-Grids/*.json', 'tools/build-grids.js'], 'Columns, margins, gutters, safe areas.'),

    # ------------------------------------------------------------------------------------------------ GRAPHIC SYSTEM
] + [
    E(f'graphic.{slug}', 'Graphic system', name, 'PRODUCTION EXPORT', [f'05-Graphic-System/SVG/SIRAJ_{f}*.svg', f'05-Graphic-System/PNG/SIRAJ_{f}*.png'], use,
      sources=['tools/build-graphics.js'])
    for slug, f, name, use in (
        ('silk-blade', 'Silk-Blade', 'Silk Blade (R-leg crescent of the wordmark)', 'Accents, section openers, dividers; ≤ 1.5× the adjacent cap height.'),
        ('silk-line', 'Silk-Line', 'Silk Line (tapered S-curve thread)', 'Connects content across a spread; one per layout; never under body text.'),
        ('lumen', 'Lumen', 'Lumen ◆ and Lumen Halo', 'Bullets, active state, pin head, step markers, loader; always 45°, Stone (Maroon when active).'),
        ('silk-corner-window', 'Silk-Corner-Window', 'SIRAJ Window (Silk Corner)', 'Hero image container; curve on the top-end corner only; ≤ 2 per view.'),
        ('portal', 'Portal', 'SIRAJ Portal (asymmetric silk arch)', 'Vertical image openings for project reveals and entrances.'),
        ('architectural-cut', 'Architectural-Cut', 'Architectural Cut', 'Splits a plane or image at the Lumen angle.'),
        ('silk-fold', 'Silk-Fold', 'Silk Fold (planar corner fold)', 'Covers and section dividers.'))
] + [
    E('graphic.silk-vector', 'Graphic system', 'Silk Ribbon (vector, continuous + tonal) and Silk Wrap (vector)', 'SPECIAL PRODUCTION',
      ['05-Graphic-System/SVG/SIRAJ_Silk-Ribbon_Vector-*.svg', '05-Graphic-System/SVG/SIRAJ_Silk-Wrap_Vector-*.svg', '05-Graphic-System/PNG/SIRAJ_Silk-Ribbon_Vector-*.png', '05-Graphic-System/PNG/SIRAJ_Silk-Wrap_Vector-*.png'],
      'RESTRICTED USE: vinyl cutting, embroidery, special printing, fabrication, plotter/cutting work that technically needs vectors. Never in place of real pressed silk in marketing visuals.', decision='D2'),
    E('graphic.masks', 'Graphic system', 'Masks (Portal, Silk Corner LTR/RTL)', 'PRODUCTION EXPORT', ['05-Graphic-System/Masks/*.svg', '05-Graphic-System/*.css'], 'Clip paths for image frames (CSS + SVG).'),
    E('graphic.spec', 'Graphic system', 'Graphic system specification + specimen', 'SOURCE', ['05-Graphic-System/README.md', '05-Graphic-System/Previews/*', 'tools/build-graphics.js'], 'Origin, rule and file of every element.'),

    # ------------------------------------------------------------------------------------------------ SILK
] + [
    E(f'silk.{f.lower()}', 'Silk', f'Pressed maroon silk — {f}', 'MASTER',
      [f'06-SIRAJ-Silk/Stills/{f}/SIRAJ_Silk_{f}_{r}_v1.0.jpg' for r in ('16x9', '9x16', '1x1', '4x5')] + [f'06-SIRAJ-Silk/Stills/{f}/SIRAJ_Silk_{f}_*_web_v1.0.webp'],
      use, notes='Real silk photograph, 4K (3840 × 2160 / 2160 × 3840) JPG q92 = print/high-res master; 1:1 and 4:5 crops; web WebP exports. Silk QA: no wash, no yellow, maroon chroma (tools/qa-silk.py).')
    for f, use in (('Drape-Lumen', 'Hero backgrounds, covers, end cards'), ('Drape-Deep', 'Quotes, statements, title slides'),
                   ('Drape-Fall', 'Portrait formats, hoardings, stories'), ('Ribbon-Sweep', 'Signature gesture'),
                   ('Ribbon-Ivory', 'Light covers, print'), ('Ribbon-Pair', 'Campaign key visuals'),
                   ('Horizon-Ivory', 'Architecture above, information below (light)'), ('Horizon-Deep', 'Architecture above, information below (dark)'),
                   ('Fold-Corner-Ivory', 'Section dividers, covers'), ('Gateway', 'Project reveals, entrances'), ('Wrap', 'Composited around towers'))
] + [
    E('silk.alpha', 'Silk', 'Silk cut-outs with alpha (PNG, 4K)', 'PRODUCTION EXPORT', ['06-SIRAJ-Silk/Stills/Alpha/*.png'],
      'Compositing over architecture and layouts: Fold-Corner, Gateway, Horizon, Ribbon-Ivory, Ribbon-Sweep, Wrap (16:9 + 9:16) and the 3:1 long ribbon.'),
    E('silk.footage', 'Silk', 'Real silk footage — ribbon pass with alpha (VP9 WebM)', 'PRODUCTION EXPORT', ['06-SIRAJ-Silk/Footage/*.webm'],
      'Intro, outro and transitions (1920 × 1080 and 1080 × 1920, 24 fps, 8 s).', sources=['silk.footage.source']),
    E('silk.footage.source', 'Silk', 'Real silk footage — 4K green-screen masters', 'SOURCE', ['06-SIRAJ-Silk/Footage/Source/*.mp4'],
      'Re-keying masters (3840 × 2160 / 2160 × 3840, H.264): bash tools/silk-footage-key.sh.'),
    E('silk.engine', 'Silk', 'SIRAJ Silk Engine (WebGL previs)', 'SOURCE', ['06-SIRAJ-Silk/engine/*'],
      'Design/previs tool for blocking a silk gesture before photography. Its renders are never deliverables.'),
    E('silk.spec', 'Silk', 'Silk rules and import tools', 'SOURCE', ['06-SIRAJ-Silk/README.md', '06-SIRAJ-Silk/Footage/README.md', 'tools/silk-photo-import.py', 'tools/siraj-silk-deepen.py', 'tools/qa-silk.py'],
      'One gesture per layout, ≤ 35% coverage, never over the logo, pressed silk only.'),

    # ------------------------------------------------------------------------------------------------ SILK & LIGHT
    E('sl.kv', 'Silk & Light', 'Approved key visuals — Veil, Reveal, Ribbon, Lantern, Detail (4:5 + 9:16)', 'MASTER',
      ['14-Property-Marketing/12-Project-Siraj/Source/KeyVisuals/SIRAJ_Project-Siraj_KV_*_v1.0.jpg'],
      'The controlled Silk & Light art direction on the real project (Luxe Grade).', decision='D6'),
    E('sl.renders', 'Silk & Light', 'Approved clean renders — corner, front, side × blue hour, cloudy day', 'MASTER',
      ['14-Property-Marketing/12-Project-Siraj/Source/Clean/SIRAJ_Project-Siraj_*_Clean_v1.0.jpg'],
      'The real building in Muscat, 3712 × 4608, Luxe-graded; architecture is always primary.'),
    E('sl.architect', 'Silk & Light', "Architect's original renders and presentation", 'SOURCE',
      ['14-Property-Marketing/12-Project-Siraj/Source/Architect/Renders/*.jpg', '14-Property-Marketing/12-Project-Siraj/Source/Architect/*.pdf'],
      'Untouched source from the architect (ORIX-WEG, 2026-07). Ungraded; do not publish directly.'),
    E('sl.compositions', 'Silk & Light', 'Hero, façade and wrap composition sources', 'SOURCE',
      ['14-Property-Marketing/12-Project-Siraj/Source/SIRAJ_Project-Siraj_*', '14-Property-Marketing/12-Project-Siraj/Source/*.html'],
      'Compositions used to build the post/story formats.'),
    E('sl.post', 'Silk & Light', 'Key-visual posts (4:5)', 'PRODUCTION EXPORT', ['14-Property-Marketing/12-Project-Siraj/Key-Visuals/*_Post_AR_v1.0.png', '14-Property-Marketing/12-Project-Siraj/SIRAJ_Project-Siraj_*_Post_AR_v1.0.png'],
      'Approved post format 2160 × 2700.'),
    E('sl.story', 'Silk & Light', 'Key-visual stories (9:16)', 'PRODUCTION EXPORT', ['14-Property-Marketing/12-Project-Siraj/Key-Visuals/*_Story_AR_v1.0.png', '14-Property-Marketing/12-Project-Siraj/SIRAJ_Project-Siraj_*_Story_AR_v1.0.png'],
      'Approved story format 2160 × 3840.'),
    E('sl.grade', 'Silk & Light', 'Colour grade and light treatment', 'SOURCE',
      ['08-Photography/Grade/SIRAJ_Silk-Grade_v1.0.cube', 'tools/siraj-luxe-grade.py', 'tools/siraj-grade.py', 'tools/keyvisual-enhance.py'],
      'SIRAJ Silk Grade LUT (33-point, sRGB) + Luxe Grade: less yellow, deeper blacks, ivory-rose light.'),
    E('sl.grade-reference', 'Silk & Light', 'Grade reference: before / after the Luxe Grade', 'REFERENCE', ['99-Archive/Pre-Luxe-Grade-v1.0/KeyVisuals/*'],
      'The «before» half of the comparison; never publish.'),
    E('sl.camera-reference', 'Silk & Light', 'Camera, composition and art-direction references', 'REFERENCE',
      ['08-Photography/Library/SIRAJ_Photo_*_v1.0.jpg', '08-Photography/README.md'],
      'AI-generated concept visuals that demonstrate camera, light and composition. They do not depict SIRAJ projects; never publish.'),
    E('sl.spec', 'Silk & Light', 'Project imagery documentation', 'SOURCE',
      ['14-Property-Marketing/12-Project-Siraj/README.md', '14-Property-Marketing/12-Project-Siraj/Key-Visuals/README.md', '14-Property-Marketing/12-Project-Siraj/Source/Clean/README.md'],
      'What each key visual and render is, and how they were made.'),

    # ------------------------------------------------------------------------------------------------ ICONS
    E('icons.outline', 'Icons', 'Icon system — outline (85 icons, master style)', 'MASTER', ['07-Icon-System/svg/outline/siraj-icon-*.svg'],
      '24 px grid, 1.25 stroke, currentColor.', sources=['tools/build-icons.js']),
    E('icons.filled', 'Icons', 'Icon system — filled (85 icons)', 'PRODUCTION EXPORT', ['07-Icon-System/svg/filled/siraj-icon-*.svg'],
      'Filled style; line-only icons (arrows, chevrons, close …) are the same drawing in both styles.', sources=['tools/build-icons.js']),
    E('icons.sprite', 'Icons', 'Icon sprite + catalogue JSON', 'PRODUCTION EXPORT', ['07-Icon-System/sprite/siraj-icons.svg', '07-Icon-System/siraj-icons.json'],
      'Web sprite (#sj-<name>, #sj-<name>-filled) and the machine catalogue (category, AR/EN labels, keywords, RTL rule).'),
    E('icons.catalogue', 'Icons', 'Icon catalogue (README index) and specimens', 'PREVIEW', ['07-Icon-System/README.md', '07-Icon-System/previews/*.png'],
      'Human catalogue: 85 icons by category with Arabic labels; specimen sheets, size test, construction.'),
    E('icons.source', 'Icons', 'Icon source of truth', 'SOURCE', ['tools/build-icons.js'], 'Every path definition; all icon files regenerate byte-identical (v1.0.1).'),

    # ------------------------------------------------------------------------------------------------ DESIGN TOKENS
    E('tokens.ds', 'Design tokens', 'Design System v1.0 tokens (W3C)', 'MASTER', ['design-system/tokens/siraj-ds.tokens.json'],
      'Frozen Design System v1.0: colour, theme, type, space, radius, motion and component tokens.'),
    E('tokens.ds.build', 'Design tokens', 'Design System v1.0 builds', 'PRODUCTION EXPORT', ['design-system/build/*'], 'CSS, JS, TS and JSON for the web.'),
    E('tokens.brand', 'Design tokens', 'Brand tokens + platform exports', 'SOURCE', ['09-Design-System/tokens/siraj.tokens.json', '09-Design-System/tokens/build/*'],
      'Source of the colour build and the guide; exports CSS, SCSS, JS/TS, Tailwind, Swift, Kotlin.', decision='D3'),

    # ------------------------------------------------------------------------------------------------ MOTION (library only)
    E('motion.tokens', 'Motion', 'Motion tokens (six levels, wind)', 'SOURCE',
      ['motion-system/tokens/siraj-motion.tokens.json', 'motion-system/tokens/siraj-motion-levels.json', 'motion-system/tokens/siraj-wind.json', 'motion-system/tokens/src/*'],
      'FLOW · DRAPE · REVEAL · WRAP · FOLD · GLIDE · SETTLE; wind right → left.'),
    E('motion.tokens.build', 'Motion', 'Motion tokens — CSS / JS / TS', 'PRODUCTION EXPORT', ['motion-system/tokens/build/*'], 'Web implementation of the motion tokens.'),
    E('motion.runtime', 'Motion', 'Motion runtime library (compositions)', 'SOURCE', ['15-Motion-System/lib/*.js', '15-Motion-System/web/*'],
      'Deterministic composition runtime: tokens, silk engine bridge, footage seek, brand data.'),
    E('motion.plates', 'Motion', 'Architectural plates for motion', 'SOURCE', ['motion-system/assets/plates/*', 'motion-system/src/prep-plates.py'], 'Prepared project plates used by compositions.'),
    E('motion.transitions.source', 'Motion', 'Transitions — composition source', 'SOURCE', ['15-Motion-System/transitions/*.html'], 'Rendered by tools/build-motion.js.'),
    E('motion.transitions', 'Motion', 'Transitions — exports (16:9 + 9:16)', 'PRODUCTION EXPORT', ['15-Motion-System/Exports/Transitions/*.mp4', '15-Motion-System/Exports/Transitions/*_poster.png'], 'Final MP4 + posters.'),
    E('motion.components.source', 'Motion', 'Motion components — composition source', 'SOURCE', ['15-Motion-System/components/*.html'], 'Lower thirds, counters, charts, titles …'),
    E('motion.components', 'Motion', 'Motion components — exports', 'PRODUCTION EXPORT', ['15-Motion-System/Exports/Components/*.mp4', '15-Motion-System/Exports/Components/*_poster.png'], 'Final MP4 + posters.'),
    E('motion.intro.source', 'Motion', 'Intro — composition source', 'SOURCE', ['16-Intro/source/*.html'], 'Company intro, 6 s.'),
    E('motion.intro', 'Motion', 'Intro — final exports (16:9, 9:16, alpha, sound)', 'PRODUCTION EXPORT', ['16-Intro/Exports/*'], 'MP4 (with and without sound), ProRes 4444 + WebM alpha, posters.'),
    E('motion.outro.source', 'Motion', 'Outro — composition source', 'SOURCE', ['17-Outro/source/*.html'], 'Company outro, 5 s.'),
    E('motion.outro', 'Motion', 'Outro — final exports (16:9, 9:16, alpha, sound)', 'PRODUCTION EXPORT', ['17-Outro/Exports/*'], 'MP4 (with and without sound), ProRes 4444 + WebM alpha, posters.'),
    E('motion.audio', 'Motion', 'Sound beds and SFX', 'PRODUCTION EXPORT', ['15-Motion-System/Sound/*.wav'], 'Intro/outro sound beds; Lumen shimmer, silk glide, stone resonance.'),
    E('motion.build', 'Motion', 'Motion build scripts', 'SOURCE', ['tools/build-motion.js', 'tools/build-motion-system.js', 'tools/build-motion-data.js', 'tools/render-motion.js', 'tools/mux-sound.sh'], 'npm run build:motion.'),

    # ------------------------------------------------------------------------------------------------ GUIDELINES
    E('guide.pdf', 'Guidelines', 'SIRAJ Brand Guidelines v1.0.1 (82 pages)', 'PRODUCTION EXPORT', ['20-Brand-Guidelines/SIRAJ_Brand-Guidelines_v1.0.1.pdf'],
      'The official brand guide. v1.0.1 restores two images that did not render in v1.0 and marks internal pages.', version='1.0.1', sources=['guide.source']),
    E('guide.source', 'Guidelines', 'Guidelines source (reproducible)', 'SOURCE',
      ['tools/build-guidelines.js', '20-Brand-Guidelines/source/*', 'tools/compress-pdf.py', '20-Brand-Guidelines/README.md'],
      'npm run build:guidelines → HTML → PDF → compress → integrity check → previews.', version='1.0.1'),
    E('guide.pages', 'Guidelines', 'Guide page previews and contact sheet', 'PREVIEW', ['20-Brand-Guidelines/pages/*.jpg', '20-Brand-Guidelines/SIRAJ_Brand-Guidelines_Contact-Sheet_v1.0.1.jpg'],
      'Quick look; the PDF is the deliverable.', version='1.0.1'),
    E('guide.v1.0', 'Guidelines', 'Brand Guidelines v1.0 (superseded)', 'ARCHIVE', ['99-Archive/Superseded/Brand-Guidelines-v1.0/**/*'],
      'Historical; two images do not render (pages 6, 19). Also attached to the GitHub Release siraj-brand-system-v1.0.0.'),

    # ------------------------------------------------------------------------------------------------ FOUNDATION
    E('foundation.config', 'Foundation', 'Brand data (contact, language policy, project)', 'MASTER', ['00-Brand-Foundation/brand.config.json'],
      'Single source for contact data: phone 7771 4404, Instagram icon + SIRAJPROPERTIES, WWW.SIRAJPROPERTIES.NET.'),
    E('foundation.rules', 'Foundation', 'Rules for everyone producing SIRAJ work + brand skill', 'SOURCE', ['AGENTS.md', '.claude/skills/siraj-brand-system/SKILL.md'], 'Non-negotiables and voice.'),
    E('foundation.strategy', 'Foundation', 'Strategy and design language (internal)', 'SOURCE', ['00-Brand-Foundation/*.md'], 'Internal strategy; never quoted publicly.'),

    # ------------------------------------------------------------------------------------------------ COLLATERAL (governance)
    E('collateral.presentation-folder', 'Collateral', 'Presentation folder (A4 pocket) — current artwork', 'PREVIEW',
      ['12-Print/Source/Stationery/SIRAJ_Presentation-Folder.html', '12-Print/PDF/Stationery/SIRAJ_Presentation-Folder_*', '12-Print/PNG/Stationery/SIRAJ_Presentation-Folder_*', '12-Print/PRESENTATION-FOLDER_PREVIEW-NOT-FOR-PRODUCTION.md'],
      'NOT FOR PRODUCTION. Vector silk across the exterior is not an approved D2 use on printed collateral; revisit in the Applied Design & Collateral phase.',
      decision='D2', notes='Library governance decision 2026-10-15: classified PREVIEW; design intentionally unchanged; not approved production-ready collateral; not synced to Drive.'),

    # ------------------------------------------------------------------------------------------------ ARCHIVE / POSTPONED
    E('archive.project-lettering', 'Archive', '«مشروع سراج» project lettering', 'POSTPONED', ['99-Archive/Postponed/Project-Lettering/**/*'], 'Never use until a new treatment is approved.', decision='D4'),
    E('archive.demo', 'Archive', 'Fictional demo kit, earlier UI kit, print waiting for legal data', 'ARCHIVE', ['99-Archive/Demo-Isolated/**/*'], 'Not for production.', decision='D5'),
    E('archive.lockups-arabic', 'Archive', 'Withdrawn Arabic-name lockups (Horizontal, Stacked, Arabic-led)', 'ARCHIVE', ['99-Archive/Withdrawn/Arabic-Name-Lockups/**/*'],
      'Never use. The registered Arabic name is legal/administrative text only.', decision='D1'),
    E('archive.english', 'Archive', 'English-dormant outputs', 'ARCHIVE', ['99-Archive/English-Dormant/**/*'], 'Arabic-only policy.'),
    E('archive.silk', 'Archive', 'Retired silk (CG, creased, washed, soft footage)', 'ARCHIVE',
      ['99-Archive/Silk-CG-v1.0/**/*', '99-Archive/Silk-Creased-v1.0/**/*', '99-Archive/Silk-Washed-v1.0/**/*', '99-Archive/Silk-Footage-Soft-v1.0/**/*'], 'Never use.'),
]


def files_for(pattern):
    hits = sorted(p for p in glob.glob(os.path.join(ROOT, pattern), recursive=True) if os.path.isfile(p))
    return [os.path.relpath(p, ROOT) for p in hits]


def sha(p):
    h = hashlib.sha256()
    with open(os.path.join(ROOT, p), 'rb') as f:
        for b in iter(lambda: f.read(1 << 20), b''):
            h.update(b)
    return h.hexdigest()


def meta(p):
    m = {'bytes': os.path.getsize(os.path.join(ROOT, p)), 'sha256': sha(p)}
    if p.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
        with Image.open(os.path.join(ROOT, p)) as im:
            m['px'] = [im.width, im.height]
    return m


def main():
    missing, out_entries, index = [], [], {}
    seen_ids = set()
    for e in ENTRIES:
        assert e['id'] not in seen_ids, 'duplicate id ' + e['id']
        seen_ids.add(e['id'])
        files = []
        for pat in e['paths']:
            hit = files_for(pat)
            if not hit:
                missing.append(f"{e['id']}: {pat}")
            files += [f for f in hit if os.path.basename(f) not in ('_NOT-FOR-PRODUCTION.md',)]
        files = sorted(dict.fromkeys(files))
        fmts = sorted({os.path.splitext(f)[1].lstrip('.').lower() for f in files if '.' in os.path.basename(f)})
        rec = {k: e[k] for k in ('id', 'category', 'name', 'version', 'status', 'use')}
        rec.update({'formats': fmts, 'paths': e['paths'], 'file_count': len(files),
                    'files': [] if e['status'] in ('ARCHIVE', 'POSTPONED') else files})
        for k in ('kind', 'notes', 'decision', 'sources'):
            if e[k]:
                rec[k] = e[k]
        out_entries.append(rec)
        if e['status'] not in ('ARCHIVE', 'POSTPONED'):
            for f in files:
                index[f] = meta(f)
    if missing:
        print('MISSING declared paths:')
        for m in missing:
            print('  ', m)
        sys.exit(1)

    manifest = {
        '$schema': 'siraj-brand-master-manifest/1',
        'library': 'SIRAJ Brand Master Library', 'version': LIB_VERSION, 'brand_release': 'SIRAJ Brand System v1.0 (tag siraj-brand-system-v1.0.0)',
        'generated_by': 'tools/build-master-library.py', 'naming': 'SIRAJ_<Asset>_<Variant>_v<version>.<ext> (see docs/library/NAMING.md)',
        'statuses': ['MASTER', 'SOURCE', 'PRODUCTION EXPORT', 'SPECIAL PRODUCTION', 'PREVIEW', 'REFERENCE', 'ARCHIVE', 'POSTPONED'],
        'decisions': DECISIONS,
        'entries': out_entries,
        'files': dict(sorted(index.items())),
    }
    manifest_txt = json.dumps(manifest, ensure_ascii=False, indent=1) + '\n'

    # ---- Markdown index
    cats = []
    for e in out_entries:
        if e['category'] not in cats:
            cats.append(e['category'])
    md = [f'# SIRAJ Brand Master Library — Asset Index v{LIB_VERSION}', '',
          'The definitive list of official SIRAJ identity assets and the canonical path of each. Generated by',
          '`python3 -I tools/build-master-library.py` from the same declaration as `brand-master-manifest.json` (machine-readable,',
          'with size, pixel dimensions and SHA-256 of every production file). Do not edit by hand.', '',
          '**Statuses** · **MASTER** canonical original · **SOURCE** editable / generating source · **PRODUCTION EXPORT** ready to use ·',
          '**SPECIAL PRODUCTION** restricted use, only where a process technically needs it · **PREVIEW** look only · **REFERENCE** art direction, never published ·',
          '**ARCHIVE** not for production · **POSTPONED** cancelled until re-approved.', '',
          'Contact rules everywhere: phone **7771 4404** · Instagram icon + **SIRAJPROPERTIES** (never «@») · **WWW.SIRAJPROPERTIES.NET** where permitted.', '',
          'Google Drive copy: «سراج ← 01 ـ الهوية البصرية الرسمية», Arabic folders per family and status (المصدر · ملفات الإنتاج ·',
          'المعاينة · الأرشيف); layout and sync in `docs/library/DRIVE_STRUCTURE.md`.', '']
    counts = {}
    for e in out_entries:
        counts[e['status']] = counts.get(e['status'], 0) + 1
    md += ['| Family | Entries | Files |', '|---|---|---|']
    for c in cats:
        es = [e for e in out_entries if e['category'] == c]
        md.append(f"| [{c}](#{c.lower().replace(' & ', '--').replace(' ', '-')}) | {len(es)} | {sum(e['file_count'] for e in es)} |")
    md.append('')
    for c in cats:
        md += [f'## {c}', '', '| Status | Asset | Canonical path | Formats | Use |', '|---|---|---|---|---|']
        for e in [x for x in out_entries if x['category'] == c]:
            paths = '<br>'.join(f'`{p}`' for p in e['paths'])
            extra = f" **Decision {e['decision']}.**" if e.get('decision') else ''
            md.append(f"| **{e['status']}** | {e['name']} · {e['file_count']} files | {paths} | {', '.join(e['formats'])} | {e['use']}{extra} |")
        md.append('')
    md += ['## Owner decisions (resolved 2026-10-15)', ''] + [f'- **{k}** — {v}' for k, v in DECISIONS.items()] + ['']
    md_txt = '\n'.join(md)

    targets = {os.path.join(ROOT, 'brand-master-manifest.json'): manifest_txt, os.path.join(ROOT, 'BRAND_MASTER_ASSET_INDEX.md'): md_txt}
    if CHECK:
        stale = [os.path.basename(p) for p, t in targets.items() if not os.path.exists(p) or open(p, encoding='utf-8').read() != t]
        print(f"master library: {len(out_entries)} entries · {len(index)} production files · stale outputs: {stale or 'none'}")
        sys.exit(1 if stale else 0)
    for p, t in targets.items():
        open(p, 'w', encoding='utf-8').write(t)
    print(f'master library: {len(out_entries)} entries · {len(index)} indexed files · ' + ' · '.join(f'{k} {v}' for k, v in sorted(counts.items())))


if __name__ == '__main__':
    main()
