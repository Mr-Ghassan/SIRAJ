/*!
 * SIRAJ Silk Motion Engine v1.0 — the reusable motion language of the components and transitions.
 *
 * Silk is ALWAYS real: filmed footage (06-SIRAJ-Silk/Footage, played frame-accurately by siraj-footage.js) or
 * photographs / cut-outs (06-SIRAJ-Silk/Stills). This engine only moves, masks and times those real assets; it
 * never draws silk. Light is allowed as light (a warm gradient), never as silk.
 *
 * Everything is a pure function of progress or time, so web previews, frame renders (MP4/WebM) and any player
 * produce identical frames. Geometry follows the frame diagonal (the footage travels along it) which, in Arabic
 * (rtl: true), runs from the lower-right (start) to the upper-left (end).
 *
 * Primitives
 *   axis(W, H, rtl)                    → frame-diagonal coordinate system: s(x,y) ∈ [0,1], 0 = lower start corner
 *   axisMask(el, k, o)                 → REVEAL (soft): show el where s < k, feathered edge (CSS mask-image)
 *   edgeClip(W, H, k, o) / maskReveal  → REVEAL (curved silk edge): clip-path along a gently curved edge
 *   silkEdge(img, W, H, k, o)          → a real photographed ribbon (Long-Ribbon-Alpha) riding a reveal edge
 *   lightSweep(el, k, env, o)          → LIGHT: a warm band of light travelling along the axis (screen blend)
 *   passTime(fmt, p) / track(fmt, c)   → SWEEP: time-map the real ribbon footage; read its measured position
 *   sweep(footage, p, o)               → SWEEP: seek the footage for progress p, return its trailing/leading edge
 *   wrap(cutout, mode, k, o)           → WRAP: ribbon footage behind / in front of the architecture via a cut-out
 *   fold(W, H, k, o)                   → FOLD: crease geometry (clip for A, flap strip for the silk photograph)
 *   settle(el, t, start, dur, from)    → SETTLE: image scale from → 1.00 with the drape curve
 *
 * AIR / WIND (client rule 2026-10-13 · motion-system/tokens/siraj-wind.json)
 *   Air is the force that moves everything soft. Nothing soft moves on a loop or a bare tween: it moves because a
 *   breeze passes through it. One prevailing direction per scene (right → left in Arabic), low-frequency air only,
 *   at most one gust per film, then SETTLE. The architecture never moves.
 *   air(t, o)                          → the air field at time t: { v (0..1 strength), gust (0..1), level }
 *   breathe(o, t)                      → edge options (phase, curve) for maskReveal / edgePoints so the silk edge
 *                                        ripples with a wave that travels across the cloth (windward → leeward)
 *   drift(el, t, o)                    → a still photograph of silk carried by the air (tiny drift + lean, no loop)
 *   sway(el, t, o)                     → trees, palms and plants: lean from the base, crown lags, settles
 */
