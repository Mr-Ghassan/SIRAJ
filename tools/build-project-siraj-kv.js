// Project Siraj · "Silk & Light" key-visual posts (post 4:5 and story 9:16, Arabic).
// Usage: node tools/build-project-siraj-kv.js [kv]   (kv = veil|ribbon|lantern|reveal|detail; default all)
const path = require('path');
const R = require('./lib/render');
const SRC = path.join(R.ROOT, '14-Property-Marketing/12-Project-Siraj/Source/project-siraj-kv-post.html');
const OUT = path.join(R.ROOT, '14-Property-Marketing/12-Project-Siraj/Key-Visuals');
const KVS = process.argv[2] ? [process.argv[2]] : ['veil', 'ribbon', 'lantern', 'reveal', 'detail'];
const NAME = { veil: 'Veil', ribbon: 'Ribbon', lantern: 'Lantern', reveal: 'Reveal', detail: 'Detail' };
require('fs').mkdirSync(OUT, { recursive: true });
(async () => {
  for (const kv of KVS) for (const [fmt, w, h, label] of [['post', 1080, 1350, 'Post'], ['story', 1080, 1920, 'Story']]) {
    const { page, cleanup } = await R.openPage({ file: SRC, width: w, height: h, scale: 2 });
    await page.goto('file://' + SRC + `?kv=${kv}&fmt=${fmt}`, { waitUntil: 'load' });
    await page.waitForFunction(() => window.ready === true);
    await page.waitForTimeout(300);
    const out = path.join(OUT, `SIRAJ_Project-Siraj_KV_${NAME[kv]}_${label}_AR_v1.0.png`);
    await page.locator('#art').screenshot({ path: out });
    await cleanup();
    console.log('  ✓', path.relative(R.ROOT, out));
  }
  await R.close();
})();
