import type { Product } from "@/lib/products";
import { ParyUpScreen } from "@/components/mockups/ParyUpScreen";
import { OposaludQuiz } from "@/components/mockups/OposaludQuiz";

/** The live interface of a product, if it has one. */
export function ProductDevice({ product }: { product: Product }) {
  if (product.device === "paryup") return <ParyUpScreen />;
  if (product.device === "oposalud") return <OposaludQuiz />;
  return null;
}
