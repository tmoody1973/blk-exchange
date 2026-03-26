const STEPS = [
  {
    number: "1",
    title: "TRADE",
    description:
      "36 fictional companies across 12 sectors. Buy and sell with $10,000 virtual capital. Watch real cultural news move your portfolio.",
    accent: "#7F77DD",
  },
  {
    number: "2",
    title: "LEARN",
    description:
      "Every market event teaches a named investing concept. 23 total. AI coaches you through each one — no lectures, no textbooks.",
    accent: "#FDE047",
  },
  {
    number: "3",
    title: "COMPETE",
    description:
      "5 leaderboards reward skill, not luck. The Blueprint Award crowns the season champion across 8 weeks of gameplay.",
    accent: "#22c55e",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-[#0e0e0e] border-t-2 border-white py-20 px-4" id="how-it-works">
      <div className="mx-auto max-w-7xl">
        <h2
          className="text-2xl md:text-4xl font-bold text-white mb-12"
          style={{ fontFamily: "Courier New, monospace" }}
        >
          HOW IT WORKS
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STEPS.map((step) => (
            <div
              key={step.number}
              className="border-2 border-white bg-[#1a1a1a] p-8 shadow-[4px_4px_0px_0px_#ffffff] flex flex-col gap-4"
              style={{ borderLeftColor: step.accent, borderLeftWidth: "4px" }}
            >
              <div
                className="text-5xl font-bold"
                style={{ color: step.accent, fontFamily: "Courier New, monospace" }}
              >
                {step.number}.
              </div>
              <h3
                className="text-xl font-bold text-white"
                style={{ fontFamily: "Courier New, monospace" }}
              >
                {step.title}
              </h3>
              <p className="text-[#a0a0a0] text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
