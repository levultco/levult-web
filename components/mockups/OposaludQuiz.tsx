"use client";

import { useEffect, useState } from "react";
import { oposaludQuestions as questions } from "@/lib/content";
import { PhoneFrame, StatusBar } from "./PhoneFrame";

const GREEN = "#0f8f6e";
const GREEN_DARK = "#0a6b52";
const RED = "#d64532";
const LETTERS = ["A", "B", "C", "D"];

function useClock(running: boolean) {
  const [s, setS] = useState(252);
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setS((v) => v + 1), 1000);
    return () => window.clearInterval(id);
  }, [running]);
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

/** The page's live thing: a real three-question Oposalud test you can take. */
export function OposaludQuiz({ className = "" }: { className?: string }) {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const done = index >= questions.length;
  const q = questions[Math.min(index, questions.length - 1)];
  const clock = useClock(!done);

  const pick = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    if (i === q.answer) setScore((s) => s + 1);
  };
  const next = () => {
    setPicked(null);
    setIndex((n) => n + 1);
  };
  const restart = () => {
    setIndex(0);
    setPicked(null);
    setScore(0);
  };

  const ring = 2 * Math.PI * 52;

  return (
    <PhoneFrame label="Test interactivo de Oposalud" className={className} screenClassName="bg-[#f4f3ef] text-[#101814]" indicator="dark">
      <StatusBar tone="dark" />

      <div className="flex items-center justify-between px-[16px] pt-[6px]">
        <span aria-hidden="true" className="grid h-9 w-9 place-items-center rounded-full bg-white">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#101814" strokeWidth="1.8"><path d="M9 2 4 7l5 5" /></svg>
        </span>
        <p className="text-[15px] font-semibold tracking-[-0.01em]">Legislación</p>
        <span className="flex h-9 items-center gap-1.5 rounded-full bg-white px-3 text-[13px] font-semibold tabular-nums">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke={GREEN} strokeWidth="1.6"><circle cx="6" cy="6.5" r="4.6" /><path d="M6 4v2.7l1.6 1" /></svg>
          {clock}
        </span>
      </div>

      <div className="mt-[14px] flex gap-[5px] px-[16px]" aria-hidden="true">
        {questions.map((_, i) => (
          <span
            key={i}
            className="h-[5px] flex-1 rounded-full transition-colors duration-500"
            style={{ background: i < index || (i === index && picked !== null) || done ? GREEN : "#dedbd2" }}
          />
        ))}
      </div>

      {done ? (
        <div className="flex h-[calc(100%-120px)] flex-col items-center justify-center px-[22px] text-center" aria-live="polite">
          <svg width="132" height="132" viewBox="0 0 132 132" aria-hidden="true">
            <circle cx="66" cy="66" r="52" fill="none" stroke="#e3e0d7" strokeWidth="12" />
            <circle
              cx="66"
              cy="66"
              r="52"
              fill="none"
              stroke={GREEN}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={ring}
              strokeDashoffset={ring * (1 - score / questions.length)}
              transform="rotate(-90 66 66)"
              style={{ transition: "stroke-dashoffset 900ms cubic-bezier(.16,1,.3,1)" }}
            />
            <text x="66" y="74" textAnchor="middle" fontSize="28" fontWeight="700" fill="#101814">
              {score}/{questions.length}
            </text>
          </svg>
          <p className="mt-5 text-[22px] font-bold leading-tight tracking-[-0.03em]">
            {score === questions.length ? "Legislación al día" : "Vas por buen camino"}
          </p>
          <p className="mt-2 text-[14px] leading-snug text-[#4c5652]">
            {score === questions.length
              ? "Mañana subimos la dificultad del tema 4."
              : "Mañana repasarás justo las que has fallado."}
          </p>
          <div className="mt-5 flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[13px] font-semibold">
            <span className="h-2 w-2 rounded-full" style={{ background: GREEN }} />
            Racha de 12 días
          </div>
          <button
            type="button"
            onClick={restart}
            className="absolute inset-x-[16px] bottom-[30px] h-[50px] rounded-[16px] text-[15px] font-semibold text-white transition-transform duration-150 active:scale-[0.97]"
            style={{ background: GREEN }}
          >
            Repetir test
          </button>
        </div>
      ) : (
        <>
          <div className="px-[16px] pt-[18px]">
            <span className="inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold" style={{ background: "#dcefe7", color: GREEN_DARK }}>
              {q.topic}
            </span>
            <p className="mt-3 text-[19px] font-semibold leading-[1.22] tracking-[-0.02em]">{q.q}</p>
          </div>

          <ul className="mt-[16px] flex flex-col gap-[8px] px-[16px]">
            {q.options.map((opt, i) => {
              const state = picked === null ? "idle" : i === q.answer ? "right" : i === picked ? "wrong" : "muted";
              const tone =
                state === "right" ? { bg: "#dcefe7", ring: GREEN, badge: GREEN } :
                state === "wrong" ? { bg: "#fae3df", ring: RED, badge: RED } :
                { bg: "#fff", ring: "transparent", badge: "#efede7" };
              return (
                <li key={opt}>
                  <button
                    type="button"
                    onClick={() => pick(i)}
                    disabled={picked !== null}
                    className={`flex min-h-[48px] w-full items-center gap-3 rounded-[14px] px-3 py-2 text-left text-[14px] leading-snug ring-[1.5px] transition-[background-color,opacity,transform] duration-200 active:scale-[0.98] ${
                      state === "muted" ? "opacity-45" : ""
                    } ${state === "idle" ? "hover:bg-[#ecebe5]" : ""}`}
                    style={{ background: tone.bg, ["--tw-ring-color" as string]: tone.ring }}
                  >
                    <span
                      className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-[12px] font-bold"
                      style={{ background: tone.badge, color: state === "right" || state === "wrong" ? "#fff" : "#101814" }}
                    >
                      {state === "right" ? (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2"><path d="m2.5 6.2 2.3 2.3 4.7-5" /></svg>
                      ) : state === "wrong" ? (
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2"><path d="m2 2 6 6M8 2 2 8" /></svg>
                      ) : (
                        LETTERS[i]
                      )}
                    </span>
                    {opt}
                  </button>
                </li>
              );
            })}
          </ul>

          <div
            aria-live="polite"
            className={`absolute inset-x-0 bottom-0 rounded-t-[26px] bg-white px-[16px] pb-[28px] pt-[16px] transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] ${
              picked === null ? "translate-y-full" : "translate-y-0"
            }`}
          >
            {picked !== null && (
              <>
                <p className="text-[13px] font-bold" style={{ color: picked === q.answer ? GREEN : RED }}>
                  {picked === q.answer ? "¡Correcto!" : "No es esa"}
                </p>
                <p className="mt-1 text-[13px] leading-snug text-[#33403b]">{q.why}</p>
                <button
                  type="button"
                  onClick={next}
                  className="mt-3 h-[48px] w-full rounded-[16px] text-[15px] font-semibold text-white transition-transform duration-150 active:scale-[0.97]"
                  style={{ background: GREEN }}
                >
                  {index === questions.length - 1 ? "Ver resultado" : "Siguiente"}
                </button>
              </>
            )}
          </div>
        </>
      )}
    </PhoneFrame>
  );
}
