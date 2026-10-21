import { Children, isValidElement, type ReactNode } from "react";
import { Choreography } from "@/components/providers/Choreography";
import { SplitText } from "@/components/ui/SplitText";
import { legal } from "@/lib/legal";

type Props = {
  title: string;
  /** One line under the title: what this page covers. */
  lead: string;
  children: ReactNode;
};

const slug = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** The frame shared by the legal pages: a title, an index and plain, readable text. */
export function LegalPage({ title, lead, children }: Props) {
  // The index lists every section, read from the sections themselves.
  const titles = Children.toArray(children).flatMap((child) =>
    isValidElement<{ title?: string }>(child) && child.props.title ? [child.props.title] : [],
  );
  return (
    <>
      <main>
        <section data-reveal-group="load" aria-labelledby="legal-title" className="frame pb-8 pt-[clamp(130px,13vw,190px)]">
          <SplitText as="h1" id="legal-title" text={title} className="display text-[clamp(44px,7vw,112px)] leading-[0.92]" />
          <p data-reveal className="mt-8 max-w-[44ch] text-[clamp(20px,1.8vw,26px)] leading-[1.4] text-ink-soft">
            {lead}
          </p>
          <p data-reveal className="mt-4 text-[15px] uppercase text-ink-soft">
            Última actualización: {legal.updated}
          </p>
        </section>
        <div className="frame grid gap-10 pb-[var(--gap-section)] pt-6 md:grid-cols-12 md:gap-6">
          <nav aria-label="En esta página" className="hidden md:col-span-3 md:block">
            <ul className="sticky top-28 grid gap-2 text-[15px]">
              {titles.map((t) => (
                <li key={t}>
                  <a href={`#${slug(t)}`} className="link text-ink-soft transition-colors hover:text-ink">
                    {t}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="grid max-w-[66ch] gap-10 md:col-span-8 md:col-start-5">{children}</div>
        </div>
      </main>
      <Choreography />
    </>
  );
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section id={slug(title)} className="scroll-mt-28">
      <h2 className="text-[clamp(22px,2vw,30px)] font-medium leading-[1.15] tracking-[-0.03em]">{title}</h2>
      <div className="mt-4 grid gap-3 text-[17px] leading-[1.6] text-ink-soft [&_a]:text-ink [&_a]:underline [&_a]:underline-offset-4 [&_strong]:font-medium [&_strong]:text-ink [&_ul]:grid [&_ul]:gap-2 [&_ul]:pl-5 [&_ul]:list-disc">
        {children}
      </div>
    </section>
  );
}
