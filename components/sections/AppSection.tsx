import type { ReactNode } from "react";
import { SplitText } from "@/components/ui/SplitText";

type Feature = { title: string; text: string };

type Props = {
  id: "paryup" | "oposalud";
  name: string;
  color: string;
  side: "left" | "right";
  lead: string;
  body: string;
  features: Feature[];
  facts: { term: string; detail: string }[];
  device: ReactNode;
  deviceNote: string;
};

/** One app of the company: its name at full width, its live interface over its drop. */
export function AppSection({ id, name, color, side, lead, body, features, facts, device, deviceNote }: Props) {
  const deviceCol = side === "left" ? "md:col-span-5 md:col-start-1" : "md:col-span-5 md:col-start-8 md:row-start-1";
  const textCol = side === "left" ? "md:col-span-6 md:col-start-7" : "md:col-span-6 md:col-start-1 md:row-start-1";

  return (
    <section id={id} aria-labelledby={`${id}-title`} className="relative">
      <div data-reveal-group data-scene={`${id}-intro`} className="frame pb-16 pt-[var(--gap-section)] md:pb-24">
        <div className={`flex flex-col gap-4 md:flex-row md:items-end md:justify-between ${side === "right" ? "md:flex-row-reverse" : ""}`}>
          <SplitText id={`${id}-title`} text={name} className="display text-[clamp(64px,17vw,300px)] leading-[0.8]" />
          <p data-reveal className="flex items-center gap-3 pb-[1.2vw] text-[18px] font-medium">
            <span aria-hidden="true" className="h-3 w-3 rounded-full" style={{ background: color }} />
            Una app de Levult
          </p>
        </div>
      </div>

      <div data-scene={id} className="frame grid grid-cols-1 gap-y-16 md:grid-cols-12 md:gap-x-6">
        <div className={`${deviceCol} md:self-start md:sticky md:top-[12svh]`}>
          <div data-reveal-group className="flex flex-col items-center">
            <div data-reveal className="w-[min(320px,78vw)] md:w-[min(320px,100%,38svh)]">
              {device}
            </div>
          </div>
        </div>

        <div className={`${textCol} md:pt-[6svh]`}>
          <div data-reveal-group>
            <p data-reveal className="text-[clamp(26px,2.4vw,38px)] font-medium leading-[1.15] tracking-[-0.03em]">
              {lead}
            </p>
            <p data-reveal className="mt-8 max-w-[46ch] text-[18px] leading-[1.6]">
              {body}
            </p>
            <p data-reveal className="mt-8 flex items-center gap-3 text-[16px] font-medium">
              <span aria-hidden="true" className="grid h-8 w-8 place-items-center rounded-full text-ground" style={{ background: color }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" className={side === "left" ? "md:rotate-180" : ""}>
                  <path d="M2 7h10M8 3l4 4-4 4" className="max-md:hidden" />
                  <path d="M7 12V2M3 6l4-4 4 4" className="md:hidden" />
                </svg>
              </span>
              {deviceNote}
            </p>
          </div>

          <ul data-reveal-group className="mt-20 grid gap-3">
            {features.map((f) => (
              <li
                key={f.title}
                data-reveal
                className="group grid gap-2 bg-ground-2 px-6 py-6 transition-colors duration-300 hover:bg-ink hover:text-ground md:grid-cols-[1fr_1.1fr] md:gap-6 md:px-8 md:py-7"
              >
                <h3 className="text-[clamp(21px,1.7vw,26px)] font-medium leading-tight tracking-[-0.025em]">{f.title}</h3>
                <p className="text-[16px] leading-[1.5] text-ink-soft transition-colors duration-300 group-hover:text-ground">{f.text}</p>
              </li>
            ))}
          </ul>

          <dl data-reveal-group className="mt-16 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3">
            {facts.map((f) => (
              <div key={f.term} data-reveal>
                <dt className="text-[15px] text-ink-soft">{f.term}</dt>
                <dd className="mt-1 text-[18px] font-medium">{f.detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
