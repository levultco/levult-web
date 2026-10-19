import { products, type Product } from "./products";
import { absoluteUrl, site } from "./site";

const organizationId = absoluteUrl("/#organization");

/** Levult as a company, with the products it runs. */
export function organizationSchema() {
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
        description: site.description,
        owns: products.map((p) => ({ "@id": absoluteUrl(`/features/${p.slug}#app`) })),
      },
      {
        "@type": "WebSite",
        "@id": absoluteUrl("/#website"),
        url: site.url,
        name: site.name,
        inLanguage: "es",
        publisher: { "@id": organizationId },
      },
    ],
  };
}

/** One product: what kind of app it is, who makes it, where it lives. */
export function productSchema(product: Product) {
  const page = absoluteUrl(`/features/${product.slug}`);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MobileApplication",
        "@id": `${page}#app`,
        name: product.name,
        description: product.body,
        applicationCategory: product.category === "Educación" ? "EducationalApplication" : "LifestyleApplication",
        operatingSystem: product.platforms,
        url: product.url,
        sameAs: [product.url],
        inLanguage: "es",
        publisher: { "@id": organizationId },
        creator: { "@id": organizationId },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inicio", item: site.url },
          { "@type": "ListItem", position: 2, name: "Trabajos destacados", item: absoluteUrl("/#destacados") },
          { "@type": "ListItem", position: 3, name: product.name, item: page },
        ],
      },
    ],
  };
}
