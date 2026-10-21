/**
 * The brand's drops for the product cards: glossy raymarched drops joined by
 * a smooth union, like the hero's, melted into one calm liquid surface that
 * fills the panel as a background. It does not react to the pointer. Every card has its own 2D canvas, but they all share one
 * WebGL context: each frame the shader draws into it for the cards on screen
 * and the result is copied across.
 */

const VERTEX = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAGMENT = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 uRes;
uniform float uTime;
uniform float uHover;
uniform vec4 uA;
uniform vec4 uB;
uniform vec4 uC;
uniform vec4 uD;
uniform float uK;
uniform vec3 uC1;
uniform vec3 uC2;
uniform vec3 uC3;
uniform float uHasC;

const float TAN_HALF_FOV = 0.4142;
const vec3 RO = vec3(0.0, 0.0, 4.0);

float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

float wobble(vec3 p) {
  float t = uTime * 0.4;
  return (0.03 + uHover * 0.02) * sin(p.x * 1.1 + t) * sin(p.y * 1.5 + t * 1.3) * sin(p.z * 1.2 + t * 0.8);
}

float scene(vec3 p, out float w) {
  float da = length(p - uA.xyz) - uA.w;
  float db = length(p - uB.xyz) - uB.w;
  float dc = length(p - uC.xyz) - uC.w;
  float dd = length(p - uD.xyz) - uD.w;
  w = 0.0;
  return smin(smin(da, db, uK), smin(dc, dd, uK), uK) + wobble(p);
}

vec3 normalAt(vec3 p) {
  const vec2 e = vec2(0.0015, -0.0015);
  float w;
  return normalize(
    e.xyy * scene(p + e.xyy, w) +
    e.yyx * scene(p + e.yyx, w) +
    e.yxy * scene(p + e.yxy, w) +
    e.xxx * scene(p + e.xxx, w)
  );
}

