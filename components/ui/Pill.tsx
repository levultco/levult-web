import Link from "next/link";
import { Arrow } from "./Arrow";
import { Roll } from "./Roll";

type Props = {
  href: string;
  children: string;
  tone?: "dark" | "light";
  icon?: "dot" | "arrow" | "external";
  className?: string;
};

function External() {
  return (
    <svg className="arrow" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M3 11 11 3M5 3h6v6" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

/** The site's one button: a 30px-radius pill, dark on light ground and light on dark. */
export function Pill({ href, children, tone = "dark", icon = "dot", className = "" }: Props) {
  const inner = (
    <>
      <Roll>{children}</Roll>
      {icon === "dot" ? <span aria-hidden="true" className="dot" /> : icon === "external" ? <External /> : <Arrow />}
    </>
  );
  const cls = `pill pill--${tone} ${className}`;
  if (href.startsWith("/") && !href.startsWith("/#")) {
    return (
      <Link href={href} className={cls}>
        {inner}
      </Link>
    );
  }
  const external = /^https?:\/\//.test(href);
  return (
    <a href={href} className={cls} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
      {inner}
    </a>
  );
}
