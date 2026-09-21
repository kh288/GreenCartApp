type StarRatingProps = {
  rating: number;
  reviewCount: number;
};

/** Renders a five-star rating using filled/empty glyphs plus the review count. */
export function StarRating({ rating, reviewCount }: StarRatingProps) {
  const fullStars = Math.floor(rating);
  return (
    <p>
      <span aria-hidden="true">
        {"★".repeat(fullStars)}
        {"☆".repeat(5 - fullStars)}
      </span>{" "}
      <small>
        {rating.toFixed(1)} ({reviewCount})
      </small>
    </p>
  );
}
