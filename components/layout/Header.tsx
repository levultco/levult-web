"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Roll } from "@/components/ui/Roll";
import { MorphLabel, MorphIcon } from "@/components/ui/MorphLabel";
import { SiteMenu, type MenuText } from "./SiteMenu";
import { Wordmark } from "@/components/brand/Logo";
import { localePath, locales, publicPath, switchPath, type Lang } from "@/lib/i18n";
import type { Product } from "@/lib/products";

type Props = {
  lang: Lang;
  t: MenuText;
  products: Product[];
};

export function Header({ lang, t, products }: Props) {
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const last = useRef(0);
  const menuButton = useRef<HTMLButtonElement>(null);
  // A prerendered Spanish page sees /es; the visitor sees /. Compare what the visitor sees.
  const pathname = publicPath(usePathname());
  const home = localePath(lang, "/");
  const otherLang = locales.find((l) => l !== lang)!;

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > last.current && y > 200);
      last.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (open) window.__lenis?.stop();
    else window.__lenis?.start();
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // On the home page, hash links glide there instead of jumping.
  const go = (e: React.MouseEvent, href: string) => {
    setOpen(false);
    const hash = href.startsWith("/#") ? href.slice(1) : null;
    if (!hash || pathname !== home) return;
    const lenis = window.__lenis;
    e.preventDefault();
    if (lenis) {
      lenis.start();
      lenis.scrollTo(hash, { duration: 1.4 });
    } else {
      document.querySelector(hash)?.scrollIntoView();
    }
  };

  return (
    <>
      {/* The wordmark sits on its own layer so it can invert against whatever
          ground it crosses: black on white, white on black. */}
      <div
        className={`frame pointer-events-none fixed left-0 top-0 z-50 flex h-[84px] items-center mix-blend-difference transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] md:h-[104px] ${
          hidden && !open ? "-translate-y-[120%]" : "translate-y-0"
        }`}
      >
        <Link
          href={home}
          className="pointer-events-auto block text-white"
          aria-label={t.header.homeAria}
        >
          <Wordmark title="" className="h-[22px] w-auto md:h-[26px]" />
        </Link>
      </div>

      <header
        className={`frame pointer-events-none fixed right-0 top-0 z-50 flex h-[84px] items-center transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] md:h-[104px] ${
          hidden && !open ? "-translate-y-[120%]" : "translate-y-0"
        }`}
      >
        <div className="pointer-events-auto flex items-center gap-2.5">
          <a href={localePath(lang, "/#contacto")} onClick={(e) => go(e, "/#contacto")} className={`pill pill--dark hidden !h-12 ring-1 ring-white/15 transition-opacity ${open ? "pointer-events-none opacity-0" : "sm:inline-flex"}`}>
            <Roll>{t.header.talk}</Roll>
            <span aria-hidden="true" className="dot" />
          </a>
          <a
            href={switchPath(pathname, otherLang)}
            data-reload
            lang={otherLang}
            hrefLang={otherLang}
            aria-label={t.header.switchAria}
            className={`pill pill--light !h-12 !px-4 transition-opacity ${open ? "pointer-events-none opacity-0" : ""}`}
          >
            {t.header.switchShort}
          </a>
          <button
            ref={menuButton}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="site-menu"
            className={`pill !h-12 ${open ? "bg-ground text-ink" : "pill--light"}`}
          >
            <MorphLabel text={open ? t.header.close : t.header.menu} />
            <MorphIcon open={open} />
          </button>
        </div>
      </header>

      <SiteMenu open={open} anchor={menuButton} onNavigate={go} lang={lang} t={t} products={products} />
    </>
  );
}
