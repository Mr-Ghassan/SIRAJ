// Build all logo deliverables: SVG / PNG / PDF variants, clear-space versions, lockups, monogram, app icons, construction.
const fs = require('fs');
const path = require('path');
const L = require('./lib/logo');
const R = require('./lib/render');
const { textPath } = require('./lib/textpath');

const ROOT = R.ROOT;
const D = (p) => path.join(ROOT, '01-Logos', p);
const V = 'v1.0';
const write = (f, s) => { fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, s); return f; };
const pascal = (s) => s.split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join('-');
const svgFile = (svg) => R.tmpHtml(`<!doctype html><html><head><style>html,body{margin:0;background:transparent}svg{display:block;width:100vw;height:100vh}</style></head><body>${svg.replace(/<\?xml[^>]*>/, '')}</body></html>`, 'logo');

async function rasterSVG(svg, out, width, height, transparent = true) {
  const f = svgFile(svg);
  await R.png({ file: f, out, width, height, transparent });
  fs.rmSync(f);
}
async function pdfSVG(svg, out, wmm, hmm) {
  const html = `<!doctype html><html><head><style>@page{size:${wmm}mm ${hmm}mm;margin:0}html,body{margin:0}svg{display:block;width:${wmm}mm;height:${hmm}mm}</style></head><body>${svg.replace(/<\?xml[^>]*>/, '')}</body></html>`;
  await R.pdf({ html, out, width: `${wmm}mm`, height: `${hmm}mm` });
}

// ----------------------------------------------------------------------------- lockups
async function lockup(kind, { letter, lumen, text }) {
  const H = L.BOX.h, W = L.BOX.w;
  let body = '', vw, vh;
  if (kind === 'horizontal') {
    const ar = await textPath('سراج للتطوير العقاري', { font: 'tajawal-500', size: H * 0.37 });
    // Fit English line to the Arabic line's width with tracking.
    const enSize = H * 0.165;
    const en0 = await textPath('REAL ESTATE DEVELOPMENT', { font: 'jost-400', size: enSize });
    const tracking = Math.max(0.12, Math.min(0.42, (ar.width - en0.width) / (22 * enSize)));
    const en = await textPath('REAL ESTATE DEVELOPMENT', { font: 'jost-400', size: enSize, tracking });
    const gap = H * 0.62, rule = H * 0.018;
    const x0 = W + gap, tx = x0 + rule + gap;
    const blockW = Math.max(ar.width, en.width);
    const arBase = H * 0.40, enBase = H * 0.90;
    body = L.group({ letter, lumen }) +
      `<rect x="${x0.toFixed(2)}" y="0" width="${rule.toFixed(3)}" height="${H}" fill="${lumen}"/>` +
      `<path transform="translate(${(tx + blockW - ar.width).toFixed(2)} ${arBase.toFixed(2)})" d="${ar.d}" fill="${text}"/>` +
      `<path transform="translate(${(tx + blockW - en.width).toFixed(2)} ${enBase.toFixed(2)})" d="${en.d}" fill="${text}"/>`;
    vw = tx + blockW; vh = H;
  } else if (kind === 'stacked') {
    const lineW = W * 0.86;
    const enSize = H * 0.15;
    const en0 = await textPath('REAL ESTATE DEVELOPMENT', { font: 'jost-400', size: enSize });
    const en = await textPath('REAL ESTATE DEVELOPMENT', { font: 'jost-400', size: enSize, tracking: (lineW - en0.width) / (22 * enSize) });
    const ar0 = await textPath('سراج للتطوير العقاري', { font: 'tajawal-500', size: 10 });
    const arSize = Math.min(H * 0.42, 10 * (lineW * 0.82) / ar0.width);
    const ar = await textPath('سراج للتطوير العقاري', { font: 'tajawal-500', size: arSize });
    const ruleY = H * 1.42, arBase = H * 2.12, enBase = H * 2.58;
    body = L.group({ letter, lumen }) +
      `<rect x="${(W / 2 - H * 0.6).toFixed(2)}" y="${ruleY.toFixed(2)}" width="${(H * 1.2).toFixed(2)}" height="${(H * 0.018).toFixed(3)}" fill="${lumen}"/>` +
      `<path transform="translate(${((W - ar.width) / 2).toFixed(2)} ${arBase.toFixed(2)})" d="${ar.d}" fill="${text}"/>` +
      `<path transform="translate(${((W - en.width) / 2).toFixed(2)} ${enBase.toFixed(2)})" d="${en.d}" fill="${text}"/>`;
    vw = W; vh = enBase + H * 0.02;
  } else if (kind === 'descriptor') {
    // Single-line descriptor under the wordmark: «REAL ESTATE DEVELOPMENT» only (English-only contexts).
    const enSize = H * 0.15;
    const en0 = await textPath('REAL ESTATE DEVELOPMENT', { font: 'jost-400', size: enSize });
    const en = await textPath('REAL ESTATE DEVELOPMENT', { font: 'jost-400', size: enSize, tracking: (W - en0.width) / (22 * enSize) });
    body = L.group({ letter, lumen }) + `<path transform="translate(${((W - en.width) / 2).toFixed(2)} ${(H * 1.62).toFixed(2)})" d="${en.d}" fill="${text}"/>`;
    vw = W; vh = H * 1.64;
  } else if (kind === 'arabic') {
    // Arabic-led lockup: Arabic name above the official wordmark (for Arabic-first communications).
    const ar0 = await textPath('سراج للتطوير العقاري', { font: 'tajawal-500', size: 10 });
    const arSize = 10 * W / ar0.width;
    const ar = await textPath('سراج للتطوير العقاري', { font: 'tajawal-500', size: arSize });
    const top = arSize * 1.25;
    body = L.group({ x: 0, y: top + H * 0.55, letter, lumen }) + `<path transform="translate(0 ${(arSize * 1.02).toFixed(2)})" d="${ar.d}" fill="${text}"/>`;
    vw = W; vh = top + H * 1.55;
  }
  const pad = L.BOX.h * 0.5;
  const VW = vw + 2 * pad, VH = vh + 2 * pad;
  return {
    svg: `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${VW.toFixed(2)} ${VH.toFixed(2)}" width="${(VW * 10).toFixed(0)}" height="${(VH * 10).toFixed(0)}" role="img" aria-label="SIRAJ — سراج للتطوير العقاري — Real Estate Development"><title>SIRAJ Real Estate Development — سراج للتطوير العقاري</title>\n<g transform="translate(${pad.toFixed(2)} ${pad.toFixed(2)})">${body}</g>\n</svg>\n`,
    w: VW, h: VH,
  };
}

