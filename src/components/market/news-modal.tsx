"use client";

import { X, ExternalLink } from "lucide-react";

interface NewsModalProps {
  url: string;
  source: string;
  headline: string;
  commentary?: string;
  affectedStocks?: Array<{ symbol: string; changePercent: number }>;
  conceptTaught?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function NewsModal({
  url,
  source,
  headline,
  commentary,
  affectedStocks,
  conceptTaught,
  isOpen,
  onClose,
}: NewsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/80" onClick={onClose} />

      {/* Card */}
      <div
        className="relative z-10 w-full max-w-lg border-2 border-white bg-[#1a1a1a] p-6"
        style={{ boxShadow: "6px 6px 0px 0px #7F77DD" }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
        >
          <X size={18} />
        </button>

        {/* Source label */}
        <span className="font-mono text-xs text-[#7F77DD] uppercase tracking-widest">
          {source}
        </span>

        {/* Headline */}
        <h2 className="font-mono font-bold text-white text-lg mt-2 mb-4 leading-snug">
          {headline}
        </h2>

        {/* Affected stocks */}
        {affectedStocks && affectedStocks.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {affectedStocks.map((s) => {
              const isPos = s.changePercent >= 0;
              const color = isPos ? "#22c55e" : "#ef4444";
              const prefix = isPos ? "+" : "";
              return (
                <span
                  key={s.symbol}
                  className="font-mono text-xs px-2 py-0.5 border"
                  style={{
                    color,
                    borderColor: color,
                    backgroundColor: `${color}15`,
                  }}
                >
                  {s.symbol} {prefix}{s.changePercent.toFixed(1)}%
                </span>
              );
            })}
          </div>
        )}

        {/* Commentary */}
        {commentary && (
          <div className="border-l-2 border-[#7F77DD] pl-3 mb-4">
            <p className="font-mono text-sm text-white/70 leading-relaxed">
              {commentary}
            </p>
          </div>
        )}

        {/* Concept */}
        {conceptTaught && (
          <div className="mb-6">
            <span className="inline-block font-mono text-xs px-2 py-0.5 border border-[#FDE047] text-[#FDE047] bg-[#FDE047]/10">
              Concept: {conceptTaught}
            </span>
          </div>
        )}

        {/* CTA */}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full font-mono text-sm font-bold py-3 border-2 border-white bg-[#7F77DD] text-white transition-transform hover:translate-x-[2px] hover:translate-y-[2px]"
          style={{ boxShadow: "3px 3px 0px 0px #ffffff" }}
        >
          <ExternalLink size={14} />
          Read Full Article
        </a>
      </div>
    </div>
  );
}
