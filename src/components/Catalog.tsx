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
    return (
      <div className="text-center py-5" role="status">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading products…</span>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="alert alert-danger text-center" role="alert">
        Sorry, we couldn&apos;t load the products. Please try again later.
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-5" role="status">
        <div className="fs-1" aria-hidden="true">
          🌱
        </div>
        <p className="text-muted">No products match your search.</p>
        <button type="button" className="btn btn-outline-success" onClick={onClearFilters}>
          Clear filters
        </button>
      </div>
    );
  }

  return (
    <>
      <p className="text-muted mb-3">
        Showing <strong className="text-body">{products.length}</strong> product
        {products.length === 1 ? "" : "s"}
      </p>
      <div className="row row-cols-1 row-cols-sm-2 row-cols-xl-3 g-4">
        {products.map((product) => (
          <div className="col" key={product.id}>
            <ProductCard product={product} onAdd={onAdd} onOpen={onOpen} />
          </div>
        ))}
      </div>
    </>
  );
}
