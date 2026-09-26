type BadgeListProps = {
  badges: string[];
};

/** Maps eco-badge labels to Bootstrap color-role suffixes. */
const BADGE_COLORS: Record<string, string> = {
  "Plastic-Free": "success",
  "Vegan": "success",
  "Locally Made": "primary",
  "Compostable": "success",
  "Carbon Neutral": "info",
  "Recycled": "info",
  "Organic": "success",
  "Fair Trade": "warning",
};

/** Renders the sustainability badges for a product as colored pills. */
export function BadgeList({ badges }: BadgeListProps) {
  if (badges.length === 0) return null;

  return (
    <div className="d-flex flex-wrap gap-1">
      {badges.map((badge) => (
        <span key={badge} className={`badge text-bg-${BADGE_COLORS[badge] ?? "secondary"}`}>
          {badge}
        </span>
      ))}
    </div>
  );
}
