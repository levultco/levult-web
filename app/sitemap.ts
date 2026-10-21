import type { MetadataRoute } from "next";
import { legalComplete } from "@/lib/legal";
import { products } from "@/lib/products";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: absoluteUrl("/"), changeFrequency: "monthly", priority: 1 },
    ...products.map((p) => ({
      url: absoluteUrl(`/features/${p.slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    // The legal pages stay out until the company's details are filled in (lib/legal.ts).
    ...(legalComplete
      ? ["/aviso-legal", "/privacidad"].map((path) => ({ url: absoluteUrl(path), changeFrequency: "yearly" as const, priority: 0.2 }))
      : []),
  ];
}
