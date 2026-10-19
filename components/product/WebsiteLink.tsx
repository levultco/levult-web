import type { Product } from "@/lib/products";
import { domainOf } from "@/lib/products";
import { Roll } from "@/components/ui/Roll";

/** The product's own website, set as the largest thing on the screen. */
export function WebsiteLink({ product }: { product: Product }) {
  const domain = domainOf(product.url);
  return (
    <section aria-labelledby="web-title" className="frame pt-[var(--gap-section)]">
      <div data-reveal-group className="grid gap-6 md:grid-cols-12 md:items-end">
        <h2 id="web-title" data-reveal className="text-[15px] uppercase text-ink-soft md:col-span-12">
          La web de {product.name}
        </h2>
        <a
          data-reveal
          href={product.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-wrap items-end justify-between gap-6 md:col-span-12"
        >
          <span className="display text-[clamp(48px,9vw,160px)]">
            <Roll>{domain}</Roll>
          </span>
          <span className="pill pill--dark mb-3 md:mb-6">
            Visitar web
            <svg className="arrow" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M3 11 11 3M5 3h6v6" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </span>
        </a>
      </div>
    </section>
  );
}
