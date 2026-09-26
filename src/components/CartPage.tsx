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
    <div
      className="modal app-modal-backdrop d-block"
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label="Your Cart"
    >
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content border-0 shadow">
          <div className="modal-header bg-success-subtle">
            <h2 className="modal-title h5 d-flex align-items-center gap-2">
              <span aria-hidden="true">🛒</span> Your Cart
            </h2>
            <button type="button" className="btn-close" aria-label="Close" onClick={onClose} />
          </div>

          <div className="modal-body">
            {lines.length === 0 ? (
              <div className="text-center py-4 text-muted" role="status">
                <div className="fs-1" aria-hidden="true">
                  🛒
                </div>
                <p className="mb-0">Your cart is empty.</p>
              </div>
            ) : (
              <ul className="list-unstyled mb-0 d-flex flex-column gap-3">
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
          </div>

          {lines.length > 0 && (
            <div className="modal-footer flex-column align-items-stretch gap-2">
              <div className="d-flex justify-content-between align-items-center">
                <span className="text-muted">Subtotal</span>
                <strong className="fs-5 text-success">{formatPrice(subtotal)}</strong>
              </div>
              <div className="d-flex gap-2">
                <button
                  type="button"
                  className="btn btn-outline-success flex-fill"
                  onClick={onClose}
                >
                  Continue Shopping
                </button>
                <button type="button" className="btn btn-success flex-fill" onClick={onCheckout}>
                  Checkout
                </button>
              </div>
              <small className="text-muted text-center">Shipping is free on orders over $40.</small>
            </div>
          )}
        </div>
      </div>
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
    <li className="d-flex align-items-center gap-3 border-bottom pb-3">
      <div
        className="bg-body-secondary rounded flex-shrink-0 overflow-hidden"
        style={{ width: 64, height: 64 }}
      >
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className="w-100 h-100 object-fit-cover" />
        ) : (
          <span className="d-flex w-100 h-100 align-items-center justify-content-center fs-3">
            🌱
          </span>
        )}
      </div>

      <div className="flex-grow-1">
        <p className="mb-0 fw-semibold">{product.name}</p>
        <small className="text-muted">{formatPrice(product.price)} each</small>
      </div>

      <div className="input-group input-group-sm" style={{ width: "7rem" }}>
        <button
          type="button"
          className="btn btn-outline-success"
          aria-label={`Decrease ${product.name} quantity`}
          onClick={() => onSetQuantity(product.id, quantity - 1)}
        >
          −
        </button>
        <output className="form-control text-center">{quantity}</output>
        <button
          type="button"
          className="btn btn-outline-success"
          aria-label={`Increase ${product.name} quantity`}
          onClick={() => onSetQuantity(product.id, quantity + 1)}
        >
          +
        </button>
      </div>

      <span className="fw-semibold" style={{ minWidth: "4rem", textAlign: "right" }}>
        {formatPrice(product.price * quantity)}
      </span>

      <button
        type="button"
        className="btn-close"
        aria-label={`Remove ${product.name}`}
        onClick={() => onRemove(product.id)}
      />
    </li>
  );
}
