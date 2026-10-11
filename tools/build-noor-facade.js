// Noor · official façade posts (Instagram post 4:5 and story 9:16, Arabic and English).
// Usage: node tools/build-noor-facade.js   (run tools/noor-facade-prep.py first)
const path = require('path');
const R = require('./lib/render');
const SRC = path.join(R.ROOT, '14-Property-Marketing/10-Noor-Facade/Source/noor-facade-post.html');
const OUT = path.join(R.ROOT, '14-Property-Marketing/10-Noor-Facade');
const JOBS = [['post', 1080, 1350, 'Post'], ['story', 1080, 1920, 'Story']];
(async () => {
  for (const [fmt, w, h, name] of JOBS) for (const lang of ['ar', 'en']) {
    const { page, cleanup } = await R.openPage({ file: SRC, width: w, height: h, scale: 2 });
    await page.goto('file://' + SRC + `?fmt=${fmt}&lang=${lang}`, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForFunction(() => window.ready === true);
    await page.waitForTimeout(300);
    const out = path.join(OUT, `SIRAJ_Noor_Facade_${name}_${lang.toUpperCase()}_v1.0.png`);
    await page.locator('#art').screenshot({ path: out });
    await cleanup();
    console.log('  ✓', path.relative(R.ROOT, out));
  }
  await R.close();
})();
