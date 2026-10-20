import type { ReactNode } from "react";
import type { Product } from "@/lib/products";

type Props = {
  product: Product;
  children: ReactNode;
  className?: string;
};

/**
 * A dark stage where the product's colours are light, not wallpaper: soft
 * glows behind the device, like the screen lighting up the room.
 */
// A soft pool of light in one colour, fading out to its edges.
const light = (color: string) =>
  `radial-gradient(closest-side, ${color} 0%, ${color}b3 30%, ${color}40 62%, ${color}00 100%)`; // taste-skill-ignore: soft stage light, not a decorative gradient

export function DeviceStage({ product, children, className = "" }: Props) {
  const [first, second, third] = product.glow;
  return (
    <div className={`group/stage relative isolate overflow-hidden bg-[#111113] ${className}`}>
      <div aria-hidden="true" className="absolute inset-0 -z-10 transition-transform duration-[1200ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover/stage:scale-110">
        {/* Radial light rather than a blur filter: the same glow, but nothing to
            recompute while scrolling, which mobile browsers struggle with. */}
        <span className="absolute left-[18%] top-[22%] h-[52%] w-[46%] scale-[1.9] opacity-70" style={{ background: light(first) }} />
        <span className="absolute right-[16%] top-[38%] h-[48%] w-[42%] scale-[2] opacity-60" style={{ background: light(second) }} />
        {third && (
          <span className="absolute bottom-[-10%] left-[34%] h-[40%] w-[34%] scale-[2] opacity-50" style={{ background: light(third) }} />
        )}
      </div>
      {children}
    </div>
  );
}