// ----------------------------------------------------------------------------- monogram + icons
function monogram({ letter = '#D6C0B2', bg = 'gradient', size = 1024, round = false, k = 0.5 }) {
  const [a, b, c] = L.GLYPHS.S;
  const box = { x: 21.787, y: 56.85, w: 18.588, h: 28.07 };
  const h = size * k, s = h / box.h, w = box.w * s;
  const defs = bg === 'gradient' ? `<defs><linearGradient id="g" x1="0" y1="1" x2="1" y2="0.19"><stop offset="0" stop-color="#2C0F12"/><stop offset="1" stop-color="#602733"/></linearGradient></defs>` : '';
  const fill = bg === 'gradient' ? 'url(#g)' : bg;
  const shape = round ? `<circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="${fill}"/>` : bg ? `<rect width="${size}" height="${size}" fill="${fill}"/>` : '';
  const g = [a, b, c].map((i) => `<path d="${L.P[i].d}" fill="${letter}"/>`).join('');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">${defs}${shape}<g transform="translate(${((size - w) / 2).toFixed(2)} ${((size - h) / 2).toFixed(2)}) scale(${s.toFixed(5)}) translate(${-box.x} ${-box.y})">${g}</g></svg>\n`;
}
function avatar({ size = 1080, round = false }) {
  // Mirrors the official artboard 03: wordmark at 57.2% width on the official gradient (G1).
  const w = size * 0.572, h = w / L.RATIO;
  const shape = round ? `<circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="url(#g)"/>` : `<rect width="${size}" height="${size}" fill="url(#g)"/>`;
  return `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}"><defs><linearGradient id="g" x1="0.092" y1="0.833" x2="0.868" y2="0.202"><stop offset="0" stop-color="#2C0F12"/><stop offset="1" stop-color="#602733"/></linearGradient></defs>${shape}${L.group({ x: (size - w) / 2, y: (size - h) / 2, height: h, letter: '#D6C0B2', lumen: '#AA9180' })}</svg>\n`;
}

