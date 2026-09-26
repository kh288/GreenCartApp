import { useCallback, useEffect, useMemo, useState } from "react";
import { type LoadStatus, type Product } from "../types";
import { getProducts } from "../utils/getCSV";
import {
  applyOverlay,
  loadOverlay,
  type ProductOverlay,
  resetOverlay,
  saveOverlay,
} from "../utils/productStore";

type UseProductsResult = {
  products: Product[];
  status: LoadStatus;
  /** FR8: admin mutations. */
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  removeProduct: (id: string) => void;
  /** Restores the seed catalog, discarding all admin changes. */
  resetProducts: () => void;
  /** True when there are admin changes layered over the CSV seed. */
  hasAdminChanges: boolean;
};

/** Loads the product catalog once on mount and tracks its load status. */
export function useProducts(): UseProductsResult {
  const [seed, setSeed] = useState<Product[]>([]);
  const [overlay, setOverlay] = useState<ProductOverlay>(() => loadOverlay());
  const [status, setStatus] = useState<LoadStatus>("loading");

  useEffect(() => {
    let cancelled = false;

    getProducts()
      .then((loaded) => {
        if (cancelled) return;
        setSeed(loaded);
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Persist the overlay whenever it changes (FR8).
  useEffect(() => {
    saveOverlay(overlay);
  }, [overlay]);

  const products = useMemo(() => applyOverlay(seed, overlay), [seed, overlay]);

  const hasAdminChanges =
    overlay.added.length > 0 ||
    overlay.removedIds.length > 0 ||
    Object.keys(overlay.edits).length > 0;

  const addProduct = useCallback((product: Product) => {
    setOverlay((prev) => ({ ...prev, added: [...prev.added, product] }));
  }, []);

  const updateProduct = useCallback((product: Product) => {
    setOverlay((prev) => ({
      ...prev,
      edits: { ...prev.edits, [product.id]: product },
    }));
  }, []);

  const removeProduct = useCallback((id: string) => {
    setOverlay((prev) => {
      // Drop it from `added` if it was created here; otherwise mark removed.
      const wasAdded = prev.added.some((product) => product.id === id);
      return {
        edits: Object.fromEntries(Object.entries(prev.edits).filter(([key]) => key !== id)),
        added: prev.added.filter((product) => product.id !== id),
        removedIds: wasAdded ? prev.removedIds : [...new Set([...prev.removedIds, id])],
      };
    });
  }, []);

  const resetProducts = useCallback(() => {
    resetOverlay();
    setOverlay({ edits: {}, added: [], removedIds: [] });
  }, []);

  return {
    products,
    status,
    addProduct,
    updateProduct,
    removeProduct,
    resetProducts,
    hasAdminChanges,
  };
}
