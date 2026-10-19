import { Arrow } from "./Arrow";
import { Roll } from "./Roll";

type Props = {
  href: string;
  children: string;
  className?: string;
  style?: React.CSSProperties;
};

export function Button({ href, children, className = "", style }: Props) {
  return (
    <a href={href} className={`btn ${className}`} style={style}>
      <Roll>{children}</Roll>
      <Arrow />
    </a>
  );
}
