import type { MetadataRoute } from "next";
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
  ];
}
