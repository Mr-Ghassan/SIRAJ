/* SIRAJ Footage — frame-accurate playback of real silk footage inside deterministic compositions.
 *
 * Since 2026-10-11 the moving silk in the intro, outro and transitions is REAL silk footage
 * (06-SIRAJ-Silk/Footage: a silk ribbon filmed on a chroma-key screen, keyed to VP9 + alpha).
 * Compositions are rendered frame by frame through window.seek(t) (tools/render-motion.js), so a
 * <video> cannot simply play: this helper seeks it to an exact time and resolves once that frame is
 * decoded and painted.
 *
 *   const rib = SirajFootage.ribbon(document.getElementById('rib'), { fmt: '16x9' });
 *   window.seek = async (t) => { await rib.at(clipTime); ... };
 */
(function (root) {
  const DIR = (document.currentScript && document.currentScript.src.replace(/15-Motion-System\/lib\/siraj-footage\.js.*$/, '')) || '../../';
  const FOOTAGE = DIR + '06-SIRAJ-Silk/Footage/';

  function Footage(video, src) {
    video.muted = true; video.playsInline = true; video.preload = 'auto';
    if (src) video.src = src;
    const ready = new Promise((res, rej) => {
      if (video.readyState >= 2) return res();
      video.addEventListener('loadeddata', () => res(), { once: true });
      video.addEventListener('error', () => rej(new Error('footage failed to load: ' + video.src)), { once: true });
    });
    let last = -1;
    return {
      video, ready,
      get duration() { return video.duration || 0; },
      /* Show the frame at time s (seconds, clamped to the clip). Resolves when it is on screen. */
      async at(s) {
        await ready;
        const d = video.duration || 0;
        const tt = Math.max(0, Math.min(d - 0.001, s));
        if (Math.abs(tt - last) < 1e-4) return;
        last = tt;
        await new Promise((res) => {
          const timer = setTimeout(res, 4000);                       // never stall a render on a lost event
          video.addEventListener('seeked', () => requestAnimationFrame(() => requestAnimationFrame(() => { clearTimeout(timer); res(); })), { once: true });
          video.currentTime = tt;
        });
      },
    };
  }

  /* The official real-silk ribbon pass (enters lower start, leaves upper end). 1x1 crops the 16x9 clip. */
  Footage.ribbon = (video, { fmt = '16x9' } = {}) =>
    Footage(video, FOOTAGE + `SIRAJ_Silk_Ribbon-Pass_${fmt === '9x16' ? '9x16' : '16x9'}_v1.0_alpha.webm`);
  Footage.DIR = FOOTAGE;
  /* Seconds of footage in which the ribbon crosses the frame: [enters, has left] (measured on the keyed clips). */
  Footage.PASS = { '16x9': [0.0, 7.5], '9x16': [0.0, 6.25], '1x1': [0.0, 7.5] };

  root.SirajFootage = Footage;
})(window);
