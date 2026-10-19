import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { wordmark } from "@/components/brand/logo-paths";

/** Shared pieces for the generated link-preview images (1200×630). */

export const ogSize = { width: 1200, height: 630 };

const fontDir = join(process.cwd(), "node_modules/geist/dist/fonts/geist-sans");

export async function ogFonts() {
  const [medium, semibold] = await Promise.all([
    readFile(join(fontDir, "Geist-Medium.ttf")),
    readFile(join(fontDir, "Geist-SemiBold.ttf")),
  ]);
  return [
    { name: "Geist", data: medium, weight: 500 as const, style: "normal" as const },
    { name: "Geist", data: semibold, weight: 600 as const, style: "normal" as const },
  ];
}

/** The Levult wordmark at a given height, in any colour. */
export function OgWordmark({ height, color }: { height: number; color: string }) {
  const width = (wordmark.w / wordmark.h) * height;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${wordmark.w} ${wordmark.h}`}>
      <path d={wordmark.d} fill={color} fillRule="evenodd" />
    </svg>
  );
}
