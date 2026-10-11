// SIRAJ Silk — official formations v1.0
// Scene units: y ∈ [-1, 1] spans the frame height; ribbon x is multiplied by the frame aspect unless `absolute: true`.
// Every preset is deterministic: render(t) with the same t always returns the same frame.
(function (g) {
  const P = {};
  const SWEEP = [[-1.4, -0.95, 0.3], [-0.7, -0.35, -0.25], [-0.1, 0.18, 0.35], [0.45, 0.05, -0.3], [0.95, 0.42, 0.2], [1.45, 0.95, -0.1]];

  // 01 DRAPE — full-frame silk surface. Hero backgrounds, covers, end cards.
  P['drape-lumen'] = { background: 'lumen', drape: { scale: 1.0, angle: -0.5, pinch: [1.3, 1.0], folds: 5 } };
  // 02 DRAPE DEEP — quieter, darker drape that can carry type.
  P['drape-deep'] = { background: 'deep', exposure: 0.66, spec: 0.6, contrast: 0.95, drape: { scale: 0.8, angle: -0.62, pinch: [1.6, 1.2], folds: 4, amp: 0.85 } };
  // 03 DRAPE VERTICAL — folds falling vertically (portrait formats, hoardings).
  P['drape-fall'] = { background: 'lumen', drape: { scale: 1.05, angle: -1.35, pinch: [0.4, 1.5], folds: 6, crease: 1.2 } };

  // 04 RIBBON — the single SIRAJ ribbon crossing the frame (signature gesture).
  P['ribbon-sweep'] = { background: 'deep', ribbons: [{ points: SWEEP, width: 0.42, twist: [0.9, 2.4, 0.7, 0.12], wave: [0.08, 1.0, 0.2], exposure: 1.3 }] };
  P['ribbon-sweep-alpha'] = { ...P['ribbon-sweep'], background: 'transparent' };
  // 05 RIBBON ON IVORY — light environment.
  P['ribbon-ivory'] = { background: 'ivory', ribbons: [{ points: SWEEP, width: 0.46, twist: [0.9, 2.0, 0.6, 0.12], wave: [0.07, 1.0, 0.2], exposure: 1.45 }] };
  P['ribbon-ivory-alpha'] = { ...P['ribbon-ivory'], background: 'transparent' };
  // 06 RIBBON PAIR — two layered ribbons; richer formation for campaign key visuals.
  P['ribbon-pair'] = {
    background: 'lumen',
    ribbons: [
      { points: SWEEP.map(([x, y, z]) => [x, y - 0.12, z - 0.4]), width: 0.5, twist: [1.1, 1.8, 0.6, 0.1], wave: [0.07, 0.9, 0.18], exposure: 0.95, phase: 1.3 },
      { points: SWEEP, width: 0.36, twist: [0.8, 2.4, 0.7, 0.12], wave: [0.08, 1.0, 0.2], exposure: 1.3 },
    ],
  };

  // 07 HORIZON — silk surface becoming a landscape line in the lower third (architecture sits above).
  P['horizon-ivory'] = { background: 'ivory', exposure: 1.0, drape: { scale: 1.2, angle: -1.32, pinch: [2.2, -1.4], folds: 3, amp: 0.8, crease: 0.6, mask: [1, 0.3, 0.0015, 0.12] } };
  P['horizon-deep'] = { background: 'deep', exposure: 0.95, drape: { scale: 1.2, angle: -1.32, pinch: [2.2, -1.4], folds: 3, amp: 0.8, crease: 0.6, mask: [1, 0.32, 0.0015, 0.12] } };
  P['horizon-alpha'] = { background: 'transparent', drape: { scale: 1.2, angle: -1.32, pinch: [2.2, -1.4], folds: 3, amp: 0.8, crease: 0.6, mask: [1, 0.3, 0.0015, 0.12] } };

  // 08 FOLD — a diagonal corner of silk (Silk Fold). Covers, section dividers.
  P['fold-corner-ivory'] = { background: 'ivory', drape: { scale: 1.0, angle: -0.78, pinch: [1.6, -1.2], folds: 4, mask: [2, 0.42, 0.0015, 1.0] } };
  P['fold-corner-alpha'] = { background: 'transparent', drape: { scale: 1.0, angle: -0.78, pinch: [1.6, -1.2], folds: 4, mask: [2, 0.42, 0.0015, 1.0] } };

  // 09 GATEWAY — two silk forms framing a central opening (entrances, project reveals).
  P['gateway'] = {
    background: 'deep',
    ribbons: [
      { absolute: true, points: [[-2.2, 1.3, 0], [-1.25, 0.6, 0.3], [-0.85, -0.1, -0.2], [-0.95, -0.8, 0.2], [-1.6, -1.4, 0]], width: 0.5, twist: [0.7, 1.6, 0.8, 0.1], exposure: 1.25 },
      { absolute: true, points: [[2.2, -1.3, 0], [1.25, -0.6, 0.3], [0.85, 0.1, -0.2], [0.95, 0.8, 0.2], [1.6, 1.4, 0]], width: 0.5, twist: [0.7, 1.6, 0.8, 0.1], exposure: 1.25, phase: 2.1 },
    ],
  };
  P['gateway-alpha'] = { ...P['gateway'], background: 'transparent' };

  // 10 WRAP — a ribbon spiralling around a vertical axis (wraps a tower in campaign composites).
  const wrap = [];
  for (let i = 0; i <= 24; i++) { const a = -1.2 + i * 0.5; wrap.push([0.42 * Math.cos(a), -1.15 + i * 0.095, 0.42 * Math.sin(a)]); }
  P['wrap'] = { background: 'deep', ribbons: [{ absolute: true, up: [0, 1, 0], points: wrap, width: 0.2, twist: [0.0, 0.35, 1.0, 0.1], wave: [0.015, 1.0, 0.15], sway: 0.01, exposure: 1.3, segments: 800 }] };
  P['wrap-alpha'] = { ...P['wrap'], background: 'transparent' };

  g.SirajSilkPresets = P;
  g.SirajSilkSweep = SWEEP;
})(typeof window !== 'undefined' ? window : globalThis);
