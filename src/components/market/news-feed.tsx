"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { NewsItem } from "./news-item";
import { NewsModal } from "./news-modal";

type FilterTab = "all" | "real" | "fictional";

export function NewsFeed() {
  const events = useQuery(api.events.getRecentEvents);
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [modalData, setModalData] = useState<{
    url: string;
    source: string;
    headline: string;
  } | null>(null);

  const filteredEvents =
    events === undefined
      ? undefined
      : activeTab === "all"
        ? events
        : events.filter((e) => e.sourceType === activeTab);

  return (
    <div
      data-tour="news-feed"
      className="border-2 border-[#ffffff] bg-[#1a1a1a]"
      style={{ boxShadow: "4px 4px 0px 0px #ffffff" }}
    >
      {/* Header + filter tabs */}
      <div className="px-4 pt-4 pb-2 border-b-2 border-[#ffffff]">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-mono font-bold text-white text-sm uppercase tracking-wider">
            Market News
          </h2>
          {events && (
            <span className="font-mono text-[10px] text-white/30">
              {events.length} events
            </span>
          )}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1">
          {(
            [
              { key: "all", label: "All" },
              { key: "real", label: "Real News" },
              { key: "fictional", label: "BLK News Desk" },
            ] as const
          ).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className="font-mono text-[10px] uppercase tracking-widest px-2.5 py-1 border transition-colors"
              style={{
                borderColor: activeTab === key ? "#7F77DD" : "#ffffff30",
                backgroundColor: activeTab === key ? "#7F77DD20" : "transparent",
                color: activeTab === key ? "#7F77DD" : "#ffffff60",
              }}
            >
              {label}
              {events && (
                <span className="ml-1 opacity-60">
                  {key === "all"
                    ? events.length
                    : events.filter((e) => e.sourceType === key).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable list */}
      <div className="overflow-y-auto max-h-[600px]">
        {filteredEvents === undefined ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="border-b border-white/10 pb-3 last:border-0"
              >
                <div className="h-3 bg-white/10 rounded-none mb-2 w-1/3" />
                <div className="h-3 bg-white/10 rounded-none mb-2 w-full" />
                <div className="h-3 bg-white/10 rounded-none mb-2 w-4/5" />
                <div className="h-2 bg-white/5 rounded-none w-1/4" />
              </div>
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="p-6 text-center">
            <p className="font-mono text-white/30 text-sm">
              {activeTab === "real"
                ? "No real news yet. The pipeline scrapes 12 publications every 15 minutes."
                : activeTab === "fictional"
                  ? "No fictional events yet. Events generate every 5 minutes."
                  : "Market is quiet... events will fire soon."}
            </p>
          </div>
        ) : (
          <div className="p-3 flex flex-col gap-3">
            {filteredEvents.map((event) => (
              <NewsItem
                key={event._id}
                headline={event.headline}
                source={event.source}
                sourceType={event.sourceType}
                sourceUrl={event.sourceUrl}
                affectedStocks={event.affectedStocks}
                conceptTaught={event.conceptTaught}
                commentary={event.commentary}
                timestamp={event.timestamp}
                onSourceClick={
                  event.sourceUrl
                    ? () =>
                        setModalData({
                          url: event.sourceUrl!,
                          source: event.source,
                          headline: event.headline,
                        })
                    : undefined
                }
              />
            ))}
          </div>
        )}
      </div>

      {/* In-app article modal */}
      {modalData && (
        <NewsModal
          key={modalData.url}
          url={modalData.url}
          source={modalData.source}
          headline={modalData.headline}
          isOpen={true}
          onClose={() => setModalData(null)}
        />
      )}
    </div>
  );
}
