// SIRAJ Icon System v1.0 — generator.
// Holds the hand-authored path definitions for every icon (outline + filled), then writes:
//   07-Icon-System/svg/{outline,filled}/siraj-icon-<name>.svg
//   07-Icon-System/sprite/siraj-icons.svg       (<symbol id="sj-<name>"> + <symbol id="sj-<name>-filled">)
//   07-Icon-System/siraj-icons.json              (name → markup, category, labels, keywords EN/AR)
//   07-Icon-System/previews/*.png                (specimen sheets, size strip, construction diagram)
// Usage:  node tools/build-icons.js            (everything)
//         node tools/build-icons.js --no-png   (SVG / sprite / JSON only)
//         node tools/build-icons.js --inspect  (large QA sheets into tools/.cache/icon-qa)
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, '07-Icon-System');
const VERSION = '1.0';
const SW = 1.25; // master stroke on the 24 grid
const HALF = SW / 2;

// ─────────────────────────────────────────────────────────────────────────────
// Geometry helpers (all absolute coordinates on the 24×24 grid)
// ─────────────────────────────────────────────────────────────────────────────
const n = (v) => { const r = Math.round(v * 1000) / 1000; return Object.is(r, -0) ? '0' : String(r); };
const dia = (cx, cy, s = 3) => `M${n(cx)} ${n(cy - s / 2)}L${n(cx + s / 2)} ${n(cy)}L${n(cx)} ${n(cy + s / 2)}L${n(cx - s / 2)} ${n(cy)}Z`;
// A diamond hole inside a fill+stroke ("body") shape: the body stroke shrinks every hole by ½ stroke,
// so the drawn hole is enlarged by 2·(½ stroke)/cos45 to show a true `s`-sized Lumen opening.
const holeDia = (cx, cy, s = 3) => dia(cx, cy, s + SW * Math.SQRT2);
const rect = (x, y, w, h) => `M${n(x)} ${n(y)}H${n(x + w)}V${n(y + h)}H${n(x)}Z`;
const circ = (cx, cy, r) => `M${n(cx - r)} ${n(cy)}A${n(r)} ${n(r)} 0 1 0 ${n(cx + r)} ${n(cy)}A${n(r)} ${n(r)} 0 1 0 ${n(cx - r)} ${n(cy)}Z`;
const ell = (cx, cy, rx, ry) => `M${n(cx)} ${n(cy - ry)}A${n(rx)} ${n(ry)} 0 0 1 ${n(cx)} ${n(cy + ry)}A${n(rx)} ${n(ry)} 0 0 1 ${n(cx)} ${n(cy - ry)}Z`;
const pt = (cx, cy, r, deg) => [cx + r * Math.cos((deg * Math.PI) / 180), cy + r * Math.sin((deg * Math.PI) / 180)];
// Straight slot knocked out of a body shape (visible gap g, square ends), compensating the body stroke.
const KNOCK = 1.5; // optical: a knocked-out (negative) line reads thinner than an inked one, so it runs +0.25
function slot(x1, y1, x2, y2, g = KNOCK) {
  const h = g / 2 + HALF; const L = Math.hypot(x2 - x1, y2 - y1); const tx = (x2 - x1) / L; const ty = (y2 - y1) / L;
  const nx = -ty * h; const ny = tx * h; const ax = x1 - tx * h; const ay = y1 - ty * h; const bx = x2 + tx * h; const by = y2 + ty * h;
  return `M${n(ax + nx)} ${n(ay + ny)}L${n(bx + nx)} ${n(by + ny)}L${n(bx - nx)} ${n(by - ny)}L${n(ax - nx)} ${n(ay - ny)}Z`;
}
function starPts(cx, cy, R, r, k = 5, rot = -90) {
  const out = [];
  for (let i = 0; i < k * 2; i++) out.push(pt(cx, cy, i % 2 ? r : R, rot + (i * 180) / k));
  return out;
}
// Offset a convex polygon by d (positive = outward).
function offsetPoly(pts, d) {
  let a = 0; for (let i = 0; i < pts.length; i++) { const p = pts[i]; const q = pts[(i + 1) % pts.length]; a += p[0] * q[1] - q[0] * p[1]; }
  const sgn = a > 0 ? 1 : -1; const lines = [];
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i]; const q = pts[(i + 1) % pts.length]; const dx = q[0] - p[0]; const dy = q[1] - p[1]; const l = Math.hypot(dx, dy);
    const nx = (sgn * dy) / l; const ny = (-sgn * dx) / l; lines.push([p[0] + nx * d, p[1] + ny * d, dx, dy]);
  }
  return lines.map((L1, i) => { const L0 = lines[(i - 1 + lines.length) % lines.length];
    const det = L0[2] * L1[3] - L0[3] * L1[2]; const t = ((L1[0] - L0[0]) * L1[3] - (L1[1] - L0[1]) * L1[2]) / det; return [L0[0] + L0[2] * t, L0[1] + L0[3] * t]; });
}
const poly = (pts, close = true) => pts.map((p, i) => `${i ? 'L' : 'M'}${n(p[0])} ${n(p[1])}`).join('') + (close ? 'Z' : '');

// Minimal path sampler (absolute M L H V C Q only) — used to knock a round-ended "silk" groove
// out of a solid body in the filled style (the groove keeps the exact centre-line of the outline curve).
function tokens(d) { return d.match(/[MLHVCQZmlhvcqz]|-?(?:\d+\.?\d*|\.\d+)(?:e-?\d+)?/g); }
function sample(d, step = 0.3) {
  const t = tokens(d); let i = 0; let cmd = null; let x = 0; let y = 0; const pts = [];
  const num = () => parseFloat(t[i++]);
  const push = (px, py) => { const l = pts[pts.length - 1]; if (!l || Math.hypot(px - l[0], py - l[1]) > 1e-6) pts.push([px, py]); };
  const line = (x2, y2) => { const L = Math.hypot(x2 - x, y2 - y); const N = Math.max(1, Math.ceil(L / step)); for (let k = 1; k <= N; k++) push(x + ((x2 - x) * k) / N, y + ((y2 - y) * k) / N); x = x2; y = y2; };
  while (i < t.length) {
    if (/[A-Za-z]/.test(t[i])) cmd = t[i++];
    if (cmd === 'M') { x = num(); y = num(); push(x, y); cmd = 'L'; }
    else if (cmd === 'L') line(num(), num());
    else if (cmd === 'H') line(num(), y);
    else if (cmd === 'V') line(x, num());
    else if (cmd === 'C' || cmd === 'Q') {
      const c = cmd === 'C' ? [num(), num(), num(), num(), num(), num()] : (() => { const qx = num(); const qy = num(); const ex = num(); const ey = num(); return [x + (2 / 3) * (qx - x), y + (2 / 3) * (qy - y), ex + (2 / 3) * (qx - ex), ey + (2 / 3) * (qy - ey), ex, ey]; })();
      const N = 60;
      for (let k = 1; k <= N; k++) {
        const s = k / N; const u = 1 - s;
        push(u * u * u * x + 3 * u * u * s * c[0] + 3 * u * s * s * c[2] + s * s * s * c[4], u * u * u * y + 3 * u * u * s * c[1] + 3 * u * s * s * c[3] + s * s * s * c[5]);
      }
      x = c[4]; y = c[5];
    } else if (cmd === 'Z') { i++; } else throw new Error('sample(): unsupported command ' + cmd);
  }
  // resample evenly
  const out = [pts[0]]; let acc = 0;
  for (let k = 1; k < pts.length; k++) { acc += Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1]); if (acc >= step || k === pts.length - 1) { out.push(pts[k]); acc = 0; } }
  return out;
}
// Round-ended groove around a centre-line, for evenodd knock-outs in body shapes (g = visible groove width).
function groove(d, g = KNOCK) {
  const hw = g / 2 + HALF; const p = sample(d); const L = []; const R = [];
  for (let k = 0; k < p.length; k++) {
    const a = p[Math.max(0, k - 1)]; const b = p[Math.min(p.length - 1, k + 1)];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]); const nx = -(b[1] - a[1]) / len; const ny = (b[0] - a[0]) / len;
    L.push([p[k][0] + nx * hw, p[k][1] + ny * hw]); R.push([p[k][0] - nx * hw, p[k][1] - ny * hw]);
  }
  const f = (q) => `${q[0].toFixed(2)} ${q[1].toFixed(2)}`.replace(/\.00/g, '');
  let s = `M${f(L[0])}`; for (let k = 1; k < L.length; k++) s += `L${f(L[k])}`;
  s += `A${n(hw)} ${n(hw)} 0 0 0 ${f(R[R.length - 1])}`; for (let k = R.length - 2; k >= 0; k--) s += `L${f(R[k])}`;
  s += `A${n(hw)} ${n(hw)} 0 0 0 ${f(L[0])}Z`;
  return s;
}
// ─────────────────────────────────────────────────────────────────────────────
// Element types
//   A  architectural stroke   (square caps, mitre joins — inherited from the root)
//   S  silk stroke             (round caps + round joins: the one flowing gesture)
//   L  Lumen                   (filled 45° diamond, no stroke)
//   B  body                    (fill + stroke, evenodd: solid silhouette with weight parity; holes knock out)
//   Bs body, silk              (same, round joins)
//   F  fill only               (evenodd, no stroke)
//   Ab architectural line with butt caps (dies inside another stroke)
// ─────────────────────────────────────────────────────────────────────────────
const A = (d) => ({ t: 'A', d });
const S = (d) => ({ t: 'S', d });
const Ab = (d) => ({ t: 'Ab', d }); // architectural line that dies inside another stroke (butt caps)
const L = (cx, cy, s = 3) => ({ t: 'L', d: dia(cx, cy, s) });
const B = (...d) => ({ t: 'B', d: d.join('') });
const Bv = (...d) => ({ t: 'B', d: d.join(''), join: 'bevel' }); // body whose acute corner must not spike past a frame
const Bs = (...d) => ({ t: 'Bs', d: d.join('') });
const F = (...d) => ({ t: 'F', d: d.join('') });

