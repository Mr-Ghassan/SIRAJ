// SIRAJ Grid System — overlays (SVG + PNG) for every format, with the Silk Axis and Silk Field.
const fs = require('fs');
const path = require('path');
const R = require('./lib/render');
const OUT = path.join(R.ROOT, '04-Grids');
const V = 'v1.0';

// unit: px for screens, mm for print (converted at 4 px/mm for previews)
const GRIDS = [
  { id: 'Desktop-1440', w: 1440, h: 900, cols: 12, margin: 80, gutter: 24, baseline: 8, unit: 'px', note: 'Max content 1280. Hero images bleed full width; text never crosses column 7 edge in hero.' },
  { id: 'Desktop-1920', w: 1920, h: 1080, cols: 12, margin: 240, gutter: 32, baseline: 8, unit: 'px', note: 'Content max 1440, centred.' },
  { id: 'Tablet-900', w: 900, h: 1200, cols: 8, margin: 48, gutter: 24, baseline: 8, unit: 'px', note: '12-col collapses to 8.' },
  { id: 'Mobile-390', w: 390, h: 844, cols: 4, margin: 20, gutter: 16, baseline: 8, unit: 'px', note: 'Single text column; images full-bleed.' },
  { id: 'Presentation-1920x1080', w: 1920, h: 1080, cols: 12, margin: 120, gutter: 32, top: 96, bottom: 96, baseline: 8, unit: 'px', note: 'Footer band 48 px: page number + section (Lumen marker).' },
  { id: 'Social-Post-1080x1350', w: 1080, h: 1350, cols: 6, margin: 72, gutter: 24, baseline: 8, unit: 'px', note: 'Logo zone bottom-start, 72 px from edges.' },
  { id: 'Social-Square-1080', w: 1080, h: 1080, cols: 6, margin: 72, gutter: 24, baseline: 8, unit: 'px', note: '' },
  { id: 'Social-Story-1080x1920', w: 1080, h: 1920, cols: 6, margin: 72, gutter: 24, top: 250, bottom: 340, baseline: 8, unit: 'px', note: 'Platform UI safe zones: top 250, bottom 340.' },
  { id: 'Editorial-A4-Portrait', w: 210, h: 297, cols: 12, margin: 15, inner: 20, gutter: 4, top: 18, bottom: 22, baseline: 3, unit: 'mm', note: 'Baseline 3 mm (≈ 8.5 pt). Inner margin 20 mm for binding.' },
  { id: 'Brochure-A4-Landscape', w: 297, h: 210, cols: 12, margin: 15, gutter: 4, top: 15, bottom: 18, baseline: 3, unit: 'mm', note: 'Sales brochure; spreads 594 × 210 mm.' },
  { id: 'Outdoor-Billboard-48-Sheet', w: 6096, h: 3048, cols: 12, margin: 300, gutter: 120, baseline: 0, unit: 'mm', note: 'Viewing distance rule: logo ≥ 10% of width; max 7 words.' },
  { id: 'Hoarding-Panel-2x1', w: 6000, h: 2400, cols: 12, margin: 240, gutter: 100, baseline: 0, unit: 'mm', note: 'Construction hoarding module; silk runs continuously across adjacent panels.' },
];