(function (g) {
  'use strict';
  const M = g.SirajMotion;
  const DIR = (document.currentScript && document.currentScript.src.replace(/15-Motion-System\/lib\/siraj-silk-engine\.js.*$/, '')) || '../../';
  const STILLS = DIR + '06-SIRAJ-Silk/Stills/';
  const ASSET = {
    longRibbon: STILLS + 'Alpha/SIRAJ_Silk_Long-Ribbon-Alpha_3x1_v1.0.png',   // 3840×1280, ribbon centre at 48.4% of height
    horizon: (fmt) => STILLS + `Alpha/SIRAJ_Silk_Horizon-Alpha_${fmt === '9x16' ? '9x16' : '16x9'}_v1.0.png`,
    foldCorner: (fmt) => STILLS + `Fold-Corner-Ivory/SIRAJ_Silk_Fold-Corner-Ivory_${fmt === '9x16' ? '9x16' : '16x9'}_web_v1.0.webp`,
    drapeDeep: (fmt) => STILLS + `Drape-Deep/SIRAJ_Silk_Drape-Deep_${fmt === '9x16' ? '9x16' : '16x9'}_web_v1.0.webp`,
    drapeLumen: (fmt) => STILLS + `Drape-Lumen/SIRAJ_Silk_Drape-Lumen_${fmt === '9x16' ? '9x16' : '16x9'}_web_v1.0.webp`,
    drapeFall: (fmt) => STILLS + `Drape-Fall/SIRAJ_Silk_Drape-Fall_${fmt === '9x16' ? '9x16' : '16x9'}_web_v1.0.webp`,
  };

  // ---- axis ------------------------------------------------------------------------------------------
  // s(x,y) = ((x or W−x)·W + (H−y)·H) / (W²+H²). Lines of equal s are perpendicular to the frame diagonal.
  function axis(W, H, rtl = true) {
    const D = Math.hypot(W, H);
    const ux = (rtl ? -W : W) / D, uy = -H / D;           // travel direction (screen, y down): lower start → upper end
    const vx = -uy, vy = ux;                                // perpendicular (along the edge)
    const O = [rtl ? W : 0, H];                            // s = 0 corner
    const s = (x, y) => (((rtl ? W - x : x) * W) + (H - y) * H) / (D * D);
    const at = (k, tau = 0) => [O[0] + ux * k * D + vx * tau, O[1] + uy * k * D + vy * tau];
    const angle = rtl ? -Math.atan2(W, H) * 180 / Math.PI : Math.atan2(W, H) * 180 / Math.PI;   // CSS gradient angle
    return { W, H, D, ux, uy, vx, vy, O, s, at, angle, rtl };
  }

  // ---- REVEAL (soft): CSS mask along the axis ---------------------------------------------------------
  // Shows the element where s < k (the side the silk has already passed). feather in px. invert → s > k.
  function axisMask(el, k, { W, H, rtl = true, feather = 120, invert = false } = {}) {
    const a = axis(W, H, rtl);
    const c = k * a.D;
    const on = invert ? 'transparent' : '#000', off = invert ? '#000' : 'transparent';
    const m = `linear-gradient(${a.angle.toFixed(3)}deg, ${on} ${(c - feather).toFixed(1)}px, ${off} ${(c + feather).toFixed(1)}px)`;
    el.style.webkitMaskImage = m; el.style.maskImage = m;
  }
  const clearMask = (el) => { el.style.webkitMaskImage = ''; el.style.maskImage = ''; el.style.clipPath = ''; };

  // ---- REVEAL (curved silk edge): clip-path ------------------------------------------------------------
  // The edge is the iso-line s = k, bent by a gentle S (amplitude curve·D, one and a fifth waves) — the edge of a
  // falling cloth, never a hard straight wipe. Returns a CSS path() string for the revealed side (s < k).
  function edgePoints(W, H, k, { rtl = true, curve = 0.035, waves = 1.2, phase = 0.4 } = {}) {
    const a = axis(W, H, rtl), pts = [];
    for (let i = 0; i <= 32; i++) {
      const tau = (i / 32 * 2 - 1) * a.D;
      const b = curve * a.D * Math.sin(Math.PI * waves * (i / 32) + phase) * (1 - 0.35 * (i / 32));
      const [x, y] = a.at(k, tau);
      pts.push([x + a.ux * b, y + a.uy * b]);
    }
    return { a, pts };
  }
  function edgeClip(W, H, k, o = {}) {
    const { a, pts } = edgePoints(W, H, k, o);
    const back = (p) => [p[0] - a.ux * 3 * a.D, p[1] - a.uy * 3 * a.D];
    const all = pts.concat([back(pts[pts.length - 1]), back(pts[0])]);
    return `path('M${all.map((p) => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' L')} Z')`;
  }
  // p ∈ [0,1] → k from just before the start corner to just past the end corner.
  const kOf = (p, margin = 0.08) => -margin + p * (1 + 2 * margin);
  function maskReveal(el, p, o = {}) { el.style.clipPath = p >= 1 ? 'none' : edgeClip(o.W, o.H, kOf(p, o.margin), o); }

  // ---- real ribbon riding the edge (photograph) ----------------------------------------------------------
  // Places the Long-Ribbon-Alpha photograph so its centre line lies on the edge s = k across the whole frame and
  // glides along its own length (GLIDE). thickness = ribbon band height as a fraction of min(W,H).
  function silkEdge(img, W, H, k, { rtl = true, thickness = 0.16, glide = 0, opacity = 1 } = {}) {
    const a = axis(W, H, rtl);
    const len = a.D * 1.5;                              // longer than any chord, so the ends never show
    const scale = len / 3840;
    const h = 1280 * scale;
    const want = thickness * Math.min(W, H) / (378 * scale);      // band ≈ 378 px in the master
    // centre the photograph on the projection of the frame centre onto the edge
    const tau0 = (W / 2 - a.O[0]) * a.vx + (H / 2 - a.O[1]) * a.vy;
    const [cx, cy] = a.at(k, tau0 + glide * a.D);
    const ang = Math.atan2(a.vy, a.vx) * 180 / Math.PI;
    img.style.cssText = `position:absolute;left:0;top:0;width:${len.toFixed(1)}px;height:${h.toFixed(1)}px;transform-origin:50% 48.4%;` +
      `transform:translate(${(cx - len / 2).toFixed(1)}px,${(cy - h * 0.484).toFixed(1)}px) rotate(${ang.toFixed(3)}deg) scaleY(${want.toFixed(3)});` +
      `opacity:${opacity};pointer-events:none;filter:drop-shadow(0 ${(0.012 * H).toFixed(1)}px ${(0.03 * H).toFixed(1)}px rgba(23,6,8,.45))`;
  }

  // ---- LIGHT: a warm band of light (light, not silk) ------------------------------------------------------
  // el: a full-frame layer with mix-blend-mode: screen. k: band centre along the axis; env: 0..1 intensity.
  // Light is ivory-rose, never yellow or gold (client rule 2026-10-13).
  function lightSweep(el, k, env, { W, H, rtl = true, width = 0.2, color = '238,218,212', strength = 0.85, wash = 0.1 } = {}) {
    const a = axis(W, H, rtl), c = k * a.D, w = width * a.D, A = strength * env;
    const st = (o, f) => `rgba(${color},${(A * f).toFixed(4)}) ${(c + o * w).toFixed(1)}px`;
    el.style.background = `linear-gradient(${a.angle.toFixed(3)}deg, ${st(-1, 0)}, ${st(-0.55, 0.22)}, ${st(-0.18, 0.7)}, ${st(0, 1)}, ${st(0.18, 0.7)}, ${st(0.55, 0.22)}, ${st(1, 0)}), rgba(${color},${(wash * env).toFixed(4)})`;
  }

  // ---- SWEEP: the real ribbon footage -------------------------------------------------------------------
  const TR = () => g.SIRAJ_FOOTAGE_TRACK || {};
  const fmtKey = (fmt) => (fmt === '9x16' ? '9x16' : '16x9');
  // Measured edges of the ribbon at clip time c: [trailing sMin, leading sMax] (interpolated, null-safe).
  function track(fmt, c) {
    const T = TR()[fmtKey(fmt)]; if (!T) return [0, 0];
    const f = Math.max(0, Math.min(T.frames - 1, c * T.fps));
    const i = Math.floor(f), j = Math.min(T.frames - 1, i + 1), r = f - i;
    const A = T.s[i] || T.s[j] || [1, 1], B = T.s[j] || T.s[i] || [1, 1];
    return [M.lerp(A[0], B[0], r), M.lerp(A[1], B[1], r)];
  }
  // Phases of the pass, measured: head enters [0, hEnd], ribbon lies across [hEnd, tStart], tail leaves [tStart, end].
  function phases(fmt) {
    const T = TR()[fmtKey(fmt)];
    if (!T) return fmt === '9x16' ? [0, 3.0, 3.75, 6.25] : [0, 2.75, 5.0, 7.5];
    let maxS = 0; T.s.forEach((r) => { if (r && r[1] > maxS) maxS = r[1]; });
    let hEnd = 0, tStart = 0, end = 0;
    T.s.forEach((r, i) => { if (r && !hEnd && r[1] >= maxS - 0.004) hEnd = i / T.fps; if (r && r[0] <= T.s.find(Boolean)[0] + 0.004) tStart = i / T.fps; if (r) end = i / T.fps; });
    return [0, hEnd, tStart, end];
  }
  // Progress p ∈ [0,1] → clip time. The (nearly static) middle of the clip is compressed so the silk keeps moving.
  function passTime(fmt, p, { hold = 0.1 } = {}) {
    const [s, h, t, e] = phases(fmt);
    const head = h - s, tail = e - t, total = head + tail;
    const ph = (1 - hold) * head / total, pt = (1 - hold) * tail / total;
    if (p <= ph) return s + (p / ph) * head;
    if (p <= ph + hold) return h + ((p - ph) / hold) * (t - h);
    return t + Math.min(1, (p - ph - hold) / pt) * tail;
  }
  async function sweep(footage, p, { fmt = '16x9', hold = 0.1 } = {}) {
    const c = passTime(fmt, M.clamp(p), { hold });
    await footage.at(c);
    const [trail, lead] = track(fmt, c);
    return { clip: c, trail, lead, mid: (trail + lead) / 2 };
  }
  // Mirror the footage for RTL (layout silk mirrors with the text; footage of silk alone may be mirrored).
  function placeFootage(video, { rtl = true, scale = 1, origin = '50% 50%' } = {}) {
    video.style.transformOrigin = origin;
    video.style.transform = `${rtl ? 'scaleX(-1) ' : ''}scale(${scale})`;
  }

  // ---- WRAP ---------------------------------------------------------------------------------------------
  // Layer order: plate → ribbon footage → cut-out of the same building (identical size/position as the plate).
  //   'behind' : the cut-out covers the ribbon wherever the building is → the silk passes behind the architecture.
  //   'front'  : the cut-out is hidden → the silk passes in front.
  //   'split'  : behind where s > k, in front where s < k (feathered) → the silk wraps around the building.
  function wrap(cutout, mode = 'behind', k = 0.5, o = {}) {
    if (mode === 'front') { cutout.style.visibility = 'hidden'; return; }
    cutout.style.visibility = 'visible';
    if (mode === 'split') axisMask(cutout, k, { ...o, invert: true }); else clearMask(cutout);
  }

  // ---- FOLD ---------------------------------------------------------------------------------------------
  // Crease at s = k (curved). Returns the clip for scene A (kept on the far side, s > k) and the mask settings
  // for the flap strip of photographed silk on the near side (k − w < s < k).
  function fold(W, H, k, { rtl = true, flap = 0.14, curve = 0.02 } = {}) {
    const { a, pts } = edgePoints(W, H, k, { rtl, curve, waves: 1, phase: 0.2 });
    const fwd = (p) => [p[0] + a.ux * 3 * a.D, p[1] + a.uy * 3 * a.D];
    const all = pts.concat([fwd(pts[pts.length - 1]), fwd(pts[0])]);
    return { a, clipA: `path('M${all.map((p) => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' L')} Z')`, flapFrom: k - flap, flapTo: k };
  }
  // Show el only inside the strip lo < s < hi (soft edges) — used for the silk flap and fold shadow.
  function axisBand(el, lo, hi, { W, H, rtl = true, feather = 40, inner = 0 } = {}) {
    const a = axis(W, H, rtl), A = lo * a.D, B = hi * a.D;
    const m = `linear-gradient(${a.angle.toFixed(3)}deg, transparent ${(A - feather).toFixed(1)}px, #000 ${(A + feather).toFixed(1)}px, #000 ${(B - inner).toFixed(1)}px, transparent ${B.toFixed(1)}px)`;
    el.style.webkitMaskImage = m; el.style.maskImage = m;
  }

  // ---- SETTLE -------------------------------------------------------------------------------------------
  function settle(el, t, start = 0, dur = 2.4, from = 1.04, extra = '') {
    const k = M.seg(t, start, dur, M.EASE.drape);
    el.style.transform = `${extra}scale(${(from - (from - 1) * k).toFixed(5)})`;
  }

  // ---- AIR / WIND ----------------------------------------------------------------------------------------
  // Deterministic: a pure function of t (and seed), so previews and frame renders match.
  const WIND_LEVELS = {   // mirrors motion-system/tokens/siraj-wind.json → levels (normalised strength + frequency band)
    still: { v: 0.08, f: [0.08, 0.15], deg: 0.4 },
    whisper: { v: 0.3, f: [0.12, 0.25], deg: 1.2 },
    breeze: { v: 0.6, f: [0.2, 0.35], deg: 2.4 },
    gust: { v: 1, f: [0.3, 0.5], deg: 4.5 },
  };
  const WL = () => ((g.SIRAJ_MOTION_TOKENS && g.SIRAJ_MOTION_TOKENS.wind && g.SIRAJ_MOTION_TOKENS.wind.engine) || WIND_LEVELS);
  // low-frequency turbulence: 3 octaves of incommensurate sines inside the level's band (≤ 0.6 Hz, no jitter)
  function turb(t, f, seed = 0) {
    const [a, b] = f, m = (a + b) / 2;
    return (Math.sin(2 * Math.PI * a * t + seed * 1.7) * 0.55 + Math.sin(2 * Math.PI * m * 1.37 * t + seed * 2.9 + 1.1) * 0.3 + Math.sin(2 * Math.PI * b * 1.9 * t + seed * 4.3 + 2.3) * 0.15);
  }
  // a gust: rise 0.6–0.9 s (flow), hold ≤ 0.4 s, fall 1.2–1.8 s (drape) — never a step or a bounce
  function gustEnv(t, at, { rise = 0.75, hold = 0.3, fall = 1.5 } = {}) {
    if (t <= at) return 0;
    if (t < at + rise) return M.EASE.flow((t - at) / rise);
    if (t < at + rise + hold) return 1;
    if (t < at + rise + hold + fall) return 1 - M.EASE.drape((t - at - rise - hold) / fall);
    return 0;
  }
  function air(t, { level = 'whisper', gust = null, seed = 0 } = {}) {
    const L = WL()[level] || WIND_LEVELS.whisper, G = WL().gust || WIND_LEVELS.gust;
    const gu = gust == null ? 0 : gustEnv(t, typeof gust === 'number' ? gust : gust.at, typeof gust === 'object' ? gust : {});
    const base = L.v * (0.75 + 0.25 * turb(t, L.f, seed));
    const v = M.lerp(base, G.v * (0.85 + 0.15 * turb(t, G.f, seed + 1)), gu);
    return { v, gust: gu, level, f: L.f, deg: M.lerp(L.deg, G.deg, gu) };
  }
  // edge options for maskReveal/edgePoints: the wave travels across the cloth; amplitude grows with the air
  function breathe(o = {}, t = 0, w = {}) {
    const A = air(t, w), f = (A.f[0] + A.f[1]) / 2;
    return { ...o, phase: (o.phase ?? 0.4) + 2 * Math.PI * f * t * (0.8 + 0.4 * A.v), curve: (o.curve ?? 0.035) * (0.7 + 0.6 * A.v) };
  }
  // a still photograph of silk, carried by the air: drift along the wind (right → left), a slight lean; ≤ 0.6% of W
  function drift(el, t, { W = 1920, level = 'whisper', gust = null, seed = 0, rtl = true, extra = '' } = {}) {
    const A = air(t, { level, gust, seed });
    const dx = (rtl ? -1 : 1) * W * 0.006 * A.v * (0.6 + 0.4 * turb(t, A.f, seed + 3));
    const lean = (rtl ? 1 : -1) * 0.25 * A.v * turb(t, A.f, seed + 5);
    el.style.transform = `${extra}translate3d(${dx.toFixed(2)}px,0,0) skewX(${lean.toFixed(3)}deg)`;
    return A;
  }
  // trees, palms, plants: lean from the base with the air (crown lags by lag s); small plants use lag 0
  function sway(el, t, { level = 'whisper', gust = null, seed = 0, rtl = true, lag = 0.25, scale = 1 } = {}) {
    const A = air(t - lag, { level, gust, seed });
    const deg = (rtl ? -1 : 1) * A.deg * scale * (0.55 + 0.45 * turb(t - lag, A.f, seed + 7));
    el.style.transformOrigin = '50% 100%';
    el.style.transform = `rotate(${deg.toFixed(3)}deg)`;
    return deg;
  }

  g.SirajSilk = { version: '1.0.0', ASSET, air, breathe, drift, sway, gustEnv, axis, axisMask, axisBand, clearMask, edgeClip, edgePoints, kOf, maskReveal, silkEdge, lightSweep, track, phases, passTime, sweep, placeFootage, wrap, fold, settle };
})(window);
