/**
 * Liquid ink on the GPU: the page-transition edge as a fragment shader.
 * Same drop / hole model as the 2D ink, but the boundary is pushed around by
 * layered turbulence and split into a chromatic fringe (red outside, blue
 * inside), the way the liquid-morphology "timeshift" and "glass" effects bend
 * light along the front of a spreading circle.
 */

export type LiquidInkState = {
  mode: "drop" | "hole";
  x: number;
  y: number;
  r: number;
  max: number;
};

const vertex = `
attribute vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }
`;

const fragment = `
precision highp float;

uniform vec2 uRes;
uniform vec2 uCenter;
uniform float uRadius;
uniform float uCalm;
uniform float uTime;
uniform float uDpr;
uniform float uHole;
uniform vec3 uInk;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
    f.y
  );
}

// 1 where the ink covers the screen, for a circle of radius rad whose edge is
// pushed around by turbulence. In hole mode the ink is everything outside.
float cover(vec2 p, float rad) {
  vec2 d = p - uCenter;
  float dist = length(d);
  float a = atan(d.y, d.x);
  float wave = sin(a * 3.0 + uTime * 2.1) * 0.07 + sin(a * 5.0 - uTime * 3.3) * 0.045 + sin(a * 9.0 + uTime * 1.6) * 0.025;
  float scale = uRes.y * 0.14;
  float turb = (vnoise(p / scale + uTime * 0.5) - 0.5) * 1.2 + (vnoise(p / (scale * 0.55) - uTime * 0.7) - 0.5) * 0.8;
  float edge = rad * (1.0 + wave * uCalm) + turb * rad * 0.16 * uCalm;
  float width = max(1.5 * uDpr, rad * 0.006);
  float inside = smoothstep(edge + width, edge - width, dist);
  return mix(inside, 1.0 - inside, uHole);
}

void main() {
  vec2 p = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y);
  float fringe = uRadius * 0.016 * uCalm + 0.5 * uDpr;
  float sign = mix(1.0, -1.0, uHole);
  float mR = cover(p, uRadius + fringe * sign);
  float mG = cover(p, uRadius);
  float mB = cover(p, uRadius - fringe * sign);

  float alpha = max(mR, max(mG, mB));
  if (alpha < 0.002) { gl_FragColor = vec4(0.0); return; }

  float outer = clamp(mR - mG, 0.0, 1.0);
  float inner = clamp(mG - mB, 0.0, 1.0);
  float k = 0.35 + uCalm * 0.65;

  // Slow liquid sheen inside the ink, so it reads as a body and not a flat fill.
  float sheen = vnoise(p / (uRes.y * 0.35) + uTime * 0.25) * vnoise(p / (uRes.y * 0.2) - uTime * 0.2);
  vec3 color = uInk + sheen * 0.05;
  color += vec3(0.95, 0.18, 0.32) * outer * 0.55 * k;
  color += vec3(0.16, 0.38, 1.0) * inner * 0.6 * k;

  gl_FragColor = vec4(color * alpha, alpha);
}
`;

export type LiquidInk = {
  draw: (s: LiquidInkState, calm: number) => void;
  clear: () => void;
  dispose: () => void;
};

/** Returns null where WebGL is unavailable, so the caller can fall back to 2D. */
export function createLiquidInk(canvas: HTMLCanvasElement, ink: [number, number, number]): LiquidInk | null {
  const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: true, antialias: false, depth: false });
  if (!gl) return null;

  const compile = (type: number, src: string) => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
  };
  const vs = compile(gl.VERTEX_SHADER, vertex);
  const fs = compile(gl.FRAGMENT_SHADER, fragment);
  const program = gl.createProgram();
  if (!vs || !fs || !program) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  gl.useProgram(program);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, "position");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  const u = (name: string) => gl.getUniformLocation(program, name);
  const uRes = u("uRes");
  const uCenter = u("uCenter");
  const uRadius = u("uRadius");
  const uCalm = u("uCalm");
  const uTime = u("uTime");
  const uDpr = u("uDpr");
  const uHole = u("uHole");
  gl.uniform3f(u("uInk"), ink[0], ink[1], ink[2]);

  const clear = () => {
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
  };

  const draw = (s: LiquidInkState, calm: number) => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.round(window.innerWidth * dpr);
    const h = Math.round(window.innerHeight * dpr);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    gl.viewport(0, 0, w, h);
    gl.uniform2f(uRes, w, h);
    gl.uniform2f(uCenter, s.x * dpr, s.y * dpr);
    gl.uniform1f(uRadius, s.r * dpr);
    gl.uniform1f(uCalm, calm);
    gl.uniform1f(uTime, performance.now() / 1000);
    gl.uniform1f(uDpr, dpr);
    gl.uniform1f(uHole, s.mode === "hole" ? 1 : 0);
    clear();
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  const dispose = () => {
    gl.deleteProgram(program);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    gl.deleteBuffer(buffer);
  };

  return { draw, clear, dispose };
}
