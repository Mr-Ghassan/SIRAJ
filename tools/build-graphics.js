// SIRAJ Graphic System — vector brand elements derived from the wordmark geometry and the silk engine.
const fs = require('fs');
const path = require('path');
const R = require('./lib/render');
const L = require('./lib/logo');
require('../06-SIRAJ-Silk/engine/siraj-silk.js');
require('../06-SIRAJ-Silk/engine/presets.js');
const Silk = globalThis.SirajSilk;

const OUT = path.join(R.ROOT, '05-Graphic-System');
const V = 'v1.0';
const C = { maroon: '#602733', deep: '#2C0F12', shadow: '#170608', stone: '#AA9180', sand: '#D6C0B2', ivory: '#F7F2ED', mid: '#81404C', hi: '#C79A9C', dark: '#45161F' };
const write = (rel, s) => { const f = path.join(OUT, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, s); return f; };
const svgDoc = (w, h, body, extra = '') => `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}"${extra}>\n${body}\n</svg>\n`;
const f2 = (n) => +n.toFixed(2);

// ---------------------------------------------------------------- shading (JS port of the engine's silk BRDF)
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const RAMP = Silk.RAMP.map(([t, c]) => [t, hex(c)]);
const sm = (a, b, x) => { const t = Math.min(Math.max((x - a) / (b - a), 0), 1); return t * t * (3 - 2 * t); };
function ramp(x) {
  x = Math.min(Math.max(x, 0), 1);
  let c = RAMP[0][1];
  for (let i = 1; i < RAMP.length; i++) { const k = sm(RAMP[i - 1][0], RAMP[i][0], x); c = c.map((v, j) => v + (RAMP[i][1][j] - v) * k); }
  return c;
}
const norm = (a) => { const l = Math.hypot(...a) || 1; return a.map((v) => v / l); };
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
function silkI(N, T, Vv, P) {
  const Lt = norm(P.light || [0.55, 0.75, 0.62]);
  const ndl = dot(N, Lt);
  const diff = Math.min(Math.max((ndl + 0.42) / 1.42, 0), 1);
  const H = norm([Lt[0] + Vv[0], Lt[1] + Vv[1], Lt[2] + Vv[2]]);
  const th = dot(T, H); const sTH = Math.sqrt(Math.max(0, 1 - th * th));
  const lit = sm(-0.15, 0.45, ndl);
  const gloss = P.gloss || 48;
  const aniso = Math.pow(sTH, gloss) * lit;
  const T2 = norm([T[0] + N[0] * 0.22, T[1] + N[1] * 0.22, T[2] + N[2] * 0.22]);
  const th2 = dot(T2, H);
  const aniso2 = Math.pow(Math.sqrt(Math.max(0, 1 - th2 * th2)), gloss * 0.22) * lit;
  const blinn = Math.pow(Math.max(dot(N, H), 0), 30) * lit;
  const rim = Math.pow(1 - Math.abs(dot(N, Vv)), 2.6);
  let I = 0.16 + diff * 0.4 + (aniso * 0.32 + aniso2 * 0.16 + blinn * 0.22) * 0.8 + rim * 1.1 * 0.22;
  I = (I - 0.45) * 1.08 + 0.45;
  return I * 0.84 * (P.exposure || 1.3);
}

