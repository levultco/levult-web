import type { Metadata } from "next";
import { Choreography } from "@/components/providers/Choreography";
import { SplitText } from "@/components/ui/SplitText";
import { Pill } from "@/components/ui/Pill";
import { products } from "@/lib/products";

export const metadata: Metadata = {
  title: "Página no encontrada",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <>
      <main>
        <section data-reveal-group="load" aria-labelledby="not-found-title" className="frame flex min-h-svh flex-col justify-center pb-16 pt-[clamp(140px,16vw,220px)]">
          <p data-reveal className="text-[15px] uppercase text-ink-soft">
            Error 404
          </p>
          <SplitText as="h1" id="not-found-title" text="Esta página se nos ha escapado." className="display mt-8 max-w-[14ch] text-[clamp(56px,10vw,170px)] leading-[0.9]" />
          <p data-reveal className="mt-10 max-w-[38ch] text-[clamp(20px,1.8vw,26px)] leading-[1.4] text-ink-soft">
            El enlace puede estar roto o la página haberse movido. Vuelve al inicio o entra directo a uno de nuestros trabajos.
          </p>
          <div data-reveal className="mt-10 flex flex-wrap gap-2.5">
            <Pill href="/">Volver al inicio</Pill>
            {products.map((p) => (
              <Pill key={p.slug} href={`/features/${p.slug}`} tone="light" icon="arrow">
                {p.name}
              </Pill>
            ))}
          </div>
        </section>
      </main>
      <Choreography />
    </>
  );
}
