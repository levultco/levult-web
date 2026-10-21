/**
 * Languages. Spanish is the default and lives at the root (`/`); every other
 * language lives under its own prefix (`/en`). This file is safe to import
 * from client components.
 */
export const locales = ["es", "en"] as const;
export type Lang = (typeof locales)[number];
export const defaultLang: Lang = "es";

export const hasLang = (value: string): value is Lang => (locales as readonly string[]).includes(value);

/** BCP 47 tag for `hreflang`, `<html lang>` and structured data. */
export const langTag: Record<Lang, string> = { es: "es-ES", en: "en" };

/** Open Graph locale. */
export const ogLocale: Record<Lang, string> = { es: "es_ES", en: "en_US" };

/** A site path in a language: "/features/x" → "/en/features/x"; "/" → "/en"; "/#a" → "/en#a". */
export function localePath(lang: Lang, path = "/"): string {
  if (lang === defaultLang) return path;
  if (path === "/") return `/${lang}`;
  if (path.startsWith("/#") || path.startsWith("/?")) return `/${lang}${path.slice(1)}`;
  return `/${lang}${path}`;
}

/**
 * Which language a pathname is in, and what it is without the prefix. Spanish
 * has no prefix in the browser, but the pages are built under /es, and a
 * prerendered page sees that internal path: read it as the same thing.
 */
export function parsePath(pathname: string): { lang: Lang; path: string } {
  for (const lang of locales) {
    if (pathname === `/${lang}`) return { lang, path: "/" };
    if (pathname.startsWith(`/${lang}/`)) return { lang, path: pathname.slice(lang.length + 1) };
  }
  return { lang: defaultLang, path: pathname };
}

/** The address as the visitor sees it: "/es/features/x" (the internal one) → "/features/x". */
export function publicPath(pathname: string): string {
  const { lang, path } = parsePath(pathname);
  return localePath(lang, path);
}

/**
 * Pages whose address is written in each language. The key is the page's
 * canonical (Spanish) address, which is also the folder it is built from.
 */
const slugs: Record<string, Record<Lang, string>> = {
  "/aviso-legal": { es: "/aviso-legal", en: "/legal-notice" },
  "/privacidad": { es: "/privacidad", en: "/privacy" },
};

/** A page's address without a language prefix, as it is written in `lang`. */
const slugIn = (path: string, lang: Lang) => slugs[path]?.[lang] ?? path;

/** A page's canonical address, from its address in any language. */
function canonicalOf(path: string) {
  const entry = Object.entries(slugs).find(([, byLang]) => Object.values(byLang).includes(path));
  return entry ? entry[0] : path;
}

/** A page's public address in a language: canonical "/aviso-legal" → "/en/legal-notice". */
export const pageHref = (lang: Lang, canonical: string) => localePath(lang, slugIn(canonical, lang));

/** The same page in another language. */
export function switchPath(pathname: string, to: Lang) {
  const { path } = parsePath(pathname);
  return pageHref(to, canonicalOf(path));
}

/** Fills `{name}` placeholders in a dictionary string. */
export const fmt = (text: string, values: Record<string, string>) => text.replace(/\{(\w+)\}/g, (_, k) => values[k] ?? "");
