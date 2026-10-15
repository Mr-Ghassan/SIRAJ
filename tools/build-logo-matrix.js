// SIRAJ Brand Library v1.0.1 — complete the logo export matrix WITHOUT touching existing exports or geometry.
// Source of every file: the canonical SVGs already in 01-Logos/SVG (generated from the Illustrator master by
// tools/build-logos.js). This script only rasterises / prints them at the missing sizes. No new compositions.
//
//   node tools/build-logo-matrix.js           → writes missing files only (never overwrites)
//   node tools/build-logo-matrix.js --check   → re-renders the existing 1024 px monograms and compares them pixel by pixel
//
// Added in v1.0.1:
//   01-Logos/PNG/SIRAJ_Monogram-S_<variant>_{512,2048,4096}px.png   (1024 px already existed)
//   01-Logos/PDF/SIRAJ_Monogram-S_<variant>_v1.0.pdf                 (vector, 40 × 40 mm)
const fs = require('fs');
const path = require('path');
const R = require('./lib/render');

const ROOT = R.ROOT;
const D = (p) => path.join(ROOT, '01-Logos', p);
const MONOGRAMS = ['Sand-on-G1', 'Maroon-on-Ivory', 'Ivory-on-Maroon', 'Maroon-Transparent'];
const SIZES = [512, 1024, 2048, 4096];
const CHECK = process.argv.includes('--check');

const wrap = (svg) => `<!doctype html><html><head><style>html,body{margin:0;background:transparent}svg{display:block;width:100vw;height:100vh}</style></head><body>${svg.replace(/<\?xml[^>]*>/, '')}</body></html>`;

async function raster(svg, out, size, transparent) {
  const f = R.tmpHtml(wrap(svg), 'matrix');
  await R.png({ file: f, out, width: size, height: size, transparent });
  fs.rmSync(f);
}
async function vector(svg, out, mm) {
  const html = `<!doctype html><html><head><style>@page{size:${mm}mm ${mm}mm;margin:0}html,body{margin:0}svg{display:block;width:${mm}mm;height:${mm}mm}</style></head><body>${svg.replace(/<\?xml[^>]*>/, '')}</body></html>`;
  await R.pdf({ html, out, width: `${mm}mm`, height: `${mm}mm` });
}

(async () => {
  const written = [];
  for (const v of MONOGRAMS) {
    const svg = fs.readFileSync(D(`SVG/SIRAJ_Monogram-S_${v}_v1.0.svg`), 'utf8');
    const transparent = v.endsWith('Transparent');
    if (CHECK) {
      const tmp = path.join(ROOT, 'tools', '.cache', `check-${v}.png`);
      await raster(svg, tmp, 1024, transparent);
      const { execFileSync } = require('child_process');
      const res = execFileSync('python3', ['-I', '-c', `
import sys, numpy as np
from PIL import Image
a = np.asarray(Image.open(sys.argv[1]).convert('RGBA'), float); b = np.asarray(Image.open(sys.argv[2]).convert('RGBA'), float)
print(f'{np.abs(a - b).mean():.4f} {(np.abs(a - b).max(axis=2) > 8).mean() * 100:.4f}')`, D(`PNG/SIRAJ_Monogram-S_${v}_1024px.png`), tmp], { encoding: 'utf8' }).trim();
      console.log(`check ${v}: mean diff / % pixels > 8 = ${res}`);
      fs.rmSync(tmp);
      continue;
    }
    for (const s of SIZES) {
      const out = D(`PNG/SIRAJ_Monogram-S_${v}_${s}px.png`);
      if (fs.existsSync(out)) continue;
      await raster(svg, out, s, transparent); written.push(out);
    }
    const pdf = D(`PDF/SIRAJ_Monogram-S_${v}_v1.0.pdf`);
    if (!fs.existsSync(pdf)) { await vector(svg, pdf, 40); written.push(pdf); }
  }
  await R.close();
  if (!CHECK) console.log(`logo matrix: ${written.length} files written`);
  written.forEach((f) => console.log('  +', path.relative(ROOT, f)));
})();
