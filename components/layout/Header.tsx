"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Roll } from "@/components/ui/Roll";
import { MorphLabel, MorphIcon } from "@/components/ui/MorphLabel";
import { SiteMenu } from "./SiteMenu";

export function Header() {
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const last = useRef(0);
  const menuButton = useRef<HTMLButtonElement>(null);
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
          <a href="/#contacto" onClick={(e) => go(e, "/#contacto")} className={`pill pill--dark hidden !h-12 ring-1 ring-white/15 transition-opacity ${open ? "pointer-events-none opacity-0" : "sm:inline-flex"}`}>
            <Roll>Hablemos</Roll>
            <span aria-hidden="true" className="dot" />
          </a>
          <button
            ref={menuButton}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="site-menu"
            className={`pill !h-12 ${open ? "bg-ground text-ink" : "pill--light"}`}
          >
            <MorphLabel text={open ? "Cerrar" : "Menú"} />
            <MorphIcon open={open} />
          </button>
        </div>
      </header>

      <SiteMenu open={open} anchor={menuButton} onNavigate={go} />
    </>
  );
}
