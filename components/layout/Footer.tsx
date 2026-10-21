import Link from "next/link";
import { getProducts } from "@/lib/products";
import { localePath, pageHref } from "@/lib/i18n";
import { getI18n } from "@/lib/i18n/server";
import { Wordmark } from "@/components/brand/Logo";

/**
 * The page's close, on the light ground where the fluid comes to rest.
 * The fluid comes to rest over the end of the giant logo; the drops' canvas
 * inverts what it covers, so those letters turn white.
 */
export async function Footer() {
  const { lang, t } = await getI18n();
  const products = getProducts(lang);
  return (
    <footer data-scene="footer" className="relative pt-[clamp(96px,10vw,160px)]">
      <div className="frame grid gap-12 md:grid-cols-12 md:gap-6">
        <div className="md:col-span-4">
          <p className="text-[15px] uppercase text-ink-soft">{t.footer.navigation}</p>
          <ul className="mt-4 grid gap-1 text-[20px] font-medium">
            {t.nav.map((item) => (
              <li key={item.href}>
                <Link href={localePath(lang, item.href)} className="link">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-4">
          <p className="text-[15px] uppercase text-ink-soft">{t.footer.featured}</p>
          <ul className="mt-4 grid gap-1 text-[20px] font-medium">
            {products.map((p) => (
              <li key={p.slug}>
                <Link href={localePath(lang, `/features/${p.slug}`)} className="link">
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <p className="max-w-[30ch] text-[18px] leading-[1.5] text-ink-soft md:col-span-4">
          {t.footer.tagline}
        </p>
      </div>
      {/* The drops' canvas sits above the page and inverts what it covers,
          so the logo turns white wherever a drop passes over it. */}
      <div className="frame mt-24 text-ink">
        <Wordmark title="" className="block h-auto w-full" />
      </div>
      <div className="frame flex flex-wrap justify-between gap-3 pb-8 pt-8 text-[15px] text-ink-soft">
        <p>© 2026 Levult</p>
        <ul className="flex gap-6">
          <li>
            <Link href={pageHref(lang, "/aviso-legal")} className="link">
              {t.footer.legal}
            </Link>
          </li>
          <li>
            <Link href={pageHref(lang, "/privacidad")} className="link">
              {t.footer.privacy}
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}
