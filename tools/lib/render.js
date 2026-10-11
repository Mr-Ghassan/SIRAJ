// SIRAJ build helper — headless Chromium rendering for PNG / PDF / frame capture.
const path = require('path');
const fs = require('fs');
const { chromium } = require(process.env.PLAYWRIGHT_PATH || '/opt/node22/lib/node_modules/playwright');

const ROOT = path.resolve(__dirname, '..', '..');
const ARGS = ['--enable-unsafe-swiftshader', '--use-gl=angle', '--use-angle=swiftshader', '--font-render-hinting=none'];

let _browser = null;
async function browser() {
  if (!_browser) _browser = await chromium.launch({ args: ARGS });
  return _browser;
}
async function close() {
  if (_browser) await _browser.close();
  _browser = null;
}

function ensureDir(file) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
}

// Write an HTML string into a temp file next to the repo root so relative font URLs resolve.
function tmpHtml(html, name = 'tmp') {
  const dir = path.join(ROOT, 'tools', '.cache');
  fs.mkdirSync(dir, { recursive: true });
  const f = path.join(dir, `${name}-${process.pid}-${Math.random().toString(36).slice(2, 8)}.html`);
  fs.writeFileSync(f, html);
  return f;
}

async function openPage({ file, html, width, height, scale = 1, transparent = false }) {
  const b = await browser();
  const page = await b.newPage({ viewport: { width, height }, deviceScaleFactor: scale });
  const target = file || tmpHtml(html);
  await page.goto('file://' + target, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  if (transparent) await page.evaluate(() => { document.documentElement.style.background = 'transparent'; document.body.style.background = 'transparent'; });
  return { page, target, cleanup: async () => { await page.close(); if (!file) fs.rmSync(target, { force: true }); } };
}

async function png({ file, html, out, width, height, scale = 1, transparent = false, selector = null, wait = 0 }) {
  const { page, cleanup } = await openPage({ file, html, width, height, scale, transparent });
  if (wait) await page.waitForTimeout(wait);
  ensureDir(out);
  const opts = { path: out, omitBackground: transparent };
  if (selector) await page.locator(selector).screenshot(opts);
  else await page.screenshot({ ...opts, clip: { x: 0, y: 0, width, height } });
  await cleanup();
  return out;
}

async function pdf({ file, html, out, width, height, wait = 0 }) {
  // width/height accept CSS units, e.g. '210mm'
  const { page, cleanup } = await openPage({ file, html, width: 1200, height: 800 });
  if (wait) await page.waitForTimeout(wait);
  ensureDir(out);
  await page.pdf({ path: out, width, height, printBackground: true, preferCSSPageSize: true });
  await cleanup();
  return out;
}

module.exports = { ROOT, browser, close, png, pdf, openPage, tmpHtml, ensureDir };
