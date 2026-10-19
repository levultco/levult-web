"use client";

import { useEffect, useRef, type RefObject } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { nav, contactEmail } from "@/lib/content";
import { products } from "@/lib/products";
import { inkCalm, inkPath, inkReach } from "@/lib/ink";
import { DeviceStage } from "@/components/product/DeviceStage";
import { Arrow } from "@/components/ui/Arrow";
import { Roll } from "@/components/ui/Roll";
import { LogoSymbol } from "@/components/brand/Logo";

type Props = {
  open: boolean;
  /** The button that opens the menu: the ink grows out of it and returns to it. */
  anchor: RefObject<HTMLElement | null>;
  onNavigate: (e: React.MouseEvent, href: string) => void;
};

/**
 * The menu is a pool of ink. It spills out of the menu button and fills the
 * screen, the links rise out of masks one after another, the works follow;
 * closing, everything drops away and the ink runs back into the button.
 */
export function SiteMenu({ open, anchor, onNavigate }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const first = useRef(true);
  const pathname = usePathname();

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const q = (sel: string) => el.querySelectorAll(sel);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Nothing to animate on the first render: the menu starts closed.
    if (first.current) {
      first.current = false;
      gsap.set(el, { visibility: "hidden" });
      return;
    }

    gsap.killTweensOf(el);
    const box = anchor.current?.getBoundingClientRect();
    const x = box ? box.left + box.width / 2 : window.innerWidth - 60;
    const y = box ? box.top + box.height / 2 : 50;
    const ink = { r: open ? 0 : inkReach(x, y), max: inkReach(x, y) };
    const paint = () => {
      el.style.clipPath = `path("${inkPath(x, y, ink.r, performance.now() / 1000, inkCalm(ink.r, ink.max))}")`;
    };

    // A page change is already covered by the transition ink: just vanish.
    const navigating = document.documentElement.classList.contains("curtain");
    if (reduce || (!open && navigating)) {
      gsap.set(el, { visibility: open ? "visible" : "hidden", clipPath: "none" });
      gsap.set(q("[data-menu-line], [data-menu-fade]"), { clearProps: "all" });
      return;
    }

    const tl = gsap.timeline();
    if (open) {
      gsap.set(el, { visibility: "visible" });
      gsap.set(q("[data-menu-line]"), { yPercent: 115, rotate: 4 });
      gsap.set(q("[data-menu-fade]"), { y: 32, opacity: 0 });
      paint();
      tl.to(ink, { r: ink.max, duration: 1, ease: "expo.inOut", onUpdate: paint, onComplete: () => void (el.style.clipPath = "none") }, 0)
        .to(q("[data-menu-line]"), { yPercent: 0, rotate: 0, duration: 1, ease: "expo.out", stagger: 0.07 }, 0.38)
        .to(q("[data-menu-fade]"), { y: 0, opacity: 1, duration: 0.9, ease: "expo.out", stagger: 0.08 }, 0.55);
    } else {
      paint();
      tl.to(q("[data-menu-line]"), { yPercent: -115, duration: 0.4, ease: "power3.in", stagger: 0.03 }, 0)
        .to(q("[data-menu-fade]"), { opacity: 0, y: -16, duration: 0.3, ease: "power2.in" }, 0)
        .to(ink, { r: 0, duration: 0.8, ease: "expo.inOut", onUpdate: paint }, 0.2)
        .set(el, { visibility: "hidden" });
    }
    return () => {
      tl.kill();
    };
  }, [open, anchor]);

  const isActive = (href: string) => href === pathname;

  return (
    <div
      ref={root}
      id="site-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menú"
      aria-hidden={!open}
      // Lets the menu scroll on its own while the page behind is locked.
      data-lenis-prevent
      className="theme-dark fixed inset-0 z-40 flex flex-col justify-between overflow-y-auto pb-8 pt-[110px] md:pb-10 md:pt-[136px]"
      style={{ visibility: "hidden" }}
    >
      <div className="frame grid gap-14 md:grid-cols-12 md:gap-6">
        <nav aria-label="Menú principal" className="md:col-span-7">
          <ul className="group/menu">
            {nav.map((item) => (
              <li key={item.href} className="overflow-hidden">
                <Link
                  href={item.href}
                  onClick={(e) => onNavigate(e, item.href)}
                  tabIndex={open ? 0 : -1}
                  className="group/link flex items-center gap-5 py-1 text-[clamp(52px,7.4vw,112px)] font-medium leading-[1] tracking-[-0.05em] transition-opacity duration-300 group-hover/menu:opacity-30 hover:!opacity-100 focus-visible:!opacity-100"
                >
                  <span data-menu-line className="flex origin-bottom-left items-center gap-5">
                    {isActive(item.href) && <span aria-hidden="true" className="h-3 w-3 rounded-full bg-ground md:h-4 md:w-4" />}
                    {item.label}
                    <span
                      aria-hidden="true"
                      className="-translate-x-4 opacity-0 transition-[transform,opacity] duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover/link:translate-x-0 group-hover/link:opacity-100 [&_svg]:h-[0.4em] [&_svg]:w-[0.4em]"
                    >
                      <Arrow />
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-5 md:col-start-8 md:pt-3">
          <p data-menu-fade className="text-[15px] uppercase text-ink-soft-dark">
            Trabajos destacados
          </p>
          <ul className="mt-5 grid gap-3">
            {products.map((p) => (
              <li key={p.slug} data-menu-fade>
                <Link href={`/features/${p.slug}`} tabIndex={open ? 0 : -1} className="group block">
                  <DeviceStage product={p} className="flex h-[clamp(112px,17vh,190px)] items-end justify-between rounded-[18px] p-5 md:p-6">
                    <span className="text-[clamp(26px,2.4vw,40px)] font-medium leading-none tracking-[-0.04em]">{p.name}</span>
                    <span className="flex items-center gap-3 text-[14px] uppercase text-ink-soft-dark">
                      {p.category}
                      <span className="grid h-9 w-9 place-items-center rounded-full bg-ground text-ink transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:rotate-[-45deg]">
                        <Arrow />
                      </span>
                    </span>
                  </DeviceStage>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="frame mt-16 flex flex-wrap items-end justify-between gap-6">
        <a data-menu-fade href={`mailto:${contactEmail}`} tabIndex={open ? 0 : -1} className="text-[clamp(24px,2.6vw,40px)] font-medium tracking-[-0.04em]">
          <Roll>{contactEmail}</Roll>
        </a>
        <div data-menu-fade className="flex items-center gap-6">
          <a href="/#contacto" onClick={(e) => onNavigate(e, "/#contacto")} tabIndex={open ? 0 : -1} className="pill pill--dark">
            <Roll>Hablemos</Roll>
            <span aria-hidden="true" className="dot" />
          </a>
          <p className="flex items-center gap-3 text-[15px] text-ink-soft-dark">
            <LogoSymbol title="" className="h-7 w-auto text-ground" />© 2026
          </p>
        </div>
      </div>
    </div>
  );
}
