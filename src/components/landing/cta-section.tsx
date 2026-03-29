import Link from "next/link";

export function CTASection() {
  return (
    <section className="bg-[#0e0e0e] border-t-2 border-white py-20 px-4" id="cta">
      <div className="mx-auto max-w-7xl">
        <div className="border-2 border-white bg-[#1a1a1a] p-10 md:p-16 shadow-[4px_4px_0px_0px_#ffffff] text-center">
          <h2
            className="text-3xl md:text-5xl font-bold text-white mb-6"
            style={{ fontFamily: "Courier New, monospace" }}
          >
            READY TO TRADE THE CULTURE?
          </h2>
          <p className="text-[#a0a0a0] text-base md:text-lg mb-10 max-w-xl mx-auto">
            $10,000 virtual capital. 36 companies. 23 investing concepts.{" "}
            <span className="text-[#22c55e] font-bold">Free forever.</span>
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center border-2 border-white bg-[#7F77DD] px-10 py-4 text-base font-bold text-white shadow-[4px_4px_0px_0px_#ffffff] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#ffffff]"
              style={{ fontFamily: "Courier New, monospace" }}
            >
              START TRADING
            </Link>
            <a
              href="https://buymeacoffee.com/tarikmoody"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center border-2 border-white bg-[#1a1a1a] px-10 py-4 text-base font-bold text-white shadow-[4px_4px_0px_0px_#ffffff] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#ffffff]"
              style={{ fontFamily: "Courier New, monospace" }}
            >
              SUPPORT THIS PROJECT
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
