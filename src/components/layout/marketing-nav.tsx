"use client";

import { useState } from "react";
import Link from "next/link";

export function MarketingNav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b-2 border-white bg-[#0e0e0e]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link
          href="/"
          className="font-bold text-white text-lg tracking-widest"
          style={{ fontFamily: "Courier New, monospace" }}
        >
          BLK EXCHANGE
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/#how-it-works"
            className="text-sm text-white hover:text-[#7F77DD] transition-colors"
            style={{ fontFamily: "Courier New, monospace" }}
          >
            How It Works
          </Link>
          <Link
            href="/#ai"
            className="text-sm text-white hover:text-[#7F77DD] transition-colors"
            style={{ fontFamily: "Courier New, monospace" }}
          >
            The AI
          </Link>
          <Link
            href="/judges"
            className="text-sm text-white hover:text-[#7F77DD] transition-colors"
            style={{ fontFamily: "Courier New, monospace" }}
          >
            For Judges
          </Link>
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <Link
            href="/sign-up"
            className="inline-flex items-center justify-center border-2 border-white bg-[#7F77DD] px-5 py-2 text-sm font-bold text-white shadow-[4px_4px_0px_0px_#ffffff] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#ffffff]"
            style={{ fontFamily: "Courier New, monospace" }}
          >
            Start Trading
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="flex md:hidden flex-col gap-1.5 p-1"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span
            className={`block h-0.5 w-6 bg-white transition-transform ${open ? "translate-y-2 rotate-45" : ""}`}
          />
          <span
            className={`block h-0.5 w-6 bg-white transition-opacity ${open ? "opacity-0" : ""}`}
          />
          <span
            className={`block h-0.5 w-6 bg-white transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`}
          />
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="border-t-2 border-white bg-[#0e0e0e] px-4 py-4 flex flex-col gap-4 md:hidden">
          <Link
            href="/#how-it-works"
            className="text-sm text-white hover:text-[#7F77DD]"
            style={{ fontFamily: "Courier New, monospace" }}
            onClick={() => setOpen(false)}
          >
            How It Works
          </Link>
          <Link
            href="/#ai"
            className="text-sm text-white hover:text-[#7F77DD]"
            style={{ fontFamily: "Courier New, monospace" }}
            onClick={() => setOpen(false)}
          >
            The AI
          </Link>
          <Link
            href="/judges"
            className="text-sm text-white hover:text-[#7F77DD]"
            style={{ fontFamily: "Courier New, monospace" }}
            onClick={() => setOpen(false)}
          >
            For Judges
          </Link>
          <Link
            href="/sign-up"
            className="inline-flex items-center justify-center border-2 border-white bg-[#7F77DD] px-5 py-2 text-sm font-bold text-white shadow-[4px_4px_0px_0px_#ffffff]"
            style={{ fontFamily: "Courier New, monospace" }}
            onClick={() => setOpen(false)}
          >
            Start Trading
          </Link>
        </div>
      )}
    </nav>
  );
}
