import { contactEmail } from "./content";

/**
 * Site-wide facts used by metadata, the sitemap, link previews and
 * structured data. Anything written in words lives in lib/i18n/dictionaries.
 * Set NEXT_PUBLIC_SITE_URL in production if the domain ever differs from
 * levult.com.
 */
export const site = {
  name: "Levult",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://levult.com").replace(/\/$/, ""),
  email: contactEmail,
  colors: { ground: "#F0F1FA", ink: "#0C0C0D" },
};

export const absoluteUrl = (path = "/") => `${site.url}${path.startsWith("/") ? path : `/${path}`}`;
