import { createElement, type ElementType } from "react";

type Props = {
  text: string;
  as?: ElementType;
  className?: string;
  id?: string;
};

/** Splits a heading into masked words that rise in when revealed. */
export function SplitText({ text, as = "h2", className, id }: Props) {
  const words = text.split(" ");
  return createElement(
    as,
    { className, id, "data-reveal": "lines", "aria-label": text },
    words.map((word, i) => (
      <span key={i} className="line" aria-hidden="true">
        <span className="line-inner">
          {word}
          {i < words.length - 1 ? " " : ""}
        </span>
      </span>
    )),
  );
}
