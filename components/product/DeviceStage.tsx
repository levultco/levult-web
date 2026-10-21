import type { ReactNode } from "react";
import type { Product } from "@/lib/products";
import { DropStage } from "@/components/webgl/DropStage";

type Props = {
  product: Product;
  children: ReactNode;
  className?: string;
};

/**
 * A dark stage filled with the brand's liquid: glossy drops in the product's
 * colours, melting into one calm mass behind the device.
 * Without WebGL, or with reduced motion, the stage stays dark.
 */
export function DeviceStage({ product, children, className = "" }: Props) {
  return (
    <div data-stage className={`group/stage relative isolate overflow-hidden bg-[#111113] ${className}`}>
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <DropStage glow={product.glow} phase={product.slug.length} />
      </div>
      {children}
    </div>
  );
}
