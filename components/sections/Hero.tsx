import { SplitText } from "@/components/ui/SplitText";
import { Pill } from "@/components/ui/Pill";
import { localePath } from "@/lib/i18n";
import { getI18n } from "@/lib/i18n/server";

export async function Hero() {
  const { lang, t } = await getI18n();
  return (
    <section
      id="top"
      data-scene="hero"
      data-reveal-group="load"
      className="frame relative flex min-h-[100svh] flex-col justify-end pb-[clamp(28px,4vw,56px)] pt-32"
    >
      <SplitText
        as="h1"
        text={t.hero.title}
        className="display max-w-[11ch] text-[clamp(52px,9vw,156px)]"
      />

      <div className="mt-10 grid gap-8 md:mt-14 md:grid-cols-12 md:items-end md:gap-6">
        <p data-reveal className="max-w-[32ch] text-[clamp(18px,1.4vw,22px)] leading-[1.4] md:col-span-5">
          {t.hero.text}
        </p>
        <div data-reveal className="flex flex-wrap gap-2.5 md:col-span-6 md:col-start-7 md:justify-end">
          <Pill href={localePath(lang, "/#destacados")} icon="arrow">{t.hero.seeWork}</Pill>
          <Pill href={localePath(lang, "/#compania")} tone="light">{t.hero.company}</Pill>
        </div>
      </div>
    </section>
  );
}
