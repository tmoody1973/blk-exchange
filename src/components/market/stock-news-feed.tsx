"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

interface StockNewsFeedProps {
  symbol: string;
}

function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

type EventItem = {
  kind: "event";
  headline: string;
  commentary?: string;
  conceptTaught?: string;
  sourceType: "fictional" | "real";
  timestamp: number;
  changePercent: number;
};

type ArticleItem = {
  kind: "article";
  title: string;
  url: string;
  publication: string;
  summary?: string;
  timestamp: number;
};

type FeedItem = EventItem | ArticleItem;

export function StockNewsFeed({ symbol }: StockNewsFeedProps) {
  const [isOpen, setIsOpen] = useState(false);
  const events = useQuery(api.events.getEventsBySymbol, { symbol });
  const articles = useQuery(api.articles.getArticlesByTicker, { symbol });

  if (events === undefined || articles === undefined) {
    return (
      <div
        className="border-2 border-[#ffffff] bg-[#1a1a1a] p-4"
        style={{ boxShadow: "4px 4px 0px 0px #ffffff" }}
      >
        <h2 className="font-mono font-bold text-white text-sm uppercase tracking-wider">
          News & Events
        </h2>
        <div className="mt-3 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-white/5 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  // Merge events and articles into a unified feed
  const feedItems: FeedItem[] = [];

  for (const event of events) {
    if (!event.fired) continue;
    const primaryChange = event.affectedStocks.find(
      (s) => s.symbol === symbol
    );
    feedItems.push({
      kind: "event",
      headline: event.headline,
      commentary: event.commentary,
      conceptTaught: event.conceptTaught,
      sourceType: event.sourceType,
      timestamp: event.firedAt ?? event.timestamp,
      changePercent: primaryChange?.changePercent ?? 0,
    });
  }

  for (const article of articles) {
    feedItems.push({
      kind: "article",
      title: article.title,
      url: article.url,
      publication: article.publication,
      summary: article.summary,
      timestamp: article.createdAt,
    });
  }

  // Sort by most recent first
  feedItems.sort((a, b) => b.timestamp - a.timestamp);

  const isEmpty = feedItems.length === 0;

  const itemCount = feedItems.length;

  return (
    <div
      className="border-2 border-[#ffffff] bg-[#1a1a1a]"
      style={{ boxShadow: "4px 4px 0px 0px #ffffff" }}
    >
      {/* Accordion header */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between p-4 text-left"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          <h2 className="font-mono font-bold text-white text-sm uppercase tracking-wider">
            News & Events
          </h2>
          {itemCount > 0 && (
            <span
              className="font-mono text-[10px] font-bold px-2 py-0.5 border"
              style={{ borderColor: "#7F77DD", color: "#7F77DD" }}
            >
              {itemCount}
            </span>
          )}
        </div>
        <span
          className="font-mono text-lg text-white/40 transition-transform"
          style={{ transform: isOpen ? "rotate(0deg)" : "rotate(-90deg)" }}
        >
          ▾
        </span>
      </button>

      {/* Accordion content */}
      {isOpen && (
        <div className="border-t border-white/10 px-4 pb-4">
          {isEmpty ? (
            <div className="py-6 text-center">
              <p className="font-mono text-white/30 text-sm">
                No news yet for {symbol}. Events will appear as the market moves.
              </p>
            </div>
          ) : (
            <div className="space-y-0">
              {feedItems.slice(0, 8).map((item, i) => (
                <div
                  key={i}
                  className="py-3 border-b border-white/10 last:border-b-0"
                >
                  {item.kind === "event" ? (
                    <EventCard item={item} />
                  ) : (
                    <ArticleCard item={item} />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function EventCard({ item }: { item: EventItem }) {
  const isPositive = item.changePercent >= 0;
  const changeColor = isPositive ? "#22c55e" : "#ef4444";
  const prefix = isPositive ? "+" : "";

  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="font-mono text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 border"
              style={{
                borderColor: item.sourceType === "real" ? "#60A5FA" : "#7F77DD",
                color: item.sourceType === "real" ? "#60A5FA" : "#7F77DD",
              }}
            >
              {item.sourceType === "real" ? "NEWS" : "EVENT"}
            </span>
            <span className="font-mono text-[10px] text-white/30">
              {timeAgo(item.timestamp)}
            </span>
          </div>
          <p className="font-mono text-xs text-white/90 leading-relaxed">
            {item.headline}
          </p>
          {item.commentary && (
            <p className="font-mono text-[11px] text-white/50 leading-relaxed mt-1">
              {item.commentary}
            </p>
          )}
        </div>
        <span
          className="font-mono text-xs font-bold flex-shrink-0 mt-4"
          style={{ color: changeColor }}
        >
          {prefix}{item.changePercent.toFixed(1)}%
        </span>
      </div>
      {item.conceptTaught && (
        <div className="mt-1.5">
          <span className="font-mono text-[10px] text-[#FDE047] uppercase tracking-wider">
            Concept: {item.conceptTaught}
          </span>
        </div>
      )}
    </div>
  );
}

function ArticleCard({ item }: { item: ArticleItem }) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block hover:bg-white/5 -mx-2 px-2 py-1 transition-colors"
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="font-mono text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 border border-white/20 text-white/40">
          ARTICLE
        </span>
        <span className="font-mono text-[10px] text-white/30">
          {item.publication}
        </span>
        <span className="font-mono text-[10px] text-white/20">
          {timeAgo(item.timestamp)}
        </span>
      </div>
      <p className="font-mono text-xs text-white/90 leading-relaxed">
        {item.title}
      </p>
      {item.summary && (
        <p className="font-mono text-[11px] text-white/40 leading-relaxed mt-1 line-clamp-2">
          {item.summary}
        </p>
      )}
    </a>
  );
}
