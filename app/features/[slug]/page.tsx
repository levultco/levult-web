import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { products, getProduct, domainOf } from "@/lib/products";
import { Choreography } from "@/components/providers/Choreography";
import { ProductDevice } from "@/components/product/ProductDevice";
import { DeviceStage } from "@/components/product/DeviceStage";
import { NextWork } from "@/components/product/NextWork";
import { WebsiteLink } from "@/components/product/WebsiteLink";
import { SplitText } from "@/components/ui/SplitText";
import { Arrow } from "@/components/ui/Arrow";
import { Pill } from "@/components/ui/Pill";
import { JsonLd } from "@/components/seo/JsonLd";
import { productSchema } from "@/lib/structured-data";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/features/[slug]">): Promise<Metadata> {
  const product = getProduct((await params).slug);
  if (!product) return {};
  const title = `${product.name}: ${product.lead.replace(/\.$/, "")}`;
  const description = `${product.summary} ${product.kind} de ${product.category.toLowerCase()} creada por Levult.`;
  const path = `/features/${product.slug}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", url: path, title: `${title} — Levult`, description },
    twitter: { card: "summary_large_image", title: `${title} — Levult`, description },
  };
}

export default async function ProductPage({ params }: PageProps<"/features/[slug]">) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const next = products[(products.indexOf(product) + 1) % products.length];
  const facts = [
    { term: "Tipo", detail: product.kind },
    { term: "Categoría", detail: product.category },
    { term: "Plataformas", detail: product.platforms },
    { term: "Estado", detail: product.status },
  ];

  return (
    <>
      <JsonLd data={productSchema(product)} />
      <main>
        {/* Opening: the name, what it is, the facts and the way to the real thing. */}
        <section data-reveal-group="load" aria-labelledby="product-title" className="frame pb-16 pt-[clamp(140px,16vw,220px)]">
          <Link href="/#destacados" className="inline-flex items-center gap-2 text-[15px] uppercase">
            <Arrow className="rotate-180" />
            Trabajos destacados
          </Link>
          <SplitText as="h1" id="product-title" text={product.name} className="display mt-8 text-[clamp(72px,15vw,260px)] leading-[0.82]" />
          <div className="mt-12 grid gap-10 md:grid-cols-12 md:gap-6">
            <div className="md:col-span-6">
              <p data-reveal className="text-[clamp(24px,2.4vw,38px)] font-medium leading-[1.15] tracking-[-0.03em]">
                {product.lead}
              </p>
              <div data-reveal className="mt-10 flex flex-wrap gap-2.5">
                <Pill href={product.url} icon="external">
                  {`Visitar ${domainOf(product.url)}`}
                </Pill>
              </div>
            </div>
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

        {/* The live interface, lit by the brand. */}
        <section aria-label={`${product.name} en funcionamiento`} className="frame">
          <div data-reveal-group>
            <div data-reveal>
              <DeviceStage product={product} className="grid min-h-[min(92svh,900px)] place-items-center rounded-[28px] py-16">
                <div className="w-[min(320px,78vw,42svh)]">
                  <ProductDevice product={product} />
                </div>
              </DeviceStage>
            </div>
            {product.hint && (
              <p data-reveal className="mt-5 text-[15px] uppercase text-ink-soft">
                {product.hint}
              </p>
            )}
          </div>
        </section>

        {/* What it does, and for whom. */}
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
          {product.audience && (
            <div data-reveal-group className="frame mt-20 grid gap-6 md:grid-cols-12">
              <p data-reveal className="text-[15px] uppercase text-ink-soft-dark md:col-span-3">
                {product.audience.title}
              </p>
              <ul data-reveal className="flex flex-wrap gap-2.5 md:col-span-9">
                {product.audience.items.map((item) => (
                  <li key={item} className="pill pill--light !h-12 normal-case">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        <WebsiteLink product={product} />
        {next.slug !== product.slug && <NextWork product={next} />}
      </main>
      <Choreography />
    </>
  );
}
