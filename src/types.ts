import type { Product } from "./utils/getCSV";

export type { Product };

/** A single line in the shopping cart. */
export type CartLine = {
  product: Product;
  quantity: number;
};

/** Async lifecycle state shared by data-loading hooks. */
export type LoadStatus = "loading" | "ready" | "error";

/** The sentinel used in filter dropdowns to mean "any". */
export const ALL = "All" as const;

/** The full set of user-adjustable catalog filters. */
export type Filters = {
  search: string;
  category: string;
  badge: string;
  maxPrice: number;
  minRating: number;
};
