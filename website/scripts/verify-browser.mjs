// SIRAJ website — browser verification of the production build (dist/), served by a tiny static server.
// Per page × viewport (390, 768, 1280, 1920): console/page errors, failed requests, horizontal overflow, images loaded,
// Arabic line-height floors (display ≥ 1.3, headings ≥ 1.4, body ≥ 1.6), touch targets (≥ 44 px at 390),
// reduced motion (everything visible, nothing moving), keyboard (skip link first, visible focus), axe-core WCAG 2 A/AA,
// and the form contract (validation + transport disabled = nothing sent). Screenshots → ../docs/digital/screens/.
import http from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { existsSync, statSync } from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_PATH || '/opt/node22/lib/node_modules/playwright');
const WEB = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(WEB, 'dist');
const SHOTS = path.resolve(WEB, '..', 'docs', 'digital', 'screens');
const AXE = await readFile(path.join(WEB, 'node_modules', 'axe-core', 'axe.min.js'), 'utf8');
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain', '.webmanifest': 'application/manifest+json' };

const server = http.createServer(async (req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let f = path.join(DIST, p);
  if (existsSync(f) && statSync(f).isDirectory()) f = path.join(f, 'index.html');
  if (!existsSync(f)) { res.writeHead(404, { 'content-type': TYPES['.html'] }); res.end(await readFile(path.join(DIST, '404.html'))); return; }
  res.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' }); res.end(await readFile(f));
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const BASE = `http://127.0.0.1:${server.address().port}`;

const ROUTES = ['/', '/about/', '/project/', '/contact/', '/404.html'];
const VIEWPORTS = [[390, 844], [768, 1024], [1280, 800], [1920, 1080]];
let fails = 0; const warn = [];
const fail = (where, msg) => { fails++; console.log(`✗ ${where}: ${msg}`); };
await mkdir(SHOTS, { recursive: true });

const browser = await chromium.launch();
for (const route of ROUTES) {
  for (const [w, h] of VIEWPORTS) {
    const where = `${route} @${w}`;
    const ctx = await browser.newContext({ viewport: { width: w, height: h } });
    const page = await ctx.newPage();
    const errors = []; const badReq = [];
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('pageerror', (e) => errors.push(String(e)));
    page.on('response', (r) => { if (r.status() >= 400 && !(route === '/404.html' && r.url().endsWith('/404.html'))) badReq.push(`${r.status()} ${r.url()}`); });
    page.on('requestfailed', (r) => badReq.push(`failed ${r.url()}`));
    await page.goto(BASE + route, { waitUntil: 'networkidle' });
    for (let y = 0; y < 30000; y += Math.round(h * 0.7)) { await page.evaluate((yy) => window.scrollTo(0, yy), y); await page.waitForTimeout(90); if (await page.evaluate((yy) => yy > document.documentElement.scrollHeight, y)) break; }
    await page.waitForLoadState('networkidle'); await page.waitForTimeout(2600);
    const r = await page.evaluate(() => {
      const W = document.documentElement.clientWidth;
      const imgs = [...document.images].filter((i) => !i.closest('[hidden]'));
      const broken = imgs.filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.currentSrc || i.src);
      const lh = (el) => { const cs = getComputedStyle(el); return parseFloat(cs.lineHeight) / parseFloat(cs.fontSize); };
      const tight = [];
      document.querySelectorAll('h1, .siraj-hero__title').forEach((e) => { if (e.textContent.trim() && lh(e) < 1.3) tight.push(`${e.tagName} ${lh(e).toFixed(2)}`); });
      document.querySelectorAll('h2, h3').forEach((e) => { if (e.textContent.trim() && lh(e) < 1.4) tight.push(`${e.tagName} ${lh(e).toFixed(2)} “${e.textContent.trim().slice(0, 24)}”`); });
      document.querySelectorAll('main p').forEach((e) => { if (e.textContent.trim().length > 40 && lh(e) < 1.6) tight.push(`P ${lh(e).toFixed(2)} “${e.textContent.trim().slice(0, 24)}”`); });
      const hidden = [...document.querySelectorAll('[data-sj-motion]')].filter((e) => !e.classList.contains('is-in')).length;
      const small = [];
      if (W <= 400) document.querySelectorAll('.siraj-btn, .siraj-nav__link, .siraj-channel, .siraj-check input').forEach((e) => { const b = e.getBoundingClientRect(); const hit = Math.max(b.height, parseFloat(getComputedStyle(e, '::after').height) || 0); if (b.width && b.height && e.offsetParent && (hit < 44 && !e.matches('.siraj-check input'))) small.push(`${e.className.split(' ')[0]} ${Math.round(b.width)}×${Math.round(b.height)}`); });
      return { overflow: document.documentElement.scrollWidth - W, broken, tight, hidden, small };
    });
    if (errors.length) fail(where, `console/page errors: ${errors.slice(0, 3).join(' | ')}`);
    if (badReq.length) fail(where, `failed requests: ${badReq.slice(0, 3).join(' | ')}`);
    if (r.overflow > 0) fail(where, `horizontal overflow ${r.overflow}px`);
    if (r.broken.length) fail(where, `images not loaded: ${r.broken.slice(0, 3).join(' | ')}`);
    if (r.tight.length) fail(where, `tight Arabic line height: ${r.tight.slice(0, 3).join(' | ')}`);
    if (r.hidden) fail(where, `${r.hidden} motion elements never revealed`);
    if (r.small.length) fail(where, `touch targets under 44px: ${r.small.slice(0, 4).join(' | ')}`);
    if (w === 390 || w === 1920) {
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.addStyleTag({ content: '.siraj-header{position:relative!important}' });
      await page.waitForTimeout(300);
      const name = `${route === '/' ? 'home' : route.replace(/\//g, '').replace('.html', '')}-${w}`;
      await page.screenshot({ path: path.join(SHOTS, `${name}.jpg`), fullPage: true, type: 'jpeg', quality: 72 });
    }
    if (w === 1280) {
      await page.addScriptTag({ content: AXE });
      const ax = await page.evaluate(async () => (await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] } })).violations.map((v) => ({ id: v.id, impact: v.impact, n: v.nodes.length, t: v.nodes[0]?.target?.join(' ') })));
      ax.forEach((v) => (v.impact === 'serious' || v.impact === 'critical' ? fail(where, `axe ${v.impact} ${v.id} ×${v.n} (${v.t})`) : warn.push(`${where} axe ${v.impact} ${v.id} ×${v.n}`)));
      // keyboard: first Tab lands on the skip link, and focus is visible
      await page.goto(BASE + route, { waitUntil: 'networkidle' });
      await page.keyboard.press('Tab');
      const k = await page.evaluate(() => { const a = document.activeElement; const cs = getComputedStyle(a); return { skip: a.classList.contains('siraj-skip'), outline: cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0 }; });
      if (!k.skip) fail(where, 'first Tab does not reach the skip link');
      if (!k.outline) fail(where, 'focus ring not visible on the skip link');
    }
    await ctx.close();
  }
}

