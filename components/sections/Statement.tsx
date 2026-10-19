import { Scrub } from "@/components/ui/Scrub";

/**
 * A held scene: the statement stays centred while it fills with ink and the
 * drops part around it, then slide away.
 */
export function Statement() {
  return (
    <section data-scene="statement" aria-labelledby="statement-title" className="relative h-[220svh]">
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <div className="frame relative mx-auto max-w-[1040px]">
          <h2 id="statement-title" className="sr-only">
            Cómo trabajamos
          </h2>
          <Scrub
            text="El mundo no necesita más apps. Necesita mejores. Construimos productos que merecen existir y nos quedamos para hacerlos crecer."
            className="text-center text-[clamp(32px,4.4vw,72px)] font-medium leading-[1.05] tracking-[-0.04em]"
          />
        </div>
      </div>
    </section>
  );
}
