"use client";

import { useState } from "react";
import Link from "next/link";

type Tab = "parents" | "educators" | "community";

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="font-mono text-xs font-bold uppercase tracking-widest px-4 py-2 border-2 transition-all"
      style={{
        borderColor: active ? "#7F77DD" : "#ffffff30",
        backgroundColor: active ? "#7F77DD" : "transparent",
        color: active ? "#0e0e0e" : "#ffffff80",
        boxShadow: active ? "3px 3px 0px 0px #ffffff" : "none",
      }}
    >
      {children}
    </button>
  );
}

function AccordionSection({
  title,
  defaultOpen = false,
  accent = "#7F77DD",
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  accent?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div
      className="border-2 border-white mb-4"
      style={{ backgroundColor: "#1a1a1a", boxShadow: open ? `4px 4px 0px 0px ${accent}` : "none" }}
    >
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between p-4 text-left"
        aria-expanded={open}
      >
        <h3 className="font-mono font-bold text-sm uppercase tracking-wider text-white">
          {title}
        </h3>
        <span
          className="font-mono text-lg transition-transform"
          style={{ color: accent, transform: open ? "rotate(0deg)" : "rotate(-90deg)" }}
        >
          ▾
        </span>
      </button>
      {open && (
        <div className="border-t border-white/10 px-4 pb-4 pt-3">
          {children}
        </div>
      )}
    </div>
  );
}

function QuestionCard({ question }: { question: string }) {
  return (
    <div
      className="border-l-4 pl-3 py-1 mb-2"
      style={{ borderColor: "#FDE047" }}
    >
      <p className="font-mono text-xs text-white/70 leading-relaxed">{question}</p>
    </div>
  );
}

function StatBlock({ number, label }: { number: string; label: string }) {
  return (
    <div className="text-center">
      <p className="font-mono font-bold text-2xl text-white">{number}</p>
      <p className="font-mono text-[10px] text-white/40 uppercase tracking-wider mt-1">{label}</p>
    </div>
  );
}