// Performance budget (mobile, first view, no scrolling): initial transfer ≤ 900 KB, JavaScript ≤ 30 KB, LCP measured.
const perf = [];
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  for (const route of ROUTES.slice(0, 4)) {
    const page = await ctx.newPage();
    const sizes = { total: 0, js: 0, css: 0, img: 0, font: 0, html: 0 };
    page.on('response', async (r) => { try { const b = (await r.body()).length; const t = r.request().resourceType(); sizes.total += b; if (t === 'script') sizes.js += b; else if (t === 'stylesheet') sizes.css += b; else if (t === 'image') sizes.img += b; else if (t === 'font') sizes.font += b; else if (t === 'document') sizes.html += b; } catch {} });
    await page.goto(BASE + route, { waitUntil: 'networkidle' }); await page.waitForTimeout(500);
    const lcp = await page.evaluate(() => new Promise((res) => { let v = 0; new PerformanceObserver((l) => { for (const e of l.getEntries()) v = e.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true }); setTimeout(() => res(Math.round(v)), 300); }));
    const kb = (n) => Math.round(n / 1024);
    perf.push(`${route} @390×2: ${kb(sizes.total)} KB (html ${kb(sizes.html)}, css ${kb(sizes.css)}, js ${kb(sizes.js)}, fonts ${kb(sizes.font)}, img ${kb(sizes.img)}) · LCP ${lcp} ms (local)`);
    if (sizes.total > 900 * 1024) fail(`${route} perf`, `initial transfer ${kb(sizes.total)} KB > 900 KB`);
    if (sizes.js > 30 * 1024) fail(`${route} perf`, `JavaScript ${kb(sizes.js)} KB > 30 KB`);
    await page.close();
  }
  await ctx.close();
}

// Reduced motion: everything visible immediately, nothing transforms
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  for (const route of ROUTES.slice(0, 4)) {
    await page.goto(BASE + route, { waitUntil: 'networkidle' }); await page.waitForTimeout(400);
    const r = await page.evaluate(() => [...document.querySelectorAll('[data-sj-motion]')].filter((e) => { const cs = getComputedStyle(e); return !e.classList.contains('is-in') || parseFloat(cs.opacity) < 1 || (cs.transform !== 'none' && cs.transform !== 'matrix(1, 0, 0, 1, 0, 0)'); }).length);
    if (r) fail(`${route} reduced-motion`, `${r} elements hidden or still moving`);
  }
  await ctx.close();
}

// Forms: validation blocks empty submit; valid submit with transport disabled shows the offline notice and sends nothing
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  const posts = []; page.on('request', (rq) => { if (rq.method() !== 'GET') posts.push(rq.url()); });
  await page.goto(BASE + '/contact/', { waitUntil: 'networkidle' });
  await page.click('#interest-form button[type=submit]');
  const invalid = await page.evaluate(() => document.querySelectorAll('#interest-form .siraj-field.is-invalid').length);
  const focused = await page.evaluate(() => document.activeElement?.id);
  if (invalid < 4) fail('/contact/ form', `empty submit should flag 4 required fields, flagged ${invalid}`);
  if (focused !== 'interest-name') fail('/contact/ form', `focus should move to the first invalid field, got ${focused}`);
  await page.fill('#interest-name', 'اختبار'); await page.fill('#interest-phone', '9123 4567'); await page.selectOption('#interest-interest', 'apartment'); await page.check('#interest-form input[name=consent]');
  const cleared = await page.evaluate(() => document.querySelectorAll('#interest-form .siraj-field.is-invalid').length);
  if (cleared) fail('/contact/ form', `${cleared} errors did not clear after fixing`);
  await page.click('#interest-form button[type=submit]'); await page.waitForTimeout(300);
  const state = await page.evaluate(() => [...document.querySelectorAll('#interest-status [data-state]')].find((e) => !e.hidden)?.dataset.state);
  if (state !== 'offline') fail('/contact/ form', `transport disabled should show the offline notice, showed ${state}`);
  if (posts.length) fail('/contact/ form', `data was sent: ${posts.join(', ')}`);
  await ctx.close();
}

await browser.close(); server.close();
perf.forEach((x) => console.log(`· ${x}`));
warn.forEach((x) => console.log(`! ${x}`));
console.log(`browser QA: ${ROUTES.length} pages × ${VIEWPORTS.length} viewports + reduced motion + forms · failures: ${fails} · notes: ${warn.length}`);
process.exit(fails ? 1 : 0);
