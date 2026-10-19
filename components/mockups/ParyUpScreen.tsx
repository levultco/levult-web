"use client";

import { useEffect, useRef, useState } from "react";
import { paryupEvents, paryupNearby } from "@/lib/content";
import { PhoneFrame, StatusBar } from "./PhoneFrame";
import { Poster } from "./paryup/Poster";

const tabs = ["Inicio", "Descubrir", "Chats", "Perfil"] as const;

function TabIcon({ name, active }: { name: (typeof tabs)[number]; active: boolean }) {
  const c = active ? "#5aa9ff" : "#fff";
  if (name === "Inicio")
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill={c}><path d="M4 10.2 12 4l8 6.2V19a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 19v-8.8Z" /></svg>
    );
  if (name === "Descubrir")
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="7.5" stroke={c} strokeWidth="4" /></svg>
    );
  if (name === "Chats")
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill={c}><path d="M12 4c4.7 0 8 3 8 6.8s-3.3 6.8-8 6.8c-.8 0-1.6-.1-2.3-.3L5 19.5l1.2-3.6C4.8 14.7 4 13 4 10.8 4 7 7.3 4 12 4Z" /></svg>
    );
  return <span className="block h-6 w-6 rounded-full bg-[#d9a37a] ring-2 ring-white/80" />;
}

