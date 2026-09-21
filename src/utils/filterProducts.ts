import { ALL, type Filters, type Product } from "../types";

/**
 * Returns the subset of `products` matching every active filter.
 *
 * Keyword search (FR1) matches the product name, description, or brand.
 * Category, eco-badge, max price, and min rating each narrow the result set.
 */
export function filterProducts(products: Product[], filters: Filters): Product[] {
  const term = filters.search.trim().toLowerCase();

  return products.filter((product) => {
    const matchesTerm =
      term === "" ||
      product.name.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term) ||
      product.brand.toLowerCase().includes(term);

    const matchesCategory = filters.category === ALL || product.category === filters.category;
    const matchesBadge = filters.badge === ALL || product.ecoBadges.includes(filters.badge);
    const matchesPrice = product.price <= filters.maxPrice;
    const matchesRating = product.rating >= filters.minRating;

    return matchesTerm && matchesCategory && matchesBadge && matchesPrice && matchesRating;
  });
}

/** Distinct sorted list of categories, prefixed with the "All" sentinel. */
export function getCategories(products: Product[]): string[] {
  return [ALL, ...Array.from(new Set(products.map((p) => p.category))).sort()];
}

/** Distinct sorted list of eco-badges, prefixed with the "All" sentinel. */
export function getBadges(products: Product[]): string[] {
  return [ALL, ...Array.from(new Set(products.flatMap((p) => p.ecoBadges))).sort()];
}

/** Highest product price, rounded up; falls back to `fallback` for empty input. */
export function getPriceCeiling(products: Product[], fallback = 20): number {
  return Math.ceil(Math.max(...products.map((p) => p.price), fallback));
}

/** Resolves a product's related items by id, capped at `limit` entries. */
export function getRelatedProducts(
  product: Product | null,
  products: Product[],
  limit = 3,
): Product[] {
  if (!product) return [];
  return product.relatedProductIds
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p))
    .slice(0, limit);
}
