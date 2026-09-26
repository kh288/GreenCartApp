type NavbarProps = {
  cartCount: number;
  onOpenCart: () => void;
  onOpenInsights: () => void;
};

/** Top navigation bar with the brand, insights link, and a cart button. */
export function Navbar({ cartCount, onOpenCart, onOpenInsights }: NavbarProps) {
  return (
    <nav className="navbar navbar-expand-lg bg-success-subtle border-bottom shadow-sm sticky-top">
      <div className="container">
        <a className="navbar-brand fw-bold text-success d-flex align-items-center gap-1" href="#">
          <span aria-hidden="true">🌿</span> GreenCart
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
              <a className="nav-link active fw-semibold" aria-current="page" href="#products">
                Shop
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#products">
                Categories
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#mission">
                Our Mission
              </a>
            </li>
            <li className="nav-item">
              <button type="button" className="nav-link btn btn-link" onClick={onOpenInsights}>
                Insights
              </button>
            </li>
          </ul>

          <button
            type="button"
            className="btn btn-success d-flex align-items-center gap-2 position-relative"
            onClick={onOpenCart}
          >
            <span aria-hidden="true">🛒</span>
            <span>Cart</span>
            {cartCount > 0 && (
              <span className="badge rounded-pill text-bg-danger">
                {cartCount}
                <span className="visually-hidden">items in cart</span>
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
