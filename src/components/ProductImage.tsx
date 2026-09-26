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
    return (
      <div
        className="d-flex align-items-center justify-content-center w-100 h-100 bg-body-secondary text-success"
        style={{ minHeight: size }}
      >
        <span className="fs-1" aria-hidden="true">
          🌱
        </span>
        <span className="visually-hidden">{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className="w-100 h-100 object-fit-cover"
      style={{ aspectRatio: "1 / 1" }}
      onError={() => setFailed(true)}
    />
  );
}
