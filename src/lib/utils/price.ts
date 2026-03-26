export function applyPriceChange(priceInCents: number, changePercent: number): number {
  return Math.round(priceInCents * (1 + changePercent / 100));
}

export function computePortfolioValue(
  holdings: Array<{ shares: number; priceInCents: number }>,
  cashInCents: number
): number {
  const holdingsValue = holdings.reduce(
    (sum, h) => sum + Math.round(h.shares * h.priceInCents),
    0
  );
  return holdingsValue + cashInCents;
}

export function roundShares(shares: number): number {
  return Math.round(shares * 10000) / 10000;
}

export function computeDiversificationScore(sectorCount: number, totalSectors: number): number {
  return Math.round((sectorCount / totalSectors) * 100);
}
