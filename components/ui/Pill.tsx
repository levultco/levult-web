import Link from "next/link";
import { Arrow } from "./Arrow";
import { Roll } from "./Roll";

type Props = {
  href: string;
  children: string;
  tone?: "dark" | "light";
  icon?: "dot" | "arrow";
  className?: string;
};

/** The site's one button: a 30px-radius pill, dark on light ground and light on dark. */
export function Pill({ href, children, tone = "dark", icon = "dot", className = "" }: Props) {
  const inner = (
    <>
      <Roll>{children}</Roll>
      {icon === "dot" ? <span aria-hidden="true" className="dot" /> : <Arrow />}
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
  return (
    <a href={href} className={cls}>
      {inner}
    </a>
  );
}
