"use client";

type StockData = {
  _id: string;
  symbol: string;
  name: string;
  priceInCents: number;
};

type TradePreviewProps = {
  type: "buy" | "sell";
  amountInCents: number;
  stock: StockData;
  playerCash: number;
  currentHoldingShares: number;
  totalPortfolioValueInCents: number;
};

function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function TradePreview({
  type,
  amountInCents,
  stock,
  playerCash,
  currentHoldingShares,
  totalPortfolioValueInCents,
}: TradePreviewProps) {
  if (amountInCents <= 0) {
    return (
      <div className="border-2 border-white/20 bg-[#1a1a1a] p-4">
        <p className="font-mono text-xs text-white/30 text-center">
          Enter an amount to preview
        </p>
      </div>
    );
  }

  const shares = Math.round((amountInCents / stock.priceInCents) * 10000) / 10000;

  // Compute new cash balance
  const newCash =
    type === "buy" ? playerCash - amountInCents : playerCash + amountInCents;

  // Compute existing holding value
  const existingHoldingValueCents = Math.round(
    currentHoldingShares * stock.priceInCents
  );

  // Compute new holding value after trade
  const newHoldingValueCents =
    type === "buy"
      ? existingHoldingValueCents + amountInCents
      : existingHoldingValueCents - amountInCents;

  // Allocation % of total portfolio after trade
  const newPortfolioValue =
    type === "buy"
      ? totalPortfolioValueInCents
      : totalPortfolioValueInCents; // portfolio value stays roughly the same (cash up, holding down)

  const allocationPercent =
    newPortfolioValue > 0
      ? Math.round((newHoldingValueCents / newPortfolioValue) * 10000) / 100
      : 0;

  // 25% position limit check
  const maxPositionCents = Math.round(totalPortfolioValueInCents * 0.25);
  const wouldExceedLimit =
    type === "buy" && newHoldingValueCents > maxPositionCents;

  // Sell validation
  const currentSharesValue = existingHoldingValueCents;
  const insufficientShares =
    type === "sell" && amountInCents > currentSharesValue;
  const insufficientCash = type === "buy" && amountInCents > playerCash;

  return (
    <div className="border-2 border-[#ffffff] bg-[#1a1a1a] p-4 space-y-3">
      <p className="font-mono text-xs text-white/40 uppercase tracking-wider border-b border-white/10 pb-2">
        Trade Preview
      </p>

      {/* Shares */}
      <div className="flex justify-between items-center">
        <span className="font-mono text-xs text-white/50">Shares</span>
        <span className="font-mono text-sm text-white font-bold">
          {shares.toFixed(4)} {stock.symbol}
        </span>
      </div>

      {/* Execution price */}
      <div className="flex justify-between items-center">
        <span className="font-mono text-xs text-white/50">Exec Price</span>
        <span className="font-mono text-sm text-white">
          {formatCents(stock.priceInCents)}
        </span>
      </div>

      {/* New position allocation */}
      <div className="flex justify-between items-center">
        <span className="font-mono text-xs text-white/50">New Allocation</span>
        <span
          className="font-mono text-sm font-bold"
          style={{
            color: wouldExceedLimit ? "#ef4444" : "#22c55e",
          }}
        >
          {allocationPercent.toFixed(1)}%
        </span>
      </div>

      {/* New cash balance */}
      <div className="flex justify-between items-center">
        <span className="font-mono text-xs text-white/50">New Cash</span>
        <span
          className="font-mono text-sm font-bold"
          style={{
            color: newCash < 0 ? "#ef4444" : "#ffffff",
          }}
        >
          {newCash < 0 ? "-" : ""}
          {formatCents(Math.abs(newCash))}
        </span>
      </div>

      {/* Warnings */}
      {wouldExceedLimit && (
        <div className="border-2 border-[#ef4444] bg-[#ef4444]/10 p-2 mt-2">
          <p className="font-mono text-xs text-[#ef4444]">
            Warning: exceeds 25% position limit ({formatCents(maxPositionCents)}{" "}
            max)
          </p>
        </div>
      )}

      {insufficientCash && (
        <div className="border-2 border-[#ef4444] bg-[#ef4444]/10 p-2 mt-2">
          <p className="font-mono text-xs text-[#ef4444]">
            Insufficient cash. Available: {formatCents(playerCash)}
          </p>
        </div>
      )}

      {insufficientShares && (
        <div className="border-2 border-[#ef4444] bg-[#ef4444]/10 p-2 mt-2">
          <p className="font-mono text-xs text-[#ef4444]">
            Insufficient position. Current value: {formatCents(currentSharesValue)}
          </p>
        </div>
      )}
    </div>
  );
}
