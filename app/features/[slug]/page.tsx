import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { products, getProduct } from "@/lib/products";
import { Choreography } from "@/components/providers/Choreography";
import { ProductDevice } from "@/components/product/ProductDevice";
import { SplitText } from "@/components/ui/SplitText";
import { Arrow } from "@/components/ui/Arrow";
import { Pill } from "@/components/ui/Pill";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/features/[slug]">): Promise<Metadata> {
  const product = getProduct((await params).slug);
  return product ? { title: product.name, description: product.summary } : {};
}

export default async function ProductPage({ params }: PageProps<"/features/[slug]">) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const index = products.indexOf(product);
  const next = products[(index + 1) % products.length];
  const facts = [
    { term: "Tipo", detail: product.kind },
    { term: "Categoría", detail: product.category },
    { term: "Plataformas", detail: product.platforms },
    { term: "Desde", detail: product.year },
  ];

  return (
    <>
      <main>
        <section data-reveal-group="load" aria-labelledby="product-title" className="frame pb-16 pt-[clamp(140px,16vw,220px)]">
          <Link href="/#destacados" className="inline-flex items-center gap-2 text-[15px] uppercase">
            <Arrow className="rotate-180" />
            Trabajos destacados
          </Link>
          <SplitText as="h1" id="product-title" text={product.name} className="display mt-8 text-[clamp(72px,15vw,260px)] leading-[0.82]" />
          <div className="mt-12 grid gap-10 md:grid-cols-12 md:gap-6">
            <p data-reveal className="text-[clamp(24px,2.4vw,38px)] font-medium leading-[1.15] tracking-[-0.03em] md:col-span-6">
              {product.lead}
            </p>
            <dl data-reveal className="grid grid-cols-2 gap-x-6 gap-y-6 md:col-span-5 md:col-start-8">
              {facts.map((f) => (
                <div key={f.term}>
                  <dt className="text-[15px] uppercase text-ink-soft">{f.term}</dt>
                  <dd className="mt-1 text-[18px] font-medium">{f.detail}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section aria-label={`${product.name} en funcionamiento`} className="frame">
          <div data-reveal-group>
            <div data-reveal className={`${product.stage} relative grid min-h-[min(92svh,900px)] place-items-center overflow-hidden rounded-[28px] py-16`}>
              <div className="w-[min(320px,78vw,42svh)]">
                <ProductDevice product={product} />
              </div>
            </div>
            {product.hint && (
              <p data-reveal className="mt-5 text-[15px] uppercase text-ink-soft">
                {product.hint}
              </p>
            )}
          </div>
        </section>

        <section aria-labelledby="product-features" className="theme-dark relative z-10 mt-[var(--gap-section)] rounded-[clamp(24px,3vw,44px)] py-[var(--gap-section)]">
          <div data-reveal-group className="frame grid gap-10 md:grid-cols-12 md:gap-6">
            <h2 id="product-features" className="display text-[clamp(44px,5.4vw,92px)] md:col-span-5">
              Qué hace
            </h2>
            <p data-reveal className="max-w-[46ch] text-[20px] leading-[1.55] text-ink-soft-dark md:col-span-6 md:col-start-7 md:self-end">
              {product.body}
            </p>
          </div>
          <ul data-reveal-group className="frame mt-20">
            {product.features.map((f) => (
              <li key={f.title} data-reveal>
                <div className="grid gap-3 rounded-[22px] py-8 transition-[background-color,padding] duration-500 md:grid-cols-12 md:items-baseline md:gap-6 md:py-10 md:hover:bg-ink-2 md:hover:px-8">
                  <h3 className="text-[clamp(30px,3.6vw,60px)] font-medium leading-none tracking-[-0.045em] md:col-span-7">{f.title}</h3>
                  <p className="max-w-[36ch] text-[18px] leading-[1.5] text-ink-soft-dark md:col-span-5">{f.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {next.slug !== product.slug && (
          <section aria-labelledby="next-title" className="frame py-[var(--gap-section)]">
            <div data-reveal-group>
              <p data-reveal className="text-[15px] uppercase text-ink-soft">Siguiente trabajo</p>
              <Link href={`/features/${next.slug}`} className="group mt-4 flex flex-wrap items-end justify-between gap-6">
                <span id="next-title" className="display text-[clamp(64px,11vw,190px)] transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-x-4">
                  {next.name}
                </span>
                <span className="pill pill--dark mb-4">
                  Ver trabajo
                  <Arrow />
                </span>
              </Link>
            </div>
            <div data-reveal-group className="mt-16 flex">
              <Pill href="/#contacto" tone="light">Hablemos</Pill>
            </div>
          </section>
        )}
      </main>
      <Choreography />
    </>
  );
}
