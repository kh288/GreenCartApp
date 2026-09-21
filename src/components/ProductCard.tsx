import { formatPrice } from "../utils/format";
import { BadgeList } from "./BadgeList";
import { ProductImage } from "./ProductImage";
import { StarRating } from "./StarRating";
import type { Product } from "../types";

type ProductCardProps = {
  product: Product;
  onAdd: (product: Product) => void;
  onOpen: (product: Product) => void;
};

/** A single product in the catalog grid (Task 1 → Task 2 entry point). */
export function ProductCard({ product, onAdd, onOpen }: ProductCardProps) {
  const inStock = product.inventory > 0;

  return (
    <article>
      <button
        type="button"
        onClick={() => onOpen(product)}
        aria-label={`View details for ${product.name}`}
      >
        <ProductImage src={product.imageUrl} alt={product.name} size={240} />
      </button>
      <BadgeList badges={product.ecoBadges} />
      <p>
        <small>{product.brand}</small>
      </p>
      <h3>{product.name}</h3>
      <StarRating rating={product.rating} reviewCount={product.reviewCount} />
      <p>{product.description}</p>
      <p>
        <strong>{formatPrice(product.price)}</strong> · <small>{product.size}</small>
      </p>
      <button type="button" disabled={!inStock} onClick={() => onAdd(product)}>
        {inStock ? "Add to Cart" : "Out of Stock"}
      </button>
    </article>
  );
}