void main() {
  vec2 uv = (gl_FragCoord.xy * 2.0 - uRes) / uRes.y;
  vec3 rd = normalize(vec3(uv * TAN_HALF_FOV, -1.0));

  float t = 0.0;
  float w = 0.0;
  float dmin = 1e3;
  bool hit = false;
  for (int i = 0; i < 56; i++) {
    vec3 p = RO + rd * t;
    float d = scene(p, w);
    dmin = min(dmin, d);
    if (d < 0.002) { hit = true; break; }
    t += d * 0.85;
    if (t > 7.0) break;
  }

  float px = 2.0 * TAN_HALF_FOV * 4.0 / uRes.y;
  float alpha = hit ? 1.0 : 1.0 - smoothstep(0.0, px * 1.5, dmin);
  if (alpha <= 0.0) { gl_FragColor = vec4(0.0); return; }

  vec3 p = RO + rd * t;
  vec3 n = normalAt(p);
  vec3 v = -rd;
  float ndv = clamp(dot(n, v), 0.0, 1.0);
  float fres = pow(1.0 - ndv, 3.0);

  // The product's colours run down the drop's surface, lit from above.
  float g = clamp(0.5 + 0.55 * n.y + 0.2 * n.x, 0.0, 1.0);
  vec3 three = g > 0.5
    ? mix(uC2, uC1, smoothstep(0.5, 1.0, g))
    : mix(uC3, uC2, smoothstep(0.0, 0.5, g));
  vec3 two = mix(uC1, uC2, g);
  vec3 base = mix(two, three, uHasC);

  vec3 l = normalize(vec3(-0.55, 0.8, 0.6));
  float diff = max(dot(n, l), 0.0);
  float spec = pow(max(dot(reflect(-l, n), v), 0.0), 30.0);
  vec3 r = reflect(rd, n);
  vec3 env = mix(vec3(0.04), vec3(1.0), smoothstep(-0.3, 0.9, r.y));
  float box = smoothstep(0.42, 0.5, r.y) * smoothstep(0.78, 0.7, r.y) * smoothstep(-0.9, -0.2, r.x);
  float side = smoothstep(0.55, 0.75, r.x) * smoothstep(0.6, 0.1, abs(r.y));
  vec3 irid = 0.5 + 0.5 * cos(6.2831 * (fres * 1.1 + n.y * 0.25 + uTime * 0.03 + vec3(0.0, 0.33, 0.67)));

  vec3 col = base * (0.4 + 0.5 * diff);
  col += env * (0.03 + fres * 0.3);
  col += vec3(box * 0.22 + side * 0.1) * (0.3 + 0.7 * fres);
  col += irid * fres * 0.1;
  col += vec3(spec) * 0.35;

  gl_FragColor = vec4(col * alpha, alpha);
}
`;

type Vec3 = [number, number, number];

type Stage = {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  colors: [Vec3, Vec3, Vec3];
  hasThird: number;
  phase: number;
  a: [number, number];
  b: [number, number];
  rb: number;
  w: number;
  h: number;
  cssW: number;
  cssH: number;
  onLive: (live: boolean) => void;
  drawn: boolean;
};

type Options = { canvas: HTMLCanvasElement; glow: [string, string, string?]; phase?: number; onLive: (live: boolean) => void };

const HALF_H = 4 * 0.4142; // visible half-height at z = 0
// The surface is soft, so it can be drawn small and scaled up without showing.
// Phones get a tighter budget: fewer pixels per stage and fewer frames.
const budget = () => (window.matchMedia("(max-width: 767px)").matches ? 140_000 : 320_000);
const frameMs = () => (window.matchMedia("(max-width: 767px)").matches ? 1000 / 30 : 1000 / 45);

const stages = new Map<HTMLCanvasElement, Stage>();
const visible = new Set<Stage>();
let gl: WebGLRenderingContext | null = null;
let glCanvas: HTMLCanvasElement | null = null;
const uniforms: Record<string, WebGLUniformLocation | null> = {};
let io: IntersectionObserver | null = null;
let ro: ResizeObserver | null = null;
let raf = 0;
let last = 0;
let failed = false;

const toRgb = (hex: string): Vec3 => {
  const n = parseInt(hex.replace("#", "").padEnd(6, "0").slice(0, 6), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

function compile(type: number, src: string) {
  const s = gl!.createShader(type)!;
  gl!.shaderSource(s, src);
  gl!.compileShader(s);
  if (!gl!.getShaderParameter(s, gl!.COMPILE_STATUS)) {
    console.error("drop shader:", gl!.getShaderInfoLog(s));
    return null;
  }
  return s;
}

function init() {
  if (gl) return true;
  if (failed) return false;
  try {
    glCanvas = document.createElement("canvas");
    glCanvas.width = 256;
    glCanvas.height = 256;
    gl = glCanvas.getContext("webgl", { alpha: true, premultipliedAlpha: true, antialias: false, powerPreference: "low-power" });
    if (!gl) throw new Error("no webgl");
    const vs = compile(gl.VERTEX_SHADER, VERTEX);
    const fs = compile(gl.FRAGMENT_SHADER, FRAGMENT);
    if (!vs || !fs) throw new Error("shader");
    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error("link");
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(program, "aPos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    gl.disable(gl.BLEND);
    for (const name of ["uRes", "uTime", "uHover", "uA", "uB", "uC", "uD", "uK", "uC1", "uC2", "uC3", "uHasC"]) {
      uniforms[name] = gl.getUniformLocation(program, name);
    }
    glCanvas.addEventListener("webglcontextlost", (e) => {
      e.preventDefault();
      failed = true;
      gl = null;
      cancelAnimationFrame(raf);
      raf = 0;
      stages.forEach((s) => s.onLive(false));
    });
    io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const s = stages.get(entry.target as HTMLCanvasElement);
        if (!s) continue;
        if (entry.isIntersecting) visible.add(s);
        else visible.delete(s);
      }
      if (visible.size && !raf && gl) raf = requestAnimationFrame(frame);
    });
    ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const s = stages.get(entry.target as HTMLCanvasElement);
        if (s) size(s, entry.contentRect.width, entry.contentRect.height);
      }
    });
    return true;
  } catch (err) {
    console.error("drop engine:", err);
    failed = true;
    gl = null;
    return false;
  }
}

function size(s: Stage, cssW: number, cssH: number) {
  const k = Math.min(Math.min(window.devicePixelRatio || 1, 1.5), Math.sqrt(budget() / Math.max(1, cssW * cssH)));
  s.cssW = cssW;
  s.cssH = cssH;
  s.w = Math.max(2, Math.round(cssW * k));
  s.h = Math.max(2, Math.round(cssH * k));
  s.canvas.width = s.w;
  s.canvas.height = s.h;
  s.drawn = false;
}

function draw(s: Stage, now: number) {
  if (!gl || !glCanvas) return;
  if (glCanvas.width < s.w || glCanvas.height < s.h) {
    glCanvas.width = Math.max(glCanvas.width, s.w);
    glCanvas.height = Math.max(glCanvas.height, s.h);
  }
  const t = now / 1000 + s.phase;
  const aspect = s.cssW / s.cssH;
  const halfW = HALF_H * aspect;

  // Three big drops, overlapping, melt into one liquid surface that fills the
  // panel edge to edge.
  const r = Math.max(HALF_H * 1.4, halfW * 0.55);
  const zc = -(r - 1.6);
  const big = [0, 1, 2].map((i) => [
    (i - 1) * halfW * 0.65 + Math.sin(t * 0.3 + i * 2.1) * 0.5,
    Math.sin(t * 0.4 + i * 1.7) * 0.4,
    zc,
    r,
  ]);

  gl.viewport(0, 0, s.w, s.h);
  gl.uniform2f(uniforms.uRes, s.w, s.h);
  gl.uniform1f(uniforms.uTime, t % 500);
  gl.uniform1f(uniforms.uHover, 0);
  gl.uniform4fv(uniforms.uA, big[0]);
  gl.uniform4fv(uniforms.uB, big[1]);
  gl.uniform4fv(uniforms.uC, big[2]);
  // The fourth drop stays far out of sight: its rim cut a dark line across the surface.
  gl.uniform4f(uniforms.uD, -500, 0, -50, 0.1);
  gl.uniform1f(uniforms.uK, 1.6);
  gl.uniform3fv(uniforms.uC1, s.colors[0]);
  gl.uniform3fv(uniforms.uC2, s.colors[1]);
  gl.uniform3fv(uniforms.uC3, s.colors[2]);
  gl.uniform1f(uniforms.uHasC, s.hasThird);
  gl.drawArrays(gl.TRIANGLES, 0, 3);

  s.ctx.clearRect(0, 0, s.w, s.h);
  s.ctx.drawImage(glCanvas, 0, glCanvas.height - s.h, s.w, s.h, 0, 0, s.w, s.h);
  if (!s.drawn) {
    s.drawn = true;
    s.onLive(true);
  }
}

function frame(now: number) {
  raf = 0;
  if (!gl || !visible.size) return;
  if (now - last >= frameMs()) {
    last = now;
    visible.forEach((s) => {
      // Hidden stages (a closed menu) still intersect the viewport.
      if (s.canvas.checkVisibility && !s.canvas.checkVisibility({ visibilityProperty: true })) return;
      draw(s, now);
    });
  }
  raf = requestAnimationFrame(frame);
}

/** Starts drawing the drops into `canvas`. Returns a stop function, or null without WebGL. */
export function registerDropStage({ canvas, glow, phase = 0, onLive }: Options) {
  const ctx = canvas.getContext("2d");
  if (!ctx || !init() || !io || !ro) return null;

  const [a, b, c] = glow;
  const s: Stage = {
    canvas,
    ctx,
    // Two-colour products read bottom to top: deep, then light.
    colors: [toRgb(a), toRgb(b), toRgb(c ?? b)],
    hasThird: c ? 1 : 0,
    phase,
    a: [0, 0],
    b: [1, 0],
    rb: 0.36,
    w: 2,
    h: 2,
    cssW: 1,
    cssH: 1,
    onLive,
    drawn: false,
  };
  const rect = canvas.getBoundingClientRect();
  size(s, rect.width, rect.height);

  stages.set(canvas, s);
  io.observe(canvas);
  ro.observe(canvas);

  return () => {
    io?.unobserve(canvas);
    ro?.unobserve(canvas);
    visible.delete(s);
    stages.delete(canvas);
  };
}