function el(e) {
  switch (e.t) {
    case 'A': return `<path d="${e.d}"/>`;
    case 'Ab': return `<path stroke-linecap="butt" d="${e.d}"/>`;
    case 'S': return `<path stroke-linecap="round" stroke-linejoin="round" d="${e.d}"/>`;
    case 'L': return `<path fill="currentColor" stroke="none" d="${e.d}"/>`;
    case 'B': return `<path fill="currentColor" fill-rule="evenodd"${e.join ? ` stroke-linejoin="${e.join}"` : ''} d="${e.d}"/>`;
    case 'Bs': return `<path fill="currentColor" fill-rule="evenodd" stroke-linejoin="round" d="${e.d}"/>`;
    case 'F': return `<path fill="currentColor" fill-rule="evenodd" stroke="none" d="${e.d}"/>`;
    default: throw new Error('unknown element ' + e.t);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Icon definitions
// ─────────────────────────────────────────────────────────────────────────────
const ICONS = [];
const CATS = {
  'real-estate': { en: 'Property', ar: 'العقار' },
  spaces: { en: 'Spaces & Amenities', ar: 'المساحات والمرافق' },
  location: { en: 'Location', ar: 'الموقع' },
  finance: { en: 'Investment & Finance', ar: 'الاستثمار والتمويل' },
  journey: { en: 'Purchase Journey', ar: 'رحلة الشراء' },
  trust: { en: 'Trust & Values', ar: 'الثقة والقيم' },
  contact: { en: 'People & Contact', ar: 'الأشخاص والتواصل' },
  media: { en: 'Media & Sharing', ar: 'الوسائط والمشاركة' },
  navigation: { en: 'Navigation', ar: 'التنقّل' },
  interface: { en: 'Interface', ar: 'الواجهة' },
};
let CAT = null;
function cat(c) { CAT = c; }
function icon(name, ar, kwEn, kwAr, o, f, extra = {}) {
  ICONS.push({ name, cat: CAT, ar, kw: { en: kwEn, ar: kwAr }, o, f: f || o, ...extra });
}

// ── Property ───────────────────────────────────────────────────────────────
cat('real-estate');
icon('property', 'عقار', ['property', 'house', 'home', 'residence', 'listing'], ['عقار', 'منزل', 'بيت', 'سكن'],
  [A('M3 21H21M5 21V10.5L12 4.5L19 10.5V21M10 21V15.5H14V21'), L(12, 11, 3)],
  [A('M3 21H21'), B('M5 21V10.5L12 4.5L19 10.5V21H14V15.5H10V21Z', holeDia(12, 11, 3))]);

icon('building', 'مبنى', ['building', 'tower', 'high-rise', 'development'], ['مبنى', 'برج', 'بناية', 'مشروع'],
  [A('M3 21H21M7 21V7.5H11.5M9.5 11H12.5M9.5 14.5H12.5M9.5 18H12.5'), S('M11.5 7.5C15 7.5 17 13 17 21'), L(9.25, 4, 3)],
  [A('M3 21H21'), B('M7 21V7.5H11.5C15 7.5 17 13 17 21Z', slot(9.5, 11, 12.5, 11), slot(9.5, 14.5, 12.5, 14.5), slot(9.5, 18, 12.5, 18)), L(9.25, 4, 3)]);

icon('apartment', 'شقة', ['apartment', 'flat', 'residential block', 'unit'], ['شقة', 'وحدة سكنية', 'عمارة'],
  [A('M3 21H21M5 21V3.5H19V21M10.5 21V17H13.5V21M8 7H10M14 7H16M8 11H10M8 15H10M14 15H16'), L(15, 11, 3)],
  [A('M3 21H21'), B('M5 21V3.5H19V21H13.5V17H10.5V21Z', slot(8, 7, 10, 7), slot(14, 7, 16, 7), slot(8, 11, 10, 11), slot(8, 15, 10, 15), slot(14, 15, 16, 15), holeDia(15, 11, 3))]);

icon('villa', 'فيلا', ['villa', 'house', 'detached', 'modern home'], ['فيلا', 'منزل مستقل', 'بيت'],
  [A('M2.5 21H21.5M4 21V8.5M2.5 8.5H15.5M14 8.5V21M14 13H21.5M20 13V21M7 21V12.5H11V21'), L(17, 17, 2.75)],
  [A('M2.5 21H21.5M2.5 8.5H15.5M14 13H21.5'), B('M4 21V8.5H14V21H11V12.5H7V21Z'), B('M14 13H20V21H14Z', holeDia(17, 17, 2.75))]);

icon('commercial', 'تجاري', ['commercial', 'retail', 'office', 'shop', 'storefront'], ['تجاري', 'محل', 'مكتب', 'تجزئة'],
  [A('M2.5 21H21.5M4.5 21V10M19.5 21V10M3 5H21V10H3ZM7.5 21V14H16.5V21M12 14V21'), L(12, 7.5, 2.25)],
  [A('M2.5 21H21.5M12 14V21'), B('M3 5H21V10H3Z', holeDia(12, 7.5, 2.25)), B('M4.5 10H19.5V21H16.5V14H7.5V21H4.5Z')]);

icon('land', 'أرض', ['land', 'plot', 'parcel', 'site'], ['أرض', 'قطعة أرض', 'موقع'],
  [A('M3.75 20L8.25 13H20.25L15.75 20ZM12 16.5V8'), L(12, 5.25, 3)],
  [B('M3.75 20L8.25 13H20.25L15.75 20Z'), A('M12 13V8'), L(12, 5.25, 3)]);

icon('community', 'مجتمع سكني', ['community', 'neighbourhood', 'masterplan', 'district'], ['مجتمع', 'حي', 'مجمع سكني'],
  [A('M2.5 21H21.5M4 21V12.5L8 9L12 12.5V21M14.5 21V5H20V21M17.25 8.25V9.25M17.25 12.25V13.25M17.25 16.25V17.25'), L(8, 16.5, 2.5)],
  [A('M2.5 21H21.5'), B('M4 21V12.5L8 9L12 12.5V21Z', holeDia(8, 16.5, 2.5)), B('M14.5 21V5H20V21Z', slot(17.25, 8.25, 17.25, 9.25), slot(17.25, 12.25, 17.25, 13.25), slot(17.25, 16.25, 17.25, 17.25))]);

icon('construction', 'إنشاء', ['construction', 'crane', 'under construction', 'progress'], ['إنشاء', 'قيد الإنشاء', 'رافعة', 'تشييد'],
  [A('M3 21.5H11M7 21.5V3.25M2.75 6.5H21M17 6.5V11.5M2.75 6.5V9H5V6.5'), Ab('M2.75 6.5L7 3.25L21 6.5'), L(17, 13.5, 3)],
  [A('M3 21.5H11M7 21.5V3.25M2.75 6.5H21M17 6.5V11.5'), Ab('M2.75 6.5L7 3.25L21 6.5'), B('M2.75 6.5V9H5V6.5Z'), L(17, 13.75, 3.5)]);

icon('handover', 'تسليم', ['handover', 'move in', 'delivery', 'open door', 'welcome home'], ['تسليم', 'استلام', 'الانتقال', 'باب'],
  [A('M2.5 21.5H21.5M5.5 21.5V2.5H18.5V21.5M9.25 11.5V13'), Ab('M5.5 2.5L11 4.5V19.5L5.5 21.5'), L(14.75, 12, 3)],
  [A('M2.5 21.5H21.5M5.5 21.5V2.5H18.5V21.5'), Bv('M5.5 2.5L11 4.5V19.5L5.5 21.5Z', slot(9.25, 11.5, 9.25, 13)), L(14.75, 12, 3)]);

// ── Spaces & Amenities ─────────────────────────────────────────────────────
cat('spaces');
icon('floor-plan', 'مخطط الطابق', ['floor plan', 'layout', 'blueprint', 'plan'], ['مخطط', 'مخطط الطابق', 'تصميم داخلي'],
  [A('M3 3H21V21H3ZM14 3V9M14 13.5V21M14 15.5H21M14 13.5H9.5'), S('M9.5 13.5A4.5 4.5 0 0 1 14 9')],
  [A('M3 3H21V21H3ZM14 3V9M14 13.5V21M14 15.5H21M14 13.5H9.5'), S('M9.5 13.5A4.5 4.5 0 0 1 14 9'), F(rect(14.625, 3.625, 5.75, 11.25))]);

icon('area', 'المساحة', ['area', 'size', 'square metres', 'm2', 'dimensions'], ['المساحة', 'متر مربع', 'الأبعاد'],
  [A('M3 8.5V3H8.5M15.5 3H21V8.5M21 15.5V21H15.5M8.5 21H3V15.5M8 16L16 8M11 8H16V13M8 11V16H13')]);

icon('bedroom', 'غرفة نوم', ['bedroom', 'bed', 'rooms', 'sleep'], ['غرفة نوم', 'سرير', 'غرف'],
  [A('M3 5V20M21 13V20M3 13H21M3 17H21'), S('M5.5 13C5.5 9.75 10.5 9.75 10.5 13')],
  [A('M3 5V20M21 13V20'), B('M3 13H21V17H3Z'), Bs('M5.75 11.25C5.75 8.25 10.25 8.25 10.25 11.25Z')]);

icon('bathroom', 'حمّام', ['bathroom', 'bath', 'bathtub', 'washroom'], ['حمّام', 'دورة مياه', 'حوض استحمام'],
  [A('M2.5 12H21.5M4 12V15A3.5 3.5 0 0 0 7.5 18.5H16.5A3.5 3.5 0 0 0 20 15V12M6.5 18.5L5.5 21M17.5 18.5L18.5 21'), S('M6.5 12V6C6.5 4.6 7.5 3.5 9 3.5C10.5 3.5 11.5 4.6 11.5 6'), L(11.5, 8.75, 2.5)],
  [A('M2.5 12H21.5M6.5 18.5L5.5 21M17.5 18.5L18.5 21'), B('M4 12H20V15A3.5 3.5 0 0 1 16.5 18.5H7.5A3.5 3.5 0 0 1 4 15Z'), S('M6.5 12V6C6.5 4.6 7.5 3.5 9 3.5C10.5 3.5 11.5 4.6 11.5 6'), L(11.5, 8.75, 2.5)]);

icon('parking', 'موقف سيارات', ['parking', 'car park', 'garage'], ['موقف', 'مواقف سيارات', 'كراج'],
  [A('M3 3H21V21H3ZM9 17.5V7'), S('M9 7H12.5A3.25 3.25 0 0 1 12.5 13.5H9')],
  [B('M3 3H21V21H3Z', 'M7.625 18.875V5.625H12.5A4.625 4.625 0 0 1 12.5 14.875H10.375V18.875Z', 'M10.375 8.375H12.5A1.875 1.875 0 0 1 12.5 12.125H10.375Z')]);

icon('amenities', 'المرافق', ['amenities', 'services', 'concierge', 'facilities'], ['المرافق', 'الخدمات', 'كونسيرج'],
  [A('M3 18.5H21M4.5 15.5H19.5'), S('M5.5 15.5C5.5 11.25 8.4 8.25 12 8.25C15.6 8.25 18.5 11.25 18.5 15.5'), L(12, 5.25, 3)],
  [A('M3 18.5H21M4.5 15.5H19.5'), Bs('M5.5 15.5C5.5 11.25 8.4 8.25 12 8.25C15.6 8.25 18.5 11.25 18.5 15.5Z'), L(12, 5.25, 3)]);

icon('pool', 'مسبح', ['pool', 'swimming', 'leisure'], ['مسبح', 'سباحة', 'حمّام سباحة'],
  [A('M8 15V5.75A2.25 2.25 0 0 0 5.75 3.5M15 15V5.75A2.25 2.25 0 0 0 12.75 3.5M8 8.5H15M8 12H15'), S('M2.5 18.5C4.5 17.25 6.5 17.25 8.5 18.5C10.5 19.75 12.5 19.75 14.5 18.5C16.5 17.25 18.5 17.25 21.5 18.75')],
  [A('M8 15V5.75A2.25 2.25 0 0 0 5.75 3.5M15 15V5.75A2.25 2.25 0 0 0 12.75 3.5'), B('M8 8H15V12.5H8Z'), S('M2.5 18.5C4.5 17.25 6.5 17.25 8.5 18.5C10.5 19.75 12.5 19.75 14.5 18.5C16.5 17.25 18.5 17.25 21.5 18.75')]);

icon('gym', 'نادٍ رياضي', ['gym', 'fitness', 'wellness', 'dumbbell'], ['نادي رياضي', 'لياقة', 'صالة رياضية'],
  [A('M7.5 12H16.5M4.5 7.5H7.5V16.5H4.5ZM16.5 7.5H19.5V16.5H16.5ZM2.5 10V14M21.5 10V14')],
  [A('M7.5 12H16.5M2.5 10V14M21.5 10V14'), B('M4.5 7.5H7.5V16.5H4.5Z'), B('M16.5 7.5H19.5V16.5H16.5Z')]);

icon('elevator', 'مصعد', ['elevator', 'lift'], ['مصعد'],
  [A('M4.5 2.5H19.5V21.5H4.5ZM12 5.75L15.25 9.75H8.75ZM12 18.25L15.25 14.25H8.75Z')],
  [A('M4.5 2.5H19.5V21.5H4.5Z'), B('M12 5.75L15.25 9.75H8.75Z'), B('M12 18.25L15.25 14.25H8.75Z')]);

const SEA1 = 'M3 16C5.25 14.75 7.25 14.75 9.5 16C11.75 17.25 13.75 17.25 16 16C17.75 15 19.5 14.85 21 15.5';
const SEA2 = 'M7 20C8.75 19 10.25 19 12 20C13.75 21 15.25 21 17 20';
icon('sea-view', 'إطلالة بحرية', ['sea view', 'waterfront', 'beach', 'ocean'], ['إطلالة بحرية', 'واجهة بحرية', 'شاطئ', 'بحر'],
  [A('M2.5 12H21.5M7 12A5 5 0 0 1 17 12'), S(SEA1 + SEA2)],
  [A('M2.5 12H21.5'), B('M7 12A5 5 0 0 1 17 12Z'), S(SEA1 + SEA2)]);

icon('view', 'إطلالة', ['view', 'preview', 'visibility', 'see', 'watch'], ['عرض', 'إطلالة', 'مشاهدة', 'معاينة'],
  [S('M2.5 12C5.5 7.25 8.5 5.5 12 5.5C15.5 5.5 18.5 7.25 21.5 12C18.5 16.75 15.5 18.5 12 18.5C8.5 18.5 5.5 16.75 2.5 12Z'), A(circ(12, 12, 3.25)), L(12, 12, 2)],
  [Bs('M2.5 12C5.5 7.25 8.5 5.5 12 5.5C15.5 5.5 18.5 7.25 21.5 12C18.5 16.75 15.5 18.5 12 18.5C8.5 18.5 5.5 16.75 2.5 12Z', circ(12, 12, 4.5), circ(12, 12, 2.25), holeDia(12, 12, 1.5))]);

icon('sun', 'شمس', ['sun', 'daylight', 'orientation', 'sunlight'], ['شمس', 'ضوء النهار', 'إضاءة طبيعية'],
  (() => { const r = []; for (let k = 0; k < 8; k++) { const deg = k * 45; const [a, b] = pt(12, 12, k % 2 ? 6.75 : 7, deg); const [c, d] = pt(12, 12, k % 2 ? 8.5 : 9.5, deg); r.push(`M${n(a)} ${n(b)}L${n(c)} ${n(d)}`); } return [A(circ(12, 12, 4) + r.join(''))]; })(),
  (() => { const r = []; for (let k = 0; k < 8; k++) { const deg = k * 45; const [a, b] = pt(12, 12, k % 2 ? 6.75 : 7, deg); const [c, d] = pt(12, 12, k % 2 ? 8.5 : 9.5, deg); r.push(`M${n(a)} ${n(b)}L${n(c)} ${n(d)}`); } return [A(r.join('')), B(circ(12, 12, 4))]; })());

// ── Location ───────────────────────────────────────────────────────────────
cat('location');
const PIN = 'M12 20.75C10 17.5 5.75 14.25 5.75 9.25A6.25 6.25 0 1 1 18.25 9.25C18.25 14.25 14 17.5 12 20.75Z';
icon('location', 'الموقع', ['location', 'pin', 'address', 'map marker'], ['الموقع', 'عنوان', 'دبوس الخريطة'],
  [A(PIN), L(12, 9.25, 3.25)],
  [B(PIN, holeDia(12, 9.25, 3.25))]);

icon('map', 'خريطة', ['map', 'masterplan', 'area map', 'neighbourhood'], ['خريطة', 'مخطط عام', 'الحي'],
  [A('M3 6L9 4L15 6L21 4V18L15 20L9 18L3 20Z'), Ab('M9 4V18M15 6V20'), L(12, 12, 3)],
  (() => {
    const top = (x) => (x <= 9 ? 6 - ((x - 3) / 6) * 2 : x <= 15 ? 4 + ((x - 9) / 6) * 2 : 6 - ((x - 15) / 6) * 2);
    const panel = (x1, x2) => `M${n(x1)} ${n(top(x1))}L${n(x2)} ${n(top(x2))}V${n(top(x2) + 14)}L${n(x1)} ${n(top(x1) + 14)}Z`;
    return [B(panel(3, 7.625)), B(panel(9.875, 14.125), holeDia(12, 12, 2)), B(panel(16.375, 21))];
  })());

icon('direction', 'الاتجاهات', ['directions', 'signpost', 'route', 'navigate', 'how to get there'], ['الاتجاهات', 'لافتة', 'الطريق'],
  [A('M12 4.5V21.5M9 21.5H15M12 4.5H18L20.25 6.75L18 9H12M12 11.5H6L3.75 13.75L6 16H12')],
  [A('M12 4.5V21.5M9 21.5H15'), B('M12 4.5H18L20.25 6.75L18 9H12Z'), B('M12 11.5H6L3.75 13.75L6 16H12Z')]);

const NEEDLE = [[16.5, 7.5], [13.75, 13.75], [7.5, 16.5], [10.25, 10.25]];
icon('compass', 'بوصلة', ['compass', 'orientation', 'explore', 'north'], ['بوصلة', 'اتجاه', 'استكشاف', 'الشمال'],
  [A(circ(12, 12, 9.5) + 'M16.5 7.5L13.75 13.75L7.5 16.5L10.25 10.25Z'), F('M16.5 7.5L13.75 13.75L10.25 10.25Z')],
  [F(circ(12, 12, 9.5 + HALF), poly(offsetPoly(NEEDLE, HALF))), F(poly(offsetPoly(NEEDLE.slice(0, 2).concat([NEEDLE[3]]), -0.4)))]);

icon('globe', 'عالمي', ['globe', 'international', 'language', 'website', 'world'], ['عالمي', 'دولي', 'اللغة', 'الموقع الإلكتروني'],
  [A(circ(12, 12, 9.5) + ell(12, 12, 4, 9.5) + 'M2.5 12H21.5')],
  (() => {
    // Six solid facets: outer disk (r 10.125) minus the meridian ring (rx 4±.625) and the equator (y 12±.625).
    const R = 9.5 + HALF; const g = HALF; const ao = 4 + HALF; const bo = 9.5 + HALF; const ai = 4 - HALF; const bi = 9.5 - HALF;
    const xc = (r) => Math.sqrt(r * r - g * g); const xe = (a, b) => a * Math.sqrt(1 - (g * g) / (b * b));
    const parts = [];
    for (const sy of [-1, 1]) {
      const y = 12 + sy * g; const sw = sy < 0 ? 1 : 0;
      // left + right crescents
      for (const sx of [-1, 1]) {
        const x1 = 12 + sx * xc(R); const x2 = 12 + sx * xe(ao, bo); const ty = 12 + sy * R;
        const s1 = (sx < 0) === (sy < 0) ? 1 : 0;
        parts.push(`M${n(x1)} ${n(y)}A${n(R)} ${n(R)} 0 0 ${s1} 12 ${n(ty)}A${n(ao)} ${n(bo)} 0 0 ${1 - s1} ${n(x2)} ${n(y)}Z`);
      }
      // central lens half
      const xl = 12 - xe(ai, bi); const xr = 12 + xe(ai, bi);
      parts.push(`M${n(xl)} ${n(y)}A${n(ai)} ${n(bi)} 0 0 ${sw} 12 ${n(12 + sy * bi)}A${n(ai)} ${n(bi)} 0 0 ${sw} ${n(xr)} ${n(y)}Z`);
    }
    return [F(parts.join(''))];
  })());

// ── Investment & Finance ───────────────────────────────────────────────────
cat('finance');
icon('investment', 'استثمار', ['investment', 'wealth', 'capital', 'assets', 'gold'], ['استثمار', 'ثروة', 'رأس المال', 'أصول'],
  [A('M2.75 20L4.25 15.5H9.75L11.25 20ZM12.75 20L14.25 15.5H19.75L21.25 20ZM7.5 15.5L9 11H15L16.5 15.5'), L(12, 7.25, 3)],
  [B('M2.75 20L4.25 16H9.75L11.25 20Z'), B('M12.75 20L14.25 16H19.75L21.25 20Z'), B('M7.75 13.75L9 10.25H15L16.25 13.75Z'), L(12, 6.5, 3)]);

const ROI = (() => {
  const c = 12; const r = 8; const a0 = -28; const a1 = 268; // gap at upper right, arrow lands at 12 o'clock
  const [x0, y0] = pt(c, c, r, a0); const [x1, y1] = pt(c, c, r, a1);
  const arc = `M${n(x0)} ${n(y0)}A${r} ${r} 0 1 1 ${n(x1)} ${n(y1)}`;
  // arrowhead at the end, along the tangent (clockwise travel)
  const t = ((a1 + 90) * Math.PI) / 180; const tx = Math.cos(t); const ty = Math.sin(t); const nx = -ty; const ny = tx; const h = 2.4;
  const tip = [x1 + tx * 0.6, y1 + ty * 0.6];
  const head = `M${n(tip[0] - tx * h + nx * h)} ${n(tip[1] - ty * h + ny * h)}L${n(tip[0])} ${n(tip[1])}L${n(tip[0] - tx * h - nx * h)} ${n(tip[1] - ty * h - ny * h)}`;
  return { arc, head };
})();
icon('roi', 'العائد على الاستثمار', ['roi', 'return', 'yield', 'rental income', 'returns'], ['العائد', 'العائد على الاستثمار', 'عائد إيجاري'],
  [S(ROI.arc), A(ROI.head), L(12, 12, 4)],
  [S(ROI.arc), A(ROI.head), L(12, 12, 5.5)]);

icon('growth', 'نمو', ['growth', 'appreciation', 'value', 'chart', 'trend'], ['نمو', 'ارتفاع القيمة', 'مؤشر', 'اتجاه'],
  [A('M3 3V21H21'), S('M6.5 17.5C11.5 17.5 12 9 17.25 6.75'), L(18.75, 6.25, 3.25)],
  [A('M3 3V21H21'), F('M6.5 17.5C11.5 17.5 12 9 17.25 6.75V18H6.5Z'), S('M6.5 17.5C11.5 17.5 12 9 17.25 6.75'), L(18.75, 6.25, 3.25)]);

icon('payment', 'دفع', ['payment', 'card', 'pay', 'instalment', 'transaction'], ['دفع', 'بطاقة', 'قسط', 'معاملة'],
  [A('M2.5 5.5H21.5V18.5H2.5ZM2.5 9.5H21.5M5.5 14.5H10'), L(17.5, 14.5, 3)],
  [B('M2.5 5.5H21.5V8.25H2.5Z'), B('M2.5 11H21.5V18.5H2.5Z', slot(5.5, 14.75, 10, 14.75), holeDia(17.5, 14.75, 3))]);

icon('sales', 'مبيعات', ['sales', 'for sale', 'sign', 'available', 'listing'], ['مبيعات', 'للبيع', 'لافتة', 'متاح'],
  [A('M5 21.5V3M3 21.5H7M5 5H19M9 5V8M17 5V8M7.5 8H18.5V15.5H7.5Z'), L(13, 11.75, 3)],
  [A('M5 21.5V3M3 21.5H7M5 5H19M9 5V8M17 5V8'), B('M7.5 8H18.5V15.5H7.5Z', holeDia(13, 11.75, 3))]);

icon('tag', 'السعر', ['tag', 'price', 'offer', 'label'], ['السعر', 'عرض', 'وسم'],
  [A('M3 3H12L21 12L12 21L3 12Z'), L(7.5, 7.5, 3)],
  [B('M3 3H12L21 12L12 21L3 12Z', holeDia(7.5, 7.5, 3))]);

icon('percent', 'نسبة مئوية', ['percent', 'discount', 'rate', 'down payment'], ['نسبة', 'خصم', 'دفعة أولى'],
  [A('M18.5 5.5L5.5 18.5'), A(dia(7, 7, 5)), A(dia(17, 17, 5))],
  [A('M18.5 5.5L5.5 18.5'), B(dia(7, 7, 5)), B(dia(17, 17, 5))]);

// ── Purchase Journey ───────────────────────────────────────────────────────
cat('journey');
icon('reservation', 'حجز', ['reservation', 'booking', 'reserve', 'save', 'hold'], ['حجز', 'حجز وحدة', 'حفظ'],
  [A('M6 3H18V20.5L12 16L6 20.5Z'), L(12, 9, 3)],
  [B('M6 3H18V20.5L12 16L6 20.5Z', holeDia(12, 9, 3))]);

const SIGN = 'M7.75 18.25C9.5 15.75 11 15.25 12.25 16.75C13.5 18.25 14.75 18.5 16.25 16.25';
icon('contract', 'عقد', ['contract', 'agreement', 'sign', 'spa', 'deed'], ['عقد', 'اتفاقية', 'توقيع', 'سند'],
  [A('M5 2.5H14.5L19 7V21.5H5ZM14.5 2.5V7H19M8 9.5H12.5M8 12.5H16'), S(SIGN)],
  [B('M5 2.5H14.5L19 7V21.5H5Z', slot(8, 9.5, 12.5, 9.5), slot(8, 12.5, 16, 12.5), groove(SIGN))]);

icon('documents', 'مستندات', ['documents', 'files', 'brochure', 'paperwork'], ['مستندات', 'ملفات', 'كتيّب', 'أوراق'],
  [A('M8 5.5V2.5H17L20.5 6V18H17M4 5.5H13L16.5 9V21.5H4ZM13 5.5V9H16.5M7 13H13.5M7 16.5H13.5')],
  [A('M8 5.5V2.5H17L20.5 6V18H17'), B('M4 5.5H13L16.5 9V21.5H4Z', slot(7, 13, 13.5, 13), slot(7, 16.5, 13.5, 16.5))]);

icon('calendar', 'تقويم', ['calendar', 'date', 'schedule', 'appointment', 'viewing'], ['تقويم', 'موعد', 'جدول', 'زيارة'],
  [A('M3 5H21V21H3ZM3 9.5H21M8 2.5V7M16 2.5V7'), L(12, 15.25, 3.5)],
  [A('M8 2.5V5M16 2.5V5'), B('M3 5H21V8.25H3Z'), B('M3 10.75H21V21H3Z', holeDia(12, 15.875, 3.5))]);

icon('clock', 'الوقت', ['clock', 'time', 'hours', 'duration', 'opening hours'], ['الوقت', 'ساعة', 'مواعيد العمل'],
  [A(circ(12, 12, 9.5) + 'M12 6V9.5M14 14L16.5 16.5'), L(12, 12, 2.5)],
  [B(circ(12, 12, 9.5), slot(12, 6, 12, 8.25), slot(14.75, 14.75, 16.5, 16.5), holeDia(12, 12, 2.5))]);

icon('key', 'مفتاح', ['key', 'keys', 'ownership', 'access', 'unlock'], ['مفتاح', 'مفاتيح', 'تملّك', 'دخول'],
  [A(circ(7.25, 12, 4.5) + 'M11.75 12H21M21 12V15.5M17.5 12V14.5'), L(7.25, 12, 3)],
  [B(circ(7.25, 12, 4.5), holeDia(7.25, 12, 3)), A('M11.75 12H21M21 12V15.5M17.5 12V14.5')]);

// ── Trust & Values ─────────────────────────────────────────────────────────
cat('trust');
const SHIELD = 'M12 2.5L19.5 5.25V11C19.5 15.75 16.25 19.5 12 21.5C7.75 19.5 4.5 15.75 4.5 11V5.25Z';
icon('security', 'أمان', ['security', 'safe', 'protection', 'gated', 'guarantee'], ['أمان', 'حماية', 'ضمان', 'مجمع مسوّر'],
  [A(SHIELD), L(12, 11.25, 3.5)],
  [B(SHIELD, holeDia(12, 11.25, 3.5))]);

icon('quality', 'جودة', ['quality', 'award', 'premium', 'certified', 'excellence'], ['جودة', 'جائزة', 'تميّز', 'معتمد'],
  [A(circ(12, 8.75, 6.25) + 'M9 14.25V20.75L12 19.25L15 20.75V14.25'), L(12, 8.75, 3.5)],
  [B(circ(12, 8.75, 6.25), holeDia(12, 8.75, 3.5)), B('M9 13.5V20.75L12 19.25L15 20.75V13.5Z')]);

icon('sustainability', 'استدامة', ['sustainability', 'green', 'eco', 'nature', 'landscape'], ['استدامة', 'صديق للبيئة', 'طبيعة', 'مساحات خضراء'],
  [A('M5.5 18.5C5.5 9.5 10.5 4.5 19.5 4.5C19.5 13.5 14.5 18.5 5.5 18.5Z'), S('M3 21C7.5 16.5 11 13 15 9')],
  [B('M5.5 18.5C5.5 9.5 10.5 4.5 19.5 4.5C19.5 13.5 14.5 18.5 5.5 18.5Z', groove('M9 15C11.5 12.5 13 11 15.25 8.75')), S('M3 21L5.75 18.25')]);

icon('lock', 'قفل', ['lock', 'secure', 'private', 'password'], ['قفل', 'آمن', 'خاص', 'كلمة المرور'],
  [A('M5 10.5H19V21H5ZM8 10.5V7A4 4 0 0 1 16 7V10.5'), L(12, 15.75, 3)],
  [A('M8 10.5V7A4 4 0 0 1 16 7V10.5'), B('M5 10.5H19V21H5Z', holeDia(12, 15.75, 3))]);

const STAR = poly(starPts(12, 12.85, 9, 4.1));
icon('star', 'مميّز', ['star', 'featured', 'rating', 'favourite', 'premium'], ['مميّز', 'تقييم', 'نجمة'],
  [A(STAR)], [B(STAR)]);

const HEART = 'M12 20.25C7 16.9 3 13.4 3 9C3 6.2 5.1 4 7.75 4C9.6 4 11.1 5 12 6.5C12.9 5 14.4 4 16.25 4C18.9 4 21 6.2 21 9C21 13.4 17 16.9 12 20.25Z';
icon('heart', 'مفضّلة', ['heart', 'favourite', 'save', 'wishlist', 'like'], ['مفضّلة', 'حفظ', 'إعجاب'],
  [S(HEART)], [Bs(HEART)]);

// ── People & Contact ───────────────────────────────────────────────────────
cat('contact');
icon('customer', 'عميل', ['customer', 'client', 'buyer', 'owner', 'vip'], ['عميل', 'مشتري', 'مالك', 'كبار العملاء'],
  [A(circ(10.5, 7.75, 3.75)), S('M3.5 21C3.5 16.6 6.6 14 10.5 14C14.4 14 17.5 16.6 17.5 21'), L(19, 6.5, 3)],
  [B(circ(10.5, 7.75, 3.75)), Bs('M3.5 21C3.5 16.6 6.6 14 10.5 14C14.4 14 17.5 16.6 17.5 21Z'), L(19, 6.5, 3)]);

icon('team', 'فريق', ['team', 'agents', 'advisors', 'people', 'staff'], ['فريق', 'مستشارون', 'وكلاء', 'موظفون'],
  [A(circ(12, 8.5, 3.25) + circ(5.5, 7, 2.25) + circ(18.5, 7, 2.25)), S('M6.25 21C6.25 17.3 8.75 15 12 15C15.25 15 17.75 17.3 17.75 21M2.5 16.5C2.5 13.9 3.9 12.25 5.75 12.25C6.5 12.25 7.15 12.45 7.7 12.8M21.5 16.5C21.5 13.9 20.1 12.25 18.25 12.25C17.5 12.25 16.85 12.45 16.3 12.8')],
  [B(circ(12, 8.5, 3.25)), Bs('M6.25 21C6.25 17.3 8.75 15 12 15C15.25 15 17.75 17.3 17.75 21Z'), A(circ(5.5, 7, 2.25) + circ(18.5, 7, 2.25)), S('M2.5 16.5C2.5 13.9 3.9 12.25 5.75 12.25C6.5 12.25 7.15 12.45 7.7 12.8M21.5 16.5C21.5 13.9 20.1 12.25 18.25 12.25C17.5 12.25 16.85 12.45 16.3 12.8')]);

icon('user', 'مستخدم', ['user', 'account', 'profile', 'sign in'], ['مستخدم', 'حساب', 'الملف الشخصي', 'تسجيل الدخول'],
  [A(circ(12, 7.5, 4)), S('M4.5 21C4.5 16.5 7.8 13.75 12 13.75C16.2 13.75 19.5 16.5 19.5 21')],
  [B(circ(12, 7.5, 4)), Bs('M4.5 21C4.5 16.5 7.8 13.75 12 13.75C16.2 13.75 19.5 16.5 19.5 21Z')]);

const PHONE = 'M8.25 3.25L10 8L7.75 9.75C9 12.5 11.5 15 14.25 16.25L16 14L20.75 15.75V19.25C20.75 20.2 20 21 19 21C10.5 20.5 3.5 13.5 3 5C3 4 3.8 3.25 4.75 3.25Z';
icon('call', 'اتصال', ['call', 'phone', 'telephone', 'contact'], ['اتصال', 'هاتف', 'تواصل'],
  [S(PHONE)], [Bs(PHONE)]);

const WA = (() => {
  const c = 12; const r = 8.75; const [x0, y0] = pt(c, c, r, 158); const [x1, y1] = pt(c, c, r, 122);
  return `M${n(x0)} ${n(y0)}A${r} ${r} 0 1 1 ${n(x1)} ${n(y1)}L3.25 20.75Z`;
})();
// Brand-safe evocation: a SIRAJ speech bubble carrying a handset drawn as ONE silk line (earpiece → curve → mouthpiece).
const WA_HANDSET = 'M11.25 7.5H8.75C8.75 12 11.75 15.25 16.5 15.25V12.75';
icon('whatsapp', 'واتساب', ['whatsapp', 'chat', 'message', 'instant messaging'], ['واتساب', 'محادثة', 'رسالة'],
  [S(WA), S(WA_HANDSET)],
  [Bs(WA, groove(WA_HANDSET, 1.5))]);

icon('email', 'بريد إلكتروني', ['email', 'mail', 'message', 'newsletter', 'enquiry'], ['بريد إلكتروني', 'رسالة', 'استفسار', 'نشرة'],
  [A('M2.5 5.5H21.5V18.5H2.5Z'), S('M3 6C7.5 10 9.5 12.25 12 12.25C14.5 12.25 16.5 10 21 6')],
  [B('M2.5 5.5H21.5V18.5H2.5Z', groove('M5.25 8.25C8.25 10.75 10 12 12 12C14 12 15.75 10.75 18.75 8.25'))]);

// ── Media & Sharing ────────────────────────────────────────────────────────
cat('media');
icon('image', 'صورة', ['image', 'photo', 'gallery', 'render'], ['صورة', 'معرض الصور', 'تصوير'],
  [A('M2.5 4.5H21.5V19.5H2.5Z'), S('M2.5 16.5C6.5 12.5 9.5 12 13 14.5C15.5 16.25 18 15.5 21.5 12.5'), L(16.5, 9, 3)],
  [A('M2.5 4.5H21.5V19.5H2.5Z'), B('M2.5 16.5C6.5 12.5 9.5 12 13 14.5C15.5 16.25 18 15.5 21.5 12.5V19.5H2.5Z'), L(16.5, 9, 3)]);

icon('video', 'فيديو', ['video', 'film', 'walkthrough', 'reel'], ['فيديو', 'فيلم', 'جولة مصوّرة'],
  [A('M2.5 6.5H15.5V17.5H2.5ZM15.5 10.5L21.5 7V17L15.5 13.5'), L(6.25, 10.25, 2.5)],
  [B('M2.5 6.5H15.5V17.5H2.5Z', holeDia(6.25, 10.25, 2.5)), B('M15.5 10.5L21.5 7V17L15.5 13.5Z')]);

// Panorama: an immersive curved frame (silk top + bottom edges) around the Lumen as the viewpoint.
const PANO_T = 'M2.5 5.75C9 8.5 15 8.5 21.5 5.75'; const PANO_B = 'M2.5 18.25C9 15.5 15 15.5 21.5 18.25';
icon('360-tour', 'جولة 360', ['360', 'virtual tour', 'panorama', '3d tour', 'immersive'], ['جولة 360', 'جولة افتراضية', 'بانوراما'],
  [A('M2.5 5.75V18.25M21.5 5.75V18.25'), S(PANO_T + PANO_B), A('M6.75 12H8.75M15.25 12H17.25'), L(12, 12, 3)],
  [B('M2.5 5.75C9 8.5 15 8.5 21.5 5.75V18.25C15 15.5 9 15.5 2.5 18.25Z', slot(6.25, 12, 8, 12), slot(16, 12, 17.75, 12), holeDia(12, 12, 3))]);

icon('play', 'تشغيل', ['play', 'start', 'video'], ['تشغيل', 'بدء'],
  [A('M7.5 5L19 12L7.5 19Z')], [B('M7.5 5L19 12L7.5 19Z')]);
icon('pause', 'إيقاف مؤقت', ['pause', 'hold'], ['إيقاف مؤقت'],
  [A('M7 5H10V19H7ZM14 5H17V19H14Z')], [B('M7 5H10V19H7Z'), B('M14 5H17V19H14Z')]);

const SHARE = (() => {
  const P = [[17.5, 5.5], [6.5, 12], [17.5, 18.5]]; const s = 5; const off = s / 2 + 0.35;
  const seg = (a, b) => { const dx = b[0] - a[0]; const dy = b[1] - a[1]; const l = Math.hypot(dx, dy); return `M${n(a[0] + (dx / l) * off)} ${n(a[1] + (dy / l) * off)}L${n(b[0] - (dx / l) * off)} ${n(b[1] - (dy / l) * off)}`; };
  return { lines: seg(P[1], P[0]) + seg(P[1], P[2]), d: P.map((p) => dia(p[0], p[1], s)).join('') };
})();
icon('share', 'مشاركة', ['share', 'send', 'network'], ['مشاركة', 'إرسال'],
  [A(SHARE.lines), A(SHARE.d)], [A(SHARE.lines), B(SHARE.d)], { rtl: 'mirror' });

icon('download', 'تنزيل', ['download', 'brochure', 'save', 'export'], ['تنزيل', 'تحميل', 'كتيّب'],
  [A('M12 3V14M7 10L12 15L17 10M3.5 15V20.5H20.5V15')]);
icon('upload', 'رفع', ['upload', 'attach', 'submit'], ['رفع', 'إرفاق', 'إرسال'],
  [A('M12 15V4.5M7 8.5L12 3.5L17 8.5M3.5 15V20.5H20.5V15')]);
icon('external', 'رابط خارجي', ['external', 'open', 'new window', 'link'], ['رابط خارجي', 'فتح', 'نافذة جديدة'],
  [A('M10.5 4.5H4.5V19.5H19.5V13.5M11 13L18.75 5.25M13.5 4.5H19.5V10.5')], null, { rtl: 'mirror' });

// ── Navigation ─────────────────────────────────────────────────────────────
cat('navigation');
icon('arrow-left', 'سهم لليسار', ['arrow left', 'back', 'previous'], ['سهم', 'رجوع', 'السابق'], [A('M21 12H4.5M9.5 6L3.5 12L9.5 18')], null, { rtl: 'mirror' });
icon('arrow-right', 'سهم لليمين', ['arrow right', 'next', 'forward', 'continue'], ['سهم', 'التالي', 'متابعة'], [A('M3 12H19.5M14.5 6L20.5 12L14.5 18')], null, { rtl: 'mirror' });
icon('arrow-up', 'سهم لأعلى', ['arrow up', 'top', 'increase'], ['سهم', 'أعلى', 'زيادة'], [A('M12 21V4.5M6 9.5L12 3.5L18 9.5')]);
icon('arrow-down', 'سهم لأسفل', ['arrow down', 'scroll', 'decrease'], ['سهم', 'أسفل', 'انخفاض'], [A('M12 3V19.5M6 14.5L12 20.5L18 14.5')]);
icon('arrow-up-right', 'سهم قطري', ['arrow up right', 'go', 'link', 'explore'], ['سهم', 'انتقال', 'رابط'], [A('M5.5 18.5L17.25 6.75M9 6H18V15')], null, { rtl: 'mirror' });
icon('chevron-left', 'رأس سهم لليسار', ['chevron left', 'back', 'previous'], ['السابق', 'رجوع'], [A('M15 5.5L8.5 12L15 18.5')], null, { rtl: 'mirror' });
icon('chevron-right', 'رأس سهم لليمين', ['chevron right', 'next', 'more'], ['التالي', 'المزيد'], [A('M9 5.5L15.5 12L9 18.5')], null, { rtl: 'mirror' });
icon('chevron-up', 'رأس سهم لأعلى', ['chevron up', 'collapse'], ['طي', 'أعلى'], [A('M5.5 15L12 8.5L18.5 15')]);
icon('chevron-down', 'رأس سهم لأسفل', ['chevron down', 'expand', 'dropdown'], ['توسيع', 'قائمة منسدلة'], [A('M5.5 9L12 15.5L18.5 9')]);

// ── Interface ──────────────────────────────────────────────────────────────
cat('interface');
icon('close', 'إغلاق', ['close', 'dismiss', 'cancel', 'x'], ['إغلاق', 'إلغاء'], [A('M5.5 5.5L18.5 18.5M18.5 5.5L5.5 18.5')]);
icon('menu', 'القائمة', ['menu', 'navigation', 'hamburger'], ['القائمة', 'التنقّل'], [A('M3 6.5H21M3 12H21M3 17.5H21')]);
icon('plus', 'إضافة', ['plus', 'add', 'new', 'expand'], ['إضافة', 'جديد'], [A('M12 4V20M4 12H20')]);
icon('minus', 'طرح', ['minus', 'remove', 'collapse'], ['إزالة', 'طي'], [A('M4 12H20')]);
icon('check', 'تأكيد', ['check', 'done', 'confirmed', 'included', 'sold'], ['تأكيد', 'تم', 'مشمول'], [A('M4 12.5L9.5 18L20 6.5')]);
icon('info', 'معلومات', ['info', 'information', 'details', 'help'], ['معلومات', 'تفاصيل', 'مساعدة'],
  [A(circ(12, 12, 9.5) + 'M12 11.25V17'), L(12, 7.5, 2.5)],
  [B(circ(12, 12, 9.5), slot(12, 11.25, 12, 16.75), holeDia(12, 7.5, 2.5))]);
icon('alert', 'تنبيه', ['alert', 'warning', 'attention', 'notice'], ['تنبيه', 'تحذير', 'انتباه'],
  [A('M12 3.75L20.75 19.75H3.25ZM12 9.25V13.5'), L(12, 16.75, 2.25)],
  [B('M12 3.75L20.75 19.75H3.25Z', slot(12, 9.5, 12, 13.25), holeDia(12, 17, 2))]);
icon('more', 'المزيد', ['more', 'options', 'overflow', 'ellipsis'], ['المزيد', 'خيارات'], [L(5.5, 12, 3.25), L(12, 12, 3.25), L(18.5, 12, 3.25)]);
icon('grid', 'شبكة', ['grid', 'gallery view', 'tiles', 'units'], ['شبكة', 'عرض شبكي', 'وحدات'],
  [A(rect(3.5, 3.5, 6.5, 6.5) + rect(14, 3.5, 6.5, 6.5) + rect(3.5, 14, 6.5, 6.5) + rect(14, 14, 6.5, 6.5))],
  [B(rect(3.5, 3.5, 6.5, 6.5)), B(rect(14, 3.5, 6.5, 6.5)), B(rect(3.5, 14, 6.5, 6.5)), B(rect(14, 14, 6.5, 6.5))]);
icon('list', 'قائمة', ['list', 'list view', 'details'], ['قائمة', 'عرض القائمة'],
  [L(4.5, 6.5, 2.75), L(4.5, 12, 2.75), L(4.5, 17.5, 2.75), A('M8.5 6.5H21M8.5 12H21M8.5 17.5H21')], null, { rtl: 'mirror' });
icon('search', 'بحث', ['search', 'find', 'explore', 'lookup'], ['بحث', 'إيجاد', 'استكشاف'],
  [A(circ(10.5, 10.5, 7) + 'M15.5 15.5L20.75 20.75')], [B(circ(10.5, 10.5, 7), circ(10.5, 10.5, 5.75)), A('M15.5 15.5L20.75 20.75')]);
icon('filter', 'تصفية', ['filter', 'refine', 'sliders', 'settings'], ['تصفية', 'فرز', 'إعدادات'],
  [A('M3 6.5H12.5M17.5 6.5H21M3 12H5.5M10.5 12H21M3 17.5H10.5M15.5 17.5H21' + dia(15, 6.5, 5) + dia(8, 12, 5) + dia(13, 17.5, 5))],
  [A('M3 6.5H21M3 12H21M3 17.5H21'), L(15, 6.5, 5.75), L(8, 12, 5.75), L(13, 17.5, 5.75)]);
icon('layers', 'طبقات', ['layers', 'floors', 'levels', 'stack'], ['طبقات', 'طوابق', 'مستويات'],
  [A('M12 3L21 8L12 13L3 8ZM3 12L12 17L21 12M3 16L12 21L21 16')],
  [B('M12 3L21 8L12 13L3 8Z'), A('M3 12L12 17L21 12M3 16L12 21L21 16')]);

// ─────────────────────────────────────────────────────────────────────────────
// Writers
// ─────────────────────────────────────────────────────────────────────────────
const ROOT_ATTRS = `fill="none" stroke="currentColor" stroke-width="${SW}" stroke-linecap="square" stroke-linejoin="miter"`;
const inner = (els) => els.map(el).join('');
function svgFile(ic, style) {
  const els = style === 'filled' ? ic.f : ic.o;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" ${ROOT_ATTRS}>` +
    `<title>${ic.name}</title>${inner(els)}</svg>\n`;
}
function writeAll() {
  for (const d of ['svg/outline', 'svg/filled', 'sprite']) fs.mkdirSync(path.join(OUT, d), { recursive: true });
  // clear old svgs so renamed icons don't linger
  for (const d of ['svg/outline', 'svg/filled']) for (const f of fs.readdirSync(path.join(OUT, d))) if (f.endsWith('.svg')) fs.rmSync(path.join(OUT, d, f));
  for (const ic of ICONS) {
    fs.writeFileSync(path.join(OUT, 'svg/outline', `siraj-icon-${ic.name}.svg`), svgFile(ic, 'outline'));
    fs.writeFileSync(path.join(OUT, 'svg/filled', `siraj-icon-${ic.name}.svg`), svgFile(ic, 'filled'));
  }
  // Sprite. stroke-width is set through a custom property so a page can switch to the compact
  // stroke (1.5 on the 24 grid) for 16–20 px use:  .sj-icon--compact { --siraj-icon-stroke: 1.5 }
  const sym = (id, els, title) => `  <symbol id="${id}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="square" stroke-linejoin="miter" style="stroke-width:var(--siraj-icon-stroke,${SW})"><title>${title}</title>${inner(els)}</symbol>\n`;
  let sprite = `<svg xmlns="http://www.w3.org/2000/svg" style="display:none">\n<!-- SIRAJ Icon System v${VERSION} — ${ICONS.length} icons × 2 styles. Usage: <svg class="sj-icon"><use href="siraj-icons.svg#sj-key"/></svg> -->\n`;
  for (const ic of ICONS) sprite += sym(`sj-${ic.name}`, ic.o, ic.name);
  for (const ic of ICONS) sprite += sym(`sj-${ic.name}-filled`, ic.f, ic.name + ' (filled)');
  sprite += '</svg>\n';
  fs.writeFileSync(path.join(OUT, 'sprite/siraj-icons.svg'), sprite);
  // JSON manifest
  const json = {
    name: 'SIRAJ Icon System', version: VERSION, grid: 24, padding: 2, stroke: SW, compactStroke: 1.5,
    attributes: { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': SW, 'stroke-linecap': 'square', 'stroke-linejoin': 'miter' },
    categories: CATS,
    icons: Object.fromEntries(ICONS.map((ic) => [ic.name, {
      category: ic.cat, label: { en: ic.name.replace(/-/g, ' '), ar: ic.ar },
      keywords: ic.kw, rtl: ic.rtl || 'none', sameInBothStyles: ic.f === ic.o,
      outline: inner(ic.o), filled: inner(ic.f),
      files: { outline: `svg/outline/siraj-icon-${ic.name}.svg`, filled: `svg/filled/siraj-icon-${ic.name}.svg` },
      sprite: { outline: `sj-${ic.name}`, filled: `sj-${ic.name}-filled` },
    }])),
  };
  fs.writeFileSync(path.join(OUT, 'siraj-icons.json'), JSON.stringify(json, null, 2) + '\n');
  // README icon index (between markers)
  const rd = path.join(OUT, 'README.md');
  if (fs.existsSync(rd)) {
    let t = `${ICONS.length} icons. ◆ marks icons that carry the Lumen, ∿ those with a silk curve. "Same" means one drawing serves both styles.\n`;
    for (const k of Object.keys(CATS)) {
      t += `\n### ${CATS[k].en} · ${CATS[k].ar}\n\n| Name | Arabic | Sprite id | Accent | Styles | RTL | Keywords |\n|---|---|---|---|---|---|---|\n`;
      for (const ic of ICONS.filter((i) => i.cat === k)) {
        const acc = [ic.o.some((e) => e.t === 'L') ? '◆' : '', ic.o.some((e) => e.t === 'S') ? '∿' : ''].join(' ').trim() || '—';
        t += `| \`${ic.name}\` | ${ic.ar} | \`sj-${ic.name}\` | ${acc} | ${ic.f === ic.o ? 'same' : 'outline + filled'} | ${ic.rtl === 'mirror' ? 'mirror' : '—'} | ${ic.kw.en.join(', ')} · ${ic.kw.ar.join('، ')} |\n`;
      }
    }
    const src = fs.readFileSync(rd, 'utf8');
    fs.writeFileSync(rd, src.replace(/<!-- INDEX:START -->[\s\S]*<!-- INDEX:END -->/, `<!-- INDEX:START -->\n${t}<!-- INDEX:END -->`));
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Previews
// ─────────────────────────────────────────────────────────────────────────────
const CSS = 'file:///home/user/SIRAJ/09-Design-System/css/siraj.css';
const C = { ivory: '#F7F2ED', linen: '#EFE7E0', graphite: '#3B3436', ash: '#6B625E', deep: '#2C0F12', sand: '#D6C0B2', stone: '#AA9180', maroon: '#602733', shadow: '#170608', near: '#140E10' };
const inline = (ic, style, size, extra = '') => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" ${ROOT_ATTRS} ${extra}>${inner(style === 'filled' ? ic.f : ic.o)}</svg>`;
const head = (bg, fg, extraCss = '') => `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="${CSS}"><style>
  html,body{margin:0;background:${bg};color:${fg};font-family:"Jost",sans-serif;-webkit-font-smoothing:antialiased}
  .lbl{font:500 10px/1.2 "Jost",sans-serif;letter-spacing:.14em;text-transform:uppercase}
  .ar{font-family:"Tajawal",sans-serif;letter-spacing:0;text-transform:none}
  ${extraCss}</style></head><body>`;

function specimenHtml({ bg, fg, sub, rule, style, title }) {
  const groups = Object.keys(CATS).map((k) => {
    const items = ICONS.filter((i) => i.cat === k).map((ic) => `<div class="cell"><div class="ic">${inline(ic, style, 32)}</div><div class="lbl nm">${ic.name}</div><div class="arl">${ic.ar}</div></div>`).join('');
    return `<section><div class="ghead"><span class="lumen"></span><span class="lbl">${CATS[k].en}</span><span class="ar garl">${CATS[k].ar}</span></div><div class="cells">${items}</div></section>`;
  }).join('');
  return head(bg, fg, `
    .wrap{padding:72px 80px 64px;width:1760px;box-sizing:border-box}
    header{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:1px solid ${rule};padding-bottom:28px;margin-bottom:12px}
    h1{font:300 46px/1 "Jost";letter-spacing:-.01em;margin:0}
    .meta{color:${sub};text-align:right}
    section{border-bottom:1px solid ${rule};padding:22px 0 18px}
    .ghead{display:flex;align-items:center;gap:12px;margin-bottom:14px;color:${sub}}
    .garl{font-size:13px;margin-left:auto}
    .lumen{width:7px;height:7px;background:${C.stone};transform:rotate(45deg);display:inline-block}
    .cells{display:grid;grid-template-columns:repeat(13,1fr);row-gap:20px}
    .cell{display:flex;flex-direction:column;align-items:center;gap:10px}
    .ic{width:56px;height:56px;display:flex;align-items:center;justify-content:center}
    .nm{font-size:10px;letter-spacing:.14em;color:${fg};opacity:.9;text-align:center;white-space:nowrap}
    .arl{font:400 12px/1 "Tajawal";color:${sub};direction:rtl}
    footer{display:flex;justify-content:space-between;margin-top:22px;color:${sub}}`) +
    `<div class="wrap"><header><div><div class="lbl" style="color:${sub};margin-bottom:14px">SIRAJ Icon System · v${VERSION}</div><h1>${title}</h1></div>
     <div class="meta lbl">${ICONS.length} icons · 24 px grid · 1.25 stroke<br><br>${style === 'filled' ? 'Filled style' : 'Outline style'} · shown at 32 px</div></header>${groups}
     <footer class="lbl"><span>Architecture first · Silk as gesture · Lumen as light${style === 'filled' ? ' &nbsp;·&nbsp; Pure line glyphs (arrows, chevrons, close, menu…) share one drawing in both styles' : ''}</span><span>07-Icon-System</span></footer></div></body></html>`;
}

function sizeStripHtml() {
  const pick = ['property', 'building', 'location', 'key', 'floor-plan', 'bedroom', 'growth', 'contract', 'calendar', 'whatsapp', 'search', 'arrow-right'];
  const SIZES = [16, 20, 24, 32, 48];
  const row = (style, compact) => pick.map((nm) => {
    const ic = ICONS.find((i) => i.name === nm); const sizes = compact ? [16, 20] : SIZES;
    return `<div class="col">${sizes.map((s) => `<div class="sz" style="height:56px">${inline(ic, style, s, compact && s <= 20 ? 'stroke-width="1.5"' : '')}</div>`).join('')}<div class="lbl nm">${nm}</div></div>`;
  }).join('');
  const block = (title, style, compact, bg, fg) => `<div class="blk" style="background:${bg};color:${fg}"><div class="lbl bt">${title}</div><div class="rows"><div class="col keys">${(compact ? [16, 20] : SIZES).map((s) => `<div class="sz lbl k" style="height:56px">${s} px${compact && s <= 20 ? ' · 1.5' : ''}</div>`).join('')}<div class="lbl nm">&nbsp;</div></div>${row(style, compact)}</div></div>`;
  return head(C.ivory, C.graphite, `
    .wrap{padding:56px 64px;width:1600px;box-sizing:border-box}
    h1{font:300 34px/1 "Jost";margin:0 0 10px}
    p{margin:0 0 28px;color:${C.ash};font-size:14px}
    .blk{padding:24px 28px 18px;margin-bottom:18px}
    .bt{margin-bottom:12px;opacity:.75}
    .rows{display:flex;gap:6px}
    .col{flex:1;display:flex;flex-direction:column;align-items:center}
    .keys{flex:0 0 90px;align-items:flex-start}
    .sz{display:flex;align-items:center;justify-content:center}
    .k{opacity:.6}
    .nm{font-size:9px;margin-top:6px;opacity:.8}`) +
    `<div class="wrap"><div class="lbl" style="color:${C.ash};margin-bottom:12px">SIRAJ Icon System · Size test</div><h1>16 · 20 · 24 · 32 · 48 px</h1>
     <p>Outline at the master 1.25 stroke, then the compact 1.5 stroke recommended at 20 px and below, then the filled style (20 px minimum for knocked-out detail).</p>
     ${block('Outline · master stroke 1.25', 'outline', false, C.ivory, C.graphite)}
     ${block('Outline · compact stroke 1.5 (16 / 20 px)', 'outline', true, C.linen, C.graphite)}
     ${block('Filled', 'filled', false, C.deep, C.sand)}</div></body></html>`;
}

function sidePanel() {
  const g = (body, vb = '0 0 12 8') => `<svg width="120" height="80" viewBox="${vb}" style="background:#FBF8F5;flex:none">${body}</svg>`;
  const cl = (d) => `<path d="${d}" fill="none" stroke="${C.ivory}" stroke-width=".05"/>`;
  return `<div class="side">
    <div class="it">${g(`<path d="M2 6V2H10" fill="none" stroke="${C.graphite}" stroke-width="1.25" stroke-linecap="square" stroke-linejoin="miter"/>${cl('M2 6V2H10')}`)}<div class="tx"><b>Architecture</b>Square caps · mitred joins · square corners. Straight members, walls, frames, arrows.</div></div>
    <div class="it">${g(`<path d="M1.5 6C4 1.5 8 6.5 10.5 2" fill="none" stroke="${C.graphite}" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>${cl('M1.5 6C4 1.5 8 6.5 10.5 2')}`)}<div class="tx"><b>Silk</b>Round caps · round joins. One continuous S- or C-curve per icon — the expressive gesture.</div></div>
    <div class="it">${g(`<path d="${dia(6, 4, 3)}" fill="${C.stone}"/><path d="M4.5 7.3H7.5" stroke="${C.maroon}" stroke-width=".06"/><path d="M4.5 7V7.6M7.5 7V7.6" stroke="${C.maroon}" stroke-width=".06"/>`)}<div class="tx"><b>Lumen ◆ 3</b>Filled 45° diamond, 2.5–3.5 across. The light point: pin head, key bow, beacon, growth tip.</div></div>
    <div class="it" style="border:0">${g(`<rect x="1" y="1" width="10" height="6" fill="${C.graphite}"/><path d="M3 4H6.5" stroke="#FBF8F5" stroke-width="1.5"/><path d="${dia(8.75, 4, 2.2)}" fill="#FBF8F5"/>`)}<div class="tx"><b>Filled knock-outs</b>Same silhouette, evenodd holes. Negative lines run 1.5 so they read as 1.25.</div></div>
  </div>`;
}

function constructionHtml() {
  const S = 16; const W = 24 * S; // 384
  const grid = () => {
    let g = '';
    for (let i = 0; i <= 24; i++) g += `<line x1="${i}" y1="0" x2="${i}" y2="24" stroke="${i % 4 === 0 ? '#D8C6B8' : '#E8DCD2'}" stroke-width="${i % 4 === 0 ? 0.06 : 0.035}"/><line x1="0" y1="${i}" x2="24" y2="${i}" stroke="${i % 4 === 0 ? '#D8C6B8' : '#E8DCD2'}" stroke-width="${i % 4 === 0 ? 0.06 : 0.035}"/>`;
    return g;
  };
  const pad = `<path d="M0 0H24V24H0ZM2 2V22H22V2Z" fill="${C.maroon}" fill-opacity=".07" fill-rule="evenodd"/><rect x="2" y="2" width="20" height="20" fill="none" stroke="${C.maroon}" stroke-width=".05" stroke-dasharray=".25 .2"/>`;
  const keyl = `<g fill="none" stroke="${C.stone}" stroke-width=".07"><circle cx="12" cy="12" r="10"/><rect x="3" y="3" width="18" height="18"/><rect x="4" y="2" width="16" height="20"/><rect x="2" y="4" width="20" height="16"/><line x1="0" y1="0" x2="24" y2="24"/><line x1="24" y1="0" x2="0" y2="24"/><line x1="12" y1="0" x2="12" y2="24"/><line x1="0" y1="12" x2="24" y2="12"/></g>`;
  const panel = (nm, note) => {
    const ic = ICONS.find((i) => i.name === nm);
    // the icon itself, then its centre-lines + anchor points in maroon for construction reading
    const centre = ic.o.filter((e) => e.t !== 'L').map((e) => `<path d="${e.d}" fill="none" stroke="${C.ivory}" stroke-width=".05" stroke-linecap="butt" opacity=".9"/>`).join('');
    return `<div class="pnl"><svg width="${W}" height="${W}" viewBox="0 0 24 24">${grid()}${pad}${keyl}<g color="${C.graphite}" opacity=".9">${inner(ic.o).replace(/^/, `<g ${ROOT_ATTRS}>`)}</g></g>${centre}</svg>
      <div class="cap"><span class="lbl">${nm}</span><span class="note">${note}</span></div></div>`;
  };
  return head(C.ivory, C.graphite, `
    .wrap{padding:56px 64px;width:1760px;box-sizing:border-box}
    header{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:30px}
    .side{flex:1;display:flex;flex-direction:column;gap:18px;padding-left:8px}
    .side .it{display:flex;align-items:center;gap:18px;border-bottom:1px solid #E2D6CC;padding-bottom:16px}
    .side .tx{font-size:13px;line-height:1.45;color:${C.ash}}
    .side .tx b{display:block;font:500 10px/1.2 "Jost";letter-spacing:.14em;text-transform:uppercase;color:${C.graphite};margin-bottom:6px}
    h1{font:300 40px/1 "Jost";margin:0}
    .panels{display:flex;gap:40px}
    .pnl{display:flex;flex-direction:column;gap:14px}
    .pnl svg{background:#FBF8F5;display:block}
    .cap{display:flex;justify-content:space-between;align-items:baseline}
    .note{font-size:13px;color:${C.ash}}
    .spec{display:grid;grid-template-columns:repeat(4,1fr);gap:28px;margin-top:40px;border-top:1px solid #D8C6B8;padding-top:26px}
    .spec div{font-size:14px;line-height:1.5;color:${C.ash}}
    .spec b{display:block;font:500 10px/1.2 "Jost";letter-spacing:.14em;text-transform:uppercase;color:${C.graphite};margin-bottom:10px}
    .legend{display:flex;gap:26px;margin-top:22px;color:${C.ash};font-size:13px;align-items:center}
    .sw{display:inline-block;width:22px;height:10px;margin-right:8px;vertical-align:middle}`) +
    `<div class="wrap"><header><div><div class="lbl" style="color:${C.ash};margin-bottom:12px">SIRAJ Icon System · Construction</div><h1>24 px grid · 2 px padding · 1.25 stroke</h1></div>
     <div class="lbl" style="color:${C.ash}">Shown at 16× · 1 grid unit = 16 px</div></header>
     <div class="panels">${panel('property', 'Gable on the square keyline, Lumen on the axis')}${panel('location', 'Pin head on the circle keyline')}${panel('contract', 'Portrait keyline, silk signature')}${sidePanel()}</div>
     <div class="legend"><span><span class="sw" style="background:${C.maroon};opacity:.15"></span>2 px padding</span><span><span class="sw" style="border:1px solid ${C.stone}"></span>Keylines: circle Ø20 · square 18 · portrait 16×20 · landscape 20×16</span><span><span class="sw" style="background:${C.graphite};position:relative"><i style="position:absolute;left:0;right:0;top:4.5px;border-top:1px solid ${C.ivory}"></i></span>Stroke centre-line</span></div>
     <div class="spec">
      <div><b>Stroke</b>1.25 on the 24 grid (compact 1.5 at 16–20 px). Keylines and live area describe the centre-line; the half stroke may sit in the padding. Coordinates on the .25 grid.</div>
      <div><b>Caps & joins</b>Architecture: square caps, mitred joins, square corners. Silk: round caps and joins, used on the one flowing curve of an icon.</div>
      <div><b>Lumen</b>A filled 45° diamond, 2.5–3.5 across (3 by default). The light source of the icon: pin head, key bow, beacon, growth tip. Never more than one accent role per icon.</div>
      <div><b>Optical</b>Circles run ~0.5 larger than squares (r 9.5 vs 18 square); acute mitres pulled inside the live area; filled holes enlarged to compensate the body stroke.</div>
     </div></div></body></html>`;
}

function qaHtml(list, style) {
  const S = 120;
  const cells = list.map((ic) => `<div class="c"><svg width="${S}" height="${S}" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" fill="none" stroke="#e6c9c9" stroke-width=".05"/><g color="${C.graphite}">${inline(ic, style, 24).replace('width="24" height="24"', 'width="24" height="24"')}</g></svg><div class="row">${[16, 24, 32].map((s) => inline(ic, style, s)).join('')}</div><div class="lbl">${ic.name}</div></div>`).join('');
  return head('#fff', C.graphite, `.g{display:grid;grid-template-columns:repeat(8,1fr);gap:14px;padding:20px;width:1500px}.c{display:flex;flex-direction:column;align-items:center;gap:6px;border:1px solid #eee;padding:8px}.row{display:flex;gap:10px;align-items:center}`) + `<div class="g">${cells}</div></body></html>`;
}

async function renderPreviews(inspect) {
  const R = require('./lib/render');
  const P = path.join(OUT, 'previews');
  try {
    if (inspect) {
      const dir = path.join(ROOT, 'tools/.cache/icon-qa');
      for (const style of ['outline', 'filled']) {
        for (let k = 0; k < ICONS.length; k += 32) {
          const list = ICONS.slice(k, k + 32);
          const rows = Math.ceil(list.length / 8);
          await R.png({ html: qaHtml(list, style), out: path.join(dir, `qa-${style}-${k / 32 + 1}.png`), width: 1540, height: rows * 230 + 40 });
        }
      }
      return;
    }
    const rowsH = Object.keys(CATS).reduce((a, k) => a + 60 + Math.ceil(ICONS.filter((i) => i.cat === k).length / 13) * 118, 0);
    const H = 72 + 120 + rowsH + 70;
    await R.png({ html: specimenHtml({ bg: C.ivory, fg: C.graphite, sub: C.ash, rule: '#E2D6CC', style: 'outline', title: 'Icon Specimen — Outline' }), out: path.join(P, 'SIRAJ_Icons_Specimen_Outline_Ivory_v1.0.png'), width: 1760, height: H, scale: 2 });
    await R.png({ html: specimenHtml({ bg: C.deep, fg: C.sand, sub: '#A88F84', rule: '#4A2328', style: 'outline', title: 'Icon Specimen — On Deep' }), out: path.join(P, 'SIRAJ_Icons_Specimen_Outline_Deep_v1.0.png'), width: 1760, height: H, scale: 2 });
    await R.png({ html: specimenHtml({ bg: C.ivory, fg: C.graphite, sub: C.ash, rule: '#E2D6CC', style: 'filled', title: 'Icon Specimen — Filled' }), out: path.join(P, 'SIRAJ_Icons_Specimen_Filled_v1.0.png'), width: 1760, height: H, scale: 2 });
    await R.png({ html: sizeStripHtml(), out: path.join(P, 'SIRAJ_Icons_Size-Test_v1.0.png'), width: 1600, height: 1170, scale: 1 });
    await R.png({ html: constructionHtml(), out: path.join(P, 'SIRAJ_Icons_Construction_v1.0.png'), width: 1760, height: 820, scale: 2 });
  } finally { await R.close(); }
}

if (require.main === module) {
  (async () => {
    const args = process.argv.slice(2);
    // sanity: unique names, all paths parse to something
    const seen = new Set(); for (const ic of ICONS) { if (seen.has(ic.name)) throw new Error('duplicate ' + ic.name); seen.add(ic.name); }
    writeAll();
    console.log(`✓ ${ICONS.length} icons → svg/outline, svg/filled, sprite, json`);
    if (args.includes('--no-png')) return;
    await renderPreviews(args.includes('--inspect'));
    console.log('✓ previews');
  })().catch((e) => { console.error(e); process.exit(1); });
}

module.exports = { ICONS, CATS, svgFile, inner };
