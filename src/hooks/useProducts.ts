import { useEffect, useState } from "react";
import { type LoadStatus, type Product } from "../types";
import { getProducts } from "../utils/getCSV";

type UseProductsResult = {
  products: Product[];
  status: LoadStatus;
};

/** Loads the product catalog once on mount and tracks its load status. */
export function useProducts(): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<LoadStatus>("loading");

  useEffect(() => {
    let cancelled = false;

    getProducts()
      .then((loaded) => {
        if (cancelled) return;
        setProducts(loaded);
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { products, status };
}
