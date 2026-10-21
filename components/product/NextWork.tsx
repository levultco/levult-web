import Link from "next/link";
import type { Product } from "@/lib/products";
import { DeviceStage } from "./DeviceStage";
import { ProductDevice } from "./ProductDevice";
import { Arrow } from "@/components/ui/Arrow";
import { fmt, localePath, type Lang } from "@/lib/i18n";
import type { Dict } from "@/lib/i18n/dictionaries/es";

/** The way on to the next work: one large card, its stage lit and its device peeking in. */
export function NextWork({ product, lang, t }: { product: Product; lang: Lang; t: Dict["product"] }) {
  return (
    <section aria-labelledby="next-title" className="frame pt-[var(--gap-section)]">
      <div data-reveal-group>
        <Link href={localePath(lang, `/features/${product.slug}`)} data-reveal className="group block" aria-label={fmt(t.nextAria, { name: product.name })}>
          <DeviceStage product={product} className="relative h-[min(78svh,720px)] rounded-[28px]">
            <div className="absolute inset-x-0 top-0 flex items-start justify-between p-6 text-ground md:p-10">
              <p className="text-[15px] uppercase">{t.next}</p>
              <p className="text-[15px] uppercase text-ink-soft-dark">
                {product.kind} · {product.category}
              </p>
            </div>
            <div className="absolute bottom-0 right-[6%] w-[min(300px,40%)] translate-y-[38%] transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-y-[30%] max-md:hidden">
              <div className="pointer-events-none" inert>
                <ProductDevice product={product} />
              </div>
            </div>
            <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-6 p-6 text-ground md:p-10 md:pr-[calc(6%+min(300px,40%)+40px)]">
              <span id="next-title" className="display text-[clamp(64px,11vw,190px)] transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-x-3">
                {product.name}
              </span>
              <span className="pill pill--light mb-2 shrink-0 md:mb-6">
                {t.viewWork}
                <Arrow />
              </span>
            </div>
          </DeviceStage>
        </Link>
      </div>
    </section>
  );
}
