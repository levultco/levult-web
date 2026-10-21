import type { MetadataRoute } from "next";
import { legalComplete } from "@/lib/legal";
import { productFacts } from "@/lib/products";
import { langTag, pageHref, locales } from "@/lib/i18n";
import { absoluteUrl } from "@/lib/site";

/** One entry per page and language, each naming its translations. */
function page(path: string, changeFrequency: "monthly" | "yearly", priority: number): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(locales.map((l) => [langTag[l], absoluteUrl(pageHref(l, path))]));
  return locales.map((l) => ({ url: absoluteUrl(pageHref(l, path)), changeFrequency, priority, alternates: { languages } }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...page("/", "monthly", 1),
    ...productFacts.flatMap((p) => page(`/features/${p.slug}`, "monthly", 0.8)),
    // The legal pages stay out until the company's details are filled in (lib/legal.ts).
    ...(legalComplete ? ["/aviso-legal", "/privacidad"].flatMap((path) => page(path, "yearly", 0.2)) : []),
  ];
}