// Vector silk ribbon: project the engine's ribbon mesh and emit depth-sorted shaded quads.
function vectorRibbon(ribbon, { w, h, t = 1.5, tonal = false, stepV = 2, segments = 220 }) {
  const aspect = w / h;
  const m = Silk.prototype._ribbonMesh.call({}, { ...ribbon, segments }, t, aspect);
  const dist = 1 / Math.tan((28 * Math.PI) / 360);
  const segV = 14, cols = segV + 1, rows = m.pos.length / 3 / cols;
  const proj = (k) => { const x = m.pos[k * 3], y = m.pos[k * 3 + 1], z = m.pos[k * 3 + 2]; const s = dist / (dist - z); return [(x * s / aspect * 0.5 + 0.5) * w, (0.5 - y * s * 0.5) * h, z]; };
  const TONES = [[0.0, C.shadow], [0.36, C.deep], [0.52, C.dark], [0.66, C.maroon], [0.8, C.mid], [0.93, C.hi]];
  const quads = [];
  const rowShade = (i) => {
    const k = i * cols + Math.floor(segV / 2);
    let N = [m.nor[k * 3], m.nor[k * 3 + 1], m.nor[k * 3 + 2]];
    const P3 = [m.pos[k * 3], m.pos[k * 3 + 1], m.pos[k * 3 + 2]];
    const Vv = norm([-P3[0], -P3[1], dist - P3[2]]);
    if (dot(N, Vv) < 0) N = N.map((v) => -v);
    const T = [m.tan[k * 3], m.tan[k * 3 + 1], m.tan[k * 3 + 2]];
    return { I: silkI(N, T, Vv, ribbon), a: m.alp[k] };
  };
  const toHex = (c) => '#' + c.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
  const tone = (I) => TONES.filter(([th]) => I >= th).pop()[1];
  let i = 0;
  while (i < rows - 1) {
    const { I, a } = rowShade(i);
    let j = i + 1;
    const fill = tonal ? tone(I) : toHex(ramp(I));
    if (tonal) while (j < rows - 1 && tone(rowShade(j).I) === fill) j++;
    if (a >= 0.02) {
      const left = [], right = [];
      for (let r = i; r <= j; r++) { left.push(proj(r * cols)); right.push(proj(r * cols + segV)); }
      const pts = left.concat(right.reverse());
      quads.push({ z: pts.reduce((s2, p) => s2 + p[2], 0) / pts.length, d: 'M' + pts.map((p) => `${f2(p[0])},${f2(p[1])}`).join('L') + 'Z', fill, a });
    }
    i = j;
  }
  quads.sort((p, q) => p.z - q.z);
  return quads.map((q) => `<path d="${q.d}" fill="${q.fill}" stroke="${q.fill}" stroke-width="0.8" stroke-linejoin="round"${q.a < 0.98 ? ` opacity="${q.a.toFixed(2)}"` : ''}/>`).join('');
}

