/**
 * Where the two drops sit for each section of the page.
 * x / y are fractions of the half-screen (−1 left/bottom … 1 right/top),
 * r is a fraction of the half-height, tint 0 = ink (Levult), 1 = app colours.
 * On narrow screens `m` overrides the desktop pose.
 */
export type Drop = { x: number; y: number; r: number };
export type Pose = { a: Drop; b: Drop; tint: number; m?: { a: Drop; b: Drop } };

export const poses: Record<string, Pose> = {
  // One company: both drops fused into a single form.
  hero: {
    a: { x: 0.6, y: 0.3, r: 0.42 },
    b: { x: 0.8, y: -0.08, r: 0.32 },
    tint: 0,
    m: { a: { x: 0.1, y: 0.42, r: 0.4 }, b: { x: 0.32, y: 0.26, r: 0.3 } },
  },
  // Two apps: the form splits and each drop takes its colour.
  statement: {
    a: { x: -0.86, y: -0.56, r: 0.28 },
    b: { x: 0.86, y: 0.56, r: 0.26 },
    tint: 1,
    m: { a: { x: -0.72, y: -0.7, r: 0.28 }, b: { x: 0.7, y: 0.66, r: 0.3 } },
  },
  // Each app: its drop waits under the giant name, then sits behind the live
  // phone. The other drop shrinks to nothing where it is (r 0), so no drop
  // ever sweeps across the text.
  "paryup-intro": {
    a: { x: -0.58, y: -0.5, r: 0.34 },
    b: { x: 0.9, y: 0.5, r: 0 },
    tint: 1,
    m: { a: { x: 0.72, y: -0.6, r: 0.3 }, b: { x: 0.7, y: 0.66, r: 0 } },
  },
  paryup: {
    a: { x: -0.58, y: -0.02, r: 0.5 },
    b: { x: 0.9, y: -0.5, r: 0 },
    tint: 1,
    m: { a: { x: 0.95, y: 0.8, r: 0.26 }, b: { x: -0.7, y: 0.6, r: 0 } },
  },
  "oposalud-intro": {
    a: { x: -0.58, y: -0.02, r: 0 },
    b: { x: 0.58, y: -0.5, r: 0.34 },
    tint: 1,
    m: { a: { x: 0.95, y: 0.8, r: 0 }, b: { x: -0.72, y: -0.6, r: 0.3 } },
  },
  oposalud: {
    a: { x: 0.6, y: 0.1, r: 0 },
    b: { x: 0.58, y: -0.02, r: 0.5 },
    tint: 1,
    m: { a: { x: 0.5, y: -0.62, r: 0 }, b: { x: -0.95, y: 0.8, r: 0.26 } },
  },
  // Side by side again, about to rejoin.
  compania: {
    a: { x: 0.6, y: 0.1, r: 0.28 },
    b: { x: 0.84, y: -0.12, r: 0.23 },
    tint: 1,
    m: { a: { x: 0.5, y: -0.62, r: 0.24 }, b: { x: 0.72, y: -0.78, r: 0.2 } },
  },
  // Back to one.
  contacto: {
    a: { x: 0.6, y: 0.06, r: 0.46 },
    b: { x: 0.74, y: -0.14, r: 0.36 },
    tint: 0,
    m: { a: { x: 0.2, y: -0.8, r: 0.34 }, b: { x: 0.42, y: -0.92, r: 0.24 } },
  },
  footer: {
    a: { x: 0.66, y: 0.5, r: 0.26 },
    b: { x: 0.8, y: 0.36, r: 0.19 },
    tint: 0,
    m: { a: { x: 0.5, y: 0.5, r: 0.24 }, b: { x: 0.7, y: 0.4, r: 0.18 } },
  },
};

const smooth = (t: number) => t * t * (3 - 2 * t);
const mixDrop = (p: Drop, q: Drop, t: number): Drop => ({
  x: p.x + (q.x - p.x) * t,
  y: p.y + (q.y - p.y) * t,
  r: p.r + (q.r - p.r) * t,
});

type Resolved = { a: Drop; b: Drop; tint: number };

const resolve = (pose: Pose, narrow: boolean): Resolved =>
  narrow && pose.m ? { a: pose.m.a, b: pose.m.b, tint: pose.tint } : pose;

/**
 * Each section holds its pose while it sits under the middle of the screen.
 * The hand-over to the next pose happens only around the boundary between two
 * sections, over at most 0.3 of a screen on each side, so a drop never starts
 * leaving while its section is still being read.
 */
export function poseAt(
  scrollY: number,
  vh: number,
  sections: { id: string; top: number; bottom: number }[],
  narrow: boolean,
): Resolved {
  const pose = (i: number) => resolve(poses[sections[i].id] ?? poses.hero, narrow);
  if (!sections.length) return resolve(poses.hero, narrow);

  const mid = scrollY + vh / 2;
  for (let i = 0; i < sections.length - 1; i++) {
    const cur = sections[i];
    const next = sections[i + 1];
    const boundary = (cur.bottom + next.top) / 2;
    const half = Math.min(vh * 0.3, (cur.bottom - cur.top) / 2, (next.bottom - next.top) / 2);
    if (mid < boundary - half) return pose(i);
    if (mid <= boundary + half) {
      const t = smooth((mid - (boundary - half)) / (2 * half));
      const p = pose(i);
      const q = pose(i + 1);
      return { a: mixDrop(p.a, q.a, t), b: mixDrop(p.b, q.b, t), tint: p.tint + (q.tint - p.tint) * t };
    }
  }
  return pose(sections.length - 1);
}
