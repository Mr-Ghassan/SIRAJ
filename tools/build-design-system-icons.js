#!/usr/bin/env node
// SIRAJ Design System v1.0 — icon set extension.
// Adds the icons the Design System needs (shop, instagram, brochure) to the SIRAJ Icon System,
// drawn with the SAME geometry helpers, element types and spec as tools/build-icons.js
// (24 grid, 1.25 stroke, square caps, one silk curve, Lumen accent, outline + filled).
// It loads tools/build-icons.js unchanged, injects the extra definitions before its writers,
// and runs its writers + preview renderer, so svg/, sprite/, siraj-icons.json, README index
// and previews/ are regenerated with the full set.
//
// Usage: node tools/build-design-system-icons.js            (everything, incl. previews)
//        node tools/build-design-system-icons.js --no-png   (SVG / sprite / JSON only)
// Note: running tools/build-icons.js alone rebuilds the original 82 icons only; run this script after it.
const fs = require('fs');
const path = require('path');
const Module = require('module');

const BASE = path.join(__dirname, 'build-icons.js');
const src = fs.readFileSync(BASE, 'utf8');
const MARK = '// Writers';
const at = src.indexOf(MARK);
if (at < 0) throw new Error('build-icons.js layout changed: writers marker not found');
const cut = src.lastIndexOf('// ─', at - 4); // start of the banner line above "// Writers"

const EXTRA = `
// ── SIRAJ Design System v1.0 additions (injected by tools/build-design-system-icons.js) ──
cat('real-estate');
// Shop unit: a square storefront, display window and door; the silk curve is a fabric valance
// across the shopfront (dies inside both jambs); the Lumen is the light above the entrance.
const DS_AWNING = 'M3.5 8.5C7.5 10 16.5 10 20.5 8.5';
const DS_AWNING_IN = 'M5.75 9.25C9.25 10.25 14.75 10.25 18.25 9.25';
icon('shop', 'محل تجاري', ['shop', 'retail unit', 'storefront', 'store', 'commercial unit'], ['محل', 'محل تجاري', 'واجهة محل', 'متجر'],
  [A('M2.5 21H21.5M3.5 21V3.5H20.5V21M14 21V14H18V21M6 14H11V18H6Z'), S(DS_AWNING), L(12, 6, 2.5)],
  [A('M2.5 21H21.5'), B('M3.5 21V3.5H20.5V21H18V14H14V21Z', rect(6, 14, 5, 4), groove(DS_AWNING_IN), holeDia(12, 6, 2.5))]);

cat('contact');
// Instagram evocation (not the Instagram logo): square camera body, lens, Lumen as the viewfinder light.
icon('instagram', 'إنستغرام', ['instagram', 'social', 'profile', 'handle', 'follow'], ['إنستغرام', 'تواصل اجتماعي', 'حساب', 'متابعة'],
  [A('M3.5 3.5H20.5V20.5H3.5Z'), A(circ(12, 12, 4.5)), L(17, 7, 2.5)],
  [B(rect(3.5, 3.5, 17, 17), circ(12, 12, 4.5 + HALF + 0.75), holeDia(17, 7, 2.5)), F(circ(12, 12, 3))]);

cat('media');
// Brochure: a bound booklet; the silk curve rises on the cover along the 51° axis toward the Lumen.
const DS_BROCHURE_SILK = 'M10.75 18.5C13.5 17.25 15.25 14.5 16.5 10.25';
icon('brochure', 'كتيّب المشروع', ['brochure', 'booklet', 'catalogue', 'sales brochure', 'download brochure'], ['كتيّب', 'بروشور', 'كتالوج', 'تنزيل الكتيّب'],
  [A('M4.5 2.5H19.5V21.5H4.5ZM8 2.5V21.5'), S(DS_BROCHURE_SILK), L(16.5, 6.5, 2.5)],
  [B('M4.5 2.5H19.5V21.5H4.5Z', slot(8, 4.25, 8, 19.75), groove(DS_BROCHURE_SILK), holeDia(16.5, 6.5, 2.5))]);

`;

const code = src.slice(0, cut) + EXTRA + src.slice(cut).replace('if (require.main === module)', 'if (true)');
const m = new Module(BASE, module);
m.filename = BASE;
m.paths = Module._nodeModulePaths(path.dirname(BASE));
m._compile(code, BASE);
