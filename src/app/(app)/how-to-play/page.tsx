import Link from "next/link";

// ─── SectionCard ──────────────────────────────────────────────────────────────

function SectionCard({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="border-2 border-white p-6"
      style={{
        backgroundColor: "#1a1a1a",
        boxShadow: "4px 4px 0px 0px #7F77DD",
      }}
    >
      <div className="flex items-start gap-4 mb-4">
        <span
          className="font-mono font-bold text-3xl leading-none"
          style={{ color: "#7F77DD" }}
        >
          {number}
        </span>
        <h2 className="font-mono font-bold text-lg uppercase tracking-widest text-white pt-1">
          {title}
        </h2>
      </div>
      <div className="font-mono text-sm leading-relaxed space-y-2" style={{ color: "#ffffff99" }}>
        {children}
      </div>
    </div>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-start gap-2">
      <span style={{ color: "#7F77DD" }}>→</span>
      <span>{children}</span>
    </p>
  );
}

// ─── HowToPlayPage ────────────────────────────────────────────────────────────

export default function HowToPlayPage() {
  return (
    <div className="min-h-screen bg-[#0e0e0e] p-4 lg:p-8 pb-24 lg:pb-12">
      {/* Header */}
      <div className="mb-8">
        <h1
          className="font-mono font-bold text-3xl uppercase tracking-widest text-white mb-2"
          style={{ fontFamily: "Courier New, monospace" }}
        >
          How to Play
        </h1>
        <p className="font-mono text-sm" style={{ color: "#ffffff50" }}>
          BLK Exchange — the Black cultural stock market simulator
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl">
        {/* Section 1: The Market */}
        <SectionCard number="01" title="The Market">
          <Bullet>36 companies across 12 sectors of Black culture and commerce.</Bullet>
          <Bullet>Sectors include Media, Music, Fashion, Beauty, Finance, Real Estate, Gaming, and more.</Bullet>
          <Bullet>Prices move based on real news events and AI-generated cultural storylines.</Bullet>
          <Bullet>A live BLK Index tracks the overall health of the market.</Bullet>
          <Bullet>Market events fire every 5 minutes — stay alert.</Bullet>
        </SectionCard>

        {/* Section 2: Trading */}
        <SectionCard number="02" title="Trading">
          <Bullet>Start with $10,000 in virtual cash every season.</Bullet>
          <Bullet>Buy and sell fractional shares — no minimum order size.</Bullet>
          <Bullet>No single position can exceed 25% of your total portfolio — this enforces diversification.</Bullet>
          <Bullet>Sells are priced at the current market rate when you execute.</Bullet>
          <Bullet>All trades are instant — no order books, no slippage.</Bullet>
        </SectionCard>

        {/* Section 3: The Vault */}
        <SectionCard number="03" title="The Vault">
          <Bullet>23 investing concepts waiting to be unlocked.</Bullet>
          <Bullet>Concepts unlock two ways: through your trading behavior (e.g. diversifying triggers the Diversification concept) or when a matching market event fires.</Bullet>
          <Bullet>Each concept comes with a plain-language definition and a real-world example.</Bullet>
          <Bullet>Your Vault score counts toward the Knowledge Vault leaderboard.</Bullet>
          <Bullet>Try to unlock all 23 to earn the Vault Master achievement.</Bullet>
        </SectionCard>

        {/* Section 4: Seasons & Tournaments */}
        <SectionCard number="04" title="Seasons & Tournaments">
          <Bullet>Seasons run 8 weeks. Portfolios reset at the start of each new season.</Bullet>
          <Bullet>Weekly leaderboards reset every Monday at midnight ET.</Bullet>
          <Bullet>5 competitive boards: Portfolio Value, Knowledge Vault, Diversification, Biggest Mover, and Blueprint Award.</Bullet>
          <Bullet>Knowledge Vault and Blueprint Award are cumulative — they never reset.</Bullet>
          <Bullet>Each player gets one free seasonal reset if they want a fresh start.</Bullet>
        </SectionCard>

        {/* Section 5: AI Coach & Professor */}
        <SectionCard number="05" title="AI Coach & Professor">
          <Bullet>Professor BLK is your on-demand financial literacy coach — ask any question about investing.</Bullet>
          <Bullet>Claude (the AI) generates personalized session debriefs after you end a session.</Bullet>
          <Bullet>The debrief reviews your trades, explains what concepts you applied, and flags what to watch for next time.</Bullet>
          <Bullet>Coaching fires automatically when meaningful patterns appear in your trading behavior.</Bullet>
          <Bullet>Ask Professor BLK 10 questions to earn the Professor&apos;s Favorite achievement.</Bullet>
        </SectionCard>

        {/* Section 6: Challenge of the Week */}
        <SectionCard number="06" title="Challenge of the Week">
          <Bullet>A new challenge drops every Monday, generated by AI based on financial literacy themes.</Bullet>
          <Bullet>Each challenge targets one of three metrics: sectors held, total trades, or portfolio value.</Bullet>
          <Bullet>Progress updates automatically after every trade.</Bullet>
          <Bullet>Completing a challenge teaches you a specific financial concept through play — not a lecture.</Bullet>
          <Bullet>Check the Challenge panel on your profile to track your weekly progress.</Bullet>
        </SectionCard>
      </div>

      {/* Back link */}
      <div className="mt-10">
        <Link
          href="/market"
          className="font-mono text-sm border-2 border-white px-4 py-2 text-white hover:bg-white hover:text-black transition-colors inline-block"
        >
          ← Back to Market
        </Link>
      </div>
    </div>
  );
}