// ---------------------------------------------------------------- elements
// 1. Silk Blade — the crescent from the R leg of the official wordmark (path index 4), the brand's signature curve.
function silkBlade(fill = C.maroon) {
  const d = L.P[4].d; // bbox 61.67..75.16 × 75.34..84.92
  return svgDoc(135, 96, `<g transform="scale(10) translate(-61.67 -75.34)"><path d="${d}" fill="${fill}"/></g>`);
}
// 2. Silk Line — a long tapered S-curve with variable width (thin → full → thin), built from offset samples.
function silkLinePath(w, h, { amp = 0.26, maxW = 0.028, phase = 0 } = {}) {
  const N = 240, L1 = [], L2 = [];
  const cy = (u) => h * (0.5 + amp * Math.sin(Math.PI * 2 * (u * 0.82 + phase)) * (0.35 + 0.65 * u) - 0.15 * (u - 0.5));
  for (let i = 0; i <= N; i++) {
    const u = i / N, x = u * w, y = cy(u);
    const dx = w / N, dy = cy(Math.min(u + 1 / N, 1)) - cy(Math.max(u - 1 / N, 0));
    const l = Math.hypot(2 * dx, dy); const nx = -dy / l, ny = (2 * dx) / l;
    const half = h * maxW * Math.pow(Math.sin(Math.PI * u), 0.9) + 0.4;
    L1.push([x + nx * half, y + ny * half]); L2.push([x - nx * half, y - ny * half]);
  }
  return 'M' + L1.map((p) => p.map(f2).join(',')).join('L') + 'L' + L2.reverse().map((p) => p.map(f2).join(',')).join('L') + 'Z';
}
// 3. Silk Corner window — rectangle whose top-END corner is a drape curve (cubic, handles 0.25 / 0.55 of r).
function silkCornerPath(w, h, r) {
  return `M0,0 H${w - r} C${f2(w - r * 0.25)},0 ${w},${f2(r * 0.45)} ${w},${r} V${h} H0 Z`;
}
// 4. Portal — vertical opening crowned by an asymmetric silk arch (higher on the start side, settling to the end side).
function portalPath(w, h) {
  const a = h * 0.18;
  return `M0,${h} V${f2(a * 0.55)} C0,${f2(a * 0.1)} ${f2(w * 0.28)},0 ${f2(w * 0.55)},0 C${f2(w * 0.86)},0 ${w},${f2(a * 0.62)} ${w},${f2(a * 1.05)} V${h} Z`;
}
// 5. Architectural Cut — a plane split by a narrow stencil cut at the Lumen angle (the wordmark's stencil logic).
function archCut(w, h, fillA = C.maroon, fillB = C.deep) {
  const g = w * 0.012, x1 = w * 0.56, x2 = w * 0.44;
  return `<path d="M0,0 H${x1 - g} L${x2 - g},${h} H0 Z" fill="${fillA}"/><path d="M${x1 + g},0 H${w} V${h} H${x2 + g} Z" fill="${fillB}"/>` +
    `<rect x="${x1 - 6}" y="${-6 + 22}" width="12" height="12" fill="${C.stone}" transform="rotate(45 ${x1} ${22})"/>`;
}
// 6. Fold — a corner of the plane folds over along a curved crease (Silk Fold).
function foldPath(w, h) {
  // under: the revealed back of the plane; flap: the folded silk corner lying over it, its crease a drape curve.
  return {
    under: `M${w * 0.30},${h} C${w * 0.52},${h * 0.80} ${w * 0.66},${h * 0.52} ${w},${h * 0.30} V${h} Z`,
    // flap = the corner reflected across the crease, lying back over the page (its tip lands at 0.30w, 0.30h)
    flap: `M${w * 0.30},${h} C${w * 0.52},${h * 0.80} ${w * 0.66},${h * 0.52} ${w},${h * 0.30} C${w * 0.72},${h * 0.26} ${w * 0.46},${h * 0.24} ${w * 0.30},${h * 0.30} C${w * 0.24},${h * 0.48} ${w * 0.26},${h * 0.74} ${w * 0.30},${h} Z`,
  };
}
// 7. Lumen — 45° diamond with optional halo.
function lumen(size = 120, halo = true) {
  const s = size, d = s * 0.22;
  return svgDoc(s, s, `${halo ? `<defs><radialGradient id="h"><stop offset="0" stop-color="${C.sand}" stop-opacity=".55"/><stop offset="1" stop-color="${C.sand}" stop-opacity="0"/></radialGradient></defs><circle cx="${s / 2}" cy="${s / 2}" r="${s / 2}" fill="url(#h)"/>` : ''}<rect x="${s / 2 - d / 2}" y="${s / 2 - d / 2}" width="${d}" height="${d}" fill="${C.stone}" transform="rotate(45 ${s / 2} ${s / 2})"/>`);
}

