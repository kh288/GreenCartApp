import { formatPrice } from "../utils/format";
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
    <section className="card border-0 shadow-sm filters-sticky" aria-label="Filters">
      <div className="card-body">
        <h2 className="h5 mb-3 d-flex align-items-center gap-2">Filters</h2>

        <div className="mb-3">
          <label htmlFor="search-input" className="form-label fw-semibold small text-uppercase">
            Search products
          </label>
          <input
            id="search-input"
            type="search"
            className="form-control"
            placeholder="Search products…"
            value={filters.search}
            onChange={(event) => onSearch(event.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="filter-category" className="form-label fw-semibold small text-uppercase">
            Category
          </label>
          <select
            id="filter-category"
            className="form-select"
            value={filters.category}
            onChange={(event) => onCategory(event.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="filter-badge" className="form-label fw-semibold small text-uppercase">
            Eco-Badge
          </label>
          <select
            id="filter-badge"
            className="form-select"
            value={filters.badge}
            onChange={(event) => onBadge(event.target.value)}
          >
            {badges.map((badge) => (
              <option key={badge} value={badge}>
                {badge}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="filter-price" className="form-label fw-semibold small text-uppercase">
            Max price: <span className="text-success">{formatPrice(filters.maxPrice)}</span>
          </label>
          <input
            id="filter-price"
            type="range"
            className="form-range"
            min={0}
            max={priceCeiling}
            step={1}
            value={filters.maxPrice}
            onChange={(event) => onMaxPrice(Number(event.target.value))}
          />
        </div>

        <div className="mb-1">
          <label htmlFor="filter-rating" className="form-label fw-semibold small text-uppercase">
            Min rating: <span className="text-warning">{filters.minRating.toFixed(1)}★</span>
          </label>
          <input
            id="filter-rating"
            type="range"
            className="form-range"
            min={0}
            max={5}
            step={0.5}
            value={filters.minRating}
            onChange={(event) => onMinRating(Number(event.target.value))}
          />
        </div>
      </div>
    </section>
  );
}
