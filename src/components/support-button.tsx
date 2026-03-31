"use client";

import { useState } from "react";

export function SupportButton() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="font-mono text-xs font-bold text-[#FDE047] border border-[#FDE047] px-3 py-1 hover:bg-[#FDE047] hover:text-[#0e0e0e] transition-colors uppercase tracking-wider"
      >
        Support the Creator
      </button>

      {showModal && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/70 z-50"
            onClick={() => setShowModal(false)}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="w-full max-w-md border-2 border-white bg-[#1a1a1a] p-6 relative"
              style={{ boxShadow: "6px 6px 0px 0px #7F77DD", fontFamily: "'Courier New', monospace" }}
            >
              {/* Close */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-white/40 hover:text-white text-lg"
              >
                x
              </button>

              {/* Header */}
              <h2 className="text-lg font-bold text-white uppercase tracking-widest mb-4">
                Support BLK Exchange
              </h2>

              {/* Message */}
              <div className="space-y-3 mb-6">
                <p className="text-sm text-white/70 leading-relaxed">
                  BLK Exchange is free and will stay free. Financial literacy should never
                  have a paywall.
                </p>
                <p className="text-sm text-white/70 leading-relaxed">
                  But the AI that coaches your portfolio, the news pipeline that scrapes 16
                  publications, the real-time market engine, the session debriefs — all of
                  that costs real money to run every month.
                </p>
                <p className="text-sm text-white/70 leading-relaxed">
                  {`I built this in a week because I couldn't find the financial literacy tool
                  I wanted for my own community. Your support helps me keep the servers
                  running and continue building products like this.`}
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 mb-6">
                <div className="border border-white/20 p-2 text-center">
                  <p className="text-lg font-bold text-white">36</p>
                  <p className="text-[10px] text-white/40 uppercase tracking-wider">Companies</p>
                </div>
                <div className="border border-white/20 p-2 text-center">
                  <p className="text-lg font-bold text-white">23</p>
                  <p className="text-[10px] text-white/40 uppercase tracking-wider">Concepts</p>
                </div>
                <div className="border border-white/20 p-2 text-center">
                  <p className="text-lg font-bold text-[#22c55e]">Free</p>
                  <p className="text-[10px] text-white/40 uppercase tracking-wider">Forever</p>
                </div>
              </div>

              {/* CTA */}
              <a
                href="https://buymeacoffee.com/tarikmoody"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center border-2 border-white bg-[#FDE047] text-[#0e0e0e] font-bold text-sm uppercase tracking-widest py-3 transition-all hover:translate-x-[2px] hover:translate-y-[2px]"
                style={{ boxShadow: "3px 3px 0px 0px #ffffff" }}
                onClick={() => setShowModal(false)}
              >
                Buy Me a Coffee
              </a>

              {/* Dismiss */}
              <button
                onClick={() => setShowModal(false)}
                className="block w-full text-center text-xs text-white/30 mt-3 hover:text-white/50"
              >
                Maybe later
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
