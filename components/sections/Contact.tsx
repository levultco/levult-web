import { SplitText } from "@/components/ui/SplitText";
import { Roll } from "@/components/ui/Roll";
import { Pill } from "@/components/ui/Pill";
import { contactEmail } from "@/lib/content";

export function Contact() {
  return (
    <section
      id="contacto"
      data-scene="contacto"
      aria-labelledby="contacto-title"
      className="frame flex min-h-[120svh] flex-col justify-center py-[var(--gap-section)]"
    >
      <div data-reveal-group className="md:max-w-[58%]">
        <SplitText id="contacto-title" text="¿Hablamos?" className="display text-[clamp(64px,11vw,190px)]" />
        <p data-reveal className="mt-8 max-w-[36ch] text-[18px] leading-[1.6]">
          Escríbenos si quieres hablar de alguno de nuestros productos, colaborar con nosotros o unirte al equipo.
        </p>
        <a data-reveal href={`mailto:${contactEmail}`} className="mt-10 inline-block text-[clamp(28px,3.4vw,56px)] font-medium tracking-[-0.04em]">
          <Roll>{contactEmail}</Roll>
        </a>
        <div data-reveal className="mt-10 flex flex-wrap gap-2.5">
          <Pill href={`mailto:${contactEmail}?subject=${encodeURIComponent("Prensa · Levult")}`}>Prensa</Pill>
          <Pill href={`mailto:${contactEmail}?subject=${encodeURIComponent("Colaboración · Levult")}`} tone="light">
            Colaborar
          </Pill>
          <Pill href={`mailto:${contactEmail}?subject=${encodeURIComponent("Trabajar en Levult")}`} tone="light">
            Trabajar aquí
          </Pill>
        </div>
      </div>
    </section>
  );
}
