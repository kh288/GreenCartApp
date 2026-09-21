/** Formats a numeric amount as a US-dollar string with two decimals. */
export function formatPrice(amount: number): string {
  return `$${amount.toFixed(2)}`;
}
