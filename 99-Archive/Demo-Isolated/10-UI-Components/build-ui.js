#!/usr/bin/env node
/* SIRAJ UI — screenshot renderer
   Serves the repo over http (needed for external SVG sprite <use href>) and captures
   PNGs of the component library and the example screens with headless Chromium.

   Usage:
     node tools/build-ui.js                 # everything
     node tools/build-ui.js library         # component library only
     node tools/build-ui.js examples        # example screens only
     node tools/build-ui.js corporate-home  # a single example (file basename)
   Output: 10-UI-Components/screenshots/
*/
const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require(process.env.PLAYWRIGHT_PATH || '/opt/node22/lib/node_modules/playwright');

const ROOT = path.resolve(__dirname, '..');
const UI = path.join(ROOT, '10-UI-Components');
const OUT = path.join(UI, 'screenshots');
const PORT = Number(process.env.SIRAJ_UI_PORT || 8899);
const BASE = `http://localhost:${PORT}/10-UI-Components/`;
const ARGS = ['--enable-unsafe-swiftshader', '--use-gl=angle', '--use-angle=swiftshader', '--font-render-hinting=none'];

const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.ttf': 'font/ttf', '.otf': 'font/otf', '.woff2': 'font/woff2', '.json': 'application/json' };

function serve() {
  return new Promise((resolve, reject) => {
    const srv = http.createServer((req, res) => {
      const url = decodeURIComponent(req.url.split('?')[0]);
      const file = path.join(ROOT, path.normalize(url).replace(/^(\.\.[/\\])+/, ''));
      if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
      fs.stat(file, (err, st) => {
        if (err || !st.isFile()) { res.writeHead(404); return res.end('not found'); }
        res.writeHead(200, { 'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
        fs.createReadStream(file).pipe(res);
      });
    });
    srv.on('error', reject);
    srv.listen(PORT, () => resolve(srv));
  });
}

// Freeze motion at a representative frame so screenshots are deterministic.
const FREEZE_CSS = `
  *, *::before, *::after { animation-delay: -0.9s !important; animation-play-state: paused !important; transition: none !important; caret-color: transparent !important; }
  .doc-top { position: relative !important; }
  .doc-side { position: relative !important; height: auto !important; }
`;

const missing = new Set();
async function settle(page) {
  await page.evaluate(() => document.fonts.ready);
  await page.addStyleTag({ content: FREEZE_CSS });
  // Ensure every image (incl. lazy ones) has loaded
  await page.evaluate(async () => {
    const imgs = Array.from(document.images);
    imgs.forEach(i => { i.loading = 'eager'; });
    await Promise.all(imgs.map(i => i.complete ? null : new Promise(r => { i.onload = i.onerror = r; })));
  });
  await page.waitForTimeout(250);
  const broken = await page.evaluate(() => Array.from(document.images).filter(i => !i.naturalWidth).map(i => i.getAttribute('src')));
  broken.forEach(b => missing.add(b));
}

async function newPage(browser, { width, height = 900, scale = 1, mobile = false }) {
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: scale, isMobile: mobile, hasTouch: mobile });
  const page = await ctx.newPage();
  page.on('response', r => { if (r.status() >= 400) missing.add(r.url().replace(`http://localhost:${PORT}/`, '')); });
  page.on('pageerror', e => console.warn('  ! page error:', e.message));
  return { ctx, page };
}

function out(...p) { const f = path.join(OUT, ...p); fs.mkdirSync(path.dirname(f), { recursive: true }); return f; }

// Full-page capture: grow the viewport to the document height so sticky/fixed bars
// (bottom tab bars, sidebars sized in vh) render where they would at the end of a scroll.
async function fullShot(page, file, width) {
  const h = await page.evaluate(() => Math.ceil(document.documentElement.scrollHeight));
  await page.setViewportSize({ width, height: h });
  await page.waitForTimeout(200);
  const h2 = await page.evaluate(() => Math.ceil(document.documentElement.scrollHeight));
  await page.screenshot({ path: file, clip: { x: 0, y: 0, width, height: Math.min(h, h2) } });
}

