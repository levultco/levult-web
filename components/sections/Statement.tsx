import { Scrub } from "@/components/ui/Scrub";

export function Statement() {
  return (
    <section
      data-scene="statement"
      aria-labelledby="statement-title"
      className="frame flex min-h-[150svh] items-center py-[var(--gap-section)]"
    >
      <div className="mx-auto max-w-[1100px]">
        <h2 id="statement-title" className="sr-only">
          Qué hacemos
        </h2>
        <Scrub
          text="Dos apps, una misma idea: que el móvil te devuelva a la vida real. ParyUp te saca de casa con gente nueva. Oposalud te acerca a la plaza que llevas meses preparando."
          className="text-center text-[clamp(32px,4.4vw,72px)] font-medium leading-[1.05] tracking-[-0.04em]"
        />
      </div>
    </section>
  );
}
