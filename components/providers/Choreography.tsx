"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { onReveal } from "@/lib/reveal-gate";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const EXPO = "expo.out";

function revealGroup(group: Element, delay = 0) {
  const items = Array.from(group.querySelectorAll<HTMLElement>("[data-reveal]"));
  const tl = gsap.timeline({ delay });

  items.forEach((el, i) => {
    const at = i * 0.085;
    const kind = el.dataset.reveal;

    if (kind === "lines") {
      tl.to(el.querySelectorAll(".line-inner"), { y: 0, duration: 1.2, ease: EXPO, stagger: 0.04 }, at);
    } else {
      tl.to(el, { opacity: 1, y: 0, duration: 1.1, ease: EXPO }, at);
    }
  });
  return tl;
}

/**
 * Entrances and scroll-scrubbed statements for the whole page. Rendered last
 * inside the page so it only touches the DOM once everything has hydrated.
 */
export function Choreography() {
  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Groups that play on load (the hero) start as soon as nothing covers
      // the page: straight away, or as the intro or page curtain opens.
      const offReveal = onReveal(() => {
        document.querySelectorAll("[data-reveal-group='load']").forEach((g) => revealGroup(g, 0.15));
      });

      document.querySelectorAll("[data-reveal-group]:not([data-reveal-group='load'])").forEach((g) => {
        ScrollTrigger.create({
          trigger: g,
          start: "top 86%",
          once: true,
          onEnter: () => revealGroup(g),
        });
      });

      // Statements fill with ink word by word, locked to the scrollbar.
      document.querySelectorAll("[data-scrub]").forEach((el) => {
        gsap.to(el.querySelectorAll(".w"), {
          opacity: 1,
          ease: "none",
          stagger: 0.1,
          // Measured on the section: the statement itself is sticky.
          scrollTrigger: { trigger: el.closest("section"), start: "top 60%", end: "76% bottom", scrub: true },
        });
      });

      // Safety net: make sure reveals are measured after fonts settle.
      document.fonts?.ready.then(() => ScrollTrigger.refresh());

      return offReveal;
    });
  });

  return null;
}
