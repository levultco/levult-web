"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap } from "gsap";
import { announceReveal } from "@/lib/reveal-gate";
import { inkCalm, inkPath, inkReach } from "@/lib/ink";
import { glassMapUrl, glassScale } from "@/lib/liquid-glass";
import { createLiquidInk, type LiquidInk } from "@/lib/liquid-ink";
import { Wordmark } from "@/components/brand/Logo";

/*
 * Ink, the brand's fluid. Drawn by a shader (lib/liquid-ink) with a turbulent,
 * chromatic edge; where WebGL is missing it falls back to a 2D SVG blob.
 *
 * Moving between pages, a drop of black ink is
 * born where you click and spreads with a liquid edge until it fills the
 * screen; the route changes behind it, then the ink draws back, opening a
 * liquid hole from the opposite side. The first visit of a session opens the
 * same way, from a screen already full of ink.
 */

const smoothstep = (a: number, b: number, v: number) => {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

type Ink = {
  mode: "drop" | "hole";
  x: number;
  y: number;
  r: number;
  max: number;
};

// Kept with the component so the first-visit cover can never show without the
// rule that hides it: the solid cover only exists while html.intro is set.
const vtCss = `html.liquid-vt::view-transition{background:#0c0c0d}html.liquid-vt::view-transition-old(root),html.liquid-vt::view-transition-new(root){animation:none;mix-blend-mode:normal}html.liquid-vt::view-transition-new(root){filter:url(#liquid-warp);clip-path:circle(var(--vt-r,0px) at var(--vt-x,50%) var(--vt-y,50%))}html.liquid-vt::view-transition-group(root){animation:none}`;
const css = `html.intro .ink-cover{display:block!important}html.intro .ink-logo{display:grid!important}html.intro .ink-logo svg{clip-path:inset(0 100% 0 0)}`;

export function InkTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const svg = useRef<SVGSVGElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const liquid = useRef<LiquidInk | null>(null);
  const path = useRef<SVGPathElement>(null);
  const cover = useRef<HTMLDivElement>(null);
  const logo = useRef<HTMLDivElement>(null);
  const ink = useRef<Ink>({ mode: "drop", x: 0, y: 0, r: 0, max: 1 });
  const covering = useRef(false);
  const target = useRef({ x: 0, y: 0 });
  const fallback = useRef(0);
  const swapped = useRef<(() => void) | null>(null);
  const warp = useRef<SVGSVGElement>(null);
  const mapReady = useRef(false);

  // Redraw the ink every frame while it is on screen.
  const draw = () => {
    const s = ink.current;
    if (liquid.current) {
      liquid.current.draw(s, inkCalm(s.r, s.max));
      return;
    }
    const el = path.current;
    if (!el) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const t = performance.now() / 1000;
    const blob = inkPath(s.x, s.y, s.r, t, inkCalm(s.r, s.max));
    el.setAttribute("d", s.mode === "drop" ? blob : `M0 0H${w}V${h}H0Z${blob}`);
  };

  const show = (visible: boolean) => {
    const surface = liquid.current ? canvas.current : svg.current;
    if (!surface) return;
    surface.style.visibility = visible ? "visible" : "hidden";
    if (!visible) liquid.current?.clear();
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

  // The refraction map is drawn and decoded once, up front, never mid-transition.
  useEffect(() => {
    const url = glassMapUrl();
    const image = warp.current?.querySelector("feImage");
    if (!url || !image) return;
    const img = new Image();
    img.src = url;
    img.decode().then(
      () => {
        image.setAttribute("href", url);
        mapReady.current = true;
      },
      () => {},
    );
  }, []);

  // Ink colour comes from the brand token, so the shader never drifts from the CSS.
  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const probe = document.createElement("div");
    probe.style.background = "var(--ink)";
    document.body.appendChild(probe);
    const m = getComputedStyle(probe).backgroundColor.match(/[\d.]+/g);
    probe.remove();
    const rgb: [number, number, number] = m ? [Number(m[0]) / 255, Number(m[1]) / 255, Number(m[2]) / 255] : [0.047, 0.047, 0.051];
    liquid.current = createLiquidInk(el, rgb);
    return () => {
      liquid.current?.dispose();
      liquid.current = null;
    };
  }, []);

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
    if (swapped.current) {
      // Liquid view transition: let the new page paint, then hand it back.
      const done = swapped.current;
      swapped.current = null;
      window.setTimeout(done, 80);
      return;
    }
    covering.current = false;
    window.clearTimeout(fallback.current);
    window.setTimeout(() => {
      document.documentElement.classList.remove("curtain");
      openFrom(target.current.x, target.current.y, 1.05);
    }, 80);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  /**
   * The page itself morphs, like the glass effect of the liquid-morphology
   * slideshow: the browser snapshots old and new, the new one grows out of the
   * click inside a bubble that refracts it (radial pull, ripples, a split per
   * colour channel) while the old page stays untouched outside. Returns
   * false on phones or where view transitions are missing, so the ink takes over.
   */
  const liquidTransition = (url: URL, x: number, y: number) => {
    const start = document.startViewTransition?.bind(document);
    const filter = warp.current;
    if (!start || !filter) return false;
    // Phones keep the plain ink: the refraction is for larger screens.
    if (window.matchMedia("(max-width: 767px)").matches) return false;
    const root = document.documentElement;
    const maps = filter.querySelectorAll("feDisplacementMap");
    const set = (scale: number) => {
      maps[0].setAttribute("scale", String(scale * 1.04));
      maps[1].setAttribute("scale", String(scale));
      maps[2].setAttribute("scale", String(scale * 0.96));
    };
    set(0);
    const mapImage = filter.querySelector("feImage");
    const strength = glassScale(Math.min(window.innerWidth, window.innerHeight));
    // The map was decoded at mount; if it never was, skip the morph rather than risk a bad frame.
    if (!mapReady.current) return false;
    set(0);

    root.classList.add("liquid-vt");
    const transition = start(
      () =>
        new Promise<void>((resolve) => {
          swapped.current = resolve;
          router.push(url.pathname + url.search + url.hash);
          // Never hang on a route that doesn't change.
          fallback.current = window.setTimeout(resolve, 2500);
        }),
    );

    const finish = () => {
      window.clearTimeout(fallback.current);
      swapped.current = null;
      covering.current = false;
      root.classList.remove("liquid-vt", "curtain");
      root.style.removeProperty("--vt-r");
      set(0);
    };

    transition.ready.then(() => {
      root.classList.remove("curtain");
      announceReveal();
      const reach = (inkReach(x, y) / 1.3) * 1.1;
      const s = { r: 0 };
      root.style.setProperty("--vt-x", `${x}px`);
      root.style.setProperty("--vt-y", `${y}px`);
      root.style.setProperty("--vt-r", "0px");
      // The circle is driven from JS, so give the transition a real animation
      // to wait on: without one the browser ends it right after "ready" and
      // the page would simply appear.
      root.animate({ opacity: [1, 1] }, { duration: 1400, pseudoElement: "::view-transition-new(root)" });
      gsap.to(s, {
        r: reach,
        duration: 1.4,
        ease: "power3.inOut",
        onUpdate: () => {
          const p = s.r / reach;
          root.style.setProperty("--vt-r", `${s.r}px`);
          // The refraction lives inside the growing bubble only: the one map
          // image follows its position and size, and the strength eases in
          // and out so the page is perfectly still before and after.
          const R = Math.max(1, s.r);
          mapImage?.setAttribute("x", String(x - R));
          mapImage?.setAttribute("y", String(y - R));
          mapImage?.setAttribute("width", String(R * 2));
          mapImage?.setAttribute("height", String(R * 2));
          set(strength * Math.min(1, p * 6) * (1 - smoothstep(0.78, 1, p)));
        },
      });
    }, finish);
    transition.finished.then(finish, finish);
    return true;
  };

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (covering.current) return;
      const a = (e.target as Element | null)?.closest("a");
      // data-reload: a full page load (a language change rebuilds <html>, which a client navigation would not).
      if (!a || (a.target && a.target !== "_self") || a.hasAttribute("download") || a.hasAttribute("data-reload")) return;
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

      if (liquidTransition(url, x, y)) return;

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
      <style dangerouslySetInnerHTML={{ __html: css + vtCss }} />
      <svg ref={warp} aria-hidden="true" width="0" height="0" className="pointer-events-none absolute">
        <filter id="liquid-warp" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feImage href="data:image/svg+xml," preserveAspectRatio="none" result="mapImage" />
          {/* The map image decodes asynchronously. Until it lands (or between
              updates) it is transparent, which the filter would read as a full
              push to one side: laid over a neutral grey, that gap is a no-op. */}
          <feFlood floodColor="rgb(128,128,128)" result="neutral" />
          <feComposite in="mapImage" in2="neutral" operator="over" result="map" />
          <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="r" />
          <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="g" />
          <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="b" />
          <feDisplacementMap in="r" in2="map" scale="0" xChannelSelector="R" yChannelSelector="G" result="r2" />
          <feDisplacementMap in="g" in2="map" scale="0" xChannelSelector="R" yChannelSelector="G" result="g2" />
          <feDisplacementMap in="b" in2="map" scale="0" xChannelSelector="R" yChannelSelector="G" result="b2" />
          <feBlend in="r2" in2="g2" mode="screen" result="rg" />
          <feBlend in="rg" in2="b2" mode="screen" />
        </filter>
      </svg>
      {/* Solid ink before scripts run, for the first-visit opening. */}
      <div ref={cover} aria-hidden="true" className="ink-cover fixed inset-0 z-[81] bg-ink" style={{ display: "none" }} />
      <div ref={logo} aria-hidden="true" className="ink-logo fixed inset-0 z-[82] place-items-center text-ground" style={{ display: "none" }}>
        <Wordmark title="" className="h-auto w-[min(56vw,420px)]" />
      </div>
      <canvas
        ref={canvas}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[80] h-full w-full"
        style={{ visibility: "hidden" }}
      />
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
