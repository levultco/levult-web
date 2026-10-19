import { ImageResponse } from "next/og";
import { OgWordmark, ogFonts, ogSize } from "@/lib/og";
import { site } from "@/lib/site";

export const alt = "Levult — Creamos lo que viene";
export const size = ogSize;
export const contentType = "image/png";

/** The home page's link preview: the hero in miniature, with its glossy ink drop. */
export default async function Image() {
  const { ground, ink } = site.colors;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: ground, fontFamily: "Geist", color: ink }}>
        {/* The drop: black glass with a soft studio highlight. */}
        <div
          style={{
            position: "absolute",
            right: -90,
            top: 120,
            width: 560,
            height: 520,
            borderRadius: "48% 52% 46% 54% / 55% 48% 52% 45%",
            background: "radial-gradient(circle at 38% 30%, #4a4a52 0%, #16161a 32%, #050506 70%)", // taste-skill-ignore: drawn light in the share image (no blur available there)
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 210,
            top: 180,
            width: 150,
            height: 70,
            borderRadius: 999,
            background: "radial-gradient(ellipse at center, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0) 70%)", // taste-skill-ignore: drawn light in the share image (no blur available there)
            display: "flex",
          }}
        />
        <div style={{ position: "absolute", left: 72, top: 64, display: "flex" }}>
          <OgWordmark height={52} color={ink} />
        </div>
        <div style={{ position: "absolute", left: 72, bottom: 72, display: "flex", flexDirection: "column", maxWidth: 760 }}>
          {/* One div per line: the image renderer mis-measures wrapped display type. */}
          <div style={{ display: "flex", flexDirection: "column", fontSize: 118, fontWeight: 600, letterSpacing: "-0.055em", lineHeight: 1 }}>
            <div style={{ display: "flex" }}>Creamos lo</div>
            <div style={{ display: "flex" }}>que viene.</div>
          </div>
          <div style={{ marginTop: 40, fontSize: 28, fontWeight: 500, color: "#4a4a52", letterSpacing: "-0.01em", lineHeight: 1.3, maxWidth: 640 }}>
            Productos digitales propios, de la primera idea al mundo real.
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: await ogFonts() },
  );
}
