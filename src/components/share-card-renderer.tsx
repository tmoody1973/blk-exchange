"use client";

import { useState, useRef, useCallback } from "react";
import html2canvas from "html2canvas";

type CardType = "concept" | "portfolio" | "debrief" | "graduation";

interface ShareCardRendererProps {
  type: CardType;
  data: Record<string, string>;
  children: React.ReactNode; // The trigger button
}

const CARD_BACKGROUNDS: Record<CardType, string> = {
  concept: "/cards/concept-bg.png",
  portfolio: "/cards/portfolio-bg.png",
  debrief: "/cards/debrief-bg.png",
  graduation: "/cards/graduation-bg.png",
};

export function ShareCardRenderer({ type, data, children }: ShareCardRendererProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const generateCard = useCallback(async () => {
    setShowPreview(true);
    setGenerating(true);

    // Wait for the card to render
    await new Promise((r) => setTimeout(r, 200));

    if (!cardRef.current) {
      setGenerating(false);
      return;
    }

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((b) => resolve(b!), "image/png", 1);
      });

      const url = URL.createObjectURL(blob);
      setImageBlob(blob);
      setImageUrl(url);
    } catch (err) {
      console.error("Failed to generate share card:", err);
    } finally {
      setGenerating(false);
    }
  }, []);

  const handleShare = useCallback(async () => {
    if (!imageBlob) return;

    const file = new File([imageBlob], "blk-exchange-card.png", { type: "image/png" });

    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: "BLK Exchange",
          text: data.shareText ?? "Check out my progress on BLK Exchange! blkexchange.com",
        });
      } catch {
        // User cancelled share
      }
    } else {
      // Desktop fallback: download the image
      const a = document.createElement("a");
      a.href = imageUrl!;
      a.download = "blk-exchange-card.png";
      a.click();
    }
  }, [imageBlob, imageUrl, data.shareText]);

  const handleCopyImage = useCallback(async () => {
    if (!imageBlob) return;
    try {
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": imageBlob }),
      ]);
    } catch {
      // Clipboard API not available, fall back to download
      if (imageUrl) {
        const a = document.createElement("a");
        a.href = imageUrl;
        a.download = "blk-exchange-card.png";
        a.click();
      }
    }
  }, [imageBlob, imageUrl]);

  const handleClose = useCallback(() => {
    setShowPreview(false);
    setImageBlob(null);
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
      setImageUrl(null);
    }
  }, [imageUrl]);

  return (
    <>
      {/* Trigger button */}
      <div onClick={generateCard}>{children}</div>

      {/* Hidden card for html2canvas capture */}
      <div style={{ position: "fixed", left: "-9999px", top: 0 }}>
        <div
          ref={cardRef}
          style={{
            width: 1080,
            height: 1080,
            backgroundImage: `url(${CARD_BACKGROUNDS[type]})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "relative",
            fontFamily: "'Courier New', monospace",
          }}
        >
          <CardContent type={type} data={data} />
        </div>
      </div>

      {/* Preview modal */}
      {showPreview && (
        <>
          <div className="fixed inset-0 bg-black/80 z-50" onClick={handleClose} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="w-full max-w-lg border-2 border-white bg-[#1a1a1a] p-4 relative"
              style={{ boxShadow: "6px 6px 0px 0px #7F77DD", fontFamily: "'Courier New', monospace" }}
            >
              <button
                onClick={handleClose}
                className="absolute top-3 right-3 text-white/40 hover:text-white text-lg z-10"
              >
                x
              </button>

              {/* Card preview */}
              <div className="mb-4">
                {generating ? (
                  <div className="aspect-square bg-white/5 flex items-center justify-center">
                    <p className="font-mono text-white/50 text-sm animate-pulse">Generating card...</p>
                  </div>
                ) : imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="Share card preview"
                    className="w-full aspect-square border border-white/10"
                  />
                ) : null}
              </div>

              {/* Action buttons */}
              {imageBlob && (
                <div className="flex gap-2">
                  <button
                    onClick={handleShare}
                    className="flex-1 border-2 border-white bg-[#7F77DD] text-white font-mono text-xs font-bold uppercase tracking-widest py-3 transition-all hover:translate-x-[1px] hover:translate-y-[1px]"
                    style={{ boxShadow: "3px 3px 0px 0px #ffffff" }}
                  >
                    Share Image
                  </button>
                  <button
                    onClick={handleCopyImage}
                    className="flex-1 border-2 border-white bg-transparent text-white font-mono text-xs font-bold uppercase tracking-widest py-3 transition-all hover:bg-white/5"
                  >
                    Copy Image
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}

function CardContent({ type, data }: { type: CardType; data: Record<string, string> }) {
  if (type === "concept") return <ConceptCardContent data={data} />;
  if (type === "portfolio") return <PortfolioCardContent data={data} />;
  if (type === "debrief") return <DebriefCardContent data={data} />;
  if (type === "graduation") return <GraduationCardContent data={data} />;
  return null;
}

function ConceptCardContent({ data }: { data: Record<string, string> }) {
  return (
    <div style={{ position: "absolute", inset: 0, padding: 80, display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <p style={{ fontSize: 16, color: "#7F77DD", letterSpacing: 4, textTransform: "uppercase", fontWeight: 700, marginBottom: 8 }}>
        {data.tier ?? ""}
      </p>
      <p style={{ fontSize: 52, fontWeight: 900, color: "#FFFFFF", lineHeight: 1.2, marginBottom: 20 }}>
        {data.conceptName ?? ""}
      </p>
      <p style={{ fontSize: 22, color: "#ffffffaa", lineHeight: 1.5, maxWidth: 800 }}>
        {data.definition ?? ""}
      </p>
      <div style={{ position: "absolute", bottom: 80, left: 80, right: 80, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p style={{ fontSize: 16, color: "#ffffff60" }}>
          {data.playerName ? `${data.playerName} · ${data.unlocked} of 23 concepts` : "blkexchange.com"}
        </p>
        <p style={{ fontSize: 16, color: "#7F77DD", fontWeight: 700 }}>blkexchange.com</p>
      </div>
    </div>
  );
}

function PortfolioCardContent({ data }: { data: Record<string, string> }) {
  const isPositive = !data.change?.startsWith("-");
  const changeColor = isPositive ? "#22c55e" : "#ef4444";

  return (
    <div style={{ position: "absolute", inset: 0, padding: 80, display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <p style={{ fontSize: 16, color: "#7F77DD", letterSpacing: 4, textTransform: "uppercase", fontWeight: 700, marginBottom: 16 }}>
        My Portfolio
      </p>
      <p style={{ fontSize: 72, fontWeight: 900, color: "#FFFFFF", lineHeight: 1 }}>
        {data.value ?? "$10,000.00"}
      </p>
      <p style={{ fontSize: 36, fontWeight: 900, color: changeColor, marginTop: 8 }}>
        {data.change ?? "+0.00%"}
      </p>
      <div style={{ display: "flex", gap: 40, marginTop: 40 }}>
        <div>
          <p style={{ fontSize: 14, color: "#ffffff50", textTransform: "uppercase", letterSpacing: 2 }}>Holdings</p>
          <p style={{ fontSize: 32, fontWeight: 900, color: "#FFFFFF" }}>{data.holdings ?? "0"}</p>
        </div>
        <div>
          <p style={{ fontSize: 14, color: "#ffffff50", textTransform: "uppercase", letterSpacing: 2 }}>Sectors</p>
          <p style={{ fontSize: 32, fontWeight: 900, color: "#FFFFFF" }}>{data.sectors ?? "0"}</p>
        </div>
        <div>
          <p style={{ fontSize: 14, color: "#ffffff50", textTransform: "uppercase", letterSpacing: 2 }}>Concepts</p>
          <p style={{ fontSize: 32, fontWeight: 900, color: "#FDE047" }}>{data.concepts ?? "0"}/23</p>
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 80, left: 80, right: 80, display: "flex", justifyContent: "space-between" }}>
        <p style={{ fontSize: 16, color: "#ffffff60" }}>{data.playerName ?? ""}</p>
        <p style={{ fontSize: 16, color: "#7F77DD", fontWeight: 700 }}>blkexchange.com</p>
      </div>
    </div>
  );
}

function DebriefCardContent({ data }: { data: Record<string, string> }) {
  return (
    <div style={{ position: "absolute", inset: 0, padding: 80, display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <p style={{ fontSize: 16, color: "#7F77DD", letterSpacing: 4, textTransform: "uppercase", fontWeight: 700, marginBottom: 16 }}>
        Session Debrief
      </p>
      <p style={{ fontSize: 24, color: "#ffffffcc", lineHeight: 1.6, maxWidth: 850, borderLeft: "4px solid #7F77DD", paddingLeft: 24 }}>
        {data.excerpt ?? ""}
      </p>
      <div style={{ display: "flex", gap: 40, marginTop: 40 }}>
        <div>
          <p style={{ fontSize: 14, color: "#ffffff50", textTransform: "uppercase", letterSpacing: 2 }}>Trades</p>
          <p style={{ fontSize: 28, fontWeight: 900, color: "#FFFFFF" }}>{data.trades ?? "0"}</p>
        </div>
        <div>
          <p style={{ fontSize: 14, color: "#ffffff50", textTransform: "uppercase", letterSpacing: 2 }}>Concepts</p>
          <p style={{ fontSize: 28, fontWeight: 900, color: "#FDE047" }}>{data.concepts ?? "0"}</p>
        </div>
        <div>
          <p style={{ fontSize: 14, color: "#ffffff50", textTransform: "uppercase", letterSpacing: 2 }}>P&L</p>
          <p style={{ fontSize: 28, fontWeight: 900, color: data.pnl?.startsWith("-") ? "#ef4444" : "#22c55e" }}>{data.pnl ?? ""}</p>
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 80, left: 80, right: 80, display: "flex", justifyContent: "space-between" }}>
        <p style={{ fontSize: 16, color: "#ffffff60" }}>{data.playerName ?? ""}</p>
        <p style={{ fontSize: 16, color: "#7F77DD", fontWeight: 700 }}>blkexchange.com</p>
      </div>
    </div>
  );
}

function GraduationCardContent({ data }: { data: Record<string, string> }) {
  return (
    <div style={{ position: "absolute", inset: 0, padding: 80, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
      <p style={{ fontSize: 16, color: "#FDE047", letterSpacing: 6, textTransform: "uppercase", fontWeight: 700, marginBottom: 24 }}>
        Welcome to the Real Exchange
      </p>
      <p style={{ fontSize: 42, fontWeight: 900, color: "#FFFFFF", lineHeight: 1.3, maxWidth: 800 }}>
        {data.message ?? "You graduated from the simulation."}
      </p>
      <div style={{ display: "flex", gap: 40, marginTop: 40 }}>
        <div>
          <p style={{ fontSize: 14, color: "#ffffff50", textTransform: "uppercase", letterSpacing: 2 }}>Concepts</p>
          <p style={{ fontSize: 32, fontWeight: 900, color: "#FDE047" }}>{data.concepts ?? "23"}/23</p>
        </div>
        <div>
          <p style={{ fontSize: 14, color: "#ffffff50", textTransform: "uppercase", letterSpacing: 2 }}>Score</p>
          <p style={{ fontSize: 32, fontWeight: 900, color: "#FFFFFF" }}>{data.score ?? "0"}</p>
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 80, left: 80, right: 80, display: "flex", justifyContent: "space-between" }}>
        <p style={{ fontSize: 16, color: "#ffffff60" }}>{data.playerName ?? ""}</p>
        <p style={{ fontSize: 16, color: "#FDE047", fontWeight: 700 }}>blkexchange.com</p>
      </div>
    </div>
  );
}
