"use client";

import { useState, useRef } from "react";
import { useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import {
  GraduationCap,
  ChevronDown,
  ChevronUp,
  Send,
  RefreshCw,
} from "lucide-react";

type ProfessorModeProps = {
  playerId: Id<"players">;
  /** Optional ticker the user is currently viewing, for context */
  stockSymbol?: string;
  /** Placeholder text shown in the question input */
  placeholder?: string;
  /** Whether the panel starts open */
  defaultOpen?: boolean;
};

type QAEntry = {
  question: string;
  answer: string;
};

export function ProfessorMode({
  playerId,
  stockSymbol,
  placeholder,
  defaultOpen = false,
}: ProfessorModeProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<QAEntry[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const answerQuestion = useAction(api.claude.answerQuestion.answerQuestion);

  const inputPlaceholder =
    placeholder ??
    (stockSymbol
      ? `Ask about ${stockSymbol}… (e.g. "Why does sector matter?")`
      : "Ask Professor BLK anything about investing…");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = question.trim();
    if (!q || loading) return;

    setLoading(true);
    setError(null);
    setQuestion("");

    try {
      const result = await answerQuestion({
        question: q,
        playerId,
        stockSymbol,
      });

      setHistory((prev) => [{ question: q, answer: result.answer }, ...prev]);
    } catch (err) {
      console.error("[ProfessorMode] Error:", err);
      setError("Couldn't get an answer. Please try again.");
      // Restore question so user doesn't lose it
      setQuestion(q);
    } finally {
      setLoading(false);
      // Re-focus input after response
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }

  return (
    <div
      className="border-2 border-[#7F77DD] bg-[#1a1a1a]"
      style={{ boxShadow: "4px 4px 0px 0px #7F77DD" }}
    >
      {/* Collapsible trigger */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-white/5 transition-colors"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2">
          <GraduationCap className="h-4 w-4 text-[#7F77DD]" />
          <span className="font-mono font-bold text-white text-sm uppercase tracking-widest">
            Ask Professor BLK
          </span>
          <span className="font-mono text-[10px] text-[#7F77DD] border border-[#7F77DD] px-1.5 py-0.5">
            AI
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-white/40" />
        ) : (
          <ChevronDown className="h-4 w-4 text-white/40" />
        )}
      </button>

      {isOpen && (
        <div className="border-t-2 border-[#7F77DD]">
          {/* Previous answers (newest first) */}
          {history.length > 0 && (
            <div className="max-h-72 overflow-y-auto divide-y divide-white/10">
              {history.map((entry, i) => (
                <div key={i} className="px-4 py-3 space-y-2">
                  <p className="font-mono text-sm font-bold text-[#FDE047]">
                    Q: {entry.question}
                  </p>
                  <p className="font-mono text-sm text-white/75 leading-relaxed whitespace-pre-line">
                    {entry.answer}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div className="flex items-center gap-2 px-4 py-3 border-t border-white/10">
              <RefreshCw className="h-3 w-3 text-[#7F77DD] animate-spin flex-shrink-0" />
              <span className="font-mono text-xs text-white/50 uppercase tracking-wider">
                Professor BLK is thinking…
              </span>
            </div>
          )}

          {/* Error state */}
          {error && (
            <p className="font-mono text-[#ef4444] text-xs px-4 py-2 border-t border-white/10">
              {error}
            </p>
          )}

          {/* Question input */}
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 px-4 py-3 border-t border-white/10"
          >
            <input
              ref={inputRef}
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={inputPlaceholder}
              disabled={loading}
              className="flex-1 bg-transparent border-b-2 border-white/20 focus:border-[#7F77DD] outline-none font-mono text-sm text-white placeholder:text-white/30 py-1 transition-colors disabled:opacity-50"
              maxLength={300}
            />
            <button
              type="submit"
              disabled={!question.trim() || loading}
              className="flex-shrink-0 p-1.5 border-2 border-[#7F77DD] text-[#7F77DD] hover:bg-[#7F77DD]/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Ask question"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