/** ParyUp's home screen: the night's events as posters, and what is near you. */
export function ParyUpScreen({ className = "" }: { className?: string }) {
  const [active, setActive] = useState(0);
  const [tab, setTab] = useState<(typeof tabs)[number]>("Inicio");
  const track = useRef<HTMLDivElement>(null);
  const paused = useRef(false);

  const goTo = (i: number) => {
    const el = track.current;
    if (!el) return;
    const card = el.children[i] as HTMLElement | undefined;
    if (card) el.scrollTo({ left: card.offsetLeft - (el.clientWidth - card.clientWidth) / 2, behavior: "smooth" });
  };

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      if (!paused.current) goTo((active + 1) % paryupEvents.length);
    }, 3800);
    return () => window.clearInterval(id);
  }, [active]);

  const onScroll = () => {
    const el = track.current;
    if (!el) return;
    const step = (el.children[1] as HTMLElement).offsetLeft - (el.children[0] as HTMLElement).offsetLeft;
    setActive(Math.max(0, Math.min(paryupEvents.length - 1, Math.round(el.scrollLeft / step))));
  };

  const ev = paryupEvents[active];

  return (
    <PhoneFrame label="Pantalla de inicio de la app ParyUp" className={className} screenClassName="bg-black text-white">
      {/* The open poster lights the top of the screen. */}
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-[46%] overflow-hidden">
        {paryupEvents.map((e, i) => (
          <div
            key={e.title}
            className="absolute -inset-[20%] scale-110 opacity-0 blur-[38px] transition-opacity duration-700"
            style={{ opacity: i === active ? 0.75 : 0 }}
          >
            <Poster kind={e.poster} />
          </div>
        ))}
        <div className="pu-fade absolute inset-0" />
      </div>

      <StatusBar />

      <div className="relative z-10 flex items-center justify-between px-[14px] pt-[6px]">
        <button type="button" aria-label="Mapa" className="grid h-10 w-10 place-items-center rounded-full bg-white/15 backdrop-blur-md transition-transform active:scale-90">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round"><path d="M9 4 3.5 6v14L9 18l6 2 5.5-2V4L15 6 9 4Zm0 0v14m6-12v14" /></svg>
        </button>
        <div className="flex h-10 items-center gap-4 rounded-full bg-white/15 px-4 backdrop-blur-md">
          <svg width="18" height="18" viewBox="0 0 24 24" stroke="#fff" strokeWidth="2" strokeLinecap="round"><path d="M12 4v16M4 12h16" /></svg>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8"><path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15L6 16Zm4 4a2 2 0 0 0 4 0" /></svg>
        </div>
      </div>

      <div className="relative z-10 px-[18px] pt-[16px]">
        <p className="flex items-center gap-1 text-[12px] font-bold uppercase tracking-[0.08em] text-white/55">
          Sábado
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="m2 3.5 3 3 3-3" /></svg>
        </p>
        <p className="mt-0.5 text-[27px] font-extrabold leading-tight tracking-[-0.035em]">10 de octubre</p>
      </div>

      <div
        ref={track}
        onScroll={onScroll}
        onPointerEnter={() => (paused.current = true)}
        onPointerLeave={() => (paused.current = false)}
        className="relative z-10 mt-[12px] flex snap-x snap-mandatory gap-[9px] overflow-x-auto px-[19px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {paryupEvents.map((e) => (
          <article key={e.title} className="relative aspect-[263/316] w-[88%] shrink-0 snap-center overflow-hidden rounded-[22px] ring-1 ring-white/10">
            <Poster kind={e.poster} />
            <div className="pu-scrim absolute inset-x-0 bottom-0 h-[42%]" />
            <div className="absolute inset-x-[14px] bottom-[14px]">
              <p className="text-[25px] font-black leading-none tracking-[-0.05em]">{e.title}</p>
              <p className="mt-1.5 text-[13px] text-white/90">
                {e.venue} <span className="mx-1 text-white/50">•</span> <span className="font-semibold">{e.time}</span>
              </p>
            </div>
          </article>
        ))}
      </div>

      <div className="relative z-10 mt-[10px] flex justify-center gap-[5px]" role="tablist" aria-label="Eventos destacados">
        {paryupEvents.map((e, i) => (
          <button
            key={e.title}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-label={e.title}
            onClick={() => goTo(i)}
            className={`h-[6px] rounded-full transition-[width,background-color] duration-300 ${i === active ? "w-[18px] bg-white" : "w-[6px] bg-white/35"}`}
          />
        ))}
      </div>

      <div className="relative z-10 px-[18px] pt-[16px]">
        <p className="text-[17px] font-semibold tracking-[-0.02em]">Cerca de ti</p>
      </div>
      <div className="relative z-10 mt-[10px] flex gap-[9px] overflow-x-auto px-[18px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {paryupNearby.map((n) => {
          const idx = paryupEvents.findIndex((e) => e.poster === n.poster);
          return (
            <button
              key={n.poster}
              type="button"
              onClick={() => goTo(idx)}
              aria-label={`Ver ${paryupEvents[idx].title}`}
              className="relative aspect-[140/170] w-[46%] shrink-0 overflow-hidden rounded-[18px] text-left transition-transform duration-200 active:scale-95"
            >
              <Poster kind={n.poster} size="sm" />
              <span className="absolute bottom-[10px] left-[10px] flex items-center gap-1 text-[11px] font-black tracking-[0.06em] text-[#c6f24a]">
                <svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor"><path d="M6 0 0 7h4l-1 5 7-7.5H6L6 0Z" /></svg>
                {n.distance}
              </span>
            </button>
          );
        })}
      </div>

      <nav
        aria-label="Pestañas de ParyUp"
        className="absolute inset-x-[10px] bottom-[18px] z-20 flex h-[60px] items-center justify-between rounded-full bg-[#2a2a2e]/70 px-[6px] ring-1 ring-white/15 backdrop-blur-xl"
      >
        {tabs.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            aria-current={tab === t ? "page" : undefined}
            className={`flex h-[50px] flex-1 flex-col items-center justify-center gap-[2px] rounded-full text-[10.5px] font-medium transition-colors duration-200 ${
              tab === t ? "bg-white/12 text-[#5aa9ff]" : "text-white"
            }`}
          >
            <TabIcon name={t} active={tab === t} />
            {t}
          </button>
        ))}
      </nav>
      <span className="sr-only">Evento destacado: {ev.title}, {ev.venue}, {ev.time}</span>
    </PhoneFrame>
  );
}
