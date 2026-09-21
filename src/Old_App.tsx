import { useEffect, useMemo, useState } from "react";
import { getProducts, type Product } from "./utils/getCSV";

const BADGE_COLORS: Record<string, string> = {
  "Plastic-Free": "success",
  "Vegan": "success",
  "Locally Made": "primary",
  "Compostable": "success",
  "Carbon Neutral": "info",
  "Recycled": "info",
  "Organic": "success",
  "Fair Trade": "warning",
};

function StarRating({ rating, reviewCount }: { rating: number; reviewCount: number }) {
  const fullStars = Math.floor(rating);
  return (
    <div className="d-flex align-items-center gap-1">
      <span className="text-warning" aria-hidden="true">
        {"★".repeat(fullStars)}
        {"☆".repeat(5 - fullStars)}
      </span>
      <small className="text-muted">
        {rating.toFixed(1)} ({reviewCount})
      </small>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <div className="card h-100 shadow-sm border-0">
      <div className="ratio ratio-1x1 bg-body-secondary overflow-hidden">
        {imgFailed ? (
          <div className="d-flex align-items-center justify-content-center text-muted">
            <span className="fs-1">🌱</span>
          </div>
        ) : (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="object-fit-cover"
            onError={() => setImgFailed(true)}
          />
        )}
      </div>
      <div className="card-body d-flex flex-column">
        <div className="d-flex flex-wrap gap-1 mb-2">
          {product.ecoBadges.map((badge) => (
            <span key={badge} className={`badge text-bg-${BADGE_COLORS[badge] ?? "secondary"} `}>
              {badge}
            </span>
          ))}
        </div>
        <small className="text-uppercase text-muted fw-semibold">{product.brand}</small>
        <h6 className="card-title mb-1">{product.name}</h6>
        <StarRating rating={product.rating} reviewCount={product.reviewCount} />
        <p className="card-text text-muted small mt-2 flex-grow-1">{product.description}</p>
        <div className="d-flex justify-content-between align-items-center mt-3">
          <span className="fs-5 fw-bold text-success">${product.price.toFixed(2)}</span>
          <small className="text-muted">{product.size}</small>
        </div>
        <button type="button" className="btn btn-success w-100 mt-3">
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [activeCategory, setActiveCategory] = useState("All");

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

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(products.map((p) => p.category)))],
    [products],
  );

  const visibleProducts =
    activeCategory === "All" ? products : products.filter((p) => p.category === activeCategory);

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-success-subtle shadow-sm">
        <div className="container">
          <a className="navbar-brand fw-bold text-success" href="#">
            🌿 GreenCart
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNav"
            aria-controls="mainNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="mainNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link active" href="#">
                  Shop
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Categories
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Our Mission
                </a>
              </li>
            </ul>
            <div className="d-flex gap-2">
              <button className="btn btn-outline-success" type="button">
                Sign In
              </button>
              <button className="btn btn-success position-relative" type="button">
                🛒 Cart
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill text-bg-danger">
                  {/* REPLACE with actual cart item count */}3
                  <span className="visually-hidden">items in cart</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <header className="bg-success text-white py-5">
        <div className="container text-center py-4">
          <h1 className="display-4 fw-bold">Everyday Essentials, Zero Waste</h1>
          <p className="lead mb-4">
            Sustainable, plastic-free products for your home and body — delivered with
            carbon-neutral shipping.
          </p>
          <a href="#products" className="btn btn-light btn-lg fw-semibold">
            Shop Now
          </a>
        </div>
      </header>

      <main id="products" className="container py-5">
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
          <h2 className="h3 mb-0">Shop Our Products</h2>
          <div className="btn-group flex-wrap" role="group" aria-label="Category filter">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={`btn ${
                  activeCategory === category ? "btn-success" : "btn-outline-success"
                }`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {status === "loading" && (
          <div className="text-center py-5">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Loading products…</span>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="alert alert-danger text-center" role="alert">
            Sorry, we couldn&apos;t load the products. Please try again later.
          </div>
        )}

        {status === "ready" && (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4">
            {visibleProducts.map((product) => (
              <div className="col" key={product.id}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </main>

      <section className="bg-body-secondary py-5">
        <div className="container">
          <div className="row text-center g-4">
            <div className="col-md-4">
              <div className="fs-1">♻️</div>
              <h5 className="mt-2">Plastic-Free Packaging</h5>
              <p className="text-muted mb-0">Every order ships without single-use plastic.</p>
            </div>
            <div className="col-md-4">
              <div className="fs-1">🌍</div>
              <h5 className="mt-2">Carbon-Neutral Shipping</h5>
              <p className="text-muted mb-0">We offset every delivery, every time.</p>
            </div>
            <div className="col-md-4">
              <div className="fs-1">🤝</div>
              <h5 className="mt-2">Locally Sourced</h5>
              <p className="text-muted mb-0">Supporting makers and suppliers in our community.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-success text-white py-4 mt-0">
        <div className="container d-flex flex-wrap justify-content-between align-items-center gap-2">
          <span className="fw-semibold">🌿 GreenCart</span>
          <small className="mb-0">
            &copy; {new Date().getFullYear()} GreenCart. All rights reserved.
          </small>
        </div>
      </footer>
    </>
  );
}
