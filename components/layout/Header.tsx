"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav, contactEmail } from "@/lib/content";
import { products } from "@/lib/products";
import { Roll } from "@/components/ui/Roll";

export function Header() {
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const last = useRef(0);
  const pathname = usePathname();

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
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // On the home page, hash links glide there instead of jumping.
  const go = (e: React.MouseEvent, href: string) => {
    setOpen(false);
    const hash = href.startsWith("/#") ? href.slice(1) : null;
    if (!hash || pathname !== "/") return;
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
          href="/"
          className="pointer-events-auto text-[28px] font-medium tracking-[-0.06em] text-white md:text-[32px]"
          aria-label="Levult, inicio"
        >
          levult
        </Link>
      </div>

      <header
        className={`frame pointer-events-none fixed right-0 top-0 z-50 flex h-[84px] items-center transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] md:h-[104px] ${
          hidden && !open ? "-translate-y-[120%]" : "translate-y-0"
        }`}
      >
        <div className="pointer-events-auto flex items-center gap-2.5">
          <a href="/#contacto" onClick={(e) => go(e, "/#contacto")} className={`pill pill--dark hidden !h-12 transition-opacity ${open ? "pointer-events-none opacity-0" : "sm:inline-flex"}`}>
            <Roll>Hablemos</Roll>
            <span aria-hidden="true" className="dot" />
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="site-menu"
            className={`pill !h-12 ${open ? "bg-ground text-ink" : "pill--light"}`}
          >
            <Roll>{open ? "Cerrar" : "Menú"}</Roll>
            <span aria-hidden="true" className="flex gap-[3px]">
              <span className="dot" />
              <span className="dot" />
            </span>
          </button>
        </div>
      </header>

      <div
        id="site-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menú"
        className={`theme-dark fixed inset-0 z-40 flex flex-col justify-between overflow-y-auto pb-10 pt-[120px] transition-[clip-path] duration-700 ease-[cubic-bezier(.76,0,.24,1)] md:pt-[140px] ${
          open ? "[clip-path:inset(0_0_0_0)]" : "pointer-events-none [clip-path:inset(0_0_100%_0)]"
        }`}
      >
        <div className="frame grid gap-12 md:grid-cols-12 md:gap-6">
          <ul className="md:col-span-7">
            {nav.map((item, i) => (
              <li
                key={item.href}
                className="overflow-hidden"
                style={{
                  transition: "transform 700ms cubic-bezier(.16,1,.3,1)",
                  transitionDelay: open ? `${150 + i * 60}ms` : "0ms",
                  transform: open ? "none" : "translateY(40px)",
                }}
              >
                <Link
                  href={item.href}
                  onClick={(e) => go(e, item.href)}
                  className="block py-1 text-[clamp(48px,7vw,104px)] font-medium leading-[1] tracking-[-0.05em] transition-opacity duration-300 hover:opacity-60"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="md:col-span-4 md:col-start-9">
            <p className="text-[15px] uppercase text-ink-soft-dark">Trabajos destacados</p>
            <ul className="mt-5 grid gap-2">
              {products.map((p) => (
                <li key={p.slug}>
                  <Link href={`/features/${p.slug}`} className="flex items-baseline justify-between gap-4 py-1 text-[26px] font-medium tracking-[-0.03em]">
                    <Roll>{p.name}</Roll>
                    <span className="text-[15px] font-normal text-ink-soft-dark">{p.category}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="frame mt-16 flex flex-wrap items-end justify-between gap-6">
          <a href={`mailto:${contactEmail}`} className="text-[clamp(24px,2.6vw,40px)] font-medium tracking-[-0.04em]">
            <Roll>{contactEmail}</Roll>
          </a>
          <p className="text-[15px] text-ink-soft-dark">© 2026 Levult</p>
        </div>
      </div>
    </>
  );
}
