"use client";

import { useEffect, useRef } from "react";

const TRACK = 200;
const THUMB = 40;
const IDLE_MS = 900;

/**
 * A track on the right edge with a pill that follows the scroll, standing in
 * for the hidden scrollbar. It shows while the page moves, fades out once it
 * rests, and inverts against whatever ground it crosses.
 */
export function ScrollIndicator() {
  const track = useRef<HTMLDivElement>(null);
  const thumb = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let raf = 0;
    let idle = 0;
    let lastY = window.scrollY;

    const place = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      if (thumb.current) thumb.current.style.transform = `translateY(${progress * (TRACK - THUMB)}px)`;
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(place);
      // Only real movement wakes it (resizes and layout shifts don't).
      if (window.scrollY === lastY) return;
      lastY = window.scrollY;
      track.current?.setAttribute("data-active", "");
      window.clearTimeout(idle);
      idle = window.setTimeout(() => track.current?.removeAttribute("data-active"), IDLE_MS);
    };

    place();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(idle);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      ref={track}
      aria-hidden="true"
      className="pointer-events-none fixed right-[10px] top-1/2 z-50 w-[6px] -translate-y-1/2 rounded-full bg-white/25 opacity-0 mix-blend-difference transition-opacity duration-500 ease-out data-[active]:opacity-100 data-[active]:duration-200 md:right-[16px]"
      style={{ height: TRACK }}
    >
      <span ref={thumb} className="absolute inset-x-0 top-0 block rounded-full bg-white" style={{ height: THUMB }} />
    </div>
  );
}
