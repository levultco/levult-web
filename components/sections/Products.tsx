import { SplitText } from "@/components/ui/SplitText";
import { ProductStack } from "./ProductStack";

export function Products() {
  return (
    <section
      id="destacados"
      data-scene="destacados"
      aria-labelledby="destacados-title"
      className="relative py-[var(--gap-section)]"
    >
      <div data-reveal-group className="frame grid gap-8 md:grid-cols-12 md:items-end md:gap-6">
        <SplitText id="destacados-title" text="Trabajos destacados" className="display text-[clamp(64px,9vw,156px)] md:col-span-8" />
        <p data-reveal className="max-w-[40ch] text-[15px] uppercase leading-[1.5] text-ink-soft-dark md:col-span-4 md:pb-4">
          Apps y webs que diseñamos, programamos y operamos nosotros mismos, de la primera idea al día a día.
        </p>
      </div>
      <ProductStack />
    </section>
  );
}
