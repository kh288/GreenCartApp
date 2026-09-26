import { useMemo, useState } from "react";
import { CartPage } from "./components/CartPage";
import { Catalog } from "./components/Catalog";
import { Filters } from "./components/Filters";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
import { ProductDetail } from "./components/ProductDetail";
import { Toast } from "./components/Toast";
import { useCart } from "./hooks/useCart";
import { useFilters } from "./hooks/useFilters";
import { useProducts } from "./hooks/useProducts";
import { useToast } from "./hooks/useToast";
import { getRelatedProducts } from "./utils/filterProducts";
import type { Product } from "./types";

export default function App() {
  const { products, status } = useProducts();
  const { toast, showToast } = useToast();

  const {
    filters,
    categories,
    badges,
    priceCeiling,
    visibleProducts,
    setSearch,
    setCategory,
    setBadge,
    setMaxPrice,
    setMinRating,
    resetFilters,
  } = useFilters(products);

  const { cart, cartCount, subtotal, addToCart, setQuantity, removeFromCart } = useCart((product) =>
    showToast(`Added ${product.name} to your cart`),
  );

  const [selected, setSelected] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);

  const related = useMemo(() => getRelatedProducts(selected, products), [selected, products]);

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar cartCount={cartCount} onOpenCart={() => setCartOpen(true)} />

      <header className="hero text-white py-5">
        <div className="container text-center py-4">
          <h1 className="display-4 fw-bold">Everyday Essentials, Zero Waste</h1>
          <p className="lead mb-4 mx-auto" style={{ maxWidth: "42rem" }}>
            Search sustainable, plastic-free products and build your cart in seconds — delivered
            with carbon-neutral shipping.
          </p>
          <a href="#products" className="btn btn-light btn-lg fw-semibold">
            Shop Now
          </a>
        </div>
      </header>

      <main className="flex-grow-1">
        <div className="container py-5">
          <div className="row g-4">
            <div className="col-lg-3">
              <Filters
                filters={filters}
                categories={categories}
                badges={badges}
                priceCeiling={priceCeiling}
                onSearch={setSearch}
                onCategory={setCategory}
                onBadge={setBadge}
                onMaxPrice={setMaxPrice}
                onMinRating={setMinRating}
              />
            </div>

            <div className="col-lg-9" id="products">
              <h2 className="h3 mb-4">Shop Our Products</h2>
              <Catalog
                status={status}
                products={visibleProducts}
                onAdd={addToCart}
                onOpen={setSelected}
                onClearFilters={resetFilters}
              />
            </div>
          </div>
        </div>

        <section id="mission" className="bg-body-secondary py-5">
          <div className="container">
            <div className="row text-center g-4">
              <div className="col-md-4">
                <div className="fs-1" aria-hidden="true">
                  ♻️
                </div>
                <h3 className="h5 mt-2">Plastic-Free Packaging</h3>
                <p className="text-muted mb-0">Every order ships without single-use plastic.</p>
              </div>
              <div className="col-md-4">
                <div className="fs-1" aria-hidden="true">
                  🌍
                </div>
                <h3 className="h5 mt-2">Carbon-Neutral Shipping</h3>
                <p className="text-muted mb-0">We offset every delivery, every time.</p>
              </div>
              <div className="col-md-4">
                <div className="fs-1" aria-hidden="true">
                  🤝
                </div>
                <h3 className="h5 mt-2">Locally Sourced</h3>
                <p className="text-muted mb-0">Supporting makers and suppliers in our community.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {selected && (
        <ProductDetail
          product={selected}
          related={related}
          onClose={() => setSelected(null)}
          onAdd={addToCart}
        />
      )}

      {cartOpen && (
        <CartPage
          lines={cart}
          subtotal={subtotal}
          onSetQuantity={setQuantity}
          onRemove={removeFromCart}
          onClose={() => setCartOpen(false)}
          onCheckout={() => showToast("Checkout is coming in a future release")}
        />
      )}

      <Toast message={toast} />
    </div>
  );
}
