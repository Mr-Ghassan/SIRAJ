// SIRAJ website — Motion System v1.0 on the web. Uses the official classes and tokens only
// (.m-<level> durations/easings, .m-enter = SETTLE, .m-reveal = REVEAL from the start side, .m-line = line rise).
// Elements already in view on load animate immediately (the hero); the rest settle as they enter the viewport.
// prefers-reduced-motion: the tokens collapse to a 120 ms opacity change; nothing moves, nothing stays hidden.
export function initMotion() {
  const root = document.documentElement;
  root.classList.add('sj-js');
  const els = Array.from(document.querySelectorAll<HTMLElement>('[data-sj-motion]'));
  if (!els.length) return;
  const stillQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  // Reduced motion (or no IntersectionObserver): show everything at once; the tokens reduce it to a 120 ms fade.
  if (stillQuery.matches || !('IntersectionObserver' in window)) { els.forEach((el) => el.classList.add('is-in')); return; }
  // A REVEAL element starts fully masked (clip-path), and a masked element never reports an intersection,
  // so reveals are observed through their parent box.
  const targets = new Map<Element, HTMLElement[]>();
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      (targets.get(en.target) ?? []).forEach((el) => el.classList.add('is-in'));
      io.unobserve(en.target);
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });
  els.forEach((el) => {
    const watch = el.classList.contains('m-reveal') && el.parentElement ? el.parentElement : el;
    const r = watch.getBoundingClientRect();
    if (r.top < window.innerHeight * 0.95) { requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('is-in'))); return; }
    targets.set(watch, [...(targets.get(watch) ?? []), el]);
    io.observe(watch);
  });
  // If a visitor switches reduced motion on mid-visit, reveal everything at once.
  stillQuery.addEventListener?.('change', (q) => { if (q.matches) els.forEach((el) => el.classList.add('is-in')); });
}
