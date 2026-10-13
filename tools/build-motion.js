// Render SIRAJ motion deliverables. Usage: node tools/build-motion.js [group]   (groups: intro, outro, transitions, components)
const { renderMotion } = require('./render-motion');
const R = require('./lib/render');
const TOK = require('../motion-system/tokens/siraj-motion.tokens.json');
const FMTS = [['16x9', 1920, 1080], ['9x16', 1080, 1920]];
const cap = (k) => k.split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join('-');
const JOBS = {
  intro: [
    { comp: '16-Intro/source/siraj-intro.html', w: 1920, h: 1080, dur: 6, q: 'fmt=16x9', out: '16-Intro/Exports/SIRAJ_Intro_16x9_1920x1080_v1.0', poster: 5.9 },
    { comp: '16-Intro/source/siraj-intro.html', w: 1080, h: 1920, dur: 6, q: 'fmt=9x16', out: '16-Intro/Exports/SIRAJ_Intro_9x16_1080x1920_v1.0', poster: 5.9 },
    { comp: '16-Intro/source/siraj-intro.html', w: 1920, h: 1080, dur: 6, q: 'fmt=16x9&alpha=1', out: '16-Intro/Exports/SIRAJ_Intro_16x9_1920x1080_Transparent_v1.0', alpha: true, mp4: false },
    // project intro (client rule 2026-10-13: a company version and a project version)
    { comp: '16-Intro/source/siraj-intro.html', w: 1920, h: 1080, dur: 6, q: 'fmt=16x9&v=project', out: '16-Intro/Exports/SIRAJ_Intro_Project_16x9_1920x1080_v1.0', poster: 5.9 },
    { comp: '16-Intro/source/siraj-intro.html', w: 1080, h: 1920, dur: 6, q: 'fmt=9x16&v=project', out: '16-Intro/Exports/SIRAJ_Intro_Project_9x16_1080x1920_v1.0', poster: 5.9 },
  ],
  // Signature transitions v1.0 (motion-system/tokens → transitions): real project plates, real silk, driven by air.
  transitions: Object.entries(TOK.transitions).flatMap(([ty, tr]) => FMTS.map(([f, w, h]) => ({ comp: '15-Motion-System/transitions/siraj-transitions.html', w, h, dur: 0.5 + tr.duration / 1000 + 0.8, q: `type=${ty}&fmt=${f}`, out: `15-Motion-System/Exports/Transitions/SIRAJ_Transition_${cap(ty)}_${f}_v1.0`, poster: 0.5 + tr.duration / 1000 * 0.5 }))),
  // Motion component library v1.0 — 16 components, Arabic only, 16:9 and 9:16 (timing from the motion tokens).
  components: Object.entries(TOK.components).flatMap(([c, tl]) => FMTS.map(([f, w, h]) => ({ comp: '15-Motion-System/components/siraj-motion-components.html', w, h, dur: tl.duration + 0.4, q: `c=${c}&fmt=${f}`, out: `15-Motion-System/Exports/Components/SIRAJ_Motion_${cap(c)}_${f}_AR_v1.0`, poster: tl.poster ?? tl.duration * 0.85 }))),
  // Outro v1.0 (client rules 2026-10-13): two formats only (16:9 and 9:16). Official = logo + phone + Instagram;
  // Project = «سراج» · مسقط · شقق سكنية ومحلات تجارية + contact. Logo-only alpha kept as an editing utility.
  outro: [
    { comp: '17-Outro/source/siraj-outro.html', w: 1920, h: 1080, dur: 5, q: 'fmt=16x9&v=official', out: '17-Outro/Exports/SIRAJ_Outro_Official_16x9_v1.0', poster: 4.9 },
    { comp: '17-Outro/source/siraj-outro.html', w: 1080, h: 1920, dur: 5, q: 'fmt=9x16&v=official', out: '17-Outro/Exports/SIRAJ_Outro_Official_9x16_v1.0', poster: 4.9 },
    { comp: '17-Outro/source/siraj-outro.html', w: 1920, h: 1080, dur: 5, q: 'fmt=16x9&v=project', out: '17-Outro/Exports/SIRAJ_Outro_Project_16x9_v1.0', poster: 4.9 },
    { comp: '17-Outro/source/siraj-outro.html', w: 1080, h: 1920, dur: 5, q: 'fmt=9x16&v=project', out: '17-Outro/Exports/SIRAJ_Outro_Project_9x16_v1.0', poster: 4.9 },
    { comp: '17-Outro/source/siraj-outro.html', w: 1920, h: 1080, dur: 5, q: 'fmt=16x9&v=logo&alpha=1', out: '17-Outro/Exports/SIRAJ_Outro_Logo_16x9_Transparent_v1.0', alpha: true, mp4: false },
  ],
};
if (require.main === module) (async () => {
  const groups = process.argv.slice(2);
  const only = process.env.ONLY;
  for (const g of groups.length ? groups : Object.keys(JOBS)) {
    for (const j of JOBS[g] || []) {
      if (only && !j.out.endsWith(only)) continue;
      const t0 = Date.now();
      await renderMotion({ comp: j.comp, w: j.w, h: j.h, fps: j.fps || 30, dur: j.dur, out: j.out, alpha: !!j.alpha, mp4: j.mp4 !== false, query: j.q, poster: j.poster ?? null });
      console.log('✓', j.out, ((Date.now() - t0) / 1000).toFixed(0) + 's');
    }
  }
  await R.close();
})();
module.exports = { JOBS };
