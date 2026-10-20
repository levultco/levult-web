"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { chase, panelSide, poseAt, type SceneSection } from "@/lib/scene";
import { fragment, vertex } from "./shaders";
import { onReveal } from "@/lib/reveal-gate";

const COLORS = {
  paryupTop: "#ffcc3d",
  paryupMid: "#ff9a5a",
  paryupLow: "#e86aae",
  oposalud: "#0f8f6e",
  ink: "#1c1a18",
  ground: "#eaecf0",
};

const HALF_H = 4 * 0.4142; // visible half-height at z = 0

/** The page ground from CSS, as 0–1 sRGB channels. */
function pageGround(): [number, number, number] {
  const hex = getComputedStyle(document.documentElement).getPropertyValue("--ground").trim() || "#f0f1fa";
  const n = parseInt(hex.replace("#", "").padEnd(6, "0").slice(0, 6), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

/**
 * One fixed canvas over the whole page; sections steer it by scroll. It sits
 * above the content and blends with "difference", so whatever text or button
 * a drop passes over turns inside out (dark ink becomes light) on every
 * browser, including iOS, where content can't blend with a canvas below it.
 */
export function DropsScene() {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: "high-performance" });
    } catch {
      return; // No WebGL: the page reads fine without the drops.
    }

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const narrowQuery = window.matchMedia("(max-width: 767px)");
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    const uniforms = {
      uRes: { value: new THREE.Vector2() },
      uTime: { value: 0 },
      uA: { value: new THREE.Vector4() },
      uB: { value: new THREE.Vector4() },
      uColA: { value: new THREE.Color(COLORS.paryupTop) },
      uColA2: { value: new THREE.Color(COLORS.paryupMid) },
      uColA3: { value: new THREE.Color(COLORS.paryupLow) },
      uColB: { value: new THREE.Color(COLORS.oposalud) },
      uInk: { value: new THREE.Color(COLORS.ink) },
      uGround: { value: new THREE.Color(COLORS.ground) },
      uTint: { value: 0 },
      uK: { value: 0.55 },
      uMouse: { value: new THREE.Vector2() },
      uIntro: { value: reduce ? 1 : 0 },
      // Raw sRGB (no colour management): it must match the CSS ground exactly.
      uPage: { value: new THREE.Vector3(...pageGround()) },
      uMask: { value: new THREE.Vector4(-1e4, -1e4, -1e4, -1e4) },
      uMaskR: { value: 0 },
    };

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const material = new THREE.ShaderMaterial({ vertexShader: vertex, fragmentShader: fragment, uniforms, transparent: true });
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    quad.frustumCulled = false;
    scene.add(quad);

    let sections: SceneSection[] = [];
    let panel: HTMLElement | null = null;
    let panelRadius = 0;
    const measure = () => {
      panel = document.querySelector<HTMLElement>("[data-drops-mask]");
      panelRadius = panel ? parseFloat(getComputedStyle(panel).borderTopLeftRadius) || 0 : 0;
      sections = Array.from(document.querySelectorAll<HTMLElement>("[data-scene]")).map((s) => {
        const r = s.getBoundingClientRect();
        return {
          id: s.dataset.scene!,
          top: r.top + window.scrollY,
          bottom: r.bottom + window.scrollY,
          dark: !!s.closest(".theme-dark"),
        };
      });
    };

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const ratio = Math.min(window.devicePixelRatio, narrowQuery.matches ? 1.5 : 1.25);
      renderer.setPixelRatio(ratio);
      renderer.setSize(w, h, false);
      uniforms.uRes.value.set(w * ratio, h * ratio);
      measure();
    };
    resize();
    window.addEventListener("resize", resize);
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);

    const mouse = new THREE.Vector2();
    const onMove = (e: PointerEvent) => {
      mouse.set((e.clientX / window.innerWidth) * 2 - 1, -((e.clientY / window.innerHeight) * 2 - 1));
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    // Current (eased) pose, chased toward the scroll target every frame.
    const cur = { ax: 0, ay: 0, ar: 0, bx: 0, by: 0, br: 0, tint: 0 };
    let first = true;
    // The side of the dark panel the drops were last placed on.
    let placed = 0;
    let drawn = true;
    let raf = 0;
    let visible = true;
    const clock = new THREE.Clock();
    // The drops grow once nothing covers the page (intro or page curtain).
    let start = Infinity;
    const offReveal = onReveal(() => {
      start = performance.now() + 150;
    });

    const frame = () => {
      raf = requestAnimationFrame(frame);
      if (!visible) return;
      const dt = Math.min(clock.getDelta(), 0.05);
      const time = reduce ? 0 : clock.elapsedTime;
      const aspect = window.innerWidth / window.innerHeight;
      const halfW = HALF_H * aspect;
      const unit = Math.min(HALF_H, halfW * 1.25);

      const target = poseAt(window.scrollY, window.innerHeight, sections, narrowQuery.matches);
      const k = first || reduce ? 1 : 1 - Math.exp(-dt * 7);
      const kShrink = 1 - Math.exp(-dt * 16);
      first = false;
      const side = panelSide(window.scrollY, window.innerHeight, sections);
      const jump = side !== placed;
      chase(cur, "a", target.a, k, kShrink, jump);
      chase(cur, "b", target.b, k, kShrink, jump);
      // Once both drops have gone, they reappear on the new side.
      if (jump && cur.ar <= 0.01 && cur.br <= 0.01) {
        cur.ax = target.a.x;
        cur.ay = target.a.y;
        cur.bx = target.b.x;
        cur.by = target.b.y;
        placed = side;
      }
      cur.tint += (target.tint - cur.tint) * k;

      const m = uniforms.uMouse.value;
      if (!reduce) m.lerp(mouse, 1 - Math.exp(-dt * 3));
      // Drops lean very slightly toward the pointer.
      uniforms.uA.value.set(cur.ax * halfW + m.x * 0.04, cur.ay * HALF_H + m.y * 0.04, 0, cur.ar * unit);
      uniforms.uB.value.set(cur.bx * halfW + m.x * 0.03, cur.by * HALF_H + m.y * 0.03, 0.15, cur.br * unit);
      uniforms.uTint.value = cur.tint;
      // The dark panel masks the drops, so they pass behind it, never over it.
      if (panel) {
        const r = panel.getBoundingClientRect();
        const ratio = renderer.getPixelRatio();
        const h = window.innerHeight;
        uniforms.uMask.value.set(r.left * ratio, (h - r.bottom) * ratio, r.right * ratio, (h - r.top) * ratio);
        uniforms.uMaskR.value = panelRadius * ratio;
      }
      uniforms.uTime.value = time;
      // The drops grow out of nothing on load and fuse as they grow.
      if (!reduce && uniforms.uIntro.value < 1) {
        const p = Math.max(0, Math.min(1, (performance.now() - start) / 1800));
        uniforms.uIntro.value = 1 - Math.pow(1 - p, 3);
      }
      uniforms.uK.value = 0.55 * (0.4 + 0.6 * uniforms.uIntro.value);

      // With no drop on screen the canvas leaves the page entirely: a
      // full-screen blended layer makes the browser composite everything under
      // it, and iOS Safari, short of memory over the glowing cards, can stop
      // painting parts of the page while it scrolls.
      const shown = (cur.ar > 0.005 || cur.br > 0.005) && uniforms.uIntro.value > 0;
      if (shown !== drawn) {
        drawn = shown;
        el.style.display = shown ? "" : "none";
      }
      if (shown) renderer.render(scene, camera);
    };
    frame();

    const onVis = () => {
      visible = document.visibilityState === "visible";
    };
    document.addEventListener("visibilitychange", onVis);
    // Re-measure after fonts settle and lazy content lays out.
    document.fonts?.ready.then(measure);
    const late = window.setTimeout(measure, 1200);

    return () => {
      offReveal();
      cancelAnimationFrame(raf);
      window.clearTimeout(late);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVis);
      ro.disconnect();
      material.dispose();
      quad.geometry.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={host} aria-hidden="true" className="pointer-events-none fixed inset-0 z-30 mix-blend-difference [&>canvas]:h-full [&>canvas]:w-full" />;
}
