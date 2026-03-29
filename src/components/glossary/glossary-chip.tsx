"use client";

import { useState, useEffect, useRef } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

interface GlossaryChipProps {
  termId: string;
  playerId: Id<"players">;
  children: React.ReactNode;
  eventId?: string;
}

export function GlossaryChip({
  termId,
  playerId,
  children,
  eventId,
}: GlossaryChipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const chipRef = useRef<HTMLSpanElement>(null);
  const popoverRef = useRef<HTMLSpanElement | HTMLDivElement>(null);

  const termData = useQuery(api.glossary.getTerm, { termId });
  const isSeen = useQuery(api.glossary.isTermSeen, { playerId, termId });
  const markTermSeen = useMutation(api.glossary.markTermSeen);

  // Detect mobile breakpoint
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Auto-mark as seen after 1.5s of popover being open
  useEffect(() => {
    if (isOpen && isSeen === false) {
      const timer = setTimeout(() => {
        markTermSeen({ playerId, termId, eventId }).catch(() => {});
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isSeen, termId, playerId, eventId, markTermSeen]);

  // Close on outside click (desktop popover)
  useEffect(() => {
    if (!isOpen || isMobile) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node;
      const outsideChip = chipRef.current && !chipRef.current.contains(target);
      const outsidePopover =
        popoverRef.current && !popoverRef.current.contains(target);
      if (outsideChip && outsidePopover) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen, isMobile]);

  // Escape key closes popover
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen]);

  // Don't render chip until we know the term exists
  if (termData === undefined) return <span>{children}</span>;
  if (termData === null) return <span>{children}</span>;

  const toggle = () => setIsOpen((prev) => !prev);

  const popoverContent = (
    <>
      <span className="glossary-popover-concept">{termData.concept}</span>
      <span className="glossary-popover-term">{termData.term}</span>
      <span className="glossary-popover-def">{termData.shortDef}</span>
      {isSeen === false && (
        <span className="glossary-popover-vault">✦ Adding to Knowledge Vault...</span>
      )}
    </>
  );

  return (
    <span style={{ position: "relative", display: "inline" }} ref={chipRef}>
      {/* The chip itself */}
      <span
        onClick={toggle}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && toggle()}
        role="button"
        tabIndex={0}
        aria-label={`Define: ${termData.term}`}
        aria-expanded={isOpen}
        className={isSeen ? "glossary-chip-seen" : "glossary-chip-unseen"}
      >
        {children}
        {!isSeen && <span className="glossary-chip-indicator">?</span>}
      </span>

      {/* Desktop: absolute popover above the chip */}
      {isOpen && !isMobile && (
        <span
          ref={popoverRef as React.RefObject<HTMLSpanElement>}
          className="glossary-popover"
          role="tooltip"
        >
          {popoverContent}
        </span>
      )}

      {/* Mobile: bottom sheet overlay */}
      {isOpen && isMobile && (
        <>
          {/* Backdrop */}
          <span
            onClick={() => setIsOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.6)",
              zIndex: 200,
              display: "block",
            }}
          />
          {/* Sheet */}
          <div
            ref={popoverRef as React.RefObject<HTMLDivElement>}
            role="tooltip"
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 201,
              background: "#1A1A1A",
              border: "2px solid #7F77DD",
              borderBottom: "none",
              boxShadow: "0 -4px 0px #7F77DD",
              padding: "20px 20px 32px",
              fontFamily: "'Courier New', monospace",
              fontSize: "13px",
              lineHeight: "1.5",
              color: "#E5E5E5",
              animation: "slideUp 0.2s ease-out",
            }}
          >
            <button
              onClick={() => setIsOpen(false)}
              style={{
                position: "absolute",
                top: "12px",
                right: "16px",
                background: "transparent",
                border: "none",
                color: "#ffffff80",
                fontSize: "18px",
                cursor: "pointer",
                fontFamily: "'Courier New', monospace",
                lineHeight: 1,
              }}
              aria-label="Close"
            >
              ×
            </button>
            {popoverContent}
          </div>
        </>
      )}
    </span>
  );
}
