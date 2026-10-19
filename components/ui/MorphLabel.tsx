"use client";

import { useLayoutEffect, useRef, useState } from "react";

// Kept with the component so the morph works wherever it is used.
const css = `
.morph{position:relative;display:inline-block;white-space:nowrap;vertical-align:top;transition:width 480ms cubic-bezier(.16,1,.3,1)}
.morph-word{display:inline-block}
.morph-word--out{position:absolute;left:0;top:0}
.morph-ch{display:inline-block;white-space:pre}
.morph-word--in .morph-ch{animation:morph-in 560ms cubic-bezier(.16,1,.3,1) both;animation-delay:calc(var(--i) * 32ms)}
.morph-word--out .morph-ch{animation:morph-out 340ms cubic-bezier(.55,.06,.68,.19) both;animation-delay:calc(var(--i) * 22ms)}
@keyframes morph-in{from{opacity:0;transform:translateY(70%);filter:blur(6px)}to{opacity:1;transform:none;filter:blur(0)}}
@keyframes morph-out{from{opacity:1;transform:none;filter:blur(0)}to{opacity:0;transform:translateY(-70%);filter:blur(6px)}}
.morph-icon{position:relative;display:block;width:16px;height:16px}
.morph-icon>span{position:absolute;left:50%;top:50%;width:5px;height:5px;border-radius:999px;background:currentColor;transform:translate(-50%,-50%) translateX(var(--x)) rotate(0deg);transition:width 420ms cubic-bezier(.16,1,.3,1),height 420ms cubic-bezier(.16,1,.3,1),transform 520ms cubic-bezier(.16,1,.3,1)}
.morph-icon>span:first-child{--x:-4px}
.morph-icon>span:last-child{--x:4px}
.morph-icon[data-open="true"]>span{width:16px;height:2px}
.morph-icon[data-open="true"]>span:first-child{transform:translate(-50%,-50%) rotate(45deg)}
.morph-icon[data-open="true"]>span:last-child{transform:translate(-50%,-50%) rotate(-45deg)}
@media (prefers-reduced-motion:reduce){.morph,.morph-icon>span{transition:none}.morph-ch{animation:none!important}}
`;

type Word = { text: string; id: number };

/**
 * A label that morphs into another: the old letters lift away and blur out
 * one after another while the new ones rise into focus, and the width eases
 * between the two.
 */
export function MorphLabel({ text }: { text: string }) {
  const [current, setCurrent] = useState<Word>({ text, id: 0 });
  const [leaving, setLeaving] = useState<Word | null>(null);
  const [animated, setAnimated] = useState(false);
  const [width, setWidth] = useState<number | undefined>(undefined);
  const measure = useRef<HTMLSpanElement>(null);

  if (text !== current.text) {
    setLeaving(current);
    setCurrent({ text, id: current.id + 1 });
    setAnimated(true);
  }

  useLayoutEffect(() => {
    if (measure.current) setWidth(measure.current.offsetWidth);
    if (!leaving) return;
    const id = window.setTimeout(() => setLeaving(null), 520);
    return () => window.clearTimeout(id);
  }, [current, leaving]);

  const letters = (w: Word) =>
    w.text.split("").map((ch, i) => (
      <span key={i} className="morph-ch" style={{ ["--i" as string]: i }}>
        {ch}
      </span>
    ));

  return (
    <>
      {/* React hoists this into <head> once, however many labels there are. */}
      <style href="levult-morph" precedence="default">
        {css}
      </style>
      <span className="morph" style={{ width }}>
        <span key={current.id} ref={measure} className={`morph-word ${animated ? "morph-word--in" : ""}`}>
          {letters(current)}
        </span>
        {leaving && (
          <span key={leaving.id} aria-hidden="true" className="morph-word morph-word--out">
            {letters(leaving)}
          </span>
        )}
      </span>
    </>
  );
}

/** Two dots that stretch and turn into a cross when open. */
export function MorphIcon({ open }: { open: boolean }) {
  return (
    <span aria-hidden="true" className="morph-icon" data-open={open}>
      <span />
      <span />
    </span>
  );
}
