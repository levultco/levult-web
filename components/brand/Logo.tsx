import { symbol, wordmark } from "./logo-paths";

type Props = {
  className?: string;
  /** Accessible name; pass an empty string when the logo sits inside a labelled link. */
  title?: string;
};

/**
 * The Levult logo, drawn in currentColor so it follows the text colour (and
 * the header's black/white inversion). Size it by height; width follows.
 */
export function Wordmark({ className = "", title = "Levult" }: Props) {
  return (
    <svg
      viewBox={`0 0 ${wordmark.w} ${wordmark.h}`}
      className={className}
      fill="currentColor"
      role={title ? "img" : undefined}
      aria-label={title || undefined}
      aria-hidden={title ? undefined : true}
    >
      <path fillRule="evenodd" d={wordmark.d} />
    </svg>
  );
}

/** The folded L on its own: icon, favicon and tight spaces. */
export function LogoSymbol({ className = "", title = "Levult" }: Props) {
  return (
    <svg
      viewBox={`0 0 ${symbol.w} ${symbol.h}`}
      className={className}
      fill="currentColor"
      role={title ? "img" : undefined}
      aria-label={title || undefined}
      aria-hidden={title ? undefined : true}
    >
      <path fillRule="evenodd" d={symbol.d} />
    </svg>
  );
}
