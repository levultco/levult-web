"use client";

import { useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { Product } from "@/lib/products";
import { localePath, type Lang } from "@/lib/i18n";
import { ProductDevice } from "@/components/product/ProductDevice";
import { DeviceStage } from "@/components/product/DeviceStage";
import { Pill } from "@/components/ui/Pill";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Products as full-width cards that pin and stack: each new one slides over
 * the last, which settles back. Works the same for two products or thirty.
 */
export function ProductStack({ lang, products, viewWork }: { lang: Lang; products: Product[]; viewWork: string }) {
  const root = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const cards = gsap.utils.toArray<HTMLElement>("[data-stack-card]");
        cards.slice(0, -1).forEach((card, i) => {
          gsap.to(card.querySelector("[data-stack-inner]"), {
            scale: 0.92,
            opacity: 0.35,
            ease: "none",
            scrollTrigger: { trigger: cards[i + 1], start: "top bottom", end: "top 14%", scrub: true },
          });
        });
      });
    },
    { scope: root },
  );

  return (
    <ol ref={root} className="frame mt-16 grid gap-6 md:mt-24 md:gap-[12svh]">
      {products.map((p, i) => (
        <li
          key={p.slug}
          data-stack-card
          className="md:sticky"
          style={{ top: `calc(12svh + ${i * 18}px)` }}
        >
          <article
            data-stack-inner
            aria-labelledby={`card-${p.slug}`}
            className="grid origin-top gap-8 bg-ink md:h-[76svh] md:min-h-[560px] md:grid-cols-12 md:gap-6"
          >
            <div className="flex flex-col justify-between gap-10 md:col-span-5 md:py-2">
              <div>
                <p className="text-[15px] uppercase text-ink-soft-dark">
                  {p.kind} · {p.category} · {p.year}
                </p>
                <h3 id={`card-${p.slug}`} className="display mt-5 text-[clamp(56px,7vw,124px)]">
                  {p.name}
                </h3>
                <p className="mt-6 max-w-[30ch] text-[clamp(19px,1.5vw,23px)] leading-[1.35]">{p.summary}</p>
              </div>
              <div>
                <ul className="mb-8 grid gap-2 text-[16px] text-ink-soft-dark">
                  {p.features.slice(0, 4).map((f) => (
                    <li key={f.title}>{f.title}</li>
                  ))}
                </ul>
                <Pill href={localePath(lang, `/features/${p.slug}`)} icon="arrow">
                  {viewWork}
                </Pill>
              </div>
            </div>
            <Link href={localePath(lang, `/features/${p.slug}`)} tabIndex={-1} aria-hidden="true" className="group block md:col-span-7">
              <DeviceStage product={p} className="flex rounded-[24px] pt-10 items-end justify-center ring-1 ring-inset ring-white/10 md:h-full md:pt-0">
                <div className="w-[min(300px,84%)] translate-y-[12%] [mask-image:linear-gradient(to_bottom,#000_70%,transparent_96%)] md:[mask-image:none] transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-y-[11%] md:w-[min(340px,56%)]">
                  <div className="pointer-events-none" inert>
                    <ProductDevice product={p} />
                  </div>
                </div>
              </DeviceStage>
            </Link>
          </article>
        </li>
      ))}
    </ol>
  );
}
