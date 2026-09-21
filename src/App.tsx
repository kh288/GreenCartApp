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
    <>
      <Navbar cartCount={cartCount} onOpenCart={() => setCartOpen(true)} />

      <header>
        <h1>Everyday Essentials, Zero Waste</h1>
        <p>Search sustainable, plastic-free products and build your cart in seconds.</p>
      </header>

      <main>
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

        <Catalog
          status={status}
          products={visibleProducts}
          onAdd={addToCart}
          onOpen={setSelected}
          onClearFilters={resetFilters}
        />
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
    </>
  );
}
