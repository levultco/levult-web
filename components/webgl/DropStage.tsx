"use client";

import { useEffect, useRef, useState } from "react";
import { registerDropStage } from "./drop-engine";

/**
 * The brand's liquid as a background: glossy drops melted into one surface in
 * the product's colours, drifting on their own. Nothing is drawn without WebGL
 * or with reduced motion: the card stays dark.
 */
export function DropStage({ glow, phase = 0 }: { glow: [string, string, string?]; phase?: number }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [live, setLive] = useState(false);
  const [first, second, third] = glow;

  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const stop = registerDropStage({ canvas: el, glow: [first, second, third], phase, onLive: setLive });
    return () => {
      stop?.();
      setLive(false);
    };
  }, [first, second, third, phase]);

  return <canvas ref={canvas} aria-hidden="true" className={`absolute inset-0 h-full w-full transition-opacity duration-700 ${live ? "opacity-100" : "opacity-0"}`} />;
}