async function library(browser) {
  const variants = [
    { key: 'light', q: '' },
    { key: 'dark', q: '?theme=dark' },
    { key: 'rtl', q: '?dir=rtl' },
  ];
  for (const v of variants) {
    const { ctx, page } = await newPage(browser, { width: 1440, height: 1000, scale: 1 });
    await page.goto(BASE + 'index.html' + v.q, { waitUntil: 'networkidle' });
    await settle(page);
    const ids = await page.$$eval('.doc-section', els => els.map(e => e.id));
    for (const id of ids) {
      await page.locator('#' + id).screenshot({ path: out('library', `${id}_${v.key}.png`) });
    }
    console.log(`  library/${v.key}: ${ids.length} sections`);
    await ctx.close();
    if (v.key !== 'rtl') {
      // The whole library is ~30k px tall: capture at half scale to stay under Chromium's texture limit.
      const full = await newPage(browser, { width: 1440, height: 1000, scale: 0.5 });
      await full.page.goto(BASE + 'index.html' + v.q, { waitUntil: 'networkidle' });
      await settle(full.page);
      await fullShot(full.page, out('library', `_full-page_${v.key}.png`), 1440);
      await full.ctx.close();
    }
  }
  // Library on a phone
  const { ctx, page } = await newPage(browser, { width: 390, height: 844, scale: 2, mobile: true });
  await page.goto(BASE + 'index.html', { waitUntil: 'networkidle' });
  await settle(page);
  await page.screenshot({ path: out('library', '_mobile-top_light.png') });
  await ctx.close();
}

const EXAMPLES = [
  { name: 'corporate-home', desktop: true, mobile: true },
  { name: 'corporate-home-ar', desktop: true, mobile: true },
  { name: 'property-detail', desktop: true, mobile: true },
  { name: 'sales-dashboard', desktop: true, mobile: false },
  { name: 'customer-portal-mobile', desktop: false, mobile: true },
];

async function examples(browser, only) {
  for (const ex of EXAMPLES) {
    if (only && ex.name !== only) continue;
    const file = path.join(UI, 'examples', ex.name + '.html');
    if (!fs.existsSync(file)) { console.warn('  - skip (missing):', ex.name); continue; }
    if (ex.desktop) {
      const { ctx, page } = await newPage(browser, { width: 1440, height: 900 });
      await page.goto(BASE + 'examples/' + ex.name + '.html', { waitUntil: 'networkidle' });
      await settle(page);
      await page.screenshot({ path: out('examples', `${ex.name}_desktop-1440_fold.png`) });
      await fullShot(page, out('examples', `${ex.name}_desktop-1440.png`), 1440);
      await ctx.close();
    }
    if (ex.mobile) {
      // Chromium tiles captures above ~16k device px; drop the scale for very long pages.
      let scale = 2;
      for (let attempt = 0; attempt < 2; attempt++) {
        const { ctx, page } = await newPage(browser, { width: 390, height: 844, scale, mobile: true });
        await page.goto(BASE + 'examples/' + ex.name + '.html', { waitUntil: 'networkidle' });
        await settle(page);
        const h = await page.evaluate(() => document.documentElement.scrollHeight);
        if (h * scale > 16000 && attempt === 0) { scale = Math.max(1, Math.floor((16000 / h) * 10) / 10); await ctx.close(); continue; }
        await page.screenshot({ path: out('examples', `${ex.name}_mobile-390_fold.png`) });
        await fullShot(page, out('examples', `${ex.name}_mobile-390.png`), 390);
        await ctx.close();
        break;
      }
    }
    console.log('  example:', ex.name);
  }
}

(async () => {
  const arg = process.argv[2];
  const srv = await serve();
  const browser = await chromium.launch({ args: ARGS });
  try {
    if (!arg || arg === 'library') await library(browser);
    if (!arg || arg === 'examples') await examples(browser);
    else if (arg !== 'library') await examples(browser, arg);
  } finally {
    await browser.close();
    srv.close();
  }
  if (missing.size) { console.warn('Missing resources:'); missing.forEach(m => console.warn('  ', m)); process.exitCode = 1; }
  else console.log('All resources resolved.');
  console.log('Screenshots →', path.relative(ROOT, OUT));
})().catch(e => { console.error(e); process.exit(1); });
