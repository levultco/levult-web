"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap } from "gsap";
import { announceReveal } from "@/lib/reveal-gate";
import { inkCalm, inkPath, inkReach } from "@/lib/ink";
import { Wordmark } from "@/components/brand/Logo";

/*
 * Ink, the brand's fluid in 2D. Moving between pages, a drop of black ink is
 * born where you click and spreads with a liquid edge until it fills the
 * screen; the route changes behind it, then the ink draws back, opening a
 * liquid hole from the opposite side. The first visit of a session opens the
 * same way, from a screen already full of ink.
 */

type Ink = {
  mode: "drop" | "hole";
  x: number;
  y: number;
  r: number;
  max: number;
};

// Kept with the component so the first-visit cover can never show without the
// rule that hides it: the solid cover only exists while html.intro is set.
const css = `html.intro .ink-cover{display:block!important}html.intro .ink-logo{display:grid!important}html.intro .ink-logo svg{clip-path:inset(0 100% 0 0)}`;

export function InkTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const svg = useRef<SVGSVGElement>(null);
  const path = useRef<SVGPathElement>(null);
  const cover = useRef<HTMLDivElement>(null);
  const logo = useRef<HTMLDivElement>(null);
  const ink = useRef<Ink>({ mode: "drop", x: 0, y: 0, r: 0, max: 1 });
  const covering = useRef(false);
  const target = useRef({ x: 0, y: 0 });
  const fallback = useRef(0);

  // Redraw the ink every frame while it is on screen.
  const draw = () => {
    const el = path.current;
    if (!el) return;
    const s = ink.current;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const t = performance.now() / 1000;
    const blob = inkPath(s.x, s.y, s.r, t, inkCalm(s.r, s.max));
    el.setAttribute("d", s.mode === "drop" ? blob : `M0 0H${w}V${h}H0Z${blob}`);
  };

  const show = (visible: boolean) => {
    if (!svg.current) return;
    svg.current.style.visibility = visible ? "visible" : "hidden";
    if (visible) gsap.ticker.add(draw);
    else gsap.ticker.remove(draw);
  };

  /** The ink draws back from (x, y): a liquid hole opens there and grows until the page is clear. */
  const openFrom = (x: number, y: number, duration: number, onDone?: () => void) => {
    const s = ink.current;
    s.mode = "hole";
    s.x = x;
    s.y = y;
    s.r = 0;
    s.max = inkReach(x, y);
    show(true);
    draw();
    if (cover.current) cover.current.style.display = "none";
    announceReveal();
    gsap.to(s, {
      r: s.max,
      duration,
      ease: "expo.inOut",
      onComplete: () => {
        show(false);
        onDone?.();
      },
    });
  };

  // First visit: the screen starts full of ink, the logo writes itself across
  // it, then steps back as the ink opens from the middle.
  useEffect(() => {
    const html = document.documentElement;
    if (!html.classList.contains("intro")) return;
    const done = () => {
      html.classList.remove("intro");
      try {
        sessionStorage.setItem("levult-intro-seen", "1");
      } catch {}
    };
    const mark = logo.current;
    const tl = gsap.timeline();
    tl.fromTo(
      mark?.querySelector("svg") ?? {},
      { clipPath: "inset(0% 100% 0% 0%)" },
      { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, ease: "expo.out" },
      0.15,
    )
      .to(mark, { opacity: 0, scale: 0.9, duration: 0.45, ease: "power2.in" }, 1.1)
      .add(() => openFrom(window.innerWidth / 2, window.innerHeight * 0.55, 1.4, done), 1.2);
    return () => {
      tl.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // The new route has rendered behind the ink: open it from the far side.
  useEffect(() => {
    if (!covering.current) return;
    covering.current = false;
    window.clearTimeout(fallback.current);
    window.setTimeout(() => {
      document.documentElement.classList.remove("curtain");
      openFrom(target.current.x, target.current.y, 1.05);
    }, 80);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (covering.current) return;
      const a = (e.target as Element | null)?.closest("a");
      if (!a || (a.target && a.target !== "_self") || a.hasAttribute("download")) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname === window.location.pathname) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      e.preventDefault();
      e.stopPropagation();
      covering.current = true;
      document.documentElement.classList.add("curtain");

      // A keyboard "click" has no position: start from the link itself.
      const box = a.getBoundingClientRect();
      const x = e.clientX || box.left + box.width / 2;
      const y = e.clientY || box.top + box.height / 2;
      // The ink will draw back toward where it came from, so the hole opens opposite.
      target.current = { x: window.innerWidth - x, y: window.innerHeight - y };

      const s = ink.current;
      s.mode = "drop";
      s.x = x;
      s.y = y;
      s.r = 0;
      s.max = inkReach(x, y);
      show(true);
      gsap.to(s, {
        r: s.max,
        duration: 0.85,
        ease: "expo.inOut",
        onComplete: () => {
          router.push(url.pathname + url.search + url.hash);
          // Never leave the page covered if the route doesn't change.
          fallback.current = window.setTimeout(() => {
            if (!covering.current) return;
            covering.current = false;
            document.documentElement.classList.remove("curtain");
            openFrom(target.current.x, target.current.y, 1.05);
          }, 2500);
        },
      });
    };

    // Capture phase, so it runs before Next's own link handling.
    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      gsap.ticker.remove(draw);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      {/* Solid ink before scripts run, for the first-visit opening. */}
      <div ref={cover} aria-hidden="true" className="ink-cover fixed inset-0 z-[81] bg-ink" style={{ display: "none" }} />
      <div ref={logo} aria-hidden="true" className="ink-logo fixed inset-0 z-[82] place-items-center text-ground" style={{ display: "none" }}>
        <Wordmark title="" className="h-auto w-[min(56vw,420px)]" />
      </div>
      <svg
        ref={svg}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[80] h-full w-full"
        style={{ visibility: "hidden" }}
      >
        <path ref={path} fillRule="evenodd" style={{ fill: "var(--ink)" }} />
      </svg>
    </>
  );
}