// ----------------------------------------------------------------------------- construction sheet
function construction() {
  const H = L.BOX.h, W = L.BOX.w, s = 10, pad = H * 0.9;
  const VW = (W + pad * 2) * s, VH = (H + pad * 2) * s;
  const X = 4.93; // I-stem width
  const o = (v) => (pad + v) * s;
  let g = `<rect width="${VW}" height="${VH}" fill="#F7F2ED"/>`;
  // clear space zone
  const cs = H / 2;
  g += `<rect x="${o(-cs)}" y="${o(-cs)}" width="${(W + 2 * cs) * s}" height="${(H + 2 * cs) * s}" fill="none" stroke="#AA9180" stroke-width="2" stroke-dasharray="10 8"/>`;
  // X-unit grid
  for (let x = 0; x <= W + 0.01; x += X) g += `<line x1="${o(x)}" y1="${o(-cs)}" x2="${o(x)}" y2="${o(H + cs)}" stroke="#D6C0B2" stroke-width="1"/>`;
  for (let y = 0; y <= H + 0.01; y += X) g += `<line x1="${o(-cs)}" y1="${o(y)}" x2="${o(W + cs)}" y2="${o(y)}" stroke="#D6C0B2" stroke-width="1"/>`;
  // baseline, cap line, lumen line
  const base = 84.92 - L.BOX.y, cap = 56.86 - L.BOX.y, stemTop = 59.46 - L.BOX.y;
  for (const [y, lab] of [[base, 'BASELINE'], [cap, 'CAP / APEX'], [stemTop, 'STEM TOP']]) {
    g += `<line x1="${o(-cs - 2)}" y1="${o(y)}" x2="${o(W + cs + 2)}" y2="${o(y)}" stroke="#602733" stroke-width="1.5"/>`;
    g += `<text x="${o(W + cs) + 14}" y="${o(y) + 5}" font-family="Jost" font-size="15" letter-spacing="2" fill="#602733">${lab}</text>`;
  }
  g += `<g transform="translate(${pad * s} ${pad * s}) scale(${s})">${L.group({ letter: '#602733', lumen: '#AA9180' })}</g>`;
  // annotations
  g += `<text x="${o(-cs)}" y="${o(-cs) - 18}" font-family="Jost" font-size="17" letter-spacing="2" fill="#3B3436">CLEAR SPACE = ½ H ON ALL SIDES · GRID UNIT X = I-STEM WIDTH (H ÷ 5.7)</text>`;
  g += `<text x="${o(-cs)}" y="${o(H + cs) + 34}" font-family="Jost" font-size="17" letter-spacing="2" fill="#3B3436">PROPORTION W : H = 3.49 : 1 · LUMEN (◆) HEIGHT = 0.20 H · LUMEN ANGLE 45°</text>`;
  return `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${VW + 260} ${VH}" width="${VW + 260}" height="${VH}"><rect width="100%" height="100%" fill="#F7F2ED"/>${g}</svg>\n`;
}

