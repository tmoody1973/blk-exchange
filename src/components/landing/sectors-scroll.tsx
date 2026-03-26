"use client";

import { useRef } from "react";

const SECTOR_DATA = [
  { id: "media",         name: "Media & Content",      color: "#FF6B6B", tickers: ["LOUD",  "SCROLL", "VERSE"]  },
  { id: "streaming",     name: "Streaming",             color: "#4ECDC4", tickers: ["VIZN",  "NETFLO", "LIVE"]   },
  { id: "music",         name: "Music",                 color: "#45B7D1", tickers: ["RYTHM", "BLOC",   "CRATE"]  },
  { id: "gaming",        name: "Gaming",                color: "#96CEB4", tickers: ["PIXL",  "MOBILE", "SQUAD"]  },
  { id: "sportswear",    name: "Sportswear",            color: "#FFEAA7", tickers: ["KICKS", "FLEX",   "COURT"]  },
  { id: "fashion",       name: "Streetwear & Fashion",  color: "#DDA0DD", tickers: ["DRIP",  "RARE",   "THREAD"] },
  { id: "publishing",    name: "Publishing",            color: "#98D8C8", tickers: ["INK",   "READS",  "PRESS"]  },
  { id: "beauty",        name: "Beauty & Wellness",     color: "#F7DC6F", tickers: ["CROWN", "GLOW",   "SHEEN"]  },
  { id: "finance",       name: "Finance & Banking",     color: "#82E0AA", tickers: ["VAULT", "STAX",   "GROW"]   },
  { id: "realestate",    name: "Real Estate",           color: "#F0B27A", tickers: ["BLOK",  "BUILD",  "HOOD"]   },
  { id: "sports",        name: "Sports & Athletics",    color: "#85C1E9", tickers: ["DRAFT", "ARENA",  "STATS"]  },
  { id: "entertainment", name: "Entertainment",         color: "#C39BD3", tickers: ["SCREEN","STAGE",  "GAME"]   },
];

export function SectorsScroll() {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scroll(direction: "left" | "right") {
    if (!scrollRef.current) return;
    const amount = 300;
    scrollRef.current.scrollBy({
      left: direction === "right" ? amount : -amount,
      behavior: "smooth",
    });
  }

  return (
    <section className="bg-[#0e0e0e] border-t-2 border-white py-20 px-4" id="sectors">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <h2
            className="text-2xl md:text-4xl font-bold text-white"
            style={{ fontFamily: "Courier New, monospace" }}
          >
            12 SECTORS
          </h2>
          {/* Desktop scroll arrows */}
          <div className="hidden md:flex gap-2">
            <button
              onClick={() => scroll("left")}
              className="border-2 border-white bg-[#1a1a1a] p-2 text-white shadow-[2px_2px_0px_0px_#ffffff] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
              aria-label="Scroll left"
            >
              ←
            </button>
            <button
              onClick={() => scroll("right")}
              className="border-2 border-white bg-[#1a1a1a] p-2 text-white shadow-[2px_2px_0px_0px_#ffffff] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
              aria-label="Scroll right"
            >
              →
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {SECTOR_DATA.map((sector) => (
            <div
              key={sector.id}
              className="flex-none w-48 md:w-56 border-2 border-white bg-[#1a1a1a] p-5 shadow-[4px_4px_0px_0px_#ffffff] snap-start"
              style={{ borderLeftColor: sector.color, borderLeftWidth: "4px" }}
            >
              <h3
                className="text-xs font-bold text-white mb-3 leading-tight"
                style={{ fontFamily: "Courier New, monospace" }}
              >
                {sector.name.toUpperCase()}
              </h3>
              <div className="flex flex-col gap-1">
                {sector.tickers.map((t) => (
                  <span
                    key={t}
                    className="text-xs font-bold"
                    style={{ color: sector.color, fontFamily: "Courier New, monospace" }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
