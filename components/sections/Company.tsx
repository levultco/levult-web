import { SplitText } from "@/components/ui/SplitText";

const principles = [
  { title: "Producto propio", text: "Todo lo que lanzamos es nuestro, y lo mantenemos vivo." },
  { title: "Lo usamos nosotros", text: "Si no lo abriríamos cada día, no sale a la calle." },
  { title: "Medimos en personas", text: "Gente que vuelve, planes que se cumplen, plazas que se aprueban. Lo demás es ruido." },
];

export function Company() {
  return (
    <section
      id="compania"
      data-scene="compania"
      aria-labelledby="compania-title"
      className="relative pb-[var(--gap-section)] pt-[clamp(80px,8vw,140px)]"
    >
      <div data-reveal-group className="frame grid grid-cols-1 gap-y-10 md:grid-cols-12 md:gap-x-6">
        <SplitText
          id="compania-title"
          text="Construimos para quedarnos."
          className="display max-w-[13ch] text-[clamp(44px,6vw,104px)] md:col-span-8"
        />
        <p data-reveal className="max-w-[40ch] text-[18px] leading-[1.6] text-ink-soft-dark md:col-span-4 md:self-end">
          Levult diseña, desarrolla y opera sus propios productos digitales. Lanzamos menos, pero cuidamos cada
          uno durante años.
        </p>
      </div>

      <ul data-reveal-group className="frame mt-24 md:mt-32">
        {principles.map((p) => (
          <li key={p.title} data-reveal className="group">
            <div className="grid gap-3 rounded-[22px] px-0 py-8 transition-[background-color,padding] duration-500 ease-[cubic-bezier(.22,1,.36,1)] md:grid-cols-12 md:items-baseline md:gap-6 md:py-10 md:hover:bg-ink-2 md:hover:px-8">
              <h3 className="text-[clamp(32px,4vw,68px)] font-medium leading-none tracking-[-0.045em] md:col-span-7">{p.title}</h3>
              <p className="max-w-[36ch] text-[18px] leading-[1.5] text-ink-soft-dark md:col-span-5">{p.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
