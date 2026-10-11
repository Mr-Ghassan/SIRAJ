// SIRAJ deterministic motion renderer: drives a composition page frame-by-frame (window.seek(t)) and pipes
// PNG frames into ffmpeg. Outputs H.264 MP4 (opaque) and, for alpha comps, VP9 WebM + ProRes 4444 MOV.
//
//   node tools/render-motion.js <composition.html> --w 1920 --h 1080 --fps 30 --dur 6 --out path/base [--alpha] [--q key=val&...] [--poster 5.5]
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const R = require('./lib/render');

function ff(args) {
  const p = spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...args], { stdio: ['pipe', 'inherit', 'inherit'] });
  const done = new Promise((res, rej) => p.on('close', (c) => (c === 0 ? res() : rej(new Error('ffmpeg exit ' + c)))));
  return { p, done };
}

async function renderMotion({ comp, w, h, fps = 30, dur, out, alpha = false, query = '', poster = null, mp4 = true }) {
  fs.mkdirSync(path.dirname(out), { recursive: true });
  const b = await R.browser();
  const page = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  page.on('pageerror', (e) => console.error('[page error]', e.message));
  page.on('console', (m) => { if (m.type() === 'error') console.error('[console]', m.text()); });
  await page.goto('file://' + path.resolve(comp) + (query ? '?' + query : ''), { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(async () => { if (window.ready) await window.ready; });
  const encoders = [];
  const inArgs = ['-f', 'image2pipe', '-framerate', String(fps), '-i', '-'];
  if (mp4) encoders.push(ff([...inArgs, '-c:v', 'libx264', '-preset', 'slow', '-crf', '15', '-pix_fmt', 'yuv420p', '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-movflags', '+faststart', out + '.mp4']));
  if (alpha) {
    encoders.push(ff([...inArgs, '-c:v', 'libvpx-vp9', '-pix_fmt', 'yuva420p', '-b:v', '0', '-crf', '20', '-row-mt', '1', '-auto-alt-ref', '0', out + '_alpha.webm']));
    encoders.push(ff([...inArgs, '-c:v', 'prores_ks', '-profile:v', '4444', '-pix_fmt', 'yuva444p10le', '-vendor', 'apl0', out + '_alpha.mov']));
  }
  const n = Math.round(dur * fps);
  for (let i = 0; i < n; i++) {
    const t = i / fps;
    await page.evaluate((tt) => window.seek(tt), t);
    const buf = await page.screenshot({ type: 'png', omitBackground: alpha });
    for (const e of encoders) if (!e.p.stdin.write(buf)) await new Promise((r) => e.p.stdin.once('drain', r));
    if (poster !== null && Math.abs(t - poster) < 0.5 / fps) fs.writeFileSync(out + '_poster.png', buf);
  }
  encoders.forEach((e) => e.p.stdin.end());
  await Promise.all(encoders.map((e) => e.done));
  await page.close();
  return out;
}

module.exports = { renderMotion };

if (require.main === module) {
  const a = process.argv.slice(2);
  const get = (k, d) => { const i = a.indexOf('--' + k); return i >= 0 ? a[i + 1] : d; };
  renderMotion({ comp: a[0], w: +get('w', 1920), h: +get('h', 1080), fps: +get('fps', 30), dur: +get('dur', 6), out: get('out'), alpha: a.includes('--alpha'), query: get('q', ''), poster: get('poster') ? +get('poster') : null })
    .then(() => R.close()).then(() => console.log('rendered', get('out'))).catch((e) => { console.error(e); process.exit(1); });
}
