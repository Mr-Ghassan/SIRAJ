// Render the SIRAJ Silk CG reference stills from engine presets.
// Since v1.0 (2026-10-11) the official stills in 06-SIRAJ-Silk/Stills are PHOTOGRAPHS of real silk
// (tools/silk-photo-import.py). This tool therefore writes only to the CG reference archive,
// 99-Archive/Silk-CG-v1.0, and never overwrites the photographic library.
const fs = require('fs'); const path = require('path'); const { execFileSync } = require('child_process');
const { still } = require('./silk-still'); const R = require('./lib/render');
const OUT = path.join(R.ROOT, '99-Archive/Silk-CG-v1.0');
const FORMATS = { '16x9': [3840, 2160], '9x16': [2160, 3840], '1x1': [2160, 2160], '4x5': [2160, 2700] };
const OPAQUE = ['drape-lumen', 'drape-deep', 'drape-fall', 'ribbon-sweep', 'ribbon-ivory', 'ribbon-pair', 'horizon-ivory', 'horizon-deep', 'fold-corner-ivory', 'gateway', 'wrap'];
const ALPHA = ['ribbon-sweep-alpha', 'ribbon-ivory-alpha', 'horizon-alpha', 'fold-corner-alpha', 'gateway-alpha', 'wrap-alpha'];
const T = 1.5; // canonical still time
const name = (p) => p.split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join('-');
(async () => {
  const only = process.argv[2];
  for (const p of OPAQUE) {
    if (only && p !== only) continue;
    for (const [f, [w, h]] of Object.entries(FORMATS)) {
      fs.mkdirSync(path.join(OUT, name(p)), { recursive: true });
      const base = path.join(OUT, name(p), `SIRAJ_Silk_${name(p)}_${f}_v1.0`);
      const png = base + '.tmp.png';
      await still(p, w, h, T, png, 1);
      execFileSync('convert', [png, '-quality', '92', '-sampling-factor', '4:4:4', base + '.jpg']);
      execFileSync('convert', [png, '-resize', '50%', '-quality', '86', base.replace(/_v1\.0$/, '_web_v1.0') + '.webp']);
      fs.rmSync(png);
    }
    console.log('✓', p);
  }
  for (const p of ALPHA) {
    if (only && p !== only) continue;
    fs.mkdirSync(path.join(OUT, 'Alpha'), { recursive: true });
    for (const f of ['16x9', '9x16']) {
      const [w, h] = FORMATS[f];
      await still(p, w, h, T, path.join(OUT, 'Alpha', `SIRAJ_Silk_${name(p)}_${f}_v1.0.png`), 1);
    }
    console.log('✓', p);
  }
  await R.close();
})();
