import { useState } from "react";
import { formatPrice } from "../utils/format";
import { BadgeList } from "./BadgeList";
import { ProductImage } from "./ProductImage";
import { QuantityStepper } from "./QuantityStepper";
import { StarRating } from "./StarRating";
import type { Product } from "../types";

type ProductDetailProps = {
  product: Product;
  related: Product[];
  onClose: () => void;
  onAdd: (product: Product, quantity: number) => void;
};

/** Task 2: full product detail dialog with quantity selection and related items. */
export function ProductDetail({ product, related, onClose, onAdd }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1);
  const inStock = product.inventory > 0;

  return (
    <>
      <div
        className="modal app-modal-backdrop d-block"
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={product.name}
      >
        <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content border-0 shadow">
            <div className="modal-header bg-success-subtle">
              <h2 className="modal-title h5 d-flex align-items-center gap-2">{product.name}</h2>
              <button type="button" className="btn-close" aria-label="Close" onClick={onClose} />
            </div>

            <div className="modal-body">
              <div className="row g-4">
                <div className="col-md-5">
                  <div className="ratio ratio-1x1 bg-body-secondary rounded overflow-hidden">
                    <ProductImage src={product.imageUrl} alt={product.name} size={320} />
                  </div>
                </div>

                <div className="col-md-7">
                  <small className="text-uppercase text-muted fw-semibold d-block mb-2">
                    {product.brand}
                  </small>
                  <div className="mb-2">
                    <BadgeList badges={product.ecoBadges} />
                  </div>
                  <StarRating rating={product.rating} reviewCount={product.reviewCount} />

                  <p className="fs-3 fw-bold text-success mt-3 mb-1">
                    {formatPrice(product.price)}
                  </p>
                  <p className={`small ${inStock ? "text-success" : "text-danger"}`}>
                    {inStock ? `In stock (${product.inventory} available)` : "Out of stock"}
                  </p>

                  <DetailSection heading="Description" body={product.description} />
                  <DetailSection
                    heading="Ingredients / Sourcing"
                    body={product.ingredients || "Not specified."}
                  />
                  <DetailSection
                    heading="Reviews"
                    body={`${product.reviewCount} reviews · average ${product.rating.toFixed(1)} / 5`}
                  />
                  {/* NOTE: individual review text is not in the current dataset. */}

                  <div className="d-flex align-items-center gap-3 mt-4">
                    <QuantityStepper
                      quantity={quantity}
                      max={product.inventory}
                      disabled={!inStock}
                      onChange={setQuantity}
                    />
                    <button
                      type="button"
                      className="btn btn-success flex-grow-1"
                      disabled={!inStock}
                      onClick={() => onAdd(product, quantity)}
                    >
                      {inStock ? "Add to Cart" : "Notify Me"}
                    </button>
                  </div>
                </div>
              </div>

              <RelatedProducts related={related} onAdd={onAdd} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function DetailSection({ heading, body }: { heading: string; body: string }) {
  return (
    <div className="mt-3">
      <h3 className="h6 text-uppercase text-muted fw-semibold">{heading}</h3>
      <p className="mb-0">{body}</p>
    </div>
  );
}

function RelatedProducts({
  related,
  onAdd,
}: {
  related: Product[];
  onAdd: (product: Product, quantity: number) => void;
}) {
  if (related.length === 0) return null;

  return (
    <section className="mt-4 pt-4 border-top">
      <h3 className="h5 mb-3">You Might Also Like</h3>
      <div className="row row-cols-2 row-cols-md-3 g-3">
        {related.map((item) => (
          <div className="col" key={item.id}>
            <div className="card h-100 border-0 shadow-sm">
              <div className="ratio ratio-1x1 bg-body-secondary overflow-hidden">
                <ProductImage src={item.imageUrl} alt={item.name} size={120} />
              </div>
              <div className="card-body d-flex flex-column">
                <p className="small fw-semibold mb-1">{item.name}</p>
                <p className="fw-bold text-success mb-2">{formatPrice(item.price)}</p>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-success mt-auto"
                  disabled={item.inventory <= 0}
                  onClick={() => onAdd(item, 1)}
                >
                  {item.inventory > 0 ? "Add to Cart" : "Out of Stock"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
