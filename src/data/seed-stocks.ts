import { TICKERS } from "@/lib/constants/tickers";

export const SEED_STOCKS = TICKERS.map((t) => ({
  symbol: t.symbol,
  name: t.name,
  description: t.name,
  sector: t.sector,
  priceInCents: t.startPriceInCents,
  previousCloseInCents: t.startPriceInCents,
  dailyChangeInCents: 0,
  dailyChangePercent: 0,
  marketCapInCents: t.startPriceInCents * 1_000_000,
  priceHistory: [{ timestamp: Date.now(), priceInCents: t.startPriceInCents }],
}));
