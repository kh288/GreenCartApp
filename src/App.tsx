import { useEffect, useMemo, useState } from "react";
import { getProducts, type Product } from "./utils/getCSV";

type CartLine = { product: Product; quantity: number };

function StarRating({ rating, reviewCount }: { rating: number; reviewCount: number }) {
  const fullStars = Math.floor(rating);
  return (
    <p>
      <span aria-hidden="true">
        {"★".repeat(fullStars)}
        {"☆".repeat(5 - fullStars)}
      </span>{" "}
      <small>
        {rating.toFixed(1)} ({reviewCount})
      </small>
    </p>
  );
}

function BadgeList({ badges }: { badges: string[] }) {
  return (
    <ul>
      {badges.map((badge) => (
        <li key={badge}>{badge}</li>
      ))}
    </ul>
  );
}

function ProductCard({
  product,
  onAdd,
  onOpen,
}: {
  product: Product;
  onAdd: (product: Product) => void;
  onOpen: (product: Product) => void;
}) {
  const [imgFailed, setImgFailed] = useState(false);
  const inStock = product.inventory > 0;

  return (
    <article>
      <button
        type="button"
        onClick={() => onOpen(product)}
        aria-label={`View details for ${product.name}`}
      >
        {imgFailed ? (
          <span aria-hidden="true">🌱</span>
        ) : (
          <img
            src={product.imageUrl}
            alt={product.name}
            width={240}
            height={240}
            onError={() => setImgFailed(true)}
          />
        )}
      </button>
      <BadgeList badges={product.ecoBadges} />
      <p>
        <small>{product.brand}</small>
      </p>
      <h3>{product.name}</h3>
      <StarRating rating={product.rating} reviewCount={product.reviewCount} />
      <p>{product.description}</p>
      <p>
        <strong>${product.price.toFixed(2)}</strong> · <small>{product.size}</small>
      </p>
      <button type="button" disabled={!inStock} onClick={() => onAdd(product)}>
        {inStock ? "Add to Cart" : "Out of Stock"}
      </button>
    </article>
  );
}

