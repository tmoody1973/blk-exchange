import { CriteriaNav } from "@/components/judges/criteria-nav";
import { CriterionSection } from "@/components/judges/criterion-section";
import Link from "next/link";

const CRITERIA = [
  {
    id: "relevancy",
    name: "Relevancy",
    score: "5/5",
    bullets: [
      "Financial literacy and economics IS the product — not a wrapper around a game.",
      "23-concept curriculum with guaranteed delivery via curriculum debt system.",
      "Every game mechanic teaches a named investing concept.",
      "Portfolio behavior-driven unlocks: concepts surface at the exact moment they're relevant.",
      "Concepts covered: supply/demand, diversification, sector correlation, P/E ratio, the Black dollar, and 17 more.",
      "Designed specifically for the financial literacy gap in Black communities.",
    ],
  },
  {
    id: "technical",
    name: "Technical Execution",
    score: "5/5",
    bullets: [
      "Claude Sonnet 4.6 — portfolio coaching, professor mode, post-trade debrief.",
      "Groq llama-3.3-70b — fictional event generation at 758 tokens/sec.",
      "ElevenLabs Flash v2.5 — voice narration on every market alert.",
      "Convex — real-time database: all 36 tickers update in under 500ms.",
      "3-layer news pipeline: Firecrawl + Exa + Tavily for cultural news ingestion.",
      "Company state system for narrative coherence across the full season.",
      "Curriculum debt queue guarantees every player encounters all 23 concepts.",
    ],
  },
  {
    id: "presentation",
    name: "Presentation",
    score: "5/5",
    bullets: [
      "Yahoo Finance UX + neobrutalism dark mode: familiar to investors, distinct in identity.",
      "Dense, information-rich layout that respects users' intelligence.",
      "Mobile-first — primary audience lives on their phones.",
      "Marquee ticker tape, interactive charts, and bottom-sheet alert overlays.",
      "Looks like nothing else in the competition.",
    ],
  },
  {
    id: "impact",
    name: "Impact",
    score: "5/5",
    bullets: [
      "Solo mode is free 24/7 — no paywall, no ads.",
      "12 Black media publications credited as news sources.",
      "36 companies reflect real Black economic archetypes (fintech, hair care, esports, publishing, and more).",
      "Curriculum guarantee: every player learns all 23 concepts by end of season.",
      "Season structure (8 weeks) keeps players returning and building knowledge over time.",
      "Shareable vault cards spread financial literacy peer-to-peer across social networks.",
    ],
  },
  {
    id: "innovation",
    name: "Innovation",
    score: "5/5",
    bullets: [
      "Black cultural news as market-moving events — a fundamentally new asset class.",
      "AI-generated fictional events with curriculum debt guarantees: learning is built into the market itself.",
      "Portfolio behavior-driven concept unlocking: the platform responds to how you invest.",
      "Dual-AI architecture: Groq for speed at event time + Claude for depth at coaching time.",
      "Voice narration via ElevenLabs delivers market news the way culture actually travels.",
      "Company state system creates narrative coherence across hundreds of generated events.",
      "The first financial literacy platform where learning is embedded inside gameplay — not adjacent to it.",
    ],
  },
];

export default function JudgesPage() {
  return (
    <div className="bg-[#0e0e0e] text-white min-h-screen">
      {/* Hero */}
      <section className="border-b-2 border-white px-4 py-16 md:py-24 bg-[#0e0e0e]">
        <div className="mx-auto max-w-7xl">
          <div className="mb-4">
            <span
              className="text-xs font-bold border-2 border-[#FDE047] text-[#FDE047] px-3 py-1"
              style={{ fontFamily: "Courier New, monospace" }}
            >
              HACKENOMICS 2025
            </span>
          </div>
          <h1
            className="text-3xl md:text-6xl font-bold text-white mb-6 leading-tight"
            style={{ fontFamily: "Courier New, monospace" }}
          >
            FOR HACKENOMICS JUDGES
          </h1>
          <p className="text-[#a0a0a0] text-base md:text-lg max-w-2xl">
            A criterion-by-criterion case for BLK Exchange — the first financial
            literacy platform where learning is inside the gameplay.
          </p>
        </div>
      </section>

      {/* Sticky criteria nav */}
      <CriteriaNav />

      {/* Narrative intro */}
      <section className="border-b-2 border-white px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl space-y-6 text-[#a0a0a0] text-base leading-relaxed">
            <p>
              The financial literacy gap is not a motivation problem. Millions
              of young Black Americans are deeply engaged with economic forces
              every day — they follow the sneaker market, know which streaming
              platform just signed a major deal, feel when their neighborhood
              real estate prices shift. The knowledge is there. The connection
              to formal finance is not.
            </p>
            <p>
              BLK Exchange was built on a single insight:{" "}
              <span className="text-white font-bold">
                the gap isn&apos;t about effort, it&apos;s about relevance.
              </span>{" "}
              When the companies are familiar, when the news is real cultural
              news, when the AI coach speaks plainly — investing becomes
              intuitive, not intimidating.
            </p>
            <p>
              This is not an app about stocks. It is a curriculum delivery
              system disguised as a trading platform. Every mechanic, every AI
              interaction, every event is engineered to surface a named
              investing concept at the exact moment it&apos;s emotionally relevant.
              That&apos;s how people actually learn.
            </p>
          </div>
        </div>
      </section>

      {/* Criterion sections */}
      {CRITERIA.map((c) => (
        <CriterionSection
          key={c.id}
          id={c.id}
          name={c.name}
          score={c.score}
          bullets={c.bullets}
        />
      ))}

      {/* Final CTA */}
      <section className="border-t-2 border-white px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="border-2 border-white bg-[#1a1a1a] p-10 md:p-16 shadow-[4px_4px_0px_0px_#ffffff] text-center">
            <h2
              className="text-2xl md:text-4xl font-bold text-white mb-6"
              style={{ fontFamily: "Courier New, monospace" }}
            >
              SEE IT FOR YOURSELF
            </h2>
            <p className="text-[#a0a0a0] text-base mb-10 max-w-lg mx-auto">
              Every claim above is live in the app. $10,000 virtual capital, 36
              companies, and an AI coach waiting for your first trade.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/sign-up"
                className="inline-flex items-center justify-center border-2 border-white bg-[#7F77DD] px-8 py-3 text-sm font-bold text-white shadow-[4px_4px_0px_0px_#ffffff] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#ffffff]"
                style={{ fontFamily: "Courier New, monospace" }}
              >
                TRY BLK EXCHANGE
              </Link>
              <a
                href="#demo"
                className="inline-flex items-center justify-center border-2 border-white bg-transparent px-8 py-3 text-sm font-bold text-white shadow-[4px_4px_0px_0px_#ffffff] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#ffffff]"
                style={{ fontFamily: "Courier New, monospace" }}
              >
                WATCH THE DEMO
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
