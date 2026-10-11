/*!
 * SIRAJ MOTION v1.0 — deterministic motion primitives.
 * Every function is pure in time: give it t (seconds) and it returns the same value every time,
 * so the same code drives the web, the frame renderer (MP4/WebM) and any future player.
 * Mirrors the motion tokens in 09-Design-System/tokens/siraj.tokens.json.
 */
(function (g) {
  'use strict';

  // ---- cubic-bezier solver (same maths as CSS) ------------------------------
  function bezier(x1, y1, x2, y2) {
    const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
    const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
    const sx = (t) => ((ax * t + bx) * t + cx) * t;
    const sy = (t) => ((ay * t + by) * t + cy) * t;
    const dx = (t) => (3 * ax * t + 2 * bx) * t + cx;
    return (x) => {
      if (x <= 0) return 0; if (x >= 1) return 1;
      let t = x;
      for (let i = 0; i < 8; i++) { const e = sx(t) - x; const d = dx(t); if (Math.abs(e) < 1e-6) break; if (Math.abs(d) < 1e-6) break; t -= e / d; }
      let lo = 0, hi = 1;
      if (Math.abs(sx(t) - x) > 1e-5) { t = x; while (hi - lo > 1e-6) { if (sx(t) < x) lo = t; else hi = t; t = (lo + hi) / 2; } }
      return sy(t);
    };
  }

  const EASE = {
    flow: bezier(0.45, 0.05, 0.15, 1),
    drape: bezier(0.16, 1, 0.3, 1),
    glide: bezier(0.65, 0, 0.35, 1),
    fold: bezier(0.7, 0, 0.2, 1),
    reveal: bezier(0.77, 0, 0.18, 1),
    release: bezier(0.5, 0, 0.75, 0.25),
    micro: bezier(0.2, 0, 0, 1),
    linear: (x) => x,
  };

  const DUR = { micro: 0.12, fast: 0.2, standard: 0.36, emphasis: 0.64, cinematic: 1.2, hero: 2.4 };
  const STAGGER = { tight: 0.04, standard: 0.08, relaxed: 0.14 };

  // Critically/over-damped spring evaluated analytically (no overshoot for ζ ≥ 1).
  function spring(t, { stiffness = 90, damping = 19, mass = 1 } = {}) {
    if (t <= 0) return 0;
    const w0 = Math.sqrt(stiffness / mass), z = damping / (2 * Math.sqrt(stiffness * mass));
    if (z >= 1) {
      if (Math.abs(z - 1) < 1e-3) return 1 - (1 + w0 * t) * Math.exp(-w0 * t);
      const r1 = -w0 * (z - Math.sqrt(z * z - 1)), r2 = -w0 * (z + Math.sqrt(z * z - 1));
      const c2 = r1 / (r1 - r2), c1 = 1 - c2;
      return 1 - (c1 * Math.exp(r1 * t) + c2 * Math.exp(r2 * t));
    }
    const wd = w0 * Math.sqrt(1 - z * z);
    return 1 - Math.exp(-z * w0 * t) * (Math.cos(wd * t) + (z * w0 / wd) * Math.sin(wd * t));
  }
  const SPRING = { drape: { stiffness: 90, damping: 19, mass: 1 }, settle: { stiffness: 140, damping: 28, mass: 1 }, silk: { stiffness: 38, damping: 11, mass: 1 } };

  const clamp = (x, a = 0, b = 1) => Math.min(Math.max(x, a), b);
  const lerp = (a, b, k) => a + (b - a) * k;
  // progress of a segment [start, start+dur] with easing
  const seg = (t, start, dur, ease = EASE.flow) => (typeof ease === 'string' ? EASE[ease] : ease)(clamp((t - start) / dur));
  // in-hold-out envelope
  const inOut = (t, a, b, c, d, ein = EASE.flow, eout = EASE.release) => (t < b ? seg(t, a, b - a, ein) : 1 - seg(t, c, d - c, eout));

  // Standard SIRAJ entrance: rise + fade + unblur, settling with DRAPE.
  function enter(t, start, { dur = DUR.emphasis, distance = 24, ease = EASE.drape } = {}) {
    const k = seg(t, start, dur, ease);
    return { opacity: clamp(seg(t, start, dur * 0.7, EASE.flow)), y: (1 - k) * distance, blur: (1 - k) * 6, k };
  }
  function exit(t, start, { dur = DUR.standard, distance = 12 } = {}) {
    const k = seg(t, start, dur, EASE.release);
    return { opacity: 1 - k, y: -k * distance, blur: k * 4, k };
  }
  const css = (s) => `opacity:${s.opacity.toFixed(4)};transform:translate3d(0,${s.y.toFixed(2)}px,0);filter:blur(${Math.max(0, s.blur).toFixed(2)}px)`;

  // Number counter with lining figures: Western digits, thousands separator.
  function count(t, start, dur, to, { decimals = 0, from = 0 } = {}) {
    const v = lerp(from, to, seg(t, start, dur, EASE.flow));
    return v.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  }

  g.SirajMotion = { bezier, EASE, DUR, STAGGER, spring, SPRING, clamp, lerp, seg, inOut, enter, exit, css, count, version: '1.0.0' };
})(typeof window !== 'undefined' ? window : globalThis);
