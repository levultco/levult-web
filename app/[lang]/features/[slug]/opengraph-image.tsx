import { ImageResponse } from "next/og";
import { getProduct, getProducts, productFacts } from "@/lib/products";
import { hasLang, defaultLang, locales } from "@/lib/i18n";
import { OgWordmark, ogFonts, ogSize } from "@/lib/og";
import { site } from "@/lib/site";

export const alt = "Levult";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return locales.flatMap((lang) => productFacts.map((p) => ({ lang, slug: p.slug })));
}

/** Each work's link preview: its name on a dark stage lit by the brand's colours. */
export default async function Image({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang: raw, slug } = await params;
  const lang = hasLang(raw) ? raw : defaultLang;
  const product = getProduct(slug, lang) ?? getProducts(lang)[0];
  const [first, second, third] = product.glow;
  const glow = (color: string, x: number, y: number, w: number, h: number, alpha = "cc") => (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        borderRadius: 999,
        background: `radial-gradient(circle at center, ${color}${alpha} 0%, ${color}00 68%)`, // taste-skill-ignore: drawn light in the share image (no blur available there)
        display: "flex",
      }}
    />
  );

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: site.colors.ink, fontFamily: "Geist", color: "#fff" }}>
        {glow(first, 560, -40, 640, 560)}
        {glow(second, 760, 160, 600, 560)}
        {third ? glow(third, 640, 330, 520, 420, "99") : null}
        <div style={{ position: "absolute", left: 72, top: 64, display: "flex" }}>
          <OgWordmark height={44} color="#ffffff" />
        </div>
        <div style={{ position: "absolute", right: 72, top: 74, display: "flex", fontSize: 22, fontWeight: 500, letterSpacing: "0.02em", color: "rgba(255,255,255,0.72)" }}>
          {`${product.kind} · ${product.category}`.toUpperCase()}
        </div>
        <div style={{ position: "absolute", left: 72, bottom: 72, display: "flex", flexDirection: "column", maxWidth: 820 }}>
          <div style={{ fontSize: 168, fontWeight: 600, letterSpacing: "-0.06em", lineHeight: 1.05 }}>{product.name}</div>
          <div style={{ marginTop: 44, fontSize: 32, fontWeight: 500, letterSpacing: "-0.015em", lineHeight: 1.25, color: "rgba(255,255,255,0.78)" }}>
            {product.summary}
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: await ogFonts() },
  );
}
