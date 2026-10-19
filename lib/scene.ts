/**
 * Where the two drops sit for each section of the page.
 * x / y are fractions of the half-screen (−1 left/bottom … 1 right/top),
 * r is a fraction of the half-height, tint 0 = ink (Levult), 1 = app colours.
 * On narrow screens `m` overrides the desktop pose.
 */
export type Drop = { x: number; y: number; r: number };
export type Pose = { a: Drop; b: Drop; tint: number; m?: { a: Drop; b: Drop } };

// Push a pose off the screen sideways: whatever sits left leaves left,
// whatever sits right leaves right. Drops keep their size as they go.
const offscreen = (d: Drop): Drop => ({ ...d, x: d.x < 0 ? -1.9 : 1.9 });
const exit = (p: Pose): Pose => ({
  a: offscreen(p.a),
  b: offscreen(p.b),
  tint: p.tint,
  m: p.m && { a: offscreen(p.m.a), b: offscreen(p.m.b) },
});

// The fluid lives on the white stretches at the page's two ends: the opening
// and statement, then the invitation to talk and the footer. Before the black
// panel reaches them the drops slide out to the sides, and they slide back in
// only once the panel has left the screen.
const hero: Pose = {
  a: { x: 0.6, y: 0.16, r: 0.42 },
  b: { x: 0.8, y: -0.22, r: 0.32 },
  tint: 0,
  m: { a: { x: 0.1, y: 0.42, r: 0.4 }, b: { x: 0.32, y: 0.26, r: 0.3 } },
};
// While the statement is read the form parts in two, one drop on each side.
const statement: Pose = {
  a: { x: -0.8, y: 0.48, r: 0.26 },
  b: { x: 0.8, y: -0.48, r: 0.3 },
  tint: 0,
  m: { a: { x: -0.72, y: 0.6, r: 0.26 }, b: { x: 0.72, y: -0.7, r: 0.28 } },
};
const contacto: Pose = {
  a: { x: 0.6, y: 0.06, r: 0.46 },
  b: { x: 0.74, y: -0.14, r: 0.36 },
  tint: 0,
  m: { a: { x: 0.2, y: -0.8, r: 0.34 }, b: { x: 0.42, y: -0.92, r: 0.24 } },
};
// At the very end the drops fuse again and settle on the end of the giant
// wordmark, over the "lt", so the name still reads whole.
const footer: Pose = {
  a: { x: 0.56, y: -0.34, r: 0.34 },
  b: { x: 0.7, y: -0.5, r: 0.24 },
  tint: 0,
  m: { a: { x: 0.52, y: -0.58, r: 0.22 }, b: { x: 0.7, y: -0.68, r: 0.16 } },
};

export const poses: Record<string, Pose> = {
  hero,
  statement,
  // Under the black panel the drops wait off screen: first where the
  // statement sent them, then (unseen, behind the panel) below and right of
  // the contact pose, so they rise in through the white that opens up under
  // the panel's bottom edge.
  destacados: exit(statement),
  compania: {
    a: { x: 1.45, y: -1.1, r: contacto.a.r },
    b: { x: 1.6, y: -1.2, r: contacto.b.r },
    tint: 0,
    m: { a: { x: 1.45, y: -1.1, r: contacto.m!.a.r }, b: { x: 1.6, y: -1.2, r: contacto.m!.b.r } },
  },
  contacto,
  footer,
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

export type SceneSection = { id: string; top: number; bottom: number; dark: boolean };

/**
 * Each section holds its pose while it sits under the middle of the screen,
 * and hands over to the next one around their boundary. A dark section is
 * opaque, so the hand-over is moved: drops finish leaving before its top edge
 * comes into view, and only start returning once its bottom edge has gone.
 */
export function poseAt(scrollY: number, vh: number, sections: SceneSection[], narrow: boolean): Resolved {
  const pose = (i: number) => resolve(poses[sections[i].id] ?? poses.hero, narrow);
  if (!sections.length) return resolve(poses.hero, narrow);

  const mid = scrollY + vh / 2;
  for (let i = 0; i < sections.length - 1; i++) {
    const cur = sections[i];
    const next = sections[i + 1];
    let span: number;
    let start: number;
    const room = Math.min(cur.bottom - cur.top, next.bottom - next.top);
    if (next.dark && !cur.dark) {
      // Leave briskly, and be gone by the time the panel's top edge reaches
      // the bottom of the screen.
      span = Math.min(vh * 0.35, room);
      start = next.top - vh / 2 - vh * 0.08 - span;
    } else if (cur.dark && !next.dark) {
      // Arrive with the white: start when the panel's bottom edge is three
      // quarters up the screen, finish as it leaves the top.
      span = Math.min(vh * 0.75, room);
      start = cur.bottom - vh * 0.25;
    } else {
      // Between two light sections, mostly once the next one has the middle.
      span = Math.min(vh * 0.6, room);
      start = (cur.bottom + next.top) / 2 - span * 0.2;
    }
    if (mid < start) return pose(i);
    if (mid <= start + span) {
      const t = smooth((mid - start) / span);
      const p = pose(i);
      const q = pose(i + 1);
      return { a: mixDrop(p.a, q.a, t), b: mixDrop(p.b, q.b, t), tint: p.tint + (q.tint - p.tint) * t };
    }
  }
  return pose(sections.length - 1);
}
