import Link from "next/link";
import { nav } from "@/lib/content";
import { products } from "@/lib/products";
import { Wordmark } from "@/components/brand/Logo";

/**
 * The page's close, on the light ground where the fluid comes to rest.
 * Positioned without a z-index so the logo can blend with the canvas behind
 * it: its letters turn white wherever a drop passes underneath.
 */
export function Footer() {
  return (
    <footer data-scene="footer" className="relative pt-[clamp(96px,10vw,160px)]">
      <div className="frame grid gap-12 md:grid-cols-12 md:gap-6">
        <div className="md:col-span-4">
          <p className="text-[15px] uppercase text-ink-soft">Navegación</p>
          <ul className="mt-4 grid gap-1 text-[20px] font-medium">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="link">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-4">
          <p className="text-[15px] uppercase text-ink-soft">Destacados</p>
          <ul className="mt-4 grid gap-1 text-[20px] font-medium">
            {products.map((p) => (
              <li key={p.slug}>
                <Link href={`/features/${p.slug}`} className="link">
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <p className="max-w-[30ch] text-[18px] leading-[1.5] text-ink-soft md:col-span-4">
          Levult crea, lanza y hace crecer productos digitales propios.
        </p>
      </div>
      <div className="frame mt-24 text-white mix-blend-difference">
        <Wordmark title="" className="block h-auto w-full" />
      </div>
      <div className="frame flex flex-wrap justify-between gap-3 pb-8 pt-8 text-[15px] text-ink-soft">
        <p>© 2026 Levult</p>
        <p>Productos digitales propios</p>
      </div>
    </footer>
  );
}
