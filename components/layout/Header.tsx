"use client";

import { useEffect, useRef, useState } from "react";
import { nav } from "@/lib/content";
import { Roll } from "@/components/ui/Roll";

export function Header() {
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const last = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setSolid(y > window.innerHeight * 0.6);
      setHidden(y > last.current && y > 240);
      last.current = y;
    };
    onScroll();
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

  const goTo = (e: React.MouseEvent, href: string) => {
    const lenis = window.__lenis;
    setOpen(false);
    if (!lenis) return;
    e.preventDefault();
    lenis.start();
    lenis.scrollTo(href, { duration: 1.4 });
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[transform,background-color] duration-500 ease-[cubic-bezier(.22,1,.36,1)] ${
        hidden && !open ? "-translate-y-full" : "translate-y-0"
      } ${solid || open ? "bg-ground" : "bg-transparent"}`}
    >
      <div className="frame flex h-[72px] items-center justify-between gap-6 md:h-[84px]">
        <a
          href="#top"
          className="text-[26px] font-medium tracking-[-0.06em]"
          aria-label="Levult, inicio"
        >
          levult
        </a>

        <nav aria-label="Principal" className="hidden items-center gap-9 md:flex">
          {nav.map((item) => (
            <a key={item.href} href={item.href} className="text-[16px] font-medium">
              <Roll>{item.label}</Roll>
            </a>
          ))}
        </nav>

        <button
          type="button"
          className="relative h-11 px-1 text-[16px] font-medium md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Cerrar" : "Menú"}
        </button>
      </div>

      <div
        id="mobile-menu"
        className={`frame fixed inset-x-0 top-[72px] bottom-0 flex flex-col justify-between bg-ground pb-10 pt-8 transition-[opacity,visibility] duration-300 md:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <ul className="flex flex-col gap-2">
          {nav.map((item, i) => (
            <li
              key={item.href}
              className="transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)]"
              style={{
                transform: open ? "none" : "translateY(24px)",
                transitionDelay: open ? `${80 + i * 60}ms` : "0ms",
              }}
            >
              <a href={item.href} onClick={(e) => goTo(e, item.href)} className="block py-1 text-[44px] font-medium leading-tight tracking-[-0.04em]">
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <p className="text-[16px] text-ink-soft">La compañía detrás de ParyUp y Oposalud</p>
      </div>
    </header>
  );
}
