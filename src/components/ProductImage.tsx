import { useState } from "react";

type ProductImageProps = {
  src: string;
  alt: string;
  size: number;
};

/** Renders a product image, falling back to a leaf glyph when it fails to load. */
export function ProductImage({ src, alt, size }: ProductImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return <span aria-hidden="true">🌱</span>;
  }

  return <img src={src} alt={alt} width={size} height={size} onError={() => setFailed(true)} />;
}