// ----------------------------------------------------------------------------- main
(async () => {
  const report = [];
  // 1. Core variants: tight + clear-space SVG, PNG, PDF
  for (const [key, c] of Object.entries(L.COLORS)) {
    const name = `SIRAJ_Logo_${pascal(key)}_${V}`;
    const tight = L.svg({ variant: key });
    const spaced = L.svg({ variant: key, pad: 0.5 });
    const folder = key.startsWith('mono') ? 'Monochrome' : '';
    write(D(`SVG/${name}.svg`), tight);
    write(D(`SVG/${name}_ClearSpace.svg`), spaced);
    if (folder) write(D(`${folder}/${name}.svg`), tight);
    for (const w of [512, 1024, 2048, 4096]) await rasterSVG(tight, D(`PNG/${name}_${w}px.png`), w, Math.round(w / L.RATIO));
    await rasterSVG(spaced, D(`PNG/${name}_ClearSpace_2048px.png`), 2048, Math.round(2048 * (L.BOX.h * 2) / (L.BOX.w + L.BOX.h)));
    await pdfSVG(tight, D(`PDF/${name}.pdf`), 120, 120 / L.RATIO);
    report.push(name);
  }
  // 2. Logo on approved backgrounds (Light / Dark environments)
  const envs = {
    Light: [['Ivory', '#F7F2ED', 'primary'], ['White', '#FFFFFF', 'primary'], ['Linen', '#EFE7E0', 'primary'], ['Sand', '#D6C0B2', 'deep']],
    Dark: [['Maroon', '#602733', 'sand'], ['Deep', '#2C0F12', 'sand'], ['Shadow', '#170608', 'sand'], ['Black', '#020202', 'sand'], ['Gradient-G1', null, 'sand']],
  };
  for (const [env, list] of Object.entries(envs)) {
    for (const [bgName, bg, variant] of list) {
      for (const [fmt, w, h] of [['Square', 2048, 2048], ['Landscape', 3840, 2160]]) {
        const lw = (fmt === 'Square' ? 0.572 : 0.36) * w, lh = lw / L.RATIO;
        const c = L.COLORS[variant];
        const fill = bg || 'url(#g)';
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}"><defs><linearGradient id="g" x1="0.092" y1="0.833" x2="0.868" y2="0.202"><stop offset="0" stop-color="#2C0F12"/><stop offset="1" stop-color="#602733"/></linearGradient></defs><rect width="${w}" height="${h}" fill="${fill}"/>${L.group({ x: (w - lw) / 2, y: (h - lh) / 2, height: lh, ...c })}</svg>`;
        const name = `SIRAJ_Logo_On-${bgName}_${fmt}_${V}`;
        write(D(`${env}/${name}.svg`), svg);
        await rasterSVG(svg, D(`${env}/${name}.png`), w / 2, h / 2, false);
      }
    }
  }
  // 3. Lockups
  const lockColors = {
    Primary: { letter: '#602733', lumen: '#AA9180', text: '#602733' },
    Reversed: { letter: '#D6C0B2', lumen: '#AA9180', text: '#D6C0B2' },
    'Mono-Black': { letter: '#020202', lumen: '#020202', text: '#020202' },
    'Mono-White': { letter: '#FFFFFF', lumen: '#FFFFFF', text: '#FFFFFF' },
  };
  for (const kind of ['horizontal', 'stacked', 'descriptor', 'arabic']) {
    for (const [cn, c] of Object.entries(lockColors)) {
      const { svg, w, h } = await lockup(kind, c);
      const name = `SIRAJ_Lockup_${pascal(kind)}_${cn}_${V}`;
      write(D(`Lockups/${name}.svg`), svg);
      const pw = 2400;
      await rasterSVG(svg, D(`Lockups/${name}.png`), pw, Math.round(pw * h / w));
      if (cn === 'Primary' || cn === 'Reversed') await pdfSVG(svg, D(`Lockups/${name}.pdf`), 160, 160 * h / w);
    }
  }
  // 4. Monogram, app icon, favicon, social avatars
  const mono = [
    ['SIRAJ_Monogram-S_Sand-on-G1', { letter: '#D6C0B2', bg: 'gradient' }],
    ['SIRAJ_Monogram-S_Maroon-on-Ivory', { letter: '#602733', bg: '#F7F2ED' }],
    ['SIRAJ_Monogram-S_Ivory-on-Maroon', { letter: '#F7F2ED', bg: '#602733' }],
    ['SIRAJ_Monogram-S_Maroon-Transparent', { letter: '#602733', bg: null }],
  ];
  for (const [n, o] of mono) {
    const svg = monogram(o);
    write(D(`SVG/${n}_${V}.svg`), svg);
    await rasterSVG(svg, D(`PNG/${n}_1024px.png`), 1024, 1024, !o.bg);
  }
  const fav = monogram({ letter: '#D6C0B2', bg: 'gradient', k: 0.66 });
  for (const s of [16, 32, 48, 180, 192, 512]) await rasterSVG(fav, D(`PNG/Favicon/SIRAJ_Favicon_${s}px.png`), s, s, false);
  write(D('PNG/Favicon/SIRAJ_Favicon.svg'), fav);
  for (const [n, round] of [['Square', false], ['Circle', true]]) {
    const svg = avatar({ size: 1080, round });
    write(D(`Dark/SIRAJ_Social-Avatar_${n}_${V}.svg`), svg);
    await rasterSVG(svg, D(`Dark/SIRAJ_Social-Avatar_${n}_${V}.png`), 1080, 1080, round);
  }
  // 5. Master (canonical) copies
  write(D(`Master/SIRAJ_Logo_Master_${V}.svg`), L.svg({ variant: 'primary' }));
  write(D(`Master/SIRAJ_Logo_Master-Reversed_${V}.svg`), L.svg({ variant: 'sand' }));
  await pdfSVG(L.svg({ variant: 'primary' }), D(`Master/SIRAJ_Logo_Master_${V}.pdf`), 200, 200 / L.RATIO);
  // 6. Construction
  const con = construction();
  write(D(`Construction/SIRAJ_Logo_Construction_${V}.svg`), con);
  const m = con.match(/width="([\d.]+)" height="([\d.]+)"/);
  const fontCSS = fs.readFileSync(path.join(ROOT, '03-Typography/siraj-fonts.css'), 'utf8').replace(/url\("fonts\//g, `url("file://${ROOT}/03-Typography/fonts/`);
  const chtml = R.tmpHtml(`<!doctype html><html><head><style>${fontCSS}html,body{margin:0}</style></head><body>${con.replace(/<\?xml[^>]*>/, '')}</body></html>`);
  await R.png({ file: chtml, out: D(`Construction/SIRAJ_Logo_Construction_${V}.png`), width: Math.round(+m[1]), height: Math.round(+m[2]) });
  fs.rmSync(chtml);
  await R.close();
  console.log('logos built:', report.length, 'colour variants + backgrounds, lockups, monograms, favicons, construction');
})();
