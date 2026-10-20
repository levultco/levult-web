export const vertex = /* glsl */ `
  void main() {
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

// Two raymarched drops joined by a smooth union: one form when they meet,
// two when they part. Glossy, with the page's own light in their reflections.
export const fragment = /* glsl */ `
  precision highp float;

  uniform vec2 uRes;
  uniform float uTime;
  uniform vec4 uA;        // xyz centre, w radius
  uniform vec4 uB;
  uniform vec3 uColA;      // ParyUp: yellow at the top…
  uniform vec3 uColA2;     // …through orange…
  uniform vec3 uColA3;     // …to pink at the bottom.
  uniform vec3 uColB;
  uniform vec3 uInk;
  uniform vec3 uGround;
  uniform float uTint;
  uniform float uK;
  uniform vec2 uMouse;
  uniform float uIntro;
  uniform vec3 uPage;     // the page ground, exactly as the browser paints it

  const float TAN_HALF_FOV = 0.4142;
  const vec3 RO = vec3(0.0, 0.0, 4.0);

  float smin(float a, float b, float k) {
    float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
    return mix(b, a, h) - k * h * (1.0 - h);
  }

  float wobble(vec3 p) {
    float t = uTime * 0.55;
    vec3 q = p + vec3(uMouse * 0.35, 0.0);
    return 0.055 * sin(q.x * 3.1 + t) * sin(q.y * 2.6 + t * 1.3) * sin(q.z * 3.4 + t * 0.8)
         + 0.022 * sin(q.x * 7.0 + q.y * 5.0 + t * 1.9);
  }

  float scene(vec3 p, out float w) {
    float ra = uA.w * uIntro;
    float rb = uB.w * uIntro;
    // A drop that has shrunk away is removed, not left as a speck.
    float da = ra < 0.01 ? 1e3 : length(p - uA.xyz) - ra;
    float db = rb < 0.01 ? 1e3 : length(p - uB.xyz) - rb;
    w = clamp(0.5 + 0.5 * (db - da) / uK, 0.0, 1.0);
    // The wobble scales with the drop, so a small drop never breaks apart.
    float size = clamp(max(ra, rb) * 2.0, 0.0, 1.0);
    return smin(da, db, uK) + wobble(p) * uIntro * size;
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
    for (int i = 0; i < 72; i++) {
      vec3 p = RO + rd * t;
      float d = scene(p, w);
      dmin = min(dmin, d);
      if (d < 0.0015) { hit = true; break; }
      t += d * 0.85;
      if (t > 7.0) break;
    }

    // Soft edge from the closest approach, one pixel wide.
    float px = 2.0 * TAN_HALF_FOV * 4.0 / uRes.y;
    float alpha = hit ? 1.0 : 1.0 - smoothstep(0.0, px * 1.5, dmin);
    if (alpha <= 0.0) { gl_FragColor = vec4(0.0); return; }

    vec3 p = RO + rd * t;
    vec3 n = normalAt(p);
    vec3 v = -rd;
    float ndv = clamp(dot(n, v), 0.0, 1.0);
    float fres = pow(1.0 - ndv, 3.0);

    // ParyUp's brand gradient runs across its drop's surface, lit from above.
    float g = clamp(0.5 + 0.55 * n.y + 0.2 * n.x, 0.0, 1.0);
    vec3 paryup = g > 0.5
      ? mix(uColA2, uColA, smoothstep(0.5, 1.0, g))
      : mix(uColA3, uColA2, smoothstep(0.0, 0.5, g));
    vec3 appCol = mix(uColB, paryup, w);
    vec3 base = mix(uInk, appCol, uTint);

    vec3 l = normalize(vec3(-0.55, 0.8, 0.6));
    float diff = max(dot(n, l), 0.0);
    float spec = pow(max(dot(reflect(-l, n), v), 0.0), 60.0);
    vec3 r = reflect(rd, n);
    // The page reflected in the surface: ground below, white light above.
    vec3 env = mix(uGround * 0.55, vec3(1.0), smoothstep(-0.3, 0.9, r.y));
    // Two soft-box strips, like a product shot in a white studio.
    float box = smoothstep(0.42, 0.5, r.y) * smoothstep(0.78, 0.7, r.y) * smoothstep(-0.9, -0.2, r.x);
    float side = smoothstep(0.55, 0.75, r.x) * smoothstep(0.6, 0.1, abs(r.y));
    vec3 irid = 0.5 + 0.5 * cos(6.2831 * (fres * 1.1 + n.y * 0.25 + uTime * 0.03 + vec3(0.0, 0.33, 0.67)));

    // Coloured drops keep more ambient light so their colours stay bright.
    vec3 col = base * (mix(0.2, 0.55, uTint) + mix(0.65, 0.5, uTint) * diff);
    col += env * (0.06 + fres * 0.9);
    col += vec3(box * 0.75 + side * 0.35) * (0.35 + 0.65 * fres);
    col += irid * fres * 0.4;
    col += vec3(spec) * 0.8;

    // The canvas sits above the page with mix-blend-mode: difference, so it
    // draws the drop's negative: |page − negative| gives back the drop as
    // designed over the ground, while dark text underneath turns light.
    vec3 negative = abs(uPage - col);
    gl_FragColor = vec4(negative * alpha, alpha);
  }
`;
