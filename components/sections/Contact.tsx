import { SplitText } from "@/components/ui/SplitText";
import { Roll } from "@/components/ui/Roll";
import { Pill } from "@/components/ui/Pill";
import { contactEmail } from "@/lib/content";
import { getI18n } from "@/lib/i18n/server";

export async function Contact() {
  const { t } = await getI18n();
  return (
    <section
      id="contacto"
      data-scene="contacto"
      aria-labelledby="contacto-title"
      className="frame flex min-h-[120svh] flex-col justify-center py-[var(--gap-section)]"
    >
      <div data-reveal-group className="md:max-w-[58%]">
        <SplitText id="contacto-title" text={t.contact.title} className="display text-[clamp(64px,11vw,190px)]" />
        <p data-reveal className="mt-8 max-w-[36ch] text-[18px] leading-[1.6]">
          {t.contact.text}
        </p>
        <a data-reveal href={`mailto:${contactEmail}`} className="mt-10 inline-block text-[clamp(28px,3.4vw,56px)] font-medium tracking-[-0.04em]">
          <Roll>{contactEmail}</Roll>
        </a>
        <div data-reveal className="mt-10 flex flex-wrap gap-2.5">
          <Pill href={`mailto:${contactEmail}?subject=${encodeURIComponent(t.contact.subjectPress)}`}>{t.contact.press}</Pill>
          <Pill href={`mailto:${contactEmail}?subject=${encodeURIComponent(t.contact.subjectCollaborate)}`} tone="light">
            {t.contact.collaborate}
          </Pill>
          <Pill href={`mailto:${contactEmail}?subject=${encodeURIComponent(t.contact.subjectWork)}`} tone="light">
            {t.contact.work}
          </Pill>
        </div>
      </div>
    </section>
  );
}