(async () => {
  const files = [];
  // Blade
  for (const [n, c] of [['Maroon', C.maroon], ['Stone', C.stone], ['Sand', C.sand]]) files.push(write(`SVG/SIRAJ_Silk-Blade_${n}_${V}.svg`, silkBlade(c)));
  // Silk Line
  for (const [n, c] of [['Maroon', C.maroon], ['Stone', C.stone], ['Sand', C.sand]]) files.push(write(`SVG/SIRAJ_Silk-Line_${n}_${V}.svg`, svgDoc(1600, 400, `<path d="${silkLinePath(1600, 400)}" fill="${c}"/>`)));
  // Silk Line pair (two lines, the second offset — "thread")
  files.push(write(`SVG/SIRAJ_Silk-Line-Pair_Maroon_${V}.svg`, svgDoc(1600, 400, `<path d="${silkLinePath(1600, 400)}" fill="${C.maroon}"/><path d="${silkLinePath(1600, 400, { amp: 0.23, maxW: 0.007, phase: 0.035 })}" fill="${C.stone}"/>`)));
  // Vector silk ribbons (continuous + tonal), opaque-free (transparent background)
  const sweep = globalThis.SirajSilkPresets['ribbon-sweep'].ribbons[0];
  const RW = 1920, RH = 1080;
  files.push(write(`SVG/SIRAJ_Silk-Ribbon_Vector-Continuous_${V}.svg`, svgDoc(RW, RH, vectorRibbon(sweep, { w: RW, h: RH, segments: 700 }))));
  files.push(write(`SVG/SIRAJ_Silk-Ribbon_Vector-Tonal_${V}.svg`, svgDoc(RW, RH, vectorRibbon(sweep, { w: RW, h: RH, tonal: true, segments: 700 }))));
  const wrapR = globalThis.SirajSilkPresets['wrap'].ribbons[0];
  files.push(write(`SVG/SIRAJ_Silk-Wrap_Vector-Continuous_${V}.svg`, svgDoc(1080, 1920, vectorRibbon(wrapR, { w: 1080, h: 1920, segments: 900 }))));
  // Silk Corner / Window
  files.push(write(`SVG/SIRAJ_Silk-Corner-Window_${V}.svg`, svgDoc(1200, 900, `<path d="${silkCornerPath(1200, 900, 360)}" fill="${C.maroon}"/>`)));
  files.push(write(`Masks/SIRAJ_Mask_Silk-Corner_LTR.svg`, svgDoc(1000, 1000, `<path d="${silkCornerPath(1000, 1000, 400)}" fill="#fff"/>`, ' preserveAspectRatio="none"')));
  files.push(write(`Masks/SIRAJ_Mask_Silk-Corner_RTL.svg`, svgDoc(1000, 1000, `<path transform="translate(1000 0) scale(-1 1)" d="${silkCornerPath(1000, 1000, 400)}" fill="#fff"/>`, ' preserveAspectRatio="none"')));
  // Portal
  files.push(write(`SVG/SIRAJ_Portal_${V}.svg`, svgDoc(800, 1200, `<path d="${portalPath(800, 1200)}" fill="${C.maroon}"/>`)));
  files.push(write(`Masks/SIRAJ_Mask_Portal.svg`, svgDoc(1000, 1500, `<path d="${portalPath(1000, 1500)}" fill="#fff"/>`, ' preserveAspectRatio="none"')));
  // Architectural Cut
  files.push(write(`SVG/SIRAJ_Architectural-Cut_${V}.svg`, svgDoc(1200, 800, archCut(1200, 800))));
  // Fold
  const fp = foldPath(1200, 1200);
  files.push(write(`SVG/SIRAJ_Silk-Fold_Corner_${V}.svg`, svgDoc(1200, 1200, `<rect width="1200" height="1200" fill="${C.ivory}"/><defs><linearGradient id="fl" x1="1" y1="0.3" x2="0.3" y2="1"><stop offset="0" stop-color="${C.mid}"/><stop offset="0.55" stop-color="${C.maroon}"/><stop offset="1" stop-color="${C.dark}"/></linearGradient></defs><path d="${fp.under}" fill="${C.deep}"/><path d="${fp.flap}" fill="url(#fl)"/>`)));
  // Lumen
  files.push(write(`SVG/SIRAJ_Lumen_${V}.svg`, lumen(120, false)));
  files.push(write(`SVG/SIRAJ_Lumen-Halo_${V}.svg`, lumen(240, true)));

  // CSS helpers (masks are responsive via mask-size 100% 100%; inlined as data URIs so they work on file:// and any host)
  const uri = (svg) => `url("data:image/svg+xml;utf8,${encodeURIComponent(svg.replace(/<\?xml[^>]*>\n?/, ''))}")`;
  const MC_L = uri(svgDoc(1000, 1000, `<path d="${silkCornerPath(1000, 1000, 400)}" fill="#fff"/>`, ' preserveAspectRatio="none"'));
  const MC_R = uri(svgDoc(1000, 1000, `<path transform="translate(1000 0) scale(-1 1)" d="${silkCornerPath(1000, 1000, 400)}" fill="#fff"/>`, ' preserveAspectRatio="none"'));
  const MP = uri(svgDoc(1000, 1500, `<path d="${portalPath(1000, 1500)}" fill="#fff"/>`, ' preserveAspectRatio="none"'));
  write('siraj-graphics.css', `/* SIRAJ Graphic System v1.0 — CSS helpers. Paths are relative to this file. */
.sj-mask-silk-corner { -webkit-mask: ${MC_L} 0 0 / 100% 100% no-repeat; mask: ${MC_L} 0 0 / 100% 100% no-repeat; }
[dir="rtl"] .sj-mask-silk-corner { -webkit-mask-image: ${MC_R}; mask-image: ${MC_R}; }
.sj-mask-portal { -webkit-mask: ${MP} 0 0 / 100% 100% no-repeat; mask: ${MP} 0 0 / 100% 100% no-repeat; }
[dir="rtl"] .sj-mask-portal { transform: scaleX(-1); }
[dir="rtl"] .sj-mask-portal > * { transform: scaleX(-1); }
.sj-lumen { display: inline-block; width: .5em; height: .5em; background: var(--siraj-color-brand-stone, #AA9180); transform: rotate(45deg); }
.sj-silk-line { display: block; width: 100%; aspect-ratio: 4 / 1; background: url("SVG/SIRAJ_Silk-Line_Maroon_v1.0.svg") center / contain no-repeat; }
`);

  // Specimen sheet
  const rel = (f) => 'file://' + f;
  const tile = (title, desc, inner, bg = C.ivory) => `<figure style="background:${bg}"><div class="art">${inner}</div><figcaption><b>${title}</b><span>${desc}</span></figcaption></figure>`;
  const img = (f, s = '') => `<img src="${rel(path.join(OUT, f))}" style="${s}">`;
  const html = `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="file://${R.ROOT}/09-Design-System/css/siraj.css"><style>
  body{margin:0;background:#F7F2ED;width:2400px;padding:80px;box-sizing:border-box}
  h1{font:300 64px/1 Jost;color:#140E10;margin:0 0 12px} p.lead{font:300 22px/1.5 Jost;color:#3B3436;margin:0 0 56px;max-width:1200px}
  .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
  figure{margin:0;border:1px solid #E3D6CC;display:flex;flex-direction:column}
  .art{height:420px;display:flex;align-items:center;justify-content:center;overflow:hidden;position:relative}
  .art img{max-width:86%;max-height:80%}
  figcaption{padding:20px 24px;background:#fff;display:flex;flex-direction:column;gap:6px}
  figcaption b{font:500 13px Jost;letter-spacing:.16em;text-transform:uppercase;color:#602733}
  figcaption span{font:400 16px/1.5 Jost;color:#3B3436}
  .photo{width:100%;height:100%;object-fit:cover;max-width:none!important;max-height:none!important}
  </style></head><body>
  <div class="eyebrow" style="color:#602733;margin-bottom:16px">05 · Graphic System</div>
  <h1>Signature elements</h1>
  <p class="lead">Every element comes from the wordmark or from the behaviour of silk. Architecture sets the order and silk supplies the gesture. Use one signature element per layout.</p>
  <div class="grid">
  ${tile('Silk Blade', 'The crescent of the R leg in the official wordmark. It is the brand\'s signature curve, used for dividers, accents and section openers.', img('SVG/SIRAJ_Silk-Blade_Maroon_v1.0.svg', 'width:40%'))}
  ${tile('Silk Line', 'A single tapered thread that crosses a layout to connect content. It is never a decorative squiggle.', img('SVG/SIRAJ_Silk-Line-Pair_Maroon_v1.0.svg', 'width:92%'))}
  ${tile('Lumen ◆', 'The light from the I and J of the wordmark: a marker, bullet, pin head and active state.', img('SVG/SIRAJ_Lumen-Halo_v1.0.svg', 'width:34%'), C.deep)}
  ${tile('Silk Ribbon · Vector', 'The engine ribbon exported as print-ready vectors, for large-format work and hoardings.', img('SVG/SIRAJ_Silk-Ribbon_Vector-Continuous_v1.0.svg', 'width:100%'), C.shadow)}
  ${tile('Silk Ribbon · Tonal', 'A five-tone posterised ribbon for screen print, signage vinyl and embroidery.', img('SVG/SIRAJ_Silk-Ribbon_Vector-Tonal_v1.0.svg', 'width:100%'), C.ivory)}
  ${tile('Silk Wrap · Vector', 'A spiral ribbon that wraps a tower in campaign composites.', img('SVG/SIRAJ_Silk-Wrap_Vector-Continuous_v1.0.svg', 'height:96%'), C.deep)}
  ${tile('SIRAJ Window · Silk Corner', 'An architectural rectangle with one draped corner (top-end), used as the hero image container.', `<div class="sj-mask-silk-corner" style="width:78%;height:76%"><img class="photo" src="${rel(path.join(R.ROOT, '14-Property-Marketing/12-Project-Siraj/Source/Clean/SIRAJ_Project-Siraj_Corner_Blue-Hour_Clean_v1.0.jpg'))}"></div>`)}
  ${tile('SIRAJ Portal', 'A vertical opening crowned by an asymmetric silk arch, for project reveals and entrances.', `<div class="sj-mask-portal" style="width:40%;height:86%"><img class="photo" src="${rel(path.join(R.ROOT, '14-Property-Marketing/12-Project-Siraj/Source/Clean/SIRAJ_Project-Siraj_Front_Cloudy-Day_Clean_v1.0.jpg'))}"></div>`)}
  ${tile('Architectural Cut', 'A plane split by a stencil cut at the Lumen angle, echoing the cuts in S-I-R-A-J.', img('SVG/SIRAJ_Architectural-Cut_v1.0.svg', 'width:80%'))}
  ${tile('Silk Fold', 'A corner of the page folds along a draped crease, for covers and section dividers.', img('SVG/SIRAJ_Silk-Fold_Corner_v1.0.svg', 'height:86%'))}
  ${tile('Silk Drape · Raster', 'A full-frame silk surface from the SIRAJ Silk engine, for hero backgrounds and end cards.', `<img class="photo" src="${rel(path.join(R.ROOT, '06-SIRAJ-Silk/Stills/Drape-Lumen/SIRAJ_Silk_Drape-Lumen_16x9_web_v1.0.webp'))}">`)}
  ${tile('Silk Horizon', 'A silk surface that becomes the ground line, with architecture standing above it.', `<img class="photo" src="${rel(path.join(R.ROOT, '06-SIRAJ-Silk/Stills/Horizon-Ivory/SIRAJ_Silk_Horizon-Ivory_16x9_web_v1.0.webp'))}">`)}
  </div></body></html>`;
  const f = R.tmpHtml(html, 'graphics');
  // copy CSS-relative masks: the sheet links masks relatively from the cache dir, so inline a base
  fs.writeFileSync(f, html.replace('<head>', `<head><base href="file://${OUT}/">`).replace('</style>', `</style><link rel="stylesheet" href="file://${OUT}/siraj-graphics.css">`));
  const { page, cleanup } = await R.openPage({ file: f, width: 2400, height: 1600 });
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(OUT, `Previews/SIRAJ_Graphic-System_Specimen_${V}.png`), fullPage: true });
  await cleanup(); fs.rmSync(f);
  // individual PNG previews
  for (const file of fs.readdirSync(path.join(OUT, 'SVG'))) {
    const svg = fs.readFileSync(path.join(OUT, 'SVG', file), 'utf8');
    const m = svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/);
    const w = +m[1], h = +m[2], k = 1600 / Math.max(w, h);
    await R.png({ html: `<!doctype html><html><body style="margin:0;background:transparent">${svg.replace(/<\?xml[^>]*>/, '').replace(/width="[\d.]+" height="[\d.]+"/, `width="${Math.round(w * k)}" height="${Math.round(h * k)}"`)}</body></html>`, out: path.join(OUT, 'PNG', file.replace('.svg', '.png')), width: Math.round(w * k), height: Math.round(h * k), transparent: true });
  }
  await R.close();
  console.log('graphics:', files.length, 'svg elements + previews');
})();
