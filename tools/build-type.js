// Render the SIRAJ typography specimen to PDF + per-page PNG.
const path = require('path'); const R = require('./lib/render');
(async () => {
  const file = path.join(R.ROOT, '03-Typography/specimen/siraj-type-specimen.html');
  await R.pdf({ file, out: path.join(R.ROOT, '03-Typography/specimen/SIRAJ_Typography-Specimen_v1.0.pdf'), width: '1920px', height: '1080px', wait: 300 });
  const { page, cleanup } = await R.openPage({ file, width: 1920, height: 1080 });
  const n = await page.locator('section.page').count();
  for (let i = 0; i < n; i++) await page.locator('section.page').nth(i).screenshot({ path: path.join(R.ROOT, `03-Typography/specimen/SIRAJ_Typography-Specimen_p${String(i + 1).padStart(2, '0')}_v1.0.png`) });
  await cleanup(); await R.close(); console.log('type specimen pages:', n);
})();
