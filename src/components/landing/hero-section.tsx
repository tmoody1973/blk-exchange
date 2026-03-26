"use client";

import Link from "next/link";

const MARQUEE_ITEMS = [
  "▲ Media +2.1%",
  "▼ Music -0.8%",
  "▲ Sportswear +3.4%",
  "▼ Beauty -1.2%",
  "▲ Finance +1.7%",
  "▲ Gaming +4.2%",
  "▼ Publishing -0.5%",
  "▲ Streaming +2.8%",
];

const MOCK_TICKERS = [
  { symbol: "LOUD",   price: "$42.18",  change: "+2.1%",  up: true  },
  { symbol: "VIZN",   price: "$78.34",  change: "+1.4%",  up: true  },
  { symbol: "KICKS",  price: "$112.05", change: "-0.6%",  up: false },
  { symbol: "VAULT",  price: "$52.00",  change: "+3.2%",  up: true  },
  { symbol: "PIXL",   price: "$88.11",  change: "-1.8%",  up: false },
  { symbol: "DRIP",   price: "$65.50",  change: "+0.9%",  up: true  },
];

function MarqueeTape() {
  return (
    <div className="relative flex w-full overflow-x-hidden border-b-2 border-white bg-[#1a1a1a]">
      <div className="animate-marquee whitespace-nowrap py-2 flex items-center">
        {MARQUEE_ITEMS.map((item, i) => (
          <span
            key={`a-${i}`}
            className={`mx-6 text-sm font-bold ${item.startsWith("▲") ? "text-[#22c55e]" : "text-[#ef4444]"}`}
          >
            {item}
          </span>
        ))}
      </div>
      <div className="absolute top-0 animate-marquee2 whitespace-nowrap py-2 flex items-center">
        {MARQUEE_ITEMS.map((item, i) => (
          <span
            key={`b-${i}`}
            className={`mx-6 text-sm font-bold ${item.startsWith("▲") ? "text-[#22c55e]" : "text-[#ef4444]"}`}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#0e0e0e]">
      <MarqueeTape />

      {/* Decorative ticker table background */}
      <div className="absolute inset-0 top-10 pointer-events-none select-none opacity-40">
        <div className="mx-auto max-w-7xl px-4 pt-8">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/20">
                <th className="text-left py-2 pr-4 text-[#a0a0a0]">SYMBOL</th>
                <th className="text-right py-2 pr-4 text-[#a0a0a0]">PRICE</th>
                <th className="text-right py-2 text-[#a0a0a0]">CHANGE</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_TICKERS.map((t) => (
                <tr key={t.symbol} className="border-b border-white/10">
                  <td className="py-2 pr-4 font-bold">{t.symbol}</td>
                  <td className="text-right py-2 pr-4">{t.price}</td>
                  <td className={`text-right py-2 ${t.up ? "text-[#22c55e]" : "text-[#ef4444]"}`}>
                    {t.change}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Hero content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-24 md:py-36">
        <div className="max-w-2xl">
          <h1
            className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6 whitespace-pre-line"
            style={{ fontFamily: "Courier New, monospace" }}
          >
            {"LEARN TO INVEST.\nTRADE THE CULTURE."}
          </h1>
          <p className="text-base md:text-lg text-[#a0a0a0] mb-10 max-w-lg">
            Trade 36 Black-economy companies. Real cultural news moves the
            market. AI teaches you why.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center border-2 border-white bg-[#7F77DD] px-8 py-3 text-sm font-bold text-white shadow-[4px_4px_0px_0px_#ffffff] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#ffffff]"
            >
              START TRADING
            </Link>
            <a
              href="#demo"
              className="inline-flex items-center justify-center border-2 border-white bg-transparent px-8 py-3 text-sm font-bold text-white shadow-[4px_4px_0px_0px_#ffffff] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#ffffff]"
            >
              Watch Demo ↓
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
