import { contactEmail } from "./content";

/**
 * Site-wide facts used by metadata, the sitemap, link previews and
 * structured data. Set NEXT_PUBLIC_SITE_URL in production if the domain
 * ever differs from levult.com.
 */
export const site = {
  name: "Levult",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://levult.com").replace(/\/$/, ""),
  title: "Levult — Creamos lo que viene",
  tagline: "Creamos lo que viene.",
  description:
    "Levult es una empresa tecnológica que diseña, desarrolla y hace crecer sus propios productos digitales, como ParyUp y Oposalud. De la primera idea al mundo real.",
  locale: "es_ES",
  email: contactEmail,
  colors: { ground: "#F0F1FA", ink: "#0C0C0D" },
};

export const absoluteUrl = (path = "/") => `${site.url}${path.startsWith("/") ? path : `/${path}`}`;
