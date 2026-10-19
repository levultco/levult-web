import { SplitText } from "@/components/ui/SplitText";
import { Roll } from "@/components/ui/Roll";

export function Hero() {
  return (
    <section
      id="top"
      data-scene="hero"
      data-reveal-group="load"
      className="frame relative flex min-h-[100svh] flex-col justify-end pb-[clamp(28px,4vw,56px)] pt-32"
    >
      <SplitText
        as="h1"
        text="Hacemos apps para la vida real."
        className="display max-w-[9ch] text-[clamp(56px,10.4vw,176px)] md:max-w-[10ch]"
      />

      <div className="mt-10 grid gap-8 md:mt-14 md:grid-cols-12 md:items-end md:gap-6">
        <p data-reveal className="max-w-[30ch] text-[clamp(19px,1.5vw,23px)] leading-[1.35] md:col-span-5">
          Levult es la compañía detrás de ParyUp y Oposalud. Las diseñamos, las construimos y las hacemos crecer.
        </p>

        <ul data-reveal className="flex gap-8 text-[clamp(19px,1.5vw,23px)] font-medium md:col-span-4 md:col-start-9 md:justify-end">
          <li>
            <a href="#paryup" className="inline-flex items-center gap-2.5">
              <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-paryup" />
              <Roll>ParyUp</Roll>
            </a>
          </li>
          <li>
            <a href="#oposalud" className="inline-flex items-center gap-2.5">
              <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-oposalud" />
              <Roll>Oposalud</Roll>
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}
