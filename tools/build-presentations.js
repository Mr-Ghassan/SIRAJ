// SIRAJ Presentation System — export the HTML decks to PNG (per slide), PDF (combined) and contact sheets.
//
//   node tools/build-presentations.js                 # full export (EN + AR)
//   node tools/build-presentations.js --lang=EN       # one deck
//   node tools/build-presentations.js --preview=DIR --slides=3,7 [--grid]   # quick look, PNG only, into DIR
//
const fs = require('fs');
const path = require('path');
const R = require('./lib/render');

const V = 'v1.0';
const BASE = path.join(R.ROOT, '13-Presentations');
const DECKS = [
  { lang: 'EN', file: path.join(BASE, 'deck', 'siraj-deck.html') },
  { lang: 'AR', file: path.join(BASE, 'deck', 'siraj-deck-ar.html') },
];
const args = Object.fromEntries(process.argv.slice(2).map((a) => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v === undefined ? true : v]; }));
const slug = (s) => s.replace(/&/g, 'and').replace(/[^A-Za-z0-9]+/g, '-').replace(/^-|-$/g, '');

async function exportDeck(deck) {
  const b = await R.browser();
  const page = await b.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  const q = '?export' + (args.grid ? '&grid' : '');
  await page.goto('file://' + deck.file + q, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => document.documentElement.classList.contains('ready'));
  await page.evaluate(() => Promise.all(Array.from(document.images).map((i) => (i.complete ? 0 : new Promise((r) => { i.onload = i.onerror = r; })))));
  // overflow guard: report any element that spills outside its slide
  const issues = await page.evaluate(() => {
    const out = [];
    document.querySelectorAll('.slide').forEach((s, i) => {
      const sr = s.getBoundingClientRect();
      s.querySelectorAll('h1,h2,h3,h4,p,li,td,th,dd,dt,blockquote,.v,.pct').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width && (r.right > sr.right + 1 || r.bottom > sr.bottom + 1 || r.left < sr.left - 1)) out.push(`slide ${i + 1}: <${el.tagName.toLowerCase()}> "${el.textContent.trim().slice(0, 40)}" overflows`);
        if (el.scrollWidth > el.clientWidth + 2 && getComputedStyle(el).overflow !== 'visible') out.push(`slide ${i + 1}: clipped text "${el.textContent.trim().slice(0, 40)}"`);
      });
    });
    return out;
  });
  issues.forEach((m) => console.warn('  ! ' + m));
  const labels = await page.$$eval('.slide', (els) => els.map((e) => e.getAttribute('aria-label') || 'Slide'));
  const only = args.slides ? String(args.slides).split(',').map(Number) : null;
  const outDir = args.preview ? path.resolve(args.preview) : path.join(BASE, 'Exports', 'PNG');
  fs.mkdirSync(outDir, { recursive: true });
  const files = [];
  for (let i = 0; i < labels.length; i++) {
    if (only && !only.includes(i + 1)) continue;
    const n = String(i + 1).padStart(2, '0');
    const out = path.join(outDir, `SIRAJ_Presentation_Noor-Residences_${deck.lang}_${n}-${slug(labels[i])}_${V}.png`);
    await page.locator('.slide').nth(i).screenshot({ path: out });
    files.push(out);
  }
  if (!args.preview) {
    const pdfOut = path.join(BASE, 'Exports', `SIRAJ_Presentation_Noor-Residences_${deck.lang}_${V}.pdf`);
    await page.emulateMedia({ media: 'print' });
    await page.pdf({ path: pdfOut, width: '1920px', height: '1080px', printBackground: true, preferCSSPageSize: true });
    console.log('  pdf  ' + path.relative(R.ROOT, pdfOut));
  }
  await page.close();
  console.log(`  ${deck.lang}: ${files.length} PNG → ${path.relative(R.ROOT, outDir)}`);
  return { files, labels };
}

async function contactSheet(deck, files, labels) {
  const cols = 4, tw = 440, th = 248, gap = 24, padX = 72, padTop = 168, labH = 40;
  const rows = Math.ceil(files.length / cols);
  const W = padX * 2 + cols * tw + (cols - 1) * gap;
  const H = padTop + rows * (th + labH + gap) + 64;
  const rel = (f) => 'file://' + f;
  const cells = files.map((f, i) => `<figure><img src="${rel(f)}"><figcaption><b>${String(i + 1).padStart(2, '0')}</b>${labels[i]}</figcaption></figure>`).join('');
  const html = `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="file://${R.ROOT}/09-Design-System/css/siraj.css"><style>
    body{margin:0;background:#EFE7E0;width:${W}px;height:${H}px;font-family:Jost,sans-serif}
    header{padding:64px ${padX}px 0;display:flex;justify-content:space-between;align-items:flex-end}
    h1{font-weight:300;font-size:40px;margin:12px 0 0;color:#140E10}
    .eb{font-size:13px;font-weight:500;letter-spacing:.16em;text-transform:uppercase;color:#602733}
    .grid{position:absolute;top:${padTop}px;left:${padX}px;display:grid;grid-template-columns:repeat(${cols},${tw}px);gap:${gap}px}
    figure{margin:0} img{width:${tw}px;height:${th}px;display:block;outline:1px solid rgba(170,145,128,.5)}
    figcaption{height:${labH}px;display:flex;align-items:center;gap:12px;font-size:13px;font-weight:500;letter-spacing:.12em;text-transform:uppercase;color:#6B625E}
    figcaption b{color:#602733;font-weight:500}
  </style></head><body><header><div><div class="eb">SIRAJ presentation system ${V} · ${deck.lang === 'AR' ? 'Arabic' : 'English'}</div><h1>Noor Residences · Investor presentation</h1></div><div class="eb">${files.length} slides · 1920 × 1080</div></header><div class="grid">${cells}</div></body></html>`;
  const out = path.join(BASE, 'Exports', `SIRAJ_Presentation_Noor-Residences_${deck.lang}_Contact-Sheet_${V}.png`);
  await R.png({ html, out, width: W, height: H });
  console.log('  sheet ' + path.relative(R.ROOT, out));
}

(async () => {
  try {
    for (const deck of DECKS) {
      if (args.lang && args.lang !== deck.lang) continue;
      if (!fs.existsSync(deck.file)) { console.warn('  (missing) ' + deck.file); continue; }
      console.log('Deck ' + deck.lang);
      const { files, labels } = await exportDeck(deck);
      if (!args.preview && !args.slides) await contactSheet(deck, files, labels);
    }
  } finally {
    await R.close();
  }
})();
