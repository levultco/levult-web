import { createElement, type ElementType } from "react";

/** A statement whose words fill with ink as it scrolls through the screen. */
export function Scrub({ text, as = "p", className }: { text: string; as?: ElementType; className?: string }) {
  const words = text.split(" ");
  return createElement(
    as,
    { className, "data-scrub": "" },
    words.map((w, i) => (
      <span key={i} className="w">
        {w}
        {i < words.length - 1 ? " " : ""}
      </span>
    )),
  );
}