export default function ParentEducatorGuidePage() {
  const [tab, setTab] = useState<Tab>("parents");

  return (
    <div className="min-h-screen bg-[#0e0e0e] pb-24 lg:pb-8">
      <div className="max-w-3xl mx-auto p-4 lg:p-6">
        {/* Back */}
        <Link
          href="/market"
          className="inline-block font-mono text-sm text-white/50 hover:text-white transition-colors mb-6"
        >
          ← Back to Market
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-mono font-bold text-2xl text-white tracking-widest uppercase mb-2">
            Guide for Parents & Educators
          </h1>
          <p className="font-mono text-white/50 text-sm leading-relaxed">
            How to use BLK Exchange as a financial literacy learning tool at home, in the classroom, or in your community.
          </p>
        </div>

        {/* Why this matters */}
        <div
          className="border-2 border-white p-6 mb-8"
          style={{ backgroundColor: "#1a1a1a", boxShadow: "4px 4px 0px 0px #7F77DD" }}
        >
          <h2
            className="font-mono text-xs font-bold uppercase tracking-widest mb-4"
            style={{ color: "#7F77DD" }}
          >
            Why This Matters
          </h2>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <StatBlock number="48%" label="of Americans hold no investments" />
            <StatBlock number="$24K" label="median Black household wealth" />
            <StatBlock number="$189K" label="median White household wealth" />
          </div>
          <p className="font-mono text-xs text-white/60 leading-relaxed">
            The existing tools were never built with us in mind. They assume you already care about the S&P 500. BLK Exchange teaches investing through culture the learner already follows. The curriculum is hidden inside the gameplay.
          </p>
        </div>

        {/* Research callout */}
        <div
          className="border-2 p-4 mb-8"
          style={{ borderColor: "#FDE047", backgroundColor: "#FDE04710" }}
        >
          <p className="font-mono text-xs leading-relaxed" style={{ color: "#FDE047" }}>
            91% of students aged 12-18 expressed strong interest in learning financial concepts through gameplay (2024 study). Traditional approaches get 30-40% sustained engagement.
          </p>
        </div>

        {/* How BLK Exchange teaches */}
        <div className="mb-8">
          <h2 className="font-mono font-bold text-white text-sm uppercase tracking-widest mb-4 border-b-2 border-white pb-2">
            How BLK Exchange Teaches
          </h2>
          <div className="space-y-3">
            <div className="flex gap-3">
              <span className="font-mono font-bold text-lg" style={{ color: "#7F77DD" }}>1</span>
              <div>
                <p className="font-mono text-sm font-bold text-white">The Sim — 36 Cultural Tickers</p>
                <p className="font-mono text-xs text-white/50 leading-relaxed">
                  Players start with $10,000 and trade tickers like CROWN (hair care), DRIP (streetwear), LOUD (media), and KICKS (sportswear). Prices move on actual news events.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="font-mono font-bold text-lg" style={{ color: "#7F77DD" }}>2</span>
              <div>
                <p className="font-mono text-sm font-bold text-white">The Knowledge Vault — 23 Concepts</p>
                <p className="font-mono text-xs text-white/50 leading-relaxed">
                  Concepts unlock automatically through gameplay. When a player reacts to a market event, the concept behind it gets added to their Vault. They learn by doing.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="font-mono font-bold text-lg" style={{ color: "#FDE047" }}>3</span>
              <div>
                <p className="font-mono text-sm font-bold text-white">The Real Exchange — 8 Real Companies</p>
                <p className="font-mono text-xs text-white/50 leading-relaxed">
                  After proving competency, players unlock 8 real Black-owned publicly traded companies. Each comes with its founder story and the investing concept it teaches.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="font-mono font-bold text-lg" style={{ color: "#22c55e" }}>4</span>
              <div>
                <p className="font-mono text-sm font-bold text-white">Graduation — From Sim to Real</p>
                <p className="font-mono text-xs text-white/50 leading-relaxed">
                  {`The final level transitions players from sim investing to real investing, starting at $5. The education pipeline ends at "you're actually investing."`}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab selector */}
        <div className="flex flex-wrap gap-2 mb-6">
          <TabButton active={tab === "parents"} onClick={() => setTab("parents")}>
            For Parents
          </TabButton>
          <TabButton active={tab === "educators"} onClick={() => setTab("educators")}>
            For Educators
          </TabButton>
          <TabButton active={tab === "community"} onClick={() => setTab("community")}>
            Community Leaders
          </TabButton>
        </div>

        {/* Parents tab */}
        {tab === "parents" && (
          <div>
            <AccordionSection title="Getting Started Together" defaultOpen>
              <p className="font-mono text-xs text-white/60 leading-relaxed mb-3">
                {`The most powerful way to use BLK Exchange is together. Don't hand your child the app and walk away. Sit with them for the first session.`}
              </p>
              <div
                className="border-2 border-white/20 p-4 mb-3"
                style={{ backgroundColor: "#0e0e0e" }}
              >
                <p className="font-mono text-xs font-bold text-white mb-2 uppercase tracking-wider">
                  Session 1: Orientation (20-30 min)
                </p>
                <ol className="font-mono text-xs text-white/60 leading-relaxed space-y-1.5 list-decimal list-inside">
                  <li>Open BLK Exchange together and review the $10,000 balance</li>
                  <li>Scroll through tickers. Ask which companies they would invest in and why.</li>
                  <li>Let them make 3-5 trades based on instinct. No teaching yet.</li>
                  <li>Look at the ticker scroll together. Talk about the percentages.</li>
                </ol>
              </div>
              <p className="font-mono text-[11px] text-white/40 leading-relaxed">
                Do not correct their choices. The sim teaches through consequences, not instruction. If they put everything into one ticker, the Diversification Score will reflect that.
              </p>
            </AccordionSection>

            <AccordionSection title="Weekly Check-In Questions">
              <p className="font-mono text-xs text-white/50 mb-3">
                Let your child play independently but check in weekly with these:
              </p>

              <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-2 mt-4">
                Week 1-2: Portfolio Basics
              </p>
              <QuestionCard question="Show me your portfolio. Why did you pick these tickers?" />
              <QuestionCard question="What's your Diversification Score? What do you think it measures?" />
              <QuestionCard question="Did any Market Alerts come through? What happened to your stocks?" />

              <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-2 mt-4">
                Week 3-4: Strategy
              </p>
              <QuestionCard question="Are you making money or losing money? What's causing it?" />
              <QuestionCard question="Have you unlocked any Vault concepts? What's the most interesting one?" />
              <QuestionCard question="If you could only keep 5 stocks, which would you keep and why?" />

              <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-2 mt-4">
                Week 5-6: Real Connections
              </p>
              <QuestionCard question="Have you heard any real news this week that could affect the market?" />
              <QuestionCard question="If you could invest real money in one sector, which would it be?" />

              <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-2 mt-4">
                Week 7-8: Graduation
              </p>
              <QuestionCard question="Tell me about one of the real companies you unlocked. Who founded it?" />
              <QuestionCard question="What does the NAACP Minority Empowerment ETF invest in?" />
              <QuestionCard question="If you invested $5/week for 10 years starting now, what would happen?" />
            </AccordionSection>

            <AccordionSection title="Family Activities">
              <div className="space-y-3">
                <div>
                  <p className="font-mono text-xs font-bold text-white mb-1">The Portfolio Dinner</p>
                  <p className="font-mono text-xs text-white/50 leading-relaxed">
                    Once a week, each family member shares one investing concept they learned. From BLK Exchange, from the news, or from a conversation. Normalize talking about money.
                  </p>
                </div>
                <div>
                  <p className="font-mono text-xs font-bold text-white mb-1">The Sector Challenge</p>
                  <p className="font-mono text-xs text-white/50 leading-relaxed">
                    Each family member picks a different sector. Track whose performs best over a month. Makes market-watching a shared activity.
                  </p>
                </div>
              </div>
            </AccordionSection>

            <AccordionSection title="Ages & Appropriateness">
              <div className="space-y-3">
                <div className="flex gap-3">
                  <span className="font-mono text-xs font-bold text-[#7F77DD] flex-shrink-0 w-14">10-12</span>
                  <p className="font-mono text-xs text-white/50 leading-relaxed">
                    Play with parent guidance. Focus on sim tickers and basic portfolio concepts. The real company stories are opportunities for historical conversation.
                  </p>
                </div>
                <div className="flex gap-3">
                  <span className="font-mono text-xs font-bold text-[#7F77DD] flex-shrink-0 w-14">13-15</span>
                  <p className="font-mono text-xs text-white/50 leading-relaxed">
                    Play independently with weekly check-ins. Vault concepts align with middle school economics standards. Real companies introduce REITs, CDFIs, and M&A.
                  </p>
                </div>
                <div className="flex gap-3">
                  <span className="font-mono text-xs font-bold text-[#FDE047] flex-shrink-0 w-14">16-18</span>
                  <p className="font-mono text-xs text-white/50 leading-relaxed">
                    Ready for the full experience including the Real Exchange. Can open investment accounts with parent consent.
                  </p>
                </div>
                <div className="flex gap-3">
                  <span className="font-mono text-xs font-bold text-[#22c55e] flex-shrink-0 w-14">18+</span>
                  <p className="font-mono text-xs text-white/50 leading-relaxed">
                    Full independence. College students can use this as a standalone financial literacy tool.
                  </p>
                </div>
              </div>
            </AccordionSection>
          </div>
        )}

        {/* Educators tab */}
        {tab === "educators" && (
          <div>
            <AccordionSection title="Curriculum Alignment" defaultOpen>
              <p className="font-mono text-xs text-white/50 mb-3 leading-relaxed">
                {`BLK Exchange's 23 Vault concepts align with national standards:`}
              </p>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <span className="font-mono text-[10px] text-[#7F77DD] flex-shrink-0">Jump$tart</span>
                  <p className="font-mono text-xs text-white/50">Spending & Saving, Credit & Debt, Investing, Risk Management</p>
                </div>
                <div className="flex gap-2">
                  <span className="font-mono text-[10px] text-[#7F77DD] flex-shrink-0">CEE</span>
                  <p className="font-mono text-xs text-white/50">Markets, Supply & Demand, Economic Institutions</p>
                </div>
                <div className="flex gap-2">
                  <span className="font-mono text-[10px] text-[#7F77DD] flex-shrink-0">Common Core</span>
                  <p className="font-mono text-xs text-white/50">Percentages, ratios, compound growth, data analysis</p>
                </div>
                <div className="flex gap-2">
                  <span className="font-mono text-[10px] text-[#7F77DD] flex-shrink-0">Social Studies</span>
                  <p className="font-mono text-xs text-white/50">Black Wall Street, civil rights, Black entrepreneurship</p>
                </div>
              </div>
            </AccordionSection>

            <AccordionSection title="The 4-Week Unit">
              <p className="font-mono text-xs text-white/40 mb-3">Best for Personal Finance or Economics courses.</p>
              <div className="space-y-3">
                {[
                  { week: "1", focus: "What is the stock market?", activity: "Create accounts, first trades, explore tickers", discuss: "Why do prices move? What makes a company valuable?" },
                  { week: "2", focus: "Building a portfolio", activity: "Diversification challenge: trade across 6+ sectors", discuss: "Risk vs. reward. Why not put everything in one stock?" },
                  { week: "3", focus: "Real-world connections", activity: "Unlock Real Exchange companies, read founder stories", discuss: "Black entrepreneurship. What barriers do founders face?" },
                  { week: "4", focus: "From sim to real", activity: "Explore NACP ETF, discuss real investing", discuss: "What is an ETF? How do you start investing with $5?" },
                ].map((w) => (
                  <div key={w.week} className="border border-white/10 p-3" style={{ backgroundColor: "#0e0e0e" }}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-mono text-xs font-bold" style={{ color: "#7F77DD" }}>Week {w.week}</span>
                      <span className="font-mono text-xs font-bold text-white">{w.focus}</span>
                    </div>
                    <p className="font-mono text-[11px] text-white/50 mb-1">Activity: {w.activity}</p>
                    <p className="font-mono text-[11px] text-white/40">Discuss: {w.discuss}</p>
                  </div>
                ))}
              </div>
            </AccordionSection>

            <AccordionSection title="Semester Companion Model">
              <ul className="font-mono text-xs text-white/50 leading-relaxed space-y-2">
                <li className="flex gap-2"><span className="text-[#7F77DD]">•</span>Students create accounts Week 1, maintain portfolios all semester</li>
                <li className="flex gap-2"><span className="text-[#7F77DD]">•</span>Assign weekly trading minimums (3-5 trades per week)</li>
                <li className="flex gap-2"><span className="text-[#7F77DD]">•</span>Tie classroom concepts to Vault unlocks as they happen</li>
                <li className="flex gap-2"><span className="text-[#7F77DD]">•</span>Midterm: portfolio presentation with investment thesis</li>
                <li className="flex gap-2"><span className="text-[#7F77DD]">•</span>Final: compare sim performance to real market benchmarks</li>
              </ul>
            </AccordionSection>

            <AccordionSection title="3-Day Workshop">
              <p className="font-mono text-xs text-white/40 mb-3">Best for after-school programs, financial literacy events, or community workshops.</p>
              <div className="space-y-2">
                {[
                  { day: "1", time: "90 min", desc: "Account setup, first trades, explore the sim. End: 'What did you learn about the market today?'" },
                  { day: "2", time: "90 min", desc: "Vault review, sector analysis, trading strategy. Introduce one real company story (Cathy Hughes / Urban One). Group discussion on Black ownership." },
                  { day: "3", time: "90 min", desc: "Real Exchange, NACP capstone, graduation discussion. End: 'If you had $100 to invest today, what would you do?'" },
                ].map((d) => (
                  <div key={d.day} className="flex gap-3 border-l-2 pl-3" style={{ borderColor: "#7F77DD" }}>
                    <span className="font-mono text-xs font-bold text-white flex-shrink-0">Day {d.day}</span>
                    <p className="font-mono text-xs text-white/50 leading-relaxed">{d.desc}</p>
                  </div>
                ))}
              </div>
            </AccordionSection>

            <AccordionSection title="Assessment Ideas">
              <div className="space-y-3">
                <div>
                  <p className="font-mono text-xs font-bold text-white mb-1">Portfolio Presentation</p>
                  <p className="font-mono text-xs text-white/50 leading-relaxed">
                    Students present their portfolio: what they own, why, their Diversification Score, Vault concepts, and one real company story.
                  </p>
                </div>
                <div>
                  <p className="font-mono text-xs font-bold text-white mb-1">Market Event Response</p>
                  <p className="font-mono text-xs text-white/50 leading-relaxed">
                    {`When real news occurs, ask: "How would this affect your BLK Exchange portfolio? Which tickers would move and why?"`}
                  </p>
                </div>
                <div>
                  <p className="font-mono text-xs font-bold text-white mb-1">Vault Concept Journal</p>
                  <p className="font-mono text-xs text-white/50 leading-relaxed">
                    Students record each concept as they unlock it, explain it in their own words, and give a real-world example.
                  </p>
                </div>
                <div>
                  <p className="font-mono text-xs font-bold text-white mb-1">Company Research Extension</p>
                  <p className="font-mono text-xs text-white/50 leading-relaxed">
                    Research one additional Black-owned company not in BLK Exchange. Present the founder, business model, and what concept it would teach.
                  </p>
                </div>
              </div>
            </AccordionSection>

            <AccordionSection title="Discussion Questions">
              <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-2">On the Market</p>
              <QuestionCard question="Only 0.2% of NYSE companies are minority-owned. Why do you think that number is so low?" />
              <QuestionCard question="What's the difference between owning a business and owning stock in a business?" />
              <QuestionCard question="Why might it matter who owns the companies that serve your community?" />

              <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-2 mt-4">On the Companies</p>
              <QuestionCard question="Cathy Hughes once lived inside her radio station to keep it alive. What does that tell you about entrepreneurship?" />
              <QuestionCard question="Citizens Trust Bank was founded in 1921, the same year as the Tulsa Race Massacre. What does it mean to build while others destroy?" />

              <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-2 mt-4">On the Wealth Gap</p>
              <QuestionCard question="The median wealth of Black families is $24,100 vs $189,100 for White families. What structural factors contribute?" />
              <QuestionCard question="How might widespread financial literacy education change these numbers over a generation?" />
            </AccordionSection>
          </div>
        )}

        {/* Community tab */}
        {tab === "community" && (
          <div>
            <AccordionSection title="Run a Workshop" defaultOpen>
              <p className="font-mono text-xs text-white/50 leading-relaxed mb-3">
                BLK Exchange works at community centers, churches, libraries, and HBCU campuses. Use the 3-Day Workshop model from the Educators tab, adapted for your audience.
              </p>
              <ul className="font-mono text-xs text-white/50 leading-relaxed space-y-2">
                <li className="flex gap-2"><span className="text-[#7F77DD]">•</span>No accounts or equipment needed beyond phones and wifi</li>
                <li className="flex gap-2"><span className="text-[#7F77DD]">•</span>Works for ages 10 to 65. The tickers speak to everyone.</li>
                <li className="flex gap-2"><span className="text-[#7F77DD]">•</span>Pair with a local financial professional for Q&A after gameplay</li>
              </ul>
            </AccordionSection>

            <AccordionSection title="Start a League">
              <p className="font-mono text-xs text-white/50 leading-relaxed">
                A friendly competition where participants build portfolios over 4-8 weeks. Compare Diversification Scores and Vault progress. The leaderboard is built in. Weekly prizes optional. The real prize is financial literacy.
              </p>
            </AccordionSection>

            <AccordionSection title="Partner With Us">
              <p className="font-mono text-xs text-white/50 leading-relaxed mb-3">
                {`If you're running a financial literacy program and want to bring BLK Exchange to your community, reach out. We're building tools for organizations that want structured access.`}
              </p>
              <a
                href="https://buymeacoffee.com/tarikmoody"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block font-mono text-xs font-bold uppercase tracking-widest px-4 py-2 border-2 transition-all"
                style={{ borderColor: "#FDE047", color: "#FDE047" }}
              >
                Support the Project
              </a>
            </AccordionSection>
          </div>
        )}

        {/* Research footer */}
        <div className="mt-8 border-t-2 border-white/10 pt-6">
          <p className="font-mono text-[10px] text-white/30 leading-relaxed">
            {`BLK Exchange's design is grounded in research on Culturally Relevant Pedagogy (Ladson-Billings), game-based financial education (2024 multi-country RCT), and intergenerational financial knowledge transfer (Next Gen Personal Finance). Full research paper with 28 citations available at `}
            <a href="https://github.com/tmoody1973/blk-exchange/blob/main/docs/blk-exchange-research-paper.md" target="_blank" rel="noopener noreferrer" className="text-[#7F77DD] underline">
              github.com/tmoody1973/blk-exchange
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
