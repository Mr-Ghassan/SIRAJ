// SIRAJ website — prepare static assets from the frozen Brand System v1.0 (run before dev/build).
// Copies only official files into public/ (generated, git-ignored) and renders Open Graph images with sharp.
// Fonts come from @fontsource (WOFF2 subsets of the official Tajawal and Jost), never from re-drawn sources.
import { mkdir, copyFile, writeFile, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const WEB = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ROOT = path.resolve(WEB, '..');
const PUB = path.join(WEB, 'public');
const r = (...p) => path.join(ROOT, ...p);
const out = (...p) => path.join(PUB, ...p);

async function cp(src, dst) {
  if (!existsSync(src)) throw new Error(`missing official asset: ${path.relative(ROOT, src)}`);
  await mkdir(path.dirname(dst), { recursive: true });
  await copyFile(src, dst);
}

// 1 · Fonts — Tajawal (Arabic subset) + Jost (Latin; also the source of «SIRAJ Digits»)
const FS = path.join(WEB, 'node_modules', '@fontsource');
for (const w of [300, 400, 500, 700, 800]) await cp(path.join(FS, 'tajawal', 'files', `tajawal-arabic-${w}-normal.woff2`), out('fonts', `tajawal-arabic-${w}.woff2`));
for (const w of [200, 300, 400, 500]) await cp(path.join(FS, 'jost', 'files', `jost-latin-${w}-normal.woff2`), out('fonts', `jost-latin-${w}.woff2`));

// 2 · Official logo files (never redrawn)
for (const v of ['Primary', 'Sand', 'White', 'Deep']) await cp(r('01-Logos', 'SVG', `SIRAJ_Logo_${v}_v1.0.svg`), out('brand', 'logo', `SIRAJ_Logo_${v}_v1.0.svg`));

// 3 · Favicons + web manifest (official favicon set)
const FAV = r('01-Logos', 'PNG', 'Favicon');
await cp(path.join(FAV, 'SIRAJ_Favicon.svg'), out('favicon.svg'));
await cp(path.join(FAV, 'SIRAJ_Favicon_32px.png'), out('favicon-32.png'));
await cp(path.join(FAV, 'SIRAJ_Favicon_180px.png'), out('apple-touch-icon.png'));
await cp(path.join(FAV, 'SIRAJ_Favicon_192px.png'), out('icons', 'icon-192.png'));
await cp(path.join(FAV, 'SIRAJ_Favicon_512px.png'), out('icons', 'icon-512.png'));
await writeFile(out('site.webmanifest'), JSON.stringify({
  name: 'SIRAJ', short_name: 'SIRAJ', lang: 'ar', dir: 'rtl', start_url: '/', display: 'browser',
  background_color: '#F7F2ED', theme_color: '#2C0F12',
  icons: [{ src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' }, { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' }],
}, null, 2));

// 4 · Email-signature images: stable, versioned, immutable paths on the company domain (see docs/digital/email-signature.md)
for (const f of ['SIRAJ_Email-Logo_v1.0.png', 'SIRAJ_Email-Instagram_v1.0.png']) await cp(r('19-Templates', 'email-signature', 'assets', f), out('brand', 'email', 'v1', f));

// 5 · Open Graph images (1200×630): official imagery + official Sand logo, bottom-right (Arabic layouts)
const OG = [
  // [name, source, vertical focal point 0 (top) … 1 (bottom)]
  ['home', r('14-Property-Marketing', '12-Project-Siraj', 'Source', 'KeyVisuals', 'SIRAJ_Project-Siraj_KV_Lantern_4x5_v1.0.jpg'), 0.42],
  ['about', r('06-SIRAJ-Silk', 'Stills', 'Drape-Lumen', 'SIRAJ_Silk_Drape-Lumen_16x9_v1.0.jpg'), 0.5],
  ['project', r('14-Property-Marketing', '12-Project-Siraj', 'Source', 'Clean', 'SIRAJ_Project-Siraj_Corner_Blue-Hour_Clean_v1.0.jpg'), 0.36],
  ['contact', r('06-SIRAJ-Silk', 'Stills', 'Horizon-Deep', 'SIRAJ_Silk_Horizon-Deep_16x9_v1.0.jpg'), 0.5],
];
const logoSvg = await readFile(r('01-Logos', 'SVG', 'SIRAJ_Logo_Sand_v1.0.svg'));
const logo = await sharp(logoSvg, { density: 600 }).resize({ width: 260 }).png().toBuffer();
const shade = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0.45" stop-color="#170608" stop-opacity="0"/><stop offset="1" stop-color="#170608" stop-opacity="0.78"/></linearGradient></defs><rect width="1200" height="630" fill="url(#g)"/></svg>`);
await mkdir(out('og'), { recursive: true });
for (const [name, src, fy] of OG) {
  const scaled = await sharp(src).resize({ width: 1200 }).toBuffer();
  const { height } = await sharp(scaled).metadata();
  const top = Math.round(Math.max(0, Math.min(height - 630, fy * height - 315)));
  const base = await sharp(scaled).extract({ left: 0, top, width: 1200, height: 630 }).toBuffer();
  const meta = await sharp(logo).metadata();
  await sharp(base).composite([{ input: shade }, { input: logo, left: 1200 - 64 - meta.width, top: 630 - 56 - meta.height }])
    .jpeg({ quality: 84, mozjpeg: true }).toFile(out('og', `SIRAJ_OG_${name}_v1.0.jpg`));
}
console.log('prepare-assets: fonts, logos, favicons, email-signature images and 4 Open Graph images ready');
