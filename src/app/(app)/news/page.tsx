"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import Link from "next/link";

const PUBLICATION_COLORS: Record<string, string> = {
  AfroTech: "#E8520E",
  Essence: "#C026D3",
  "Black Enterprise": "#059669",
  TheGrio: "#2563EB",
  "The Root": "#DC2626",
  Blavity: "#7C3AED",
  HBCUBuzz: "#D97706",
  Andscape: "#0891B2",
  Vibe: "#E11D48",
  "Rolling Out": "#4F46E5",
  EURweb: "#CA8A04",
  "Invest Fest": "#16A34A",
  "Capital B News": "#1D4ED8",
  "NBC BLK": "#6366F1",
  "Blavity U": "#8B5CF6",
  "Blavity Entertainment": "#A855F7",
};

function getPublicationColor(pub: string): string {
  return PUBLICATION_COLORS[pub] ?? "#7F77DD";
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

type FilterType = "all" | "classified" | "unclassified";

export default function NewsPage() {
  const articles = useQuery(api.articles.getRecentArticles);
  const events = useQuery(api.events.getRecentEvents);
  const [filter, setFilter] = useState<FilterType>("all");

  if (articles === undefined || events === undefined) {
    return (
      <div className="min-h-screen bg-[#0e0e0e] p-4 lg:p-6">
        <h1 className="font-mono font-bold text-2xl text-white tracking-widest uppercase mb-6">
          News
        </h1>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-24 bg-white/5 animate-pulse border-2 border-white/10" />
          ))}
        </div>
      </div>
    );
  }

  const filteredArticles =
    filter === "classified"
      ? articles.filter((a) => a.classifiedTickers.length > 0)
      : filter === "unclassified"
      ? articles.filter((a) => a.classifiedTickers.length === 0)
      : articles;

  const classifiedCount = articles.filter((a) => a.classifiedTickers.length > 0).length;

  return (
    <div className="min-h-screen bg-[#0e0e0e] pb-24 lg:pb-8">
      <div className="max-w-3xl mx-auto p-4 lg:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <h1 className="font-mono font-bold text-2xl text-white tracking-widest uppercase">
            News
          </h1>
          <span className="font-mono text-xs text-white/30">
            {articles.length} articles
          </span>
        </div>
        <p className="font-mono text-xs text-white/40 mb-6">
          Real cultural news from {Object.keys(PUBLICATION_COLORS).length}+ Black media sources. Updated every 15 minutes.
        </p>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {(
            [
              ["all", `All (${articles.length})`],
              ["classified", `Market-linked (${classifiedCount})`],
              ["unclassified", `General (${articles.length - classifiedCount})`],
            ] as [FilterType, string][]
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className="font-mono text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 border-2 transition-all flex-shrink-0"
              style={{
                borderColor: filter === key ? "#7F77DD" : "#ffffff20",
                backgroundColor: filter === key ? "#7F77DD" : "transparent",
                color: filter === key ? "#0e0e0e" : "#ffffff60",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Recent market events section */}
        {events.length > 0 && filter === "all" && (
          <div className="mb-6">
            <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-[#FDE047] mb-3">
              Latest Market Events
            </h2>
            <div className="space-y-2">
              {events.slice(0, 3).map((event) => {
                const primaryStock = event.affectedStocks[0];
                const isPositive = primaryStock ? primaryStock.changePercent >= 0 : true;
                return (
                  <div
                    key={event._id}
                    className="border-2 border-white/20 p-3"
                    style={{ backgroundColor: "#1a1a1a" }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className="font-mono text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 border"
                            style={{
                              borderColor: event.sourceType === "real" ? "#60A5FA" : "#7F77DD",
                              color: event.sourceType === "real" ? "#60A5FA" : "#7F77DD",
                            }}
                          >
                            {event.sourceType === "real" ? "REAL NEWS" : "MARKET EVENT"}
                          </span>
                          {event.conceptTaught && (
                            <span className="font-mono text-[10px] text-[#FDE047]">
                              {event.conceptTaught}
                            </span>
                          )}
                          <span className="font-mono text-[10px] text-white/20">
                            {timeAgo(event.firedAt ?? event.timestamp)}
                          </span>
                        </div>
                        <p className="font-mono text-xs text-white/90 leading-relaxed">
                          {event.headline}
                        </p>
                        {event.commentary && (
                          <p className="font-mono text-[11px] text-white/40 mt-1 leading-relaxed">
                            {event.commentary}
                          </p>
                        )}
                      </div>
                      {primaryStock && (
                        <div className="text-right flex-shrink-0">
                          <Link href={`/market/${primaryStock.symbol}`}>
                            <span className="font-mono text-xs font-bold text-white">
                              {primaryStock.symbol}
                            </span>
                          </Link>
                          <p
                            className="font-mono text-xs font-bold"
                            style={{ color: isPositive ? "#22c55e" : "#ef4444" }}
                          >
                            {isPositive ? "+" : ""}{primaryStock.changePercent.toFixed(1)}%
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Articles feed */}
        <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-white/40 mb-3">
          {filter === "classified" ? "Market-Linked Articles" : filter === "unclassified" ? "General News" : "All Articles"}
        </h2>

        {filteredArticles.length === 0 ? (
          <div className="border-2 border-white/10 p-8 text-center" style={{ backgroundColor: "#1a1a1a" }}>
            <p className="font-mono text-white/30 text-sm">No articles yet. The pipeline refreshes every 15 minutes.</p>
          </div>
        ) : (
          <div className="space-y-0">
            {filteredArticles.map((article) => {
              const pubColor = getPublicationColor(article.publication);
              const hasTickers = article.classifiedTickers.length > 0;

              return (
                <a
                  key={article._id}
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block border-b border-white/5 py-4 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-start gap-3">
                    {/* Article image or publication badge */}
                    {article.imageUrl ? (
                      <div
                        className="flex-shrink-0 w-16 h-16 border-2 overflow-hidden"
                        style={{ borderColor: pubColor }}
                      >
                        <img
                          src={article.imageUrl}
                          alt=""
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <div
                        className="flex-shrink-0 w-16 h-16 flex items-center justify-center border-2 font-mono text-xs font-bold text-white"
                        style={{
                          borderColor: pubColor,
                          backgroundColor: `${pubColor}20`,
                        }}
                      >
                        {article.publication.slice(0, 2).toUpperCase()}
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span
                          className="font-mono text-[10px] font-bold"
                          style={{ color: pubColor }}
                        >
                          {article.publication}
                        </span>
                        <span className="font-mono text-[10px] text-white/20">
                          {timeAgo(article.createdAt)}
                        </span>
                        <span
                          className="font-mono text-[9px] uppercase tracking-wider px-1 border"
                          style={{
                            borderColor: article.sourceLayer === "perplexity" ? "#7F77DD40" : "#60A5FA40",
                            color: article.sourceLayer === "perplexity" ? "#7F77DD" : "#60A5FA",
                          }}
                        >
                          {article.sourceLayer === "perplexity" ? "AI" : "SCRAPED"}
                        </span>
                      </div>

                      <p className="font-mono text-sm text-white/90 leading-relaxed mb-1">
                        {article.title}
                      </p>

                      {article.summary && (
                        <p className="font-mono text-[11px] text-white/40 leading-relaxed line-clamp-2">
                          {article.summary}
                        </p>
                      )}

                      {/* Classified tickers */}
                      {hasTickers && (
                        <div className="flex gap-1.5 mt-2 flex-wrap">
                          {article.classifiedTickers.map((ticker) => (
                            <span
                              key={ticker}
                              className="font-mono text-[10px] font-bold px-1.5 py-0.5 border"
                              style={{
                                borderColor: "#22c55e40",
                                color: "#22c55e",
                                backgroundColor: "#22c55e10",
                              }}
                            >
                              {ticker}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
