import type { CartLine } from "../types";

/** localStorage key under which the guest cart is persisted. */
export const CART_STORAGE_KEY = "greencart:cart";

/** How long a guest cart survives without activity (FR5: 24 hours). */
export const CART_TTL_MS = 24 * 60 * 60 * 1000;

/** Shape written to storage: the lines plus the time they were last saved. */
type StoredCart = {
  savedAt: number;
  lines: CartLine[];
};

/** Returns true when the given cart line looks structurally valid. */
function isValidLine(value: unknown): value is CartLine {
  if (typeof value !== "object" || value === null) return false;
  const line = value as Partial<CartLine>;
  return (
    typeof line.quantity === "number" &&
    line.quantity > 0 &&
    typeof line.product === "object" &&
    line.product !== null &&
    typeof line.product.id === "string"
  );
}

/**
 * Reads the persisted guest cart.
 *
 * Returns an empty array when storage is unavailable, the entry is missing or
 * malformed, or the cart has outlived its 24-hour TTL. Expired/invalid entries
 * are cleared as a side effect.
 */
export function loadCart(now: number = Date.now()): CartLine[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as Partial<StoredCart>;
    const { savedAt, lines } = parsed;

    const expired = typeof savedAt !== "number" || now - savedAt > CART_TTL_MS;
    const validLines = Array.isArray(lines) && lines.every(isValidLine);

    if (expired || !validLines) {
      clearCart();
      return [];
    }

    return lines;
  } catch {
    // Storage disabled (private mode) or corrupted JSON — start fresh.
    return [];
  }
}

/** Persists the cart with a fresh timestamp. */
export function saveCart(lines: CartLine[], now: number = Date.now()): void {
  try {
    const payload: StoredCart = { savedAt: now, lines };
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Storage full or unavailable — persistence is best-effort, not critical.
  }
}

/** Removes the persisted cart. */
export function clearCart(): void {
  try {
    localStorage.removeItem(CART_STORAGE_KEY);
  } catch {
    // Nothing to do if storage is unavailable.
  }
}
