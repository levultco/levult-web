import type { Metadata } from "next";
import { Choreography } from "@/components/providers/Choreography";
import { SplitText } from "@/components/ui/SplitText";
import { Pill } from "@/components/ui/Pill";
import { getProducts } from "@/lib/products";
import { localePath } from "@/lib/i18n";
import { getI18n } from "@/lib/i18n/server";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function NotFound() {
  const { lang, t } = await getI18n();
  return (
    <>
      <main>
        <section data-reveal-group="load" aria-labelledby="not-found-title" className="frame flex min-h-svh flex-col justify-center pb-16 pt-[clamp(140px,16vw,220px)]">
          <p data-reveal className="text-[15px] uppercase text-ink-soft">
            {t.notFound.code}
          </p>
          <SplitText as="h1" id="not-found-title" text={t.notFound.title} className="display mt-8 max-w-[14ch] text-[clamp(56px,10vw,170px)] leading-[0.9]" />
          <p data-reveal className="mt-10 max-w-[38ch] text-[clamp(20px,1.8vw,26px)] leading-[1.4] text-ink-soft">
            {t.notFound.text}
          </p>
          <div data-reveal className="mt-10 flex flex-wrap gap-2.5">
            <Pill href={localePath(lang, "/")}>{t.notFound.home}</Pill>
            {getProducts(lang).map((p) => (
              <Pill key={p.slug} href={localePath(lang, `/features/${p.slug}`)} tone="light" icon="arrow">
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
