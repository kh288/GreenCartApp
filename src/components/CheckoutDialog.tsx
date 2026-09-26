import { useState } from "react";
import { formatPrice, toCents } from "../utils/format";
import type { CartLine } from "../types";

type CheckoutDialogProps = {
  lines: CartLine[];
  subtotal: number;
  onClose: () => void;
  /** Called with the order details once the user confirms; should clear the cart. */
  onPlaceOrder: (order: OrderSummary) => void;
};

export type OrderSummary = {
  reference: string;
  name: string;
  email: string;
  address: string;
  itemCount: number;
  total: number;
  placedAt: string;
};

/** Free shipping over this threshold; otherwise a flat fee applies. */
const FREE_SHIPPING_THRESHOLD = 40;
const SHIPPING_FEE = 4.95;

/** Generates a short, human-readable order reference, e.g. GC-7F3A21. */
function makeReference(): string {
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `GC-${rand}`;
}

/**
 * Checkout flow: collects shipping details, reviews the order, and confirms.
 *
 * NOTE: this is a simulated checkout for the MVP — no payment is processed and
 * no data leaves the browser (payments/PCI scope is deferred, per NFR3).
 */
export function CheckoutDialog({ lines, subtotal, onClose, onPlaceOrder }: CheckoutDialogProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [confirmed, setConfirmed] = useState<OrderSummary | null>(null);

  const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = toCents(subtotal + shipping);

  const canSubmit = name.trim() !== "" && email.trim() !== "" && address.trim() !== "";

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;
    const order: OrderSummary = {
      reference: makeReference(),
      name: name.trim(),
      email: email.trim(),
      address: address.trim(),
      itemCount,
      total,
      placedAt: new Date().toISOString(),
    };
    onPlaceOrder(order);
    setConfirmed(order);
  };

  return (
    <div
      className="modal app-modal-backdrop d-block"
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label="Checkout"
    >
      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content border-0 shadow">
          <div className="modal-header bg-success-subtle">
            <h2 className="modal-title h5 d-flex align-items-center gap-2">
              {confirmed ? "Order Confirmed" : "Checkout"}
            </h2>
            <button type="button" className="btn-close" aria-label="Close" onClick={onClose} />
          </div>

          {confirmed ? (
            <div className="modal-body text-center py-4">
              <div className="fs-1" aria-hidden="true">
                ✅
              </div>
              <h3 className="h4 mt-2">Thank you, {confirmed.name.split(" ")[0]}!</h3>
              <p className="text-muted">
                Your order <strong>{confirmed.reference}</strong> has been placed. A confirmation
                would be emailed to {confirmed.email}.
              </p>
              <ul className="list-unstyled text-start d-inline-block mt-3">
                <li>
                  <span className="text-muted">Items:</span> {confirmed.itemCount}
                </li>
                <li>
                  <span className="text-muted">Shipping to:</span> {confirmed.address}
                </li>
                <li>
                  <span className="text-muted">Total paid:</span>{" "}
                  <strong className="text-success">{formatPrice(confirmed.total)}</strong>
                </li>
              </ul>
              <p className="small text-muted mt-3 mb-0">
                This is a simulated checkout — no payment was processed.
              </p>
            </div>
          ) : (
            <form onSubmit={submit}>
              <div className="modal-body">
                <div className="row g-4">
                  <div className="col-md-7">
                    <h3 className="h6 text-uppercase text-muted fw-semibold mb-3">
                      Shipping details
                    </h3>

                    <div className="mb-3">
                      <label className="form-label" htmlFor="co-name">
                        Full name
                      </label>
                      <input
                        id="co-name"
                        className="form-control"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        autoComplete="name"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="co-email">
                        Email
                      </label>
                      <input
                        id="co-email"
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        autoComplete="email"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="co-address">
                        Shipping address
                      </label>
                      <textarea
                        id="co-address"
                        className="form-control"
                        rows={3}
                        value={address}
                        onChange={(event) => setAddress(event.target.value)}
                        autoComplete="street-address"
                        required
                      />
                    </div>
                  </div>

                  <div className="col-md-5">
                    <h3 className="h6 text-uppercase text-muted fw-semibold mb-3">Order summary</h3>
                    <ul className="list-unstyled mb-3">
                      {lines.map(({ product, quantity }) => (
                        <li
                          key={product.id}
                          className="d-flex justify-content-between small border-bottom py-1"
                        >
                          <span className="text-truncate me-2">
                            {product.name} × {quantity}
                          </span>
                          <span>{formatPrice(product.price * quantity)}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Subtotal</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Shipping</span>
                      <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between fw-bold">
                      <span>Total</span>
                      <span className="text-success">{formatPrice(total)}</span>
                    </div>
                    {shipping > 0 && (
                      <p className="small text-muted mt-2 mb-0">
                        Add {formatPrice(toCents(FREE_SHIPPING_THRESHOLD - subtotal))} more for free
                        shipping.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="modal-footer d-flex flex-column align-items-stretch gap-2">
                <div className="d-flex gap-2">
                  <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
                    Back to cart
                  </button>
                  <button type="submit" className="btn btn-success flex-fill" disabled={!canSubmit}>
                    Place order · {formatPrice(total)}
                  </button>
                </div>
                <small className="text-muted text-center">
                  Demo checkout — no real payment is taken.
                </small>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
