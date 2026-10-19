import { nav } from "@/lib/content";

export function Footer() {
  return (
    <footer data-scene="footer" className="frame relative pb-8 pt-[var(--gap-section)]">
      <p
        aria-hidden="true"
        className="select-none whitespace-nowrap text-[29vw] font-medium leading-[0.72] tracking-[-0.075em] md:text-[30.5vw]"
      >
        levult
      </p>
      <div className="mt-10 grid gap-3 text-[15px] md:grid-cols-[1fr_auto_1fr] md:items-baseline md:gap-6">
        <p className="text-ink-soft">Levult · la compañía detrás de ParyUp y Oposalud</p>
        <ul className="flex flex-wrap gap-x-6 gap-y-1">
          {nav.map((item) => (
            <li key={item.href}>
              <a href={item.href} className="link">
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <p className="text-ink-soft md:text-right">© 2026 Levult</p>
      </div>
    </footer>
  );
}
