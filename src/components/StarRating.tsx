type StarRatingProps = {
  rating: number;
  reviewCount: number;
};

/** Renders a five-star rating using filled/empty glyphs plus the review count. */
export function StarRating({ rating, reviewCount }: StarRatingProps) {
  const fullStars = Math.floor(rating);
  return (
    <div className="d-flex align-items-center gap-1">
      <span className="text-warning" aria-hidden="true">
        {"★".repeat(fullStars)}
        {"☆".repeat(5 - fullStars)}
      </span>
      <small className="text-muted">
        {rating.toFixed(1)} ({reviewCount})
      </small>
    </div>
  );
}
