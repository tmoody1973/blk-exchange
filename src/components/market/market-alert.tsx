"use client";

import { useEffect, useState } from "react";
import { X, Zap, Radio } from "lucide-react";
import { useMarketAlert } from "@/lib/hooks/use-market-alert";

export function MarketAlert() {
  const { alert, isVisible, dismiss } = useMarketAlert();
  const [mounted, setMounted] = useState(false);

  // Avoid SSR mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !alert) return null;

  return (
    <>
      {/* Desktop: slides in from right */}
      <div
        className={[
          "hidden lg:flex",
          "fixed top-16 right-4 z-50",
          "flex-col gap-3",
          "w-[380px] max-h-[calc(100vh-5rem)] overflow-y-auto",
          "border-2 border-[#ffffff] bg-[#1a1a1a]",
          "transition-transform duration-500 ease-out",
          isVisible ? "translate-x-0" : "translate-x-[110%]",
        ].join(" ")}
        style={{ boxShadow: "4px 4px 0px 0px #7F77DD" }}
        role="alert"
        aria-live="assertive"
      >
        <AlertInner alert={alert} onDismiss={dismiss} />
      </div>

      {/* Mobile: slides up from bottom */}
      <div
        className={[
          "lg:hidden",
          "fixed bottom-16 left-0 right-0 z-50",
          "border-t-2 border-[#ffffff] bg-[#1a1a1a]",
          "transition-transform duration-500 ease-out",
          isVisible ? "translate-y-0" : "translate-y-[110%]",
        ].join(" ")}
        style={{ boxShadow: "0px -4px 0px 0px #7F77DD" }}
        role="alert"
        aria-live="assertive"
      >
        <AlertInner alert={alert} onDismiss={dismiss} />
      </div>
    </>
  );
}

type AlertInnerProps = {
  alert: NonNullable<ReturnType<typeof useMarketAlert>["alert"]>;
  onDismiss: () => void;
};

function AlertInner({ alert, onDismiss }: AlertInnerProps) {
  return (
    <div className="p-4">
      {/* Header row */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-[#FDE047] flex-shrink-0" />
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#FDE047]">
            Market Alert
          </span>
          <SourceBadge sourceType={alert.sourceType} source={alert.source} />
        </div>
        <button
          onClick={onDismiss}
          className="flex-shrink-0 text-white/40 hover:text-white transition-colors ml-2"
          aria-label="Dismiss alert"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Headline */}
      <p className="font-mono font-bold text-white text-sm leading-snug mb-3">
        {alert.headline}
      </p>

      {/* Affected tickers */}
      {alert.affectedStocks.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {alert.affectedStocks.map((s) => {
            const isPositive = s.changePercent >= 0;
            const color = isPositive ? "#22c55e" : "#ef4444";
            const prefix = isPositive ? "+" : "";
            return (
              <span
                key={s.symbol}
                className="font-mono text-xs font-bold px-2 py-0.5 border-2"
                style={{
                  borderColor: color,
                  color: color,
                  backgroundColor: `${color}15`,
                }}
              >
                {s.symbol} {prefix}
                {s.changePercent.toFixed(1)}%
              </span>
            );
          })}
        </div>
      )}

      {/* Commentary */}
      {alert.commentary && (
        <p className="font-mono text-white/60 text-xs leading-relaxed mb-3 border-l-2 border-[#7F77DD] pl-3">
          {alert.commentary}
        </p>
      )}

      {/* Concept taught */}
      {alert.conceptTaught && (
        <div className="flex items-center gap-2 border-t border-white/10 pt-3">
          <Radio className="h-3 w-3 text-[#7F77DD] flex-shrink-0" />
          <span className="font-mono text-xs text-[#7F77DD] font-bold uppercase tracking-wider">
            Concept:{" "}
          </span>
          <span className="font-mono text-xs text-white/70">
            {alert.conceptTaught}
          </span>
        </div>
      )}
    </div>
  );
}

function SourceBadge({
  sourceType,
  source,
}: {
  sourceType: "fictional" | "real";
  source: string;
}) {
  const isReal = sourceType === "real";
  return (
    <span
      className="font-mono text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 border"
      style={{
        borderColor: isReal ? "#FDE047" : "#7F77DD",
        color: isReal ? "#FDE047" : "#7F77DD",
        backgroundColor: isReal ? "#FDE04715" : "#7F77DD15",
      }}
      title={source}
    >
      {isReal ? "Real" : "Sim"}
    </span>
  );
}
