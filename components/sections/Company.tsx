import { SplitText } from "@/components/ui/SplitText";

const principles = [
  { title: "Hacemos pocas cosas", text: "Dos apps, no veinte. Cada una con su equipo y toda nuestra atención." },
  { title: "Las usamos nosotros", text: "Si no la abriríamos cada día, no sale a la calle." },
  { title: "Medimos en personas", text: "Planes que se cumplen y plazas que se aprueban. Lo demás es ruido." },
];

export function Company() {
  return (
    <section id="compania" data-scene="compania" aria-labelledby="compania-title" className="pt-[var(--gap-section)]">
      <div data-reveal-group className="frame grid grid-cols-1 gap-y-10 md:grid-cols-12 md:gap-x-6">
        <SplitText
          id="compania-title"
          text="Una compañía pequeña con dos apps."
          className="display max-w-[11ch] text-[clamp(48px,6.4vw,112px)] md:col-span-8"
        />
        <p data-reveal className="max-w-[40ch] text-[18px] leading-[1.6] md:col-span-5">
          Levult es la empresa matriz de ParyUp y Oposalud. Un equipo pequeño que diseña, programa y opera sus
          propios productos, sin clientes ni encargos: solo lo que creemos que hace falta.
        </p>
      </div>

      <ul data-reveal-group className="frame mt-24 md:mt-32">
        {principles.map((p) => (
          <li key={p.title} data-reveal className="group">
            <div className="grid gap-3 py-8 transition-[padding] duration-500 ease-[cubic-bezier(.22,1,.36,1)] md:grid-cols-12 md:items-baseline md:gap-6 md:py-10 md:group-hover:pl-6">
              <h3 className="text-[clamp(34px,4.2vw,72px)] font-medium leading-none tracking-[-0.045em] md:col-span-7">
                {p.title}
              </h3>
              <p className="max-w-[34ch] text-[18px] leading-[1.5] text-ink-soft md:col-span-4 md:col-start-9">{p.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
