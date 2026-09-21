import { formatPrice } from "../utils/format";
import type { CartLine } from "../types";

type CartPageProps = {
  lines: CartLine[];
  subtotal: number;
  onSetQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  onClose: () => void;
  onCheckout: () => void;
};

/** Task 3: cart dialog with per-line quantity controls and a running subtotal. */
export function CartPage({
  lines,
  subtotal,
  onSetQuantity,
  onRemove,
  onClose,
  onCheckout,
}: CartPageProps) {
  return (
    <div role="dialog" aria-modal="true" aria-label="Your Cart">
      <header>
        <h2>Your Cart</h2>
        <button type="button" aria-label="Close" onClick={onClose}>
          ✕
        </button>
      </header>

      {lines.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul>
          {lines.map(({ product, quantity }) => (
            <CartLineRow
              key={product.id}
              product={product}
              quantity={quantity}
              onSetQuantity={onSetQuantity}
              onRemove={onRemove}
            />
          ))}
        </ul>
      )}

      {lines.length > 0 && (
        <footer>
          <p>
            Subtotal: <strong>{formatPrice(subtotal)}</strong>
          </p>
          <button type="button" onClick={onClose}>
            Continue Shopping
          </button>
          <button type="button" onClick={onCheckout}>
            Checkout
          </button>
          <small>Checkout &amp; payments are planned for a future release.</small>
        </footer>
      )}
    </div>
  );
}

function CartLineRow({
  product,
  quantity,
  onSetQuantity,
  onRemove,
}: {
  product: CartLine["product"];
  quantity: number;
  onSetQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <li>
      {product.imageUrl && <img src={product.imageUrl} alt={product.name} width={64} height={64} />}
      <div>
        <p>{product.name}</p>
        <small>{formatPrice(product.price)} each</small>
      </div>
      <div>
        <button
          type="button"
          aria-label={`Decrease ${product.name} quantity`}
          onClick={() => onSetQuantity(product.id, quantity - 1)}
        >
          −
        </button>
        <output>{quantity}</output>
        <button
          type="button"
          aria-label={`Increase ${product.name} quantity`}
          onClick={() => onSetQuantity(product.id, quantity + 1)}
        >
          +
        </button>
      </div>
      <span>{formatPrice(product.price * quantity)}</span>
      <button
        type="button"
        aria-label={`Remove ${product.name}`}
        onClick={() => onRemove(product.id)}
      >
        ✕
      </button>
    </li>
  );
}
