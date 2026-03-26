const AI_STACK = [
  {
    name: "Groq",
    model: "llama-3.3-70b",
    role: "Event Engine",
    description: "Generates real-time market events at 758 tokens/sec. Cultural news becomes fictional earnings reports, analyst downgrades, and product launches — instantly.",
    color: "#FDE047",
    badge: "758 tok/s",
  },
  {
    name: "Claude",
    model: "Sonnet 4.6",
    role: "Portfolio Coach",
    description: "Coaches your portfolio decisions, answers any investing question in plain language, and delivers AI-powered debrief sessions after every trade.",
    color: "#7F77DD",
    badge: "Professor Mode",
  },
  {
    name: "ElevenLabs",
    model: "Flash v2.5",
    role: "Voice Narrator",
    description: "Reads every market alert aloud the moment it drops. Financial news delivered by voice — the way cultural news actually travels.",
    color: "#22c55e",
    badge: "Real-time TTS",
  },
];

export function AISection() {
  return (
    <section className="bg-[#0e0e0e] border-t-2 border-white py-20 px-4" id="ai">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12">
          <h2
            className="text-2xl md:text-4xl font-bold text-white mb-4"
            style={{ fontFamily: "Courier New, monospace" }}
          >
            THE AI
          </h2>
          <p className="text-[#a0a0a0] text-base max-w-xl">
            Three AI systems work together to make every session feel alive. No
            canned responses. No static lessons.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {AI_STACK.map((ai) => (
            <div
              key={ai.name}
              className="border-2 border-white bg-[#1a1a1a] p-8 shadow-[4px_4px_0px_0px_#ffffff] flex flex-col gap-4"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3
                    className="text-xl font-bold text-white"
                    style={{ fontFamily: "Courier New, monospace" }}
                  >
                    {ai.name}
                  </h3>
                  <p className="text-xs text-[#a0a0a0]">{ai.model}</p>
                </div>
                <span
                  className="text-xs font-bold border-2 px-2 py-0.5 shrink-0"
                  style={{
                    color: ai.color,
                    borderColor: ai.color,
                    fontFamily: "Courier New, monospace",
                  }}
                >
                  {ai.badge}
                </span>
              </div>

              <div
                className="text-sm font-bold"
                style={{ color: ai.color, fontFamily: "Courier New, monospace" }}
              >
                {ai.role}
              </div>

              <p className="text-[#a0a0a0] text-sm leading-relaxed">{ai.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