function overlay(g) {
  const k = g.unit === 'mm' ? (g.w > 1000 ? 0.4 : 4) : 1; // preview scale
  const W = g.w * k, H = g.h * k;
  const ml = (g.inner || g.margin) * k, mr = g.margin * k, top = (g.top || g.margin) * k, bot = (g.bottom || g.margin) * k;
  const gut = g.gutter * k, cw = (W - ml - mr - gut * (g.cols - 1)) / g.cols;
  let s = `<rect width="${W}" height="${H}" fill="#F7F2ED"/>`;
  // silk field (lower-end third along the silk axis)
  s += `<path d="M${W * 0.45},${H} C${W * 0.7},${H * 0.78} ${W * 0.86},${H * 0.55} ${W},${H * 0.28} V${H} Z" fill="#602733" opacity="0.09"/>`;
  for (let i = 0; i < g.cols; i++) s += `<rect x="${(ml + i * (cw + gut)).toFixed(2)}" y="${top}" width="${cw.toFixed(2)}" height="${H - top - bot}" fill="#C79A9C" opacity="0.22"/>`;
  if (g.baseline) for (let y = top; y <= H - bot; y += g.baseline * k * (g.unit === 'mm' ? 1 : 1)) s += `<line x1="${ml}" x2="${W - mr}" y1="${y}" y2="${y}" stroke="#AA9180" stroke-width="${Math.max(0.5, k * 0.1)}" opacity="0.35"/>`;
  s += `<rect x="${ml}" y="${top}" width="${W - ml - mr}" height="${H - top - bot}" fill="none" stroke="#602733" stroke-width="${Math.max(1, W / 1400)}"/>`;
  // silk axis at 51° (the official gradient angle) through the lower-start corner of the live area
  const ang = (51 * Math.PI) / 180, len = Math.hypot(W, H);
  const x0 = ml, y0 = H - bot;
  s += `<line x1="${x0}" y1="${y0}" x2="${x0 + Math.sin(ang) * len}" y2="${y0 - Math.cos(ang) * len}" stroke="#602733" stroke-width="${Math.max(1.2, W / 900)}" stroke-dasharray="${W / 90} ${W / 150}"/>`;
  const fs_ = Math.max(11, W / 70);
  s += `<text x="${ml}" y="${top - fs_ * 0.7}" font-family="Jost" font-weight="500" font-size="${fs_}" letter-spacing="${fs_ * 0.14}" fill="#602733">${g.id.replace(/-/g, ' ').toUpperCase()} · ${g.cols} COL · MARGIN ${g.margin}${g.unit} · GUTTER ${g.gutter}${g.unit}${g.baseline ? ` · BASELINE ${g.baseline}${g.unit}` : ''}</text>`;
  s += `<text x="${x0 + Math.sin(ang) * H * 0.36 + 10}" y="${y0 - Math.cos(ang) * H * 0.36}" font-family="Jost" font-size="${fs_ * 0.9}" fill="#602733">SILK AXIS 51°</text>`;
  return { svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${s}</svg>`, W, H };
}

(async () => {
  const rows = [];
  for (const g of GRIDS) {
    const { svg, W, H } = overlay(g);
    const f = path.join(OUT, 'SVG', `SIRAJ_Grid_${g.id}_${V}.svg`);
    fs.mkdirSync(path.dirname(f), { recursive: true });
    fs.writeFileSync(f, `<?xml version="1.0" encoding="UTF-8"?>\n${svg}\n`);
    const pw = Math.min(W, 2400), ph = Math.round(H * pw / W);
    await R.png({ html: `<!doctype html><html><head><link rel="stylesheet" href="file://${R.ROOT}/09-Design-System/css/siraj.css"><style>body{margin:0}svg{width:${pw}px;height:${ph}px;display:block}</style></head><body>${svg}</body></html>`, out: path.join(OUT, 'PNG', `SIRAJ_Grid_${g.id}_${V}.png`), width: pw, height: ph });
    rows.push(`| ${g.id} | ${g.w} × ${g.h} ${g.unit} | ${g.cols} | ${g.margin}${g.inner ? ` (inner ${g.inner})` : ''} | ${g.gutter} | ${g.top || g.margin} / ${g.bottom || g.margin} | ${g.baseline || '—'} | ${g.note} |`);
  }
  fs.writeFileSync(path.join(OUT, 'grids.json'), JSON.stringify(GRIDS, null, 2) + '\n');
  fs.writeFileSync(path.join(OUT, 'GRID-TABLE.md'), `| Format | Size | Cols | Margin | Gutter | Top / Bottom | Baseline | Note |\n|---|---|---|---|---|---|---|---|\n${rows.join('\n')}\n`);
  await R.close();
  console.log('grids:', GRIDS.length);
})();
