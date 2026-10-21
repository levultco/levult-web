import { productFacts, type Product } from "./products";
import { absoluteUrl, site } from "./site";
import { langTag, localePath, type Lang } from "./i18n";
import { getDictionary } from "./i18n/server";

const organizationId = absoluteUrl("/#organization");

/** Levult as a company, with the products it runs. */
export function organizationSchema(lang: Lang) {
  const { meta } = getDictionary(lang);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationId,
        name: site.name,
        url: site.url,
        logo: absoluteUrl("/brand/levult-symbol.svg"),
        email: site.email,
        description: meta.description,
        owns: productFacts.map((p) => ({ "@id": absoluteUrl(localePath(lang, `/features/${p.slug}`) + "#app") })),
      },
      {
        "@type": "WebSite",
        "@id": absoluteUrl(`${localePath(lang, "/")}#website`),
        url: absoluteUrl(localePath(lang, "/")),
        name: site.name,
        inLanguage: langTag[lang],
        publisher: { "@id": organizationId },
      },
    ],
  };
}

/** One product: what kind of app it is, who makes it, where it lives. */
export function productSchema(product: Product, lang: Lang) {
  const { meta, products: copy } = getDictionary(lang);
  const page = absoluteUrl(localePath(lang, `/features/${product.slug}`));
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MobileApplication",
        "@id": `${page}#app`,
        name: product.name,
        description: product.body,
        applicationCategory: product.slug === "oposalud" ? "EducationalApplication" : "LifestyleApplication",
        operatingSystem: product.platforms,
        url: product.url,
        sameAs: [product.url],
        inLanguage: langTag[lang],
        publisher: { "@id": organizationId },
        creator: { "@id": organizationId },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: meta.breadcrumbHome, item: absoluteUrl(localePath(lang, "/")) },
          { "@type": "ListItem", position: 2, name: copy.title, item: absoluteUrl(localePath(lang, "/#destacados")) },
          { "@type": "ListItem", position: 3, name: product.name, item: page },
        ],
      },
    ],
  };
}
