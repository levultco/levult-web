import type { Metadata } from "next";
import { langTag, pageHref, locales, defaultLang, type Lang } from "./index";

/**
 * Canonical and `hreflang` links for a page: every language names the others,
 * and Spanish is the fallback for anyone else (x-default).
 */
export function alternatesFor(lang: Lang, path = "/"): NonNullable<Metadata["alternates"]> {
  return {
    canonical: pageHref(lang, path),
    languages: {
      ...Object.fromEntries(locales.map((l) => [langTag[l], pageHref(l, path)])),
      "x-default": pageHref(defaultLang, path),
    },
  };
}
