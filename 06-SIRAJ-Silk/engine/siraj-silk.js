/*!
 * SIRAJ SILK ENGINE v1.0
 * Art-directed procedural maroon silk for stills, web and motion. WebGL2, no dependencies.
 *
 *   const silk = new SirajSilk(canvas, preset);   // preset: see 06-SIRAJ-Silk/engine/presets.js
 *   silk.render(seconds);                          // deterministic: same time → same frame
 *
 * Two primitives:
 *   DRAPE  — full-frame silk surface (height field with tension folds), shaded per pixel.
 *   RIBBON — a single continuous silk band (3D strip on a spline) with twist and travelling wave.
 * All shading resolves through the SIRAJ silk colour ramp, so output never leaves the brand palette.
 */
(function (global) {
  'use strict';

  const hex = (h) => { h = h.replace('#', ''); return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255); };

  // SIRAJ silk ramp: Shadow → Deep → Silk Dark → Maroon → Midtone → Highlight → Sand (hottest sheen only)
  const RAMP = [
    [0.00, '#0A0304'], [0.14, '#170608'], [0.30, '#2C0F12'], [0.46, '#45161F'],
    [0.62, '#602733'], [0.77, '#81404C'], [0.90, '#C79A9C'], [1.00, '#E2CFC3'],
  ];

  const BACKGROUNDS = {
    transparent: null,
    lumen: { type: 1, a: '#81404C', b: '#602733', c: '#2C0F12', d: '#170608', at: [0.78, 0.18] },
    deep: { type: 1, a: '#45161F', b: '#2C0F12', c: '#170608', d: '#0A0304', at: [0.7, 0.2] },
    ivory: { type: 2, a: '#FBF8F5', b: '#F7F2ED', c: '#EFE7E0', d: '#E6DCD3', at: [0.8, 0.15] },
    black: { type: 1, a: '#170608', b: '#0A0304', c: '#030101', d: '#020202', at: [0.75, 0.2] },
  };

  const GLSL_SHADE = `
  uniform vec3 uRampC[8];
  uniform float uRampT[8];
  uniform vec3 uLight;
  uniform vec3 uFill;
  uniform float uExposure;
  uniform float uGloss;
  uniform float uSheen;
  uniform float uSpec;
  uniform float uContrast;
  uniform float uTime;
  uniform vec2 uRes;

  vec3 ramp(float x) {
    x = clamp(x, 0.0, 1.0);
    vec3 c = uRampC[0];
    for (int i = 1; i < 8; i++) c = mix(c, uRampC[i], smoothstep(uRampT[i - 1], uRampT[i], x));
    return c;
  }
  float hash(vec2 p) { p = fract(p * vec2(443.897, 441.423)); p += dot(p, p.yx + 19.19); return fract((p.x + p.y) * p.x); }

  // Silk BRDF (art-directed): wrapped diffuse + Kajiya–Kay anisotropic sheen along the fibre + grazing glow.
  float silk(vec3 N, vec3 T, vec3 V) {
    vec3 L = normalize(uLight);
    float ndl = dot(N, L);
    float diff = clamp((ndl + 0.42) / 1.42, 0.0, 1.0);
    vec3 H = normalize(L + V);
    float th = dot(T, H);
    float sTH = sqrt(max(0.0, 1.0 - th * th));
    float lit = smoothstep(-0.15, 0.45, ndl);
    float aniso = pow(sTH, uGloss) * lit;
    vec3 T2 = normalize(T + N * 0.22);
    float th2 = dot(T2, H);
    float aniso2 = pow(sqrt(max(0.0, 1.0 - th2 * th2)), uGloss * 0.22) * lit;
    float blinn = pow(max(dot(N, H), 0.0), 30.0) * lit;
    float rim = pow(1.0 - abs(dot(N, V)), 2.6);
    float fill = clamp(dot(N, normalize(uFill)), 0.0, 1.0);
    float I = 0.16 + diff * 0.40 + fill * 0.08 + (aniso * 0.32 + aniso2 * 0.16 + blinn * 0.22) * uSpec + rim * uSheen * 0.22;
    I = (I - 0.45) * uContrast + 0.45;
    return I * uExposure;
  }
  vec3 dither(vec3 c, vec2 fc) { return c + (hash(fc + fract(uTime)) - 0.5) / 255.0; }
  `;

  const VS_QUAD = `#version 300 es
  in vec2 aPos; out vec2 vUv;
  void main() { vUv = aPos * 0.5 + 0.5; gl_Position = vec4(aPos, 0.0, 1.0); }`;

  // ---- Background + drape (full-screen) ------------------------------------
  const FS_DRAPE = `#version 300 es
  precision highp float;
  in vec2 vUv; out vec4 outColor;
  ${GLSL_SHADE}
  uniform int uBgType;
  uniform vec3 uBgA, uBgB, uBgC, uBgD;
  uniform vec2 uBgAt;
  uniform int uDrape;
  uniform float uScale, uAngle, uAmp, uFolds, uCrease, uSpeed, uPhase;
  uniform vec2 uPinch;
  uniform vec4 uMask;      // x: mode (0 none, 1 lower band, 2 diagonal), y: position, z: softness, w: curvature
  uniform float uVignette;
  uniform float uDrapeAlpha;

  float sabs(float x, float k) { return sqrt(x * x + k); }

  float height(vec2 p) {
    float t = uTime * uSpeed + uPhase;
    float ca = cos(uAngle), sa = sin(uAngle);
    vec2 q = vec2(ca * p.x - sa * p.y, sa * p.x + ca * p.y) * uScale;
    float h = 0.0;
    // long tension waves — the main drape
    h += 0.20 * sin(q.x * 1.55 + 0.55 * sin(q.y * 0.9 + t * 0.6) + t * 0.45);
    h += 0.11 * sin(q.x * 2.7 - q.y * 0.8 + 1.7 - t * 0.3);
    // creased folds (smooth-abs makes crisp valleys and soft crests)
    h -= uCrease * 0.16 * sabs(sin(q.x * 3.4 + q.y * 0.55 + 0.8 * sin(q.y * 1.3 - t * 0.5)), 0.02);
    // folds converging to a pinch point (fabric gathered toward a held corner)
    vec2 d = p - uPinch; float r = length(d); float a = atan(d.y, d.x);
    h += 0.10 * sin(a * uFolds + 1.2 * sin(r * 1.6 - t * 0.7)) * smoothstep(0.05, 0.9, r) * exp(-r * 0.55);
    // micro ripple
    h += 0.008 * sin(q.x * 13.0 + q.y * 5.0 + t * 1.3);
    return h * uAmp;
  }

  vec3 background(vec2 uv) {
    vec2 p = (uv - uBgAt) * vec2(uRes.x / uRes.y, 1.0);
    float r = length(p) / 1.25;
    if (uBgType == 1) {
      vec3 c = mix(uBgA, uBgB, smoothstep(0.0, 0.32, r));
      c = mix(c, uBgC, smoothstep(0.32, 0.78, r));
      return mix(c, uBgD, smoothstep(0.78, 1.25, r));
    }
    vec3 c = mix(uBgA, uBgB, smoothstep(0.0, 0.5, r));
    c = mix(c, uBgC, smoothstep(0.5, 1.0, r));
    return mix(c, uBgD, smoothstep(1.0, 1.6, r));
  }

  void main() {
    vec2 fc = gl_FragCoord.xy;
    vec2 p = (vUv - 0.5) * vec2(uRes.x / uRes.y, 1.0) * 2.0;
    vec4 col = vec4(0.0);
    if (uBgType > 0) col = vec4(background(vUv), 1.0);
    if (uDrape == 1) {
      float e = 1.5 / uRes.y;
      float h = height(p);
      float hx = (height(p + vec2(e, 0.0)) - height(p - vec2(e, 0.0))) / (2.0 * e);
      float hy = (height(p + vec2(0.0, e)) - height(p - vec2(0.0, e))) / (2.0 * e);
      vec3 N = normalize(vec3(-hx, -hy, 1.0));
      float ca = cos(uAngle), sa = sin(uAngle);
      vec3 T = normalize(vec3(ca, -sa, ca * hx - sa * hy));
      vec3 V = vec3(0.0, 0.0, 1.0);
      float I = silk(N, T, V);
      // light fall-off from the light source corner
      vec2 lp = vUv - vec2(0.82, 0.86);
      I *= mix(1.0, 0.72, smoothstep(0.2, 1.3, length(lp * vec2(uRes.x / uRes.y, 1.0))) * uVignette);
      vec3 c = ramp(I);
      float m = 1.0;
      if (uMask.x > 0.5) {
        float s;
        if (uMask.x < 1.5) s = vUv.y - (uMask.y + uMask.w * sin(vUv.x * 3.14159 + uTime * 0.2) * 0.5);
        else s = (vUv.x + vUv.y) * 0.7071 - uMask.y + uMask.w * sin(vUv.x * 4.0 - vUv.y * 2.0 + uTime * 0.25) * 0.05;
        m = 1.0 - smoothstep(-uMask.z, uMask.z, s);
      }
      m *= uDrapeAlpha;
      col.rgb = mix(col.rgb, c, m);
      col.a = max(col.a, m);
    }
    col.rgb = dither(col.rgb, fc);
    outColor = vec4(col.rgb * col.a, col.a); // premultiplied
  }`;

  // ---- Ribbon mesh ---------------------------------------------------------
  const VS_RIBBON = `#version 300 es
  in vec3 aPos; in vec3 aNor; in vec3 aTan; in float aAlpha;
  uniform mat4 uProj; uniform mat4 uView;
  out vec3 vNor; out vec3 vTan; out vec3 vPos; out float vAlpha;
  void main() {
    vec4 wp = vec4(aPos, 1.0);
    vPos = wp.xyz; vNor = aNor; vTan = aTan; vAlpha = aAlpha;
    gl_Position = uProj * uView * wp;
  }`;
  const FS_RIBBON = `#version 300 es
  precision highp float;
  in vec3 vNor; in vec3 vTan; in vec3 vPos; in float vAlpha;
  out vec4 outColor;
  ${GLSL_SHADE}
  uniform vec3 uEye;
  uniform float uRibbonExposure;
  uniform float uOpacity;
  void main() {
    vec3 V = normalize(uEye - vPos);
    vec3 N = normalize(vNor);
    if (dot(N, V) < 0.0) N = -N;          // two-sided silk
    vec3 T = normalize(vTan);
    float I = silk(N, T, V) * uRibbonExposure;
    vec3 c = dither(ramp(I), gl_FragCoord.xy);
    float a = vAlpha * uOpacity;
    outColor = vec4(c * a, a);
  }`;

  // ---- math ----------------------------------------------------------------
  const v3 = {
    sub: (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]],
    add: (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]],
    mul: (a, s) => [a[0] * s, a[1] * s, a[2] * s],
    dot: (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2],
    cross: (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]],
    norm: (a) => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; },
  };
  function catmull(p0, p1, p2, p3, t) {
    const t2 = t * t, t3 = t2 * t;
    return [0, 1, 2].map((i) => 0.5 * ((2 * p1[i]) + (-p0[i] + p2[i]) * t + (2 * p0[i] - 5 * p1[i] + 4 * p2[i] - p3[i]) * t2 + (-p0[i] + 3 * p1[i] - 3 * p2[i] + p3[i]) * t3));
  }
  function spline(pts, u) {
    const n = pts.length - 1;
    const f = Math.min(Math.max(u, 0), 1) * n;
    const i = Math.min(Math.floor(f), n - 1);
    const t = f - i;
    const p0 = pts[Math.max(i - 1, 0)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(i + 2, n)];
    return catmull(p0, p1, p2, p3, t);
  }
  const smooth = (a, b, x) => { const t = Math.min(Math.max((x - a) / (b - a), 0), 1); return t * t * (3 - 2 * t); };
  function perspective(fovy, aspect, near, far) {
    const f = 1 / Math.tan(fovy / 2), nf = 1 / (near - far);
    return new Float32Array([f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) * nf, -1, 0, 0, 2 * far * near * nf, 0]);
  }
  function translate(z) { return new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, -z, 1]); }

  // ---- engine --------------------------------------------------------------
  class SirajSilk {
    constructor(canvas, preset = {}) {
      this.canvas = canvas;
      const gl = canvas.getContext('webgl2', { antialias: true, premultipliedAlpha: true, preserveDrawingBuffer: true, alpha: true });
      if (!gl) throw new Error('SIRAJ Silk requires WebGL2');
      this.gl = gl;
      this.fov = 28 * Math.PI / 180;
      this.dist = 1 / Math.tan(this.fov / 2);
      this.quadProg = this._program(VS_QUAD, FS_DRAPE);
      this.ribbonProg = this._program(VS_RIBBON, FS_RIBBON);
      this.quad = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.quad);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
      this.ribbonBuffers = [];
      this.set(preset);
    }

    set(preset) {
      this.p = Object.assign({
        background: 'lumen', light: [0.55, 0.75, 0.62], fill: [-0.6, -0.3, 0.5],
        exposure: 0.84, gloss: 48, sheen: 1.1, spec: 0.8, contrast: 1.08, vignette: 1.0,
        drape: null, ribbons: [],
      }, preset);
      return this;
    }

    _program(vs, fs) {
      const gl = this.gl;
      const sh = (type, src) => {
        const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) + '\n' + src);
        return s;
      };
      const p = gl.createProgram();
      gl.attachShader(p, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(p, sh(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(p);
      if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
      p.u = {};
      const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
      for (let i = 0; i < n; i++) { const info = gl.getActiveUniform(p, i); const name = info.name.replace('[0]', ''); p.u[name] = gl.getUniformLocation(p, info.name); }
      return p;
    }

    _common(prog, t) {
      const gl = this.gl, u = prog.u, P = this.p;
      const rc = [], rt = [];
      (P.ramp || RAMP).forEach(([s, c]) => { rt.push(s); rc.push(...hex(c)); });
      gl.uniform3fv(u.uRampC, rc); gl.uniform1fv(u.uRampT, rt);
      gl.uniform3fv(u.uLight, P.light); gl.uniform3fv(u.uFill, P.fill);
      gl.uniform1f(u.uExposure, P.exposure); gl.uniform1f(u.uGloss, P.gloss);
      gl.uniform1f(u.uSheen, P.sheen); gl.uniform1f(u.uSpec, P.spec); gl.uniform1f(u.uContrast, P.contrast);
      gl.uniform1f(u.uTime, t); gl.uniform2f(u.uRes, this.canvas.width, this.canvas.height);
    }

    _ribbonMesh(R, t, aspect) {
      const segU = R.segments || 520, segV = 14;
      const u0 = R.range ? R.range[0] : 0, u1 = R.range ? R.range[1] : 1;
      const sway = R.sway || 0.04;
      const pts = R.points.map((p, i) => [
        p[0] * (R.absolute ? 1 : aspect) + sway * Math.sin(t * 0.55 + i * 1.7),
        p[1] + sway * 0.8 * Math.cos(t * 0.47 + i * 2.3),
        (p[2] || 0) + sway * 0.6 * Math.sin(t * 0.36 + i * 0.9),
      ]);
      const [tw0, twA, twF, twS] = R.twist || [0.25, 0.9, 1.2, 0.18];
      const [wA, wF, wS] = R.wave || [0.05, 1.6, 0.22];
      const width = R.width || 0.32;
      const cols = [];
      const Z = [0, 0, 1];
      for (let i = 0; i <= segU; i++) {
        const uu = u0 + (u1 - u0) * (i / segU);
        const e = 0.0015;
        let C = spline(pts, uu);
        const Cn = spline(pts, Math.min(uu + e, 1)), Cp = spline(pts, Math.max(uu - e, 0));
        let T = v3.norm(v3.sub(Cn, Cp));
        let B0;
        if (R.up) { const up = R.up; B0 = v3.norm(v3.sub(up, v3.mul(T, v3.dot(up, T)))); }
        else { B0 = v3.cross(T, Z); if (Math.hypot(...B0) < 1e-4) B0 = [0, 1, 0]; B0 = v3.norm(B0); }
        const Zp = v3.norm(v3.cross(B0, T));
        const ph = 2 * Math.PI * (uu * wF - t * wS);
        C = v3.add(C, v3.add(v3.mul(B0, wA * Math.sin(ph)), v3.mul(Zp, wA * 0.7 * Math.cos(ph * 0.8))));
        const th = tw0 + twA * Math.sin(2 * Math.PI * (uu * twF - t * twS) + (R.phase || 0));
        const D = v3.add(v3.mul(B0, Math.cos(th)), v3.mul(Zp, Math.sin(th)));
        let taper = 1;
        if (R.taper) taper = Math.max(0.0, smooth(0, R.taper, uu) * smooth(1, 1 - R.taper, uu));
        const w = width * (R.widthFn ? R.widthFn(uu, t) : 1) * (0.25 + 0.75 * taper);
        let alpha = 1;
        const fade = R.fade || 0.012;
        if (R.range) alpha *= smooth(u0, u0 + fade, uu) * smooth(u1, u1 - fade, uu);
        if (R.taper) alpha *= smooth(0, R.taper * 0.5, uu) * smooth(1, 1 - R.taper * 0.5, uu);
        const col = [];
        for (let j = 0; j <= segV; j++) {
          const v = j / segV - 0.5;
          col.push(v3.add(C, v3.mul(D, v * w)));
        }
        cols.push({ col, alpha });
      }
      const nV = (segU + 1) * (segV + 1);
      const pos = new Float32Array(nV * 3), nor = new Float32Array(nV * 3), tan = new Float32Array(nV * 3), alp = new Float32Array(nV);
      for (let i = 0; i <= segU; i++) {
        for (let j = 0; j <= segV; j++) {
          const k = i * (segV + 1) + j;
          const P = cols[i].col[j];
          const Pu = v3.sub(cols[Math.min(i + 1, segU)].col[j], cols[Math.max(i - 1, 0)].col[j]);
          const Pv = v3.sub(cols[i].col[Math.min(j + 1, segV)], cols[i].col[Math.max(j - 1, 0)]);
          const N = v3.norm(v3.cross(Pu, Pv));
          const T = v3.norm(Pu);
          pos.set(P, k * 3); nor.set(N, k * 3); tan.set(T, k * 3);
          const edge = Math.abs(j / segV - 0.5) * 2;
          alp[k] = cols[i].alpha * (1 - smooth(0.985, 1.0, edge) * 0.0);
        }
      }
      const idx = new Uint32Array(segU * segV * 6);
      let q = 0;
      for (let i = 0; i < segU; i++) for (let j = 0; j < segV; j++) {
        const a = i * (segV + 1) + j, b = a + segV + 1;
        idx.set([a, b, a + 1, a + 1, b, b + 1], q); q += 6;
      }
      return { pos, nor, tan, alp, idx };
    }

    render(t = 0) {
      const gl = this.gl, P = this.p, cv = this.canvas;
      const aspect = cv.width / cv.height;
      gl.viewport(0, 0, cv.width, cv.height);
      gl.clearColor(0, 0, 0, 0); gl.clearDepth(1);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

      // pass 1: background + drape
      const bg = typeof P.background === 'string' && P.background.startsWith('#') ? { type: 1, a: P.background, b: P.background, c: P.background, d: P.background, at: [0.5, 0.5] } : BACKGROUNDS[P.background];
      if (bg || P.drape) {
        const pr = this.quadProg, u = pr.u;
        gl.useProgram(pr); this._common(pr, t);
        gl.disable(gl.DEPTH_TEST);
        gl.uniform1i(u.uBgType, bg ? bg.type : 0);
        if (bg) { gl.uniform3fv(u.uBgA, hex(bg.a)); gl.uniform3fv(u.uBgB, hex(bg.b)); gl.uniform3fv(u.uBgC, hex(bg.c)); gl.uniform3fv(u.uBgD, hex(bg.d)); gl.uniform2fv(u.uBgAt, bg.at); }
        const D = P.drape;
        gl.uniform1i(u.uDrape, D ? 1 : 0);
        if (D) {
          gl.uniform1f(u.uScale, D.scale ?? 1.0); gl.uniform1f(u.uAngle, D.angle ?? -0.5); gl.uniform1f(u.uAmp, D.amp ?? 1.0);
          gl.uniform1f(u.uFolds, D.folds ?? 5); gl.uniform1f(u.uCrease, D.crease ?? 1.0); gl.uniform1f(u.uSpeed, D.speed ?? 1.0);
          gl.uniform1f(u.uPhase, D.phase ?? 0); gl.uniform2fv(u.uPinch, D.pinch || [1.4, 1.1]);
          gl.uniform4fv(u.uMask, D.mask || [0, 0, 0, 0]); gl.uniform1f(u.uDrapeAlpha, D.alpha ?? 1);
        }
        gl.uniform1f(u.uVignette, P.vignette);
        const loc = gl.getAttribLocation(pr, 'aPos');
        gl.bindBuffer(gl.ARRAY_BUFFER, this.quad); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        gl.disableVertexAttribArray(loc);
      }

      // pass 2: ribbons
      if (P.ribbons && P.ribbons.length) {
        const pr = this.ribbonProg, u = pr.u;
        gl.useProgram(pr); this._common(pr, t);
        gl.enable(gl.DEPTH_TEST); gl.depthFunc(gl.LEQUAL);
        gl.uniformMatrix4fv(u.uProj, false, perspective(this.fov, aspect, 0.1, 40));
        gl.uniformMatrix4fv(u.uView, false, translate(this.dist));
        gl.uniform3fv(u.uEye, [0, 0, this.dist]);
        P.ribbons.forEach((R, ri) => {
          if (R.visible === false) return;
          const m = this._ribbonMesh(typeof R === 'function' ? R(t) : R, t + (R.timeOffset || 0), aspect);
          gl.uniform1f(u.uRibbonExposure, R.exposure ?? 1.0);
          gl.uniform1f(u.uOpacity, R.opacity ?? 1.0);
          const b = this.ribbonBuffers[ri] || (this.ribbonBuffers[ri] = { pos: gl.createBuffer(), nor: gl.createBuffer(), tan: gl.createBuffer(), alp: gl.createBuffer(), idx: gl.createBuffer() });
          const bind = (buf, data, name, size) => {
            const loc = gl.getAttribLocation(pr, name);
            gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);
            gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
          };
          bind(b.pos, m.pos, 'aPos', 3); bind(b.nor, m.nor, 'aNor', 3); bind(b.tan, m.tan, 'aTan', 3); bind(b.alp, m.alp, 'aAlpha', 1);
          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, b.idx); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, m.idx, gl.DYNAMIC_DRAW);
          gl.drawElements(gl.TRIANGLES, m.idx.length, gl.UNSIGNED_INT, 0);
        });
        gl.disable(gl.DEPTH_TEST);
      }
      return this;
    }
  }

  SirajSilk.RAMP = RAMP;
  SirajSilk.BACKGROUNDS = BACKGROUNDS;
  SirajSilk.version = '1.0.0';
  global.SirajSilk = SirajSilk;
})(typeof window !== 'undefined' ? window : globalThis);
