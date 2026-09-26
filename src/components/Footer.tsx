/** Site footer with the brand and copyright year. */
export function Footer() {
  return (
    <footer className="bg-success text-white py-4 mt-auto">
      <div className="container d-flex flex-wrap justify-content-between align-items-center gap-2">
        <span className="fw-semibold d-flex align-items-center gap-1">
          <span aria-hidden="true">🌿</span> GreenCart
        </span>
        <small className="mb-0">
          &copy; {new Date().getFullYear()} GreenCart. All rights reserved.
        </small>
      </div>
    </footer>
  );
}