function ProductDetail({
  product,
  related,
  onClose,
  onAdd,
}: {
  product: Product;
  related: Product[];
  onClose: () => void;
  onAdd: (product: Product, quantity: number) => void;
}) {
  const [imgFailed, setImgFailed] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const inStock = product.inventory > 0;

  return (
    <div role="dialog" aria-modal="true" aria-label={product.name}>
      <header>
        <h2>{product.name}</h2>
        <button type="button" aria-label="Close" onClick={onClose}>
          ✕
        </button>
      </header>

      <div>
        <section>
          {imgFailed ? (
            <span aria-hidden="true">🌱</span>
          ) : (
            <img
              src={product.imageUrl}
              alt={product.name}
              width={320}
              height={320}
              onError={() => setImgFailed(true)}
            />
          )}
        </section>

        <section>
          <p>
            <small>{product.brand}</small>
          </p>
          <BadgeList badges={product.ecoBadges} />
          <StarRating rating={product.rating} reviewCount={product.reviewCount} />
          <p>
            <strong>${product.price.toFixed(2)}</strong>
          </p>
          <p>{inStock ? `In stock (${product.inventory} available)` : "Out of stock"}</p>

          <h3>Description</h3>
          <p>{product.description}</p>

          <h3>Ingredients / Sourcing</h3>
          <p>{product.ingredients || "Not specified."}</p>

          <h3>Reviews</h3>
          <p>
            {product.reviewCount} reviews · average {product.rating.toFixed(1)} / 5
          </p>
          {/* NOTE: individual review text is not in the current dataset. */}

          <div>
            <button
              type="button"
              aria-label="Decrease quantity"
              disabled={!inStock || quantity <= 1}
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            >
              −
            </button>
            <output aria-live="polite">{quantity}</output>
            <button
              type="button"
              aria-label="Increase quantity"
              disabled={!inStock || quantity >= product.inventory}
              onClick={() => setQuantity((q) => Math.min(product.inventory, q + 1))}
            >
              +
            </button>
            <button type="button" disabled={!inStock} onClick={() => onAdd(product, quantity)}>
              {inStock ? "Add to Cart" : "Notify Me"}
            </button>
          </div>
        </section>
      </div>

      {related.length > 0 && (
        <section>
          <h3>You Might Also Like</h3>
          <ul>
            {related.map((item) => (
              <li key={item.id}>
                {item.imageUrl && (
                  <img src={item.imageUrl} alt={item.name} width={120} height={120} />
                )}
                <p>{item.name}</p>
                <p>
                  <strong>${item.price.toFixed(2)}</strong>
                </p>
                <button type="button" disabled={item.inventory <= 0} onClick={() => onAdd(item, 1)}>
                  Add to Cart
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Task 3: Cart page                                                   */
/* ------------------------------------------------------------------ */

function CartPage({
  lines,
  subtotal,
  onSetQuantity,
  onRemove,
  onClose,
  onCheckout,
}: {
  lines: CartLine[];
  subtotal: number;
  onSetQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  onClose: () => void;
  onCheckout: () => void;
}) {
  return (
    <div role="dialog" aria-modal="true" aria-label="Your Cart">
      <header>
        <h2>Your Cart</h2>
        <button type="button" aria-label="Close" onClick={onClose}>
          ✕
        </button>
      </header>

      {lines.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul>
          {lines.map(({ product, quantity }) => (
            <li key={product.id}>
              {product.imageUrl && (
                <img src={product.imageUrl} alt={product.name} width={64} height={64} />
              )}
              <div>
                <p>{product.name}</p>
                <small>${product.price.toFixed(2)} each</small>
              </div>
              <div>
                <button
                  type="button"
                  aria-label={`Decrease ${product.name} quantity`}
                  onClick={() => onSetQuantity(product.id, quantity - 1)}
                >
                  −
                </button>
                <output>{quantity}</output>
                <button
                  type="button"
                  aria-label={`Increase ${product.name} quantity`}
                  onClick={() => onSetQuantity(product.id, quantity + 1)}
                >
                  +
                </button>
              </div>
              <span>${(product.price * quantity).toFixed(2)}</span>
              <button
                type="button"
                aria-label={`Remove ${product.name}`}
                onClick={() => onRemove(product.id)}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}

      {lines.length > 0 && (
        <footer>
          <p>
            Subtotal: <strong>${subtotal.toFixed(2)}</strong>
          </p>
          <button type="button" onClick={onClose}>
            Continue Shopping
          </button>
          <button type="button" onClick={onCheckout}>
            Checkout
          </button>
          <small>Checkout &amp; payments are planned for a future release.</small>
        </footer>
      )}
    </div>
  );
}

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  // --- Task 1: search & filter state ---
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeBadge, setActiveBadge] = useState("All");
  const [maxPrice, setMaxPrice] = useState(20);
  const [minRating, setMinRating] = useState(0);

  // --- Task 2/3: selection + cart state ---
  const [selected, setSelected] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getProducts()
      .then((loaded) => {
        if (cancelled) return;
        setProducts(loaded);
        setStatus("ready");
        const highest = Math.ceil(Math.max(...loaded.map((p) => p.price), 0));
        setMaxPrice(highest);
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Auto-dismiss the "added to cart" toast.
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(timer);
  }, [toast]);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(products.map((p) => p.category)))],
    [products],
  );

  const badges = useMemo(
    () => ["All", ...Array.from(new Set(products.flatMap((p) => p.ecoBadges)))],
    [products],
  );

  const priceCeiling = useMemo(
    () => Math.ceil(Math.max(...products.map((p) => p.price), 20)),
    [products],
  );

  // Task 1: apply keyword + category + badge + price + rating filters (FR1).
  const visibleProducts = useMemo(() => {
    const term = search.trim().toLowerCase();
    return products.filter((p) => {
      const matchesTerm =
        term === "" ||
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        p.brand.toLowerCase().includes(term);
      const matchesCategory = activeCategory === "All" || p.category === activeCategory;
      const matchesBadge = activeBadge === "All" || p.ecoBadges.includes(activeBadge);
      const matchesPrice = p.price <= maxPrice;
      const matchesRating = p.rating >= minRating;
      return matchesTerm && matchesCategory && matchesBadge && matchesPrice && matchesRating;
    });
  }, [products, search, activeCategory, activeBadge, maxPrice, minRating]);

  const cartCount = cart.reduce((sum, line) => sum + line.quantity, 0);
  const subtotal = cart.reduce((sum, line) => sum + line.product.price * line.quantity, 0);

  // Task 3: add to cart (FR4), merging quantities for existing lines.
  function addToCart(product: Product, quantity = 1) {
    setCart((prev) => {
      const existing = prev.find((line) => line.product.id === product.id);
      if (existing) {
        return prev.map((line) =>
          line.product.id === product.id ? { ...line, quantity: line.quantity + quantity } : line,
        );
      }
      return [...prev, { product, quantity }];
    });
    setToast(`Added ${product.name} to your cart`);
  }

  // Task 3: set quantity; removing when it would drop to 0 (FR4).
  function setQuantity(id: string, quantity: number) {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prev) => prev.map((line) => (line.product.id === id ? { ...line, quantity } : line)));
  }

  function removeFromCart(id: string) {
    setCart((prev) => prev.filter((line) => line.product.id !== id));
  }

  function resetFilters() {
    setSearch("");
    setActiveCategory("All");
    setActiveBadge("All");
    setMaxPrice(priceCeiling);
    setMinRating(0);
  }

  const related = selected
    ? selected.relatedProductIds
        .map((id) => products.find((p) => p.id === id))
        .filter((p): p is Product => Boolean(p))
        .slice(0, 3)
    : [];

  return (
    <>
      <nav aria-label="Main">
        <span>🌿 GreenCart</span>
        <form role="search" onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="search-input">Search products</label>
          <input
            id="search-input"
            type="search"
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
        <button type="button" onClick={() => setCartOpen(true)}>
          🛒 Cart {cartCount > 0 && <> ({cartCount})</>}
        </button>
      </nav>

      <header>
        <h1>Everyday Essentials, Zero Waste</h1>
        <p>Search sustainable, plastic-free products and build your cart in seconds.</p>
      </header>

      <main>
        {/* Task 1: filters */}
        <section aria-label="Filters">
          <p>
            <label htmlFor="filter-category">Category</label>
            <select
              id="filter-category"
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </p>

          <p>
            <label htmlFor="filter-badge">Eco-Badge</label>
            <select
              id="filter-badge"
              value={activeBadge}
              onChange={(e) => setActiveBadge(e.target.value)}
            >
              {badges.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </p>

          <p>
            <label htmlFor="filter-price">Max price: ${maxPrice.toFixed(0)}</label>
            <input
              id="filter-price"
              type="range"
              min={0}
              max={priceCeiling}
              step={1}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
            />
          </p>

          <p>
            <label htmlFor="filter-rating">Min rating: {minRating.toFixed(1)}★</label>
            <input
              id="filter-rating"
              type="range"
              min={0}
              max={5}
              step={0.5}
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
            />
          </p>
        </section>

        {status === "loading" && <p role="status">Loading products…</p>}

        {status === "error" && (
          <p role="alert">Sorry, we couldn&apos;t load the products. Please try again later.</p>
        )}

        {status === "ready" && (
          <>
            <p>Results: {visibleProducts.length}</p>

            {visibleProducts.length === 0 ? (
              <div role="status">
                <p>No products match your search.</p>
                <button type="button" onClick={resetFilters}>
                  Clear filters
                </button>
              </div>
            ) : (
              <div>
                {visibleProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAdd={addToCart}
                    onOpen={setSelected}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      <footer>
        <span>🌿 GreenCart</span>
        <small>&copy; {new Date().getFullYear()} GreenCart. All rights reserved.</small>
      </footer>

      {/* Task 2: product detail */}
      {selected && (
        <ProductDetail
          product={selected}
          related={related}
          onClose={() => setSelected(null)}
          onAdd={(product, quantity) => addToCart(product, quantity)}
        />
      )}

      {/* Task 3: cart */}
      {cartOpen && (
        <CartPage
          lines={cart}
          subtotal={subtotal}
          onSetQuantity={setQuantity}
          onRemove={removeFromCart}
          onClose={() => setCartOpen(false)}
          onCheckout={() => setToast("Checkout is coming in a future release")}
        />
      )}

      {/* Confirmation toast (FR4) */}
      {toast && (
        <p role="status" aria-live="polite">
          {toast}
        </p>
      )}
    </>
  );
}
