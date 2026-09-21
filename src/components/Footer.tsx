/** Site footer with the brand and copyright year. */
export function Footer() {
  return (
    <footer>
      <span>🌿 GreenCart</span>
      <small>&copy; {new Date().getFullYear()} GreenCart. All rights reserved.</small>
    </footer>
  );
}
