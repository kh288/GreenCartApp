/** Rounds a monetary amount to whole cents, avoiding float drift. */
export function toCents(amount: number): number {
  return Math.round(amount * 100) / 100;
}

/** Formats a numeric amount as a US-dollar string with two decimals. */
export function formatPrice(amount: number): string {
  return `$${toCents(amount).toFixed(2)}`;
}
