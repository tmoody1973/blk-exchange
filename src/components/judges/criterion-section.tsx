interface CriterionSectionProps {
  id: string;
  name: string;
  score: string;
  bullets: string[];
}

export function CriterionSection({ id, name, score, bullets }: CriterionSectionProps) {
  return (
    <section id={id} className="scroll-mt-28 py-12 px-4">
      <div className="mx-auto max-w-7xl">
        <div className="border-2 border-[#7F77DD] bg-[#1a1a1a] shadow-[4px_4px_0px_0px_#7F77DD]">
          {/* Header */}
          <div className="flex items-center justify-between border-b-2 border-[#7F77DD] px-8 py-5">
            <h2
              className="text-xl md:text-2xl font-bold text-white"
              style={{ fontFamily: "Courier New, monospace" }}
            >
              {name.toUpperCase()}
            </h2>
            <span
              className="text-xl md:text-2xl font-bold text-[#22c55e]"
              style={{ fontFamily: "Courier New, monospace" }}
            >
              {score}
            </span>
          </div>

          {/* Bullets */}
          <ul className="px-8 py-6 flex flex-col gap-3">
            {bullets.map((bullet, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="text-[#7F77DD] font-bold mt-0.5 shrink-0">▸</span>
                <span
                  className="text-[#a0a0a0] text-sm leading-relaxed"
                  style={{ fontFamily: "Courier New, monospace" }}
                >
                  {bullet}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
