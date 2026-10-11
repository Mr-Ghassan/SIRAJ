// SIRAJ Property Marketing — deterministic build for 14-Property-Marketing.
// Usage: node tools/build-property.js [section ...]   (no args = everything)
// Sections: lockup brochure docs outdoor event digital campaign mockups sheets
// Templates live in 14-Property-Marketing/_build/*.js; HTML sources are written next to their exports (Source/).
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const R = require('./lib/render');

const PMB = path.join(R.ROOT, '14-Property-Marketing', '_build');
const K = require(path.join(PMB, 'common'));
const { PM, V, write } = K;

const ONLY = process.argv.slice(2);
const want = (s) => !ONLY.length || ONLY.includes(s);
const log = (...a) => console.log('  ·', ...a.map((x) => (typeof x === 'string' ? x.replace(R.ROOT + '/', '') : x)));
const im = (args) => execFileSync('convert', args, { stdio: ['ignore', 'ignore', 'inherit'] });

// Render every `.page` element of an HTML file to PNG (one per page) and optionally the whole file to PDF.
// pages: array of output paths (one per .page, null = skip), pdf: output path, w/h: page CSS px, pdfW/pdfH: CSS size.
async function renderDoc({ file, pages = [], pdf = null, w, h, scale = 2, pdfW, pdfH, wait = 150 }) {
  const b = await R.browser();
  const page = await b.newPage({ viewport: { width: Math.ceil(w), height: Math.ceil(h) }, deviceScaleFactor: scale });
  await page.goto('file://' + file, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(wait);
  const loc = page.locator('.page');
  const n = await loc.count();
  for (let i = 0; i < n && i < pages.length; i++) {
    if (!pages[i]) continue;
    R.ensureDir(pages[i]);
    await loc.nth(i).screenshot({ path: pages[i] });
  }
  if (pdf) {
    R.ensureDir(pdf);
    await page.emulateMedia({ media: 'print' });
    await page.pdf({ path: pdf, width: pdfW, height: pdfH, printBackground: true, preferCSSPageSize: true });
  }
  await page.close();
  return n;
}
// Single-canvas render (artwork that is one fixed-size frame).
async function renderPng(file, out, w, h, scale = 1, wait = 150) {
  await R.png({ file, out, width: w, height: h, scale, wait });
  return out;
}

// SVG file → transparent PNG at a given pixel width (Chromium; keeps outlines crisp).
async function svgPng(svgFile, out, width) {
  const vb = fs.readFileSync(svgFile, 'utf8').match(/viewBox="([^"]+)"/)[1].split(/[ ,]+/).map(Number);
  const height = Math.round((width * vb[3]) / vb[2]);
  await R.png({ html: `<html><body style="margin:0;background:transparent"><img src="file://${svgFile}" style="display:block;width:${width}px;height:${height}px"></body></html>`, out, width, height, transparent: true });
  return out;
}

const ctx = { svgPng, R, K, PM, V, write, log, im, renderDoc, renderPng };

(async () => {
  write(path.join(PM, '_shared', 'property.css'), K.PROPERTY_CSS);
  const sections = [
    ['lockup', 'lockup'], ['plans', 'plans'], ['brochure', 'brochure'], ['docs', 'docs'], ['outdoor', 'outdoor'],
    ['event', 'event'], ['digital', 'digital'], ['campaign', 'campaign'], ['mockups', 'mockups'],
  ];
  for (const [name, mod] of sections) {
    if (!want(name)) continue;
    const f = path.join(PMB, `${mod}.js`);
    if (!fs.existsSync(f)) continue;
    const M = require(f);
    if (!M.run) continue;
    console.log(`▸ ${name}`);
    const t0 = Date.now();
    await M.run(ctx);
    console.log(`  done in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
  }
  await R.close();
})().catch(async (e) => { console.error(e); await R.close(); process.exit(1); });
