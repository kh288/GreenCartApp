import type { Product } from "../types";

/**
 * FR8: admin-managed product data.
 *
 * The CSV bundled at build time is the seed catalog. Admin edits, additions,
 * and deletions are stored as an overlay in localStorage and applied on top of
 * the seed, so changes persist across reloads without writing to the CSV.
 */

const STORAGE_KEY = "greencart:product-overlay";

/** The diff between the seed catalog and the current admin state. */
export type ProductOverlay = {
  /** Full product records that were edited, keyed by id. */
  edits: Record<string, Product>;
  /** Newly created products (not present in the seed). */
  added: Product[];
  /** Ids of seed products that were removed. */
  removedIds: string[];
};

const EMPTY_OVERLAY: ProductOverlay = { edits: {}, added: [], removedIds: [] };

/** Reads the admin overlay, tolerating missing or malformed data. */
export function loadOverlay(): ProductOverlay {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_OVERLAY;
    const parsed = JSON.parse(raw) as Partial<ProductOverlay>;
    return {
      edits: parsed.edits && typeof parsed.edits === "object" ? parsed.edits : {},
      added: Array.isArray(parsed.added) ? parsed.added : [],
      removedIds: Array.isArray(parsed.removedIds) ? parsed.removedIds : [],
    };
  } catch {
    return EMPTY_OVERLAY;
  }
}

/** Persists the admin overlay. */
export function saveOverlay(overlay: ProductOverlay): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(overlay));
  } catch {
    // Best-effort.
  }
}

/** Clears all admin changes, restoring the seed catalog. */
export function resetOverlay(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore.
  }
}

/** Applies an overlay to a seed catalog, returning the effective catalog. */
export function applyOverlay(seed: Product[], overlay: ProductOverlay): Product[] {
  const removed = new Set(overlay.removedIds);
  const edited = overlay.edits;

  const kept = seed
    .filter((product) => !removed.has(product.id))
    .map((product) => edited[product.id] ?? product);

  const added = overlay.added.filter((product) => !removed.has(product.id));

  return [...kept, ...added];
}

/** Returns the next sequential product id (e.g. P013). */
export function nextProductId(products: Product[]): string {
  const max = products.reduce((highest, product) => {
    const match = /^P(\d+)$/.exec(product.id);
    return match ? Math.max(highest, Number(match[1])) : highest;
  }, 0);
  return `P${String(max + 1).padStart(3, "0")}`;
}

/** A blank product with sensible defaults, for the "add product" form. */
export function emptyProduct(id: string): Product {
  return {
    id,
    name: "",
    category: "",
    brand: "",
    price: 0,
    size: "",
    description: "",
    ingredients: "",
    plasticFree: false,
    vegan: false,
    locallyMade: false,
    carbonNeutralShipping: false,
    ecoBadges: [],
    inventory: 0,
    rating: 0,
    reviewCount: 0,
    supplierName: "",
    certification: "",
    imageUrl: "",
    relatedProductIds: [],
  };
}
