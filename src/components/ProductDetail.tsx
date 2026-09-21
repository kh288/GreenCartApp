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
    <div role="dialog" aria-modal="true" aria-label={product.name}>
      <header>
        <h2>{product.name}</h2>
        <button type="button" aria-label="Close" onClick={onClose}>
          ✕
        </button>
      </header>

      <div>
        <section>
          <ProductImage src={product.imageUrl} alt={product.name} size={320} />
        </section>

        <section>
          <p>
            <small>{product.brand}</small>
          </p>
          <BadgeList badges={product.ecoBadges} />
          <StarRating rating={product.rating} reviewCount={product.reviewCount} />
          <p>
            <strong>{formatPrice(product.price)}</strong>
          </p>
          <p>{inStock ? `In stock (${product.inventory} available)` : "Out of stock"}</p>

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

          <div>
            <QuantityStepper
              quantity={quantity}
              max={product.inventory}
              disabled={!inStock}
              onChange={setQuantity}
            />
            <button type="button" disabled={!inStock} onClick={() => onAdd(product, quantity)}>
              {inStock ? "Add to Cart" : "Notify Me"}
            </button>
          </div>
        </section>
      </div>

      <RelatedProducts related={related} onAdd={onAdd} />
    </div>
  );
}

function DetailSection({ heading, body }: { heading: string; body: string }) {
  return (
    <>
      <h3>{heading}</h3>
      <p>{body}</p>
    </>
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
    <section>
      <h3>You Might Also Like</h3>
      <ul>
        {related.map((item) => (
          <li key={item.id}>
            <ProductImage src={item.imageUrl} alt={item.name} size={120} />
            <p>{item.name}</p>
            <p>
              <strong>{formatPrice(item.price)}</strong>
            </p>
            <button type="button" disabled={item.inventory <= 0} onClick={() => onAdd(item, 1)}>
              Add to Cart
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
