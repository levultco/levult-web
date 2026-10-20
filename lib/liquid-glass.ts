/**
 * The "glass" morph of the liquid-morphology slideshow, as a displacement map.
 *
 * Inside a bubble the incoming page is refracted: pulled along the radius
 * (stronger toward the rim, clear at the centre), rippled by concentric waves
 * and carried by a slow swirl. The map is drawn ONCE, in the bubble's own
 * coordinates (the disc fills the image), and the SVG filter then moves and
 * scales that image to follow the growing bubble. Nothing is regenerated per
 * frame, so the filter never waits on an image that is still loading (which
 * used to throw the whole page sideways for a frame).
 *
 * Red/green encode x/y: 128 is no movement. Outside the disc it is neutral.
 */

const SIZE = 256;

/** Peak displacement as a fraction of the screen's shorter side. */
export const GLASS = {
  refraction: 0.045,
  waves: 0.012,
  swirl: 0.035,
};
const RANGE = (GLASS.refraction + GLASS.waves + GLASS.swirl) * 1.2;

/** Filter `scale` (px) that reproduces the encoded displacement at full strength. */
export const glassScale = (vmin: number) => RANGE * 2 * vmin;

const smooth = (a: number, b: number, v: number) => {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

let cached: string | null = null;

export function glassMapUrl() {
  if (cached) return cached;
  const canvas = document.createElement("canvas");
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const image = ctx.createImageData(SIZE, SIZE);
  const data = image.data;
  const half = SIZE / 2;

  for (let j = 0; j < SIZE; j++) {
    for (let i = 0; i < SIZE; i++) {
      const x = (i + 0.5 - half) / half;
      const y = (j + 0.5 - half) / half;
      const nd = Math.hypot(x, y);
      let ox = 0;
      let oy = 0;
      if (nd < 1 && nd > 0.002) {
        const df = smooth(0.3, 1, nd);
        const wave = (Math.sin(nd * 22) + Math.sin(nd * 35) * 0.7 + Math.sin(nd * 50) * 0.5) / 3;
        const radial = GLASS.refraction * df ** 1.5 + GLASS.waves * wave * df;
        const ux = x / nd;
        const uy = y / nd;
        const sx = Math.sin(x * 4.5 + y * 3.1) + Math.sin(y * 8.5 - x * 2.2) * 0.6;
        const sy = Math.cos(y * 4.1 - x * 2.7) + Math.cos(x * 7.6 + y * 1.9) * 0.6;
        const inner = smooth(0.05, 0.4, nd);
        // Ease to nothing at the rim so the lens doesn't buzz against the clip edge.
        const edge = smooth(1, 0.94, nd);
        ox = (-ux * radial + sx * GLASS.swirl * inner) * edge;
        oy = (-uy * radial + sy * GLASS.swirl * inner) * edge;
      }
      const k = (j * SIZE + i) * 4;
      data[k] = Math.round(128 + (ox / (RANGE * 2)) * 255);
      data[k + 1] = Math.round(128 + (oy / (RANGE * 2)) * 255);
      data[k + 2] = 128;
      data[k + 3] = 255;
    }
  }
  ctx.putImageData(image, 0, 0);
  cached = canvas.toDataURL("image/png");
  return cached;
}
