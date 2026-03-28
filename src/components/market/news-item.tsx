"use client";

const ago = (ts: number): string => {
  const mins = Math.round((Date.now() - ts) / 60000);
  if (mins < 60) return mins + "m ago";
  if (mins < 1440) return Math.round(mins / 60) + "h ago";
  return Math.round(mins / 1440) + "d ago";
};

type AffectedStock = {
  symbol: string;
  changePercent: number;
};

type NewsItemProps = {
  headline: string;
  source: string;
  sourceType: "fictional" | "real";
  sourceUrl?: string;
  affectedStocks: AffectedStock[];
  conceptTaught?: string;
  timestamp: number;
};

export function NewsItem({
  headline,
  source,
  sourceType,
  sourceUrl,
  affectedStocks,
  conceptTaught,
  timestamp,
}: NewsItemProps) {
  const sourceColor = sourceType === "real" ? "#ffffff" : "#7F77DD";
  const sourceLabel =
    sourceType === "real" ? source : "BLK Exchange News Desk";

  return (
    <div
      className="border-2 border-[#ffffff] bg-[#1a1a1a] p-4"
      style={{ boxShadow: "2px 2px 0px 0px #ffffff" }}
    >
      {/* Source + timestamp */}
      <div className="flex items-center justify-between mb-2 gap-2">
        {sourceType === "real" && sourceUrl ? (
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs font-bold uppercase tracking-wider hover:underline"
            style={{ color: sourceColor }}
          >
            {sourceLabel} ↗
          </a>
        ) : (
          <span
            className="font-mono text-xs font-bold uppercase tracking-wider"
            style={{ color: sourceColor }}
          >
            {sourceLabel}
          </span>
        )}
        <span className="font-mono text-xs text-white/30 shrink-0">
          {ago(timestamp)}
        </span>
      </div>

      {/* Headline */}
      <p className="font-mono font-bold text-white text-sm leading-snug mb-3">
        {headline}
      </p>

      {/* Affected tickers */}
      {affectedStocks.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {affectedStocks.map((s) => {
            const isPos = s.changePercent >= 0;
            const tickerColor = isPos ? "#22c55e" : "#ef4444";
            const prefix = isPos ? "+" : "";
            return (
              <span
                key={s.symbol}
                className="font-mono text-xs px-2 py-0.5 border"
                style={{
                  color: tickerColor,
                  borderColor: tickerColor,
                  backgroundColor: `${tickerColor}15`,
                }}
              >
                {s.symbol} {prefix}{s.changePercent.toFixed(1)}%
              </span>
            );
          })}
        </div>
      )}

      {/* Concept taught */}
      {conceptTaught && (
        <span className="inline-block font-mono text-xs px-2 py-0.5 border border-[#FDE047] text-[#FDE047] bg-[#FDE047]/10">
          {conceptTaught}
        </span>
      )}
    </div>
  );
}
