/**
 * Ink: the brand's fluid drawn in 2D. A wobbling circle with a liquid edge,
 * used by the page transitions, the first-visit opening and the menu.
 */

const POINTS = 72;

/** The far corner's distance from (x, y), plus room for the wavy edge. */
export function inkReach(x: number, y: number) {
  const w = window.innerWidth;
  const h = window.innerHeight;
  return Math.hypot(Math.max(x, w - x), Math.max(y, h - y)) * 1.3;
}

/**
 * A closed, wobbling circle as a smooth SVG path (Catmull-Rom through polar
 * points). `calm` 0..1 scales the ripple: ink ripples most while it is small.
 */
export function inkPath(x: number, y: number, r: number, t: number, calm: number) {
  if (r <= 0.5) return "";
  const pts: [number, number][] = [];
  for (let i = 0; i < POINTS; i++) {
    const a = (i / POINTS) * Math.PI * 2;
    const wave =
      Math.sin(a * 3 + t * 2.1) * 0.07 + Math.sin(a * 5 - t * 3.3) * 0.045 + Math.sin(a * 9 + t * 1.6) * 0.025;
    const rr = r * (1 + wave * calm);
    pts.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr]);
  }
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < POINTS; i++) {
    const p0 = pts[(i - 1 + POINTS) % POINTS];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % POINTS];
    const p3 = pts[(i + 2) % POINTS];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += `C${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return `${d}Z`;
}

/** How much the edge may ripple at radius r of max. */
export const inkCalm = (r: number, max: number) => 1 - Math.min(1, r / max) * 0.65;
