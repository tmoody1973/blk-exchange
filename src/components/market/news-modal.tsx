"use client";

import { useState } from "react";
import { X, ExternalLink } from "lucide-react";

interface NewsModalProps {
  url: string;
  source: string;
  headline: string;
  isOpen: boolean;
  onClose: () => void;
}

export function NewsModal({ url, source, headline, isOpen, onClose }: NewsModalProps) {
  const [loading, setLoading] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 lg:p-8">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/80" onClick={onClose} />

      {/* Modal */}
      <div
        className="relative z-10 w-full max-w-4xl h-[85vh] flex flex-col border-2 border-white bg-[#1a1a1a]"
        style={{ boxShadow: "6px 6px 0px 0px #7F77DD" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b-2 border-white bg-[#0e0e0e]">
          <div className="flex-1 min-w-0 mr-4">
            <span className="font-mono text-xs text-[#7F77DD] uppercase tracking-widest">
              {source}
            </span>
            <p className="font-mono text-sm text-white truncate mt-0.5">
              {headline}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 font-mono text-xs text-white/40 hover:text-white transition-colors px-2 py-1 border border-white/20 hover:border-white"
            >
              <ExternalLink size={12} />
              Open
            </a>
            <button
              onClick={onClose}
              className="text-white/40 hover:text-white transition-colors p-1"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* iframe */}
        <div className="flex-1 relative">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#1a1a1a]">
              <span className="font-mono text-sm text-white/30">Loading article...</span>
            </div>
          )}
          <iframe
            src={url}
            className="w-full h-full border-0"
            onLoad={() => setLoading(false)}
            sandbox="allow-same-origin allow-scripts"
            title={headline}
          />
        </div>
      </div>
    </div>
  );
}
