export function ProblemSection() {
  return (
    <section className="bg-[#0e0e0e] border-t-2 border-white py-20 px-4" id="problem">
      <div className="mx-auto max-w-7xl">
        <div className="border-2 border-white bg-[#1a1a1a] p-8 md:p-12 shadow-[4px_4px_0px_0px_#ffffff]">
          <h2
            className="text-2xl md:text-4xl font-bold text-white mb-8"
            style={{ fontFamily: "Courier New, monospace" }}
          >
            THE PROBLEM
          </h2>

          <div className="space-y-6 text-[#a0a0a0] text-base md:text-lg max-w-3xl">
            <p>
              Most financial literacy tools teach with hypothetical stocks in
              industries that feel distant. They assume users already care about
              the S&amp;P 500. They assume context that most young Black
              investors simply don&apos;t have.
            </p>
            <p>
              The result: dry curriculum that doesn&apos;t stick. 72% of Americans
              have never invested. The wealth gap starts with a knowledge gap —
              and the knowledge gap starts with a relevance gap.
            </p>
            <p>
              The existing tools weren&apos;t built for us. They don&apos;t reflect our
              artists, our companies, our cultural moments. They don&apos;t speak our
              language.
            </p>
          </div>

          <div className="mt-10 border-t-2 border-[#7F77DD] pt-8">
            <p
              className="text-xl md:text-2xl font-bold text-white"
              style={{ fontFamily: "Courier New, monospace" }}
            >
              Black culture IS an economy. BLK Exchange treats it like one.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
