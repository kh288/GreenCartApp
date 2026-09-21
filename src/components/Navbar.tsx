type NavbarProps = {
  cartCount: number;
  onOpenCart: () => void;
};

/** Top navigation bar with the brand and a cart button showing the item count. */
export function Navbar({ cartCount, onOpenCart }: NavbarProps) {
  return (
    <nav aria-label="Main">
      <span>🌿 GreenCart</span>
      <button type="button" onClick={onOpenCart}>
        🛒 Cart {cartCount > 0 && <> ({cartCount})</>}
      </button>
    </nav>
  );
}
