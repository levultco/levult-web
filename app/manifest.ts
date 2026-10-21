import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { es } from "@/lib/i18n/dictionaries/es";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: es.meta.title,
    short_name: site.name,
    description: es.meta.description,
    start_url: "/",
    display: "standalone",
    background_color: site.colors.ground,
    theme_color: site.colors.ground,
    lang: "es",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
