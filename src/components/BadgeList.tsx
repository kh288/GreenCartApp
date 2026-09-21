type BadgeListProps = {
  badges: string[];
};

/** Renders the sustainability badges for a product as a list. */
export function BadgeList({ badges }: BadgeListProps) {
  return (
    <ul>
      {badges.map((badge) => (
        <li key={badge}>{badge}</li>
      ))}
    </ul>
  );
}
