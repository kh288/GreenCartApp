import type { Filters as FiltersState } from "../types";

type FiltersProps = {
  filters: FiltersState;
  categories: string[];
  badges: string[];
  priceCeiling: number;
  onSearch: (value: string) => void;
  onCategory: (value: string) => void;
  onBadge: (value: string) => void;
  onMaxPrice: (value: number) => void;
  onMinRating: (value: number) => void;
};

/** Task 1: keyword search plus category, badge, price, and rating filters (FR1). */
export function Filters({
  filters,
  categories,
  badges,
  priceCeiling,
  onSearch,
  onCategory,
  onBadge,
  onMaxPrice,
  onMinRating,
}: FiltersProps) {
  return (
    <section aria-label="Filters">
      <p>
        <label htmlFor="search-input">Search products</label>
        <input
          id="search-input"
          type="search"
          placeholder="Search products…"
          value={filters.search}
          onChange={(event) => onSearch(event.target.value)}
        />
      </p>

      <p>
        <label htmlFor="filter-category">Category</label>
        <select
          id="filter-category"
          value={filters.category}
          onChange={(event) => onCategory(event.target.value)}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </p>

      <p>
        <label htmlFor="filter-badge">Eco-Badge</label>
        <select
          id="filter-badge"
          value={filters.badge}
          onChange={(event) => onBadge(event.target.value)}
        >
          {badges.map((badge) => (
            <option key={badge} value={badge}>
              {badge}
            </option>
          ))}
        </select>
      </p>

      <p>
        <label htmlFor="filter-price">Max price: ${filters.maxPrice.toFixed(0)}</label>
        <input
          id="filter-price"
          type="range"
          min={0}
          max={priceCeiling}
          step={1}
          value={filters.maxPrice}
          onChange={(event) => onMaxPrice(Number(event.target.value))}
        />
      </p>

      <p>
        <label htmlFor="filter-rating">Min rating: {filters.minRating.toFixed(1)}★</label>
        <input
          id="filter-rating"
          type="range"
          min={0}
          max={5}
          step={0.5}
          value={filters.minRating}
          onChange={(event) => onMinRating(Number(event.target.value))}
        />
      </p>
    </section>
  );
}
