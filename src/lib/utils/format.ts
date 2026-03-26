export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function formatChange(cents: number): string {
  const prefix = cents >= 0 ? "+" : "";
  return `${prefix}$${(Math.abs(cents) / 100).toFixed(2)}`;
}

export function formatPercent(pct: number): string {
  const prefix = pct >= 0 ? "+" : "";
  return `${prefix}${pct.toFixed(2)}%`;
}
