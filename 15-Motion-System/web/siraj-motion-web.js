/*! SIRAJ Motion v1.0 — web helper. Adds .is-in to [data-sj] elements entering the viewport, sets stagger
    indices for children of [data-sj-stagger], and drives [data-sj="parallax"] via --sj-parallax. No dependencies. */
(function () {
  'use strict';
  if (typeof window === 'undefined') return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('[data-sj-stagger]').forEach((group) => {
    [...group.children].forEach((c, i) => c.style.setProperty('--sj-i', i));
  });
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.15 });
  document.querySelectorAll('[data-sj]:not([data-sj="parallax"]), .sj-line').forEach((el) => (reduce ? el.classList.add('is-in') : io.observe(el)));
  if (reduce) return;
  const par = [...document.querySelectorAll('[data-sj="parallax"]')];
  if (!par.length) return;
  let ticking = false;
  const update = () => {
    par.forEach((el) => { const r = el.getBoundingClientRect(); const k = (innerHeight - r.top) / (innerHeight + r.height); el.style.setProperty('--sj-parallax', Math.min(Math.max(k, 0), 1).toFixed(4)); });
    ticking = false;
  };
  addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(update); ticking = true; } }, { passive: true });
  update();
})();
