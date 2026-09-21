import { useCallback, useMemo, useState } from "react";
import { ALL, type Filters, type Product } from "../types";
import { filterProducts, getBadges, getCategories, getPriceCeiling } from "../utils/filterProducts";

type UseFiltersResult = {
  filters: Filters;
  categories: string[];
  badges: string[];
  priceCeiling: number;
  visibleProducts: Product[];
  setSearch: (value: string) => void;
  setCategory: (value: string) => void;
  setBadge: (value: string) => void;
  setMaxPrice: (value: number) => void;
  setMinRating: (value: number) => void;
  resetFilters: () => void;
};

/** The non-price filters, which have static defaults. */
type BaseFilters = Omit<Filters, "maxPrice">;

const INITIAL_BASE_FILTERS: BaseFilters = {
  search: "",
  category: ALL,
  badge: ALL,
  minRating: 0,
};

/**
 * Owns all catalog filter state (FR1) and derives the visible products.
 *
 * The max-price filter defaults to the catalog's price ceiling until the user
 * narrows it; `userMaxPrice === null` records that intent so the ceiling can be
 * derived during render rather than synced through an effect.
 */
export function useFilters(products: Product[]): UseFiltersResult {
  const priceCeiling = useMemo(() => getPriceCeiling(products), [products]);

  const [base, setBase] = useState<BaseFilters>(INITIAL_BASE_FILTERS);
  const [userMaxPrice, setUserMaxPrice] = useState<number | null>(null);

  const maxPrice = userMaxPrice ?? priceCeiling;
  const filters = useMemo<Filters>(() => ({ ...base, maxPrice }), [base, maxPrice]);

  const categories = useMemo(() => getCategories(products), [products]);
  const badges = useMemo(() => getBadges(products), [products]);
  const visibleProducts = useMemo(() => filterProducts(products, filters), [products, filters]);

  const setSearch = useCallback((search: string) => setBase((prev) => ({ ...prev, search })), []);
  const setCategory = useCallback(
    (category: string) => setBase((prev) => ({ ...prev, category })),
    [],
  );
  const setBadge = useCallback((badge: string) => setBase((prev) => ({ ...prev, badge })), []);
  const setMinRating = useCallback(
    (minRating: number) => setBase((prev) => ({ ...prev, minRating })),
    [],
  );
  const setMaxPrice = useCallback((value: number) => setUserMaxPrice(value), []);

  const resetFilters = useCallback(() => {
    setBase(INITIAL_BASE_FILTERS);
    setUserMaxPrice(null);
  }, []);

  return {
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
  };
}
