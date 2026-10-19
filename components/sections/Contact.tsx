import { SplitText } from "@/components/ui/SplitText";
import { Roll } from "@/components/ui/Roll";
import { contactEmail } from "@/lib/content";

const reasons = [
  { label: "Prensa", subject: "Prensa" },
  { label: "Colaboraciones", subject: "Colaboración" },
  { label: "Trabajar con nosotros", subject: "Trabajar en Levult" },
];

export function Contact() {
  return (
    <section
      id="contacto"
      data-scene="contacto"
      aria-labelledby="contacto-title"
      className="frame flex min-h-[100svh] flex-col justify-center pt-[var(--gap-section)]"
    >
      <div data-reveal-group className="md:max-w-[58%]">
        <SplitText id="contacto-title" text="¿Hablamos?" className="display text-[clamp(64px,11vw,190px)]" />
        <p data-reveal className="mt-8 max-w-[36ch] text-[18px] leading-[1.6]">
          Escríbenos si quieres contar algo sobre ParyUp u Oposalud, colaborar con ellas o unirte al equipo.
        </p>
        <a
          data-reveal
          href={`mailto:${contactEmail}`}
          className="mt-10 inline-block text-[clamp(28px,3.4vw,56px)] font-medium tracking-[-0.04em]"
        >
          <Roll>{contactEmail}</Roll>
        </a>
        <ul data-reveal className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-[17px]">
          {reasons.map((r) => (
            <li key={r.label}>
              <a
                href={`mailto:${contactEmail}?subject=${encodeURIComponent(`${r.subject} · Levult`)}`}
                className="link"
              >
                {r.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
