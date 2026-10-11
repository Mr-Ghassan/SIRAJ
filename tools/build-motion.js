// Render SIRAJ motion deliverables. Usage: node tools/build-motion.js [group]   (groups: intro, outro, transitions, components)
const { renderMotion } = require('./render-motion');
const R = require('./lib/render');
const JOBS = {
  intro: [
    { comp: '16-Intro/source/siraj-intro.html', w: 1920, h: 1080, dur: 6, q: 'fmt=16x9', out: '16-Intro/Exports/SIRAJ_Intro_16x9_1920x1080_v1.0', poster: 5.9 },
    { comp: '16-Intro/source/siraj-intro.html', w: 1080, h: 1920, dur: 6, q: 'fmt=9x16', out: '16-Intro/Exports/SIRAJ_Intro_9x16_1080x1920_v1.0', poster: 5.9 },
    { comp: '16-Intro/source/siraj-intro.html', w: 1080, h: 1080, dur: 6, q: 'fmt=1x1', out: '16-Intro/Exports/SIRAJ_Intro_1x1_1080x1080_v1.0', poster: 5.9 },
    { comp: '16-Intro/source/siraj-intro.html', w: 1920, h: 1080, dur: 6, q: 'fmt=16x9&alpha=1', out: '16-Intro/Exports/SIRAJ_Intro_16x9_1920x1080_Transparent_v1.0', alpha: true, mp4: false },
    { comp: '16-Intro/source/siraj-intro.html', w: 1920, h: 1080, dur: 6.5, q: 'fmt=16x9&lockup=1', out: '16-Intro/Exports/SIRAJ_Intro_16x9_1920x1080_Bilingual-Lockup_v1.0', poster: 6.4 },
  ],
  transitions: ['sweep', 'fold', 'ribbon', 'arch', 'curtain'].map((ty, i) => ({ comp: '15-Motion-System/transitions/siraj-transitions.html', w: 1920, h: 1080, dur: 2.6, q: `type=${ty}&a=${['SIRAJ_Photo_Residential-Tower-Golden-Hour_v1.0.jpg', 'SIRAJ_Photo_Mixed-Use-Plaza-Evening_v1.0.jpg', 'SIRAJ_Photo_Apartment-Interior-Sea-View_v1.0.jpg', 'SIRAJ_Photo_Aerial-Coastal-Community_v1.0.jpg', 'SIRAJ_Photo_Sales-Centre-Interior_v1.0.jpg'][i]}&b=${['SIRAJ_Photo_Villa-Community-Dusk_v1.0.jpg', 'SIRAJ_Photo_Campaign-Silk-Reveal_v1.0.jpg', 'SIRAJ_Photo_Residential-Tower-Golden-Hour_v1.0.jpg', 'SIRAJ_Photo_Construction-Site-Dawn_v1.0.jpg', 'SIRAJ_Photo_Campaign-Silk-Foundation_v1.0.jpg'][i]}`, out: `15-Motion-System/Exports/Transitions/SIRAJ_Transition_${{ sweep: 'Silk-Sweep', fold: 'Silk-Fold', ribbon: 'Ribbon-Pass', arch: 'Architectural-Reveal', curtain: 'Curtain-Reveal' }[ty]}_16x9_v1.0`, poster: 1.1 })),
  components: [
    ...['title', 'subtitle', 'lower-third', 'name-plate', 'statistics', 'numbers', 'project-card', 'property-details', 'map', 'floor-plan', 'progress', 'chart', 'quote', 'image-reveal', 'cta'].map((c) => ({ comp: '15-Motion-System/components/siraj-motion-components.html', w: 1920, h: 1080, dur: 4.5, q: `c=${c}`, out: `15-Motion-System/Exports/Components/SIRAJ_Motion_${c.split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join('-')}_EN_v1.0`, poster: 4.0 })),
    ...['title', 'lower-third', 'statistics', 'map'].map((c) => ({ comp: '15-Motion-System/components/siraj-motion-components.html', w: 1920, h: 1080, dur: 4.5, q: `c=${c}&lang=ar`, out: `15-Motion-System/Exports/Components/SIRAJ_Motion_${c.split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join('-')}_AR_v1.0`, poster: 4.0 })),
  ],
  outro: [
    ...['logo', 'url', 'contact', 'cta', 'project'].map((v) => ({ comp: '17-Outro/source/siraj-outro.html', w: 1920, h: 1080, dur: 5, q: `fmt=16x9&v=${v}`, out: `17-Outro/Exports/SIRAJ_Outro_${v[0].toUpperCase() + v.slice(1)}_16x9_v1.0`, poster: 4.9 })),
    { comp: '17-Outro/source/siraj-outro.html', w: 1920, h: 1080, dur: 5, q: 'fmt=16x9&v=url&theme=light', out: '17-Outro/Exports/SIRAJ_Outro_Url_16x9_Light_v1.0', poster: 4.9 },
    { comp: '17-Outro/source/siraj-outro.html', w: 1080, h: 1920, dur: 5, q: 'fmt=9x16&v=social', out: '17-Outro/Exports/SIRAJ_Outro_Social_9x16_v1.0', poster: 4.9 },
    { comp: '17-Outro/source/siraj-outro.html', w: 1080, h: 1920, dur: 5, q: 'fmt=9x16&v=cta', out: '17-Outro/Exports/SIRAJ_Outro_Cta_9x16_v1.0', poster: 4.9 },
    { comp: '17-Outro/source/siraj-outro.html', w: 1080, h: 1080, dur: 5, q: 'fmt=1x1&v=url', out: '17-Outro/Exports/SIRAJ_Outro_Url_1x1_v1.0', poster: 4.9 },
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
