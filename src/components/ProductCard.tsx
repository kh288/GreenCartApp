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
    <article className="card h-100 border-0 shadow-sm product-card">
      <button
        type="button"
        className="btn p-0 border-0 position-relative ratio ratio-1x1 bg-body-secondary overflow-hidden"
        onClick={() => onOpen(product)}
        aria-label={`View details for ${product.name}`}
      >
        <ProductImage src={product.imageUrl} alt={product.name} size={240} />
        {!inStock && (
          <span className="position-absolute top-0 start-0 badge text-bg-secondary m-2">
            Out of stock
          </span>
        )}
      </button>

      <div className="card-body d-flex flex-column">
        <div className="mb-2">
          <BadgeList badges={product.ecoBadges} />
        </div>

        <small className="text-uppercase text-muted fw-semibold">{product.brand}</small>
        <h3 className="card-title h6 mb-1">
          <button
            type="button"
            className="btn btn-link p-0 text-decoration-none text-body text-start alignment-baseline"
            onClick={() => onOpen(product)}
          >
            {product.name}
          </button>
        </h3>

        <StarRating rating={product.rating} reviewCount={product.reviewCount} />

        <p className="card-text small text-muted mt-2 flex-grow-1">{product.description}</p>

        <div className="d-flex justify-content-between align-items-center mt-3">
          <span className="fs-5 fw-bold text-success">{formatPrice(product.price)}</span>
          <small className="text-muted">{product.size}</small>
        </div>

        <button
          type="button"
          className="btn btn-success w-100 mt-3"
          disabled={!inStock}
          onClick={() => onAdd(product)}
        >
          {inStock ? "Add to Cart" : "Out of Stock"}
        </button>
      </div>
    </article>
  );
}
