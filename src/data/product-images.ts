import attaImg from "@/assets/atta-pulverizer.jpg";
import masalaImg from "@/assets/masala-pulverizer.jpg";
import heroImg from "@/assets/hero-machine.png";
import rotorImg from "@/assets/rotor-detail.jpg";
import qcImg from "@/assets/quality-check.jpg";
import type { Category, Product } from "./products";

export type ProductImage = { src: string; alt?: string };

/**
 * Manually editable image sets.
 *
 * - Add a `slug` key below to override images for one machine.
 * - Add as many images as you like (4th, 5th, 6th ...) — the slider adapts.
 * - Replace `src` with any imported asset or an absolute/CDN URL string.
 */
export const productImagesBySlug: Record<string, ProductImage[]> = {
  // "atta-5-hp": [{ src: "/__l5e/assets-v1/.../photo.jpg", alt: "..." }],
};

const defaultsByCategory: Record<Category, ProductImage[]> = {
  atta: [
    { src: attaImg },
    { src: heroImg },
    { src: rotorImg, alt: "Precision rotor and bearing detail" },
    { src: qcImg, alt: "Quality inspection before dispatch" },
  ],
  masala: [
    { src: masalaImg },
    { src: heroImg },
    { src: rotorImg, alt: "Precision rotor and bearing detail" },
    { src: qcImg, alt: "Quality inspection before dispatch" },
  ],
};

export function getProductImages(product: Product): ProductImage[] {
  const custom = productImagesBySlug[product.slug];
  const list = custom && custom.length > 0 ? custom : defaultsByCategory[product.category];
  return list.map((img, i) => ({
    src: img.src,
    alt: img.alt ?? `${product.name} — view ${i + 1}`,
  }));
}
