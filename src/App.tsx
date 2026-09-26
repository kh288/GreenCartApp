import { useCallback, useMemo, useState } from "react";
import { AdminPanel } from "./components/AdminPanel";
import { CartPage } from "./components/CartPage";
import { Catalog } from "./components/Catalog";
import { Filters } from "./components/Filters";
import { Footer } from "./components/Footer";
import { InsightsPanel } from "./components/InsightsPanel";
import { Navbar } from "./components/Navbar";
import { ProductDetail } from "./components/ProductDetail";
import { Toast } from "./components/Toast";
import { useAnalytics } from "./hooks/useAnalytics";
import { useCart } from "./hooks/useCart";
import { useFilters } from "./hooks/useFilters";
import { useProducts } from "./hooks/useProducts";
import { useToast } from "./hooks/useToast";
import { getRelatedProducts } from "./utils/filterProducts";
import type { Product } from "./types";

export default function App() {
  const {
    products,
    status,
    addProduct,
    updateProduct,
    removeProduct,
    resetProducts,
    hasAdminChanges,
  } = useProducts();
  const { toast, showToast } = useToast();
  const { summary, track, clear } = useAnalytics();

  const [selected, setSelected] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [insightsOpen, setInsightsOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);

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

  // FR7: record a search whenever the keyword changes.
  const handleSearch = useCallback(
    (value: string) => {
      setSearch(value);
      if (value.trim()) track({ type: "search", term: value.trim() });
    },
    [setSearch, track],
  );

  const handleOpen = useCallback(
    (product: Product) => {
      setSelected(product);
      // FR7: record a product view.
      track({ type: "view", productId: product.id, productName: product.name });
    },
    [track],
  );

  const { cart, cartCount, subtotal, addToCart, setQuantity, removeFromCart } = useCart((product) =>
    showToast(`Added ${product.name} to your cart`),
  );

  // FR7: wrap cart removal so it is tracked.
  const handleRemove = useCallback(
    (id: string) => {
      const line = cart.find((item) => item.product.id === id);
      if (line) track({ type: "remove_from_cart", productId: id, productName: line.product.name });
      removeFromCart(id);
    },
    [cart, removeFromCart, track],
  );

  const related = useMemo(() => getRelatedProducts(selected, products), [selected, products]);

  // FR8: route a save to add or update depending on whether it already exists.
  const handleSaveProduct = useCallback(
    (product: Product) => {
      const exists = products.some((item) => item.id === product.id);
      if (exists) {
        updateProduct(product);
        showToast(`Updated ${product.name}`);
      } else {
        addProduct(product);
        showToast(`Added ${product.name}`);
      }
    },
    [products, addProduct, updateProduct, showToast],
  );

  const handleRemoveProduct = useCallback(
    (id: string) => {
      const product = products.find((item) => item.id === id);
      removeProduct(id);
      if (product) showToast(`Removed ${product.name}`);
    },
    [products, removeProduct, showToast],
  );

  const handleResetProducts = useCallback(() => {
    resetProducts();
    showToast("Catalog reset to CSV data");
  }, [resetProducts, showToast]);

  // FR7: wrap add-to-cart so each add is logged with its quantity.
  const handleAdd = useCallback(
    (product: Product, quantity = 1) => {
      addToCart(product, quantity);
      track({
        type: "add_to_cart",
        productId: product.id,
        productName: product.name,
        quantity,
      });
    },
    [addToCart, track],
  );

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar
        cartCount={cartCount}
        onOpenCart={() => setCartOpen(true)}
        onOpenInsights={() => setInsightsOpen(true)}
        onOpenAdmin={() => setAdminOpen(true)}
      />

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
                onSearch={handleSearch}
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
                onAdd={(product) => handleAdd(product, 1)}
                onOpen={handleOpen}
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
          onAdd={handleAdd}
        />
      )}

      {cartOpen && (
        <CartPage
          lines={cart}
          subtotal={subtotal}
          onSetQuantity={setQuantity}
          onRemove={handleRemove}
          onClose={() => setCartOpen(false)}
          onCheckout={() => showToast("Checkout is coming in a future release")}
        />
      )}

      {insightsOpen && (
        <InsightsPanel summary={summary} onClear={clear} onClose={() => setInsightsOpen(false)} />
      )}

      {adminOpen && (
        <AdminPanel
          products={products}
          onSave={handleSaveProduct}
          onRemove={handleRemoveProduct}
          onReset={handleResetProducts}
          onClose={() => setAdminOpen(false)}
          hasAdminChanges={hasAdminChanges}
        />
      )}

      <Toast message={toast} />
    </div>
  );
}
