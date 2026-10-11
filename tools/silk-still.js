// node tools/silk-still.js <preset> <w> <h> <t> <out.png> [ss]
const R = require('./lib/render'); const path = require('path'); const { execFileSync } = require('child_process');
async function still(preset, w, h, t, out, ss = 1) {
  const { page, cleanup } = await R.openPage({ file: path.join(R.ROOT, '06-SIRAJ-Silk/engine/stage.html'), width: w * ss, height: h * ss, transparent: true });
  page.on('console', (m) => console.log('[page]', m.text()));
  page.on('pageerror', (e) => console.log('[err]', e.message));
  await page.evaluate(([p, w, h, t]) => window.stage(p, w, h, t), [preset, w * ss, h * ss, t]);
  R.ensureDir(out);
  const tmp = ss > 1 ? out.replace(/\.png$/, '.ss.png') : out;
  await page.locator('#c').screenshot({ path: tmp, omitBackground: true });
  await cleanup();
  if (ss > 1) { execFileSync('convert', [tmp, '-filter', 'Lanczos', '-resize', `${w}x${h}!`, out]); require('fs').rmSync(tmp); }
  return out;
}
module.exports = { still };
if (require.main === module) { const [p, w, h, t, out, ss] = process.argv.slice(2); still(p, +w, +h, +t, out, +(ss || 1)).then(() => R.close()); }
