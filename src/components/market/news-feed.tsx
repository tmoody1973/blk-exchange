"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { NewsItem } from "./news-item";

export function NewsFeed() {
  const events = useQuery(api.events.getRecentEvents);

  return (
    <div
      data-tour="news-feed"
      className="border-2 border-[#ffffff] bg-[#1a1a1a]"
      style={{ boxShadow: "4px 4px 0px 0px #ffffff" }}
    >
      <div className="px-4 pt-4 pb-2 border-b-2 border-[#ffffff]">
        <h2 className="font-mono font-bold text-white text-sm uppercase tracking-wider">
          Market News
        </h2>
      </div>

      {/* Scrollable list */}
      <div className="overflow-y-auto max-h-[600px]">
        {events === undefined ? (
          // Loading skeleton
          <div className="p-4 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="border-b border-white/10 pb-3 last:border-0">
                <div className="h-3 bg-white/10 rounded-none mb-2 w-1/3" />
                <div className="h-3 bg-white/10 rounded-none mb-2 w-full" />
                <div className="h-3 bg-white/10 rounded-none mb-2 w-4/5" />
                <div className="h-2 bg-white/5 rounded-none w-1/4" />
              </div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="p-6 text-center">
            <p className="font-mono text-white/30 text-sm">
              Market is quiet... events will fire soon.
            </p>
          </div>
        ) : (
          <div className="p-3 flex flex-col gap-3">
            {events.map((event) => (
              <NewsItem
                key={event._id}
                headline={event.headline}
                source={event.source}
                sourceType={event.sourceType}
                sourceUrl={event.sourceUrl}
                affectedStocks={event.affectedStocks}
                conceptTaught={event.conceptTaught}
                timestamp={event.timestamp}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
