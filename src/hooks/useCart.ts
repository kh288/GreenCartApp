import { useCallback, useMemo, useState } from "react";
import { type CartLine, type Product } from "../types";

type AddToCart = (product: Product, quantity?: number) => void;

type UseCartResult = {
  cart: CartLine[];
  cartCount: number;
  subtotal: number;
  addToCart: AddToCart;
  setQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
};

/**
 * Owns the shopping-cart state and operations (FR4).
 *
 * - `addToCart` merges quantity into an existing line rather than duplicating it.
 * - `setQuantity` removes the line when the quantity would drop to zero.
 */
export function useCart(onAdd?: (product: Product) => void): UseCartResult {
  const [cart, setCart] = useState<CartLine[]>([]);

  const addToCart = useCallback<AddToCart>(
    (product, quantity = 1) => {
      setCart((prev) => {
        const existing = prev.find((line) => line.product.id === product.id);
        if (existing) {
          return prev.map((line) =>
            line.product.id === product.id ? { ...line, quantity: line.quantity + quantity } : line,
          );
        }
        return [...prev, { product, quantity }];
      });
      onAdd?.(product);
    },
    [onAdd],
  );

  const removeFromCart = useCallback((id: string) => {
    setCart((prev) => prev.filter((line) => line.product.id !== id));
  }, []);

  const setQuantity = useCallback(
    (id: string, quantity: number) => {
      if (quantity <= 0) {
        removeFromCart(id);
        return;
      }
      setCart((prev) =>
        prev.map((line) => (line.product.id === id ? { ...line, quantity } : line)),
      );
    },
    [removeFromCart],
  );

  const cartCount = useMemo(() => cart.reduce((sum, line) => sum + line.quantity, 0), [cart]);
  const subtotal = useMemo(
    () => cart.reduce((sum, line) => sum + line.product.price * line.quantity, 0),
    [cart],
  );

  return { cart, cartCount, subtotal, addToCart, setQuantity, removeFromCart };
}
