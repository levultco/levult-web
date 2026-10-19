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
export function DeviceStage({ product, children, className = "" }: Props) {
  const [first, second, third] = product.glow;
  return (
    <div className={`group/stage relative isolate overflow-hidden bg-[#111113] ${className}`}>
      <div aria-hidden="true" className="absolute inset-0 -z-10 transition-transform duration-[1200ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover/stage:scale-110">
        <span className="absolute left-[18%] top-[22%] h-[52%] w-[46%] rounded-full opacity-70 blur-[90px]" style={{ background: first }} />
        <span className="absolute right-[16%] top-[38%] h-[48%] w-[42%] rounded-full opacity-60 blur-[100px]" style={{ background: second }} />
        {third && (
          <span className="absolute bottom-[-10%] left-[34%] h-[40%] w-[34%] rounded-full opacity-50 blur-[90px]" style={{ background: third }} />
        )}
      </div>
      {children}
    </div>
  );
}
