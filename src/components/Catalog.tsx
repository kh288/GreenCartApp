import { ProductCard } from "./ProductCard";
import type { LoadStatus, Product } from "../types";

type CatalogProps = {
  status: LoadStatus;
  products: Product[];
  onAdd: (product: Product) => void;
  onOpen: (product: Product) => void;
  onClearFilters: () => void;
};

/** Renders the product results area with loading, error, and empty states. */
export function Catalog({ status, products, onAdd, onOpen, onClearFilters }: CatalogProps) {
  if (status === "loading") {
    return <p role="status">Loading products…</p>;
  }

  if (status === "error") {
    return <p role="alert">Sorry, we couldn&apos;t load the products. Please try again later.</p>;
  }

  if (products.length === 0) {
    return (
      <div role="status">
        <p>No products match your search.</p>
        <button type="button" onClick={onClearFilters}>
          Clear filters
        </button>
      </div>
    );
  }

  return (
    <>
      <p>Results: {products.length}</p>
      <div>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onAdd={onAdd} onOpen={onOpen} />
        ))}
      </div>
    </>
  );
}
