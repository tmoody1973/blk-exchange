"use client";

import { useState, useRef, useCallback } from "react";
import html2canvas from "html2canvas";

type CardType = "concept" | "portfolio" | "debrief" | "graduation";

interface ShareCardRendererProps {
  type: CardType;
  data: Record<string, string>;
  children: React.ReactNode;
}

export function ShareCardRenderer({ type, data, children }: ShareCardRendererProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const generateCard = useCallback(async () => {
    setShowPreview(true);
    setGenerating(true);
    await new Promise((r) => setTimeout(r, 200));

    if (!cardRef.current) { setGenerating(false); return; }

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#0A0A0A",
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((b) => resolve(b!), "image/png", 1);
      });
      setImageBlob(blob);
      setImageUrl(URL.createObjectURL(blob));
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
      } catch { /* cancelled */ }
    } else {
      const a = document.createElement("a");
      a.href = imageUrl!;
      a.download = "blk-exchange-card.png";
      a.click();
    }
  }, [imageBlob, imageUrl, data.shareText]);

  const handleCopyImage = useCallback(async () => {
    if (!imageBlob) return;
    try {
      await navigator.clipboard.write([new ClipboardItem({ "image/png": imageBlob })]);
    } catch {
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
    if (imageUrl) { URL.revokeObjectURL(imageUrl); setImageUrl(null); }
  }, [imageUrl]);

  return (
    <>
      <div onClick={generateCard}>{children}</div>

      {/* Hidden card for html2canvas */}
      <div style={{ position: "fixed", left: "-9999px", top: 0 }}>
        <div ref={cardRef} style={{ width: 1080, height: 1080, fontFamily: "'Courier New', monospace" }}>
          <CardContent type={type} data={data} />
        </div>
      </div>

      {/* Preview modal */}
      {showPreview && (
        <>
          <div className="fixed inset-0 bg-black/80 z-50" onClick={handleClose} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-lg border-2 border-white bg-[#1a1a1a] p-4 relative" style={{ boxShadow: "6px 6px 0px 0px #7F77DD", fontFamily: "'Courier New', monospace" }}>
              <button onClick={handleClose} className="absolute top-3 right-3 text-white/40 hover:text-white text-lg z-10">x</button>

              <div className="mb-4">
                {generating ? (
                  <div className="aspect-square bg-white/5 flex items-center justify-center">
                    <p className="font-mono text-white/50 text-sm animate-pulse">Generating card...</p>
                  </div>
                ) : imageUrl ? (
                  <img src={imageUrl} alt="Share card preview" className="w-full aspect-square border border-white/10" />
                ) : null}
              </div>

              {imageBlob && (
                <div className="flex gap-2">
                  <button onClick={handleShare} className="flex-1 border-2 border-white bg-[#7F77DD] text-white font-mono text-xs font-bold uppercase tracking-widest py-3" style={{ boxShadow: "3px 3px 0px 0px #ffffff" }}>
                    Share Image
                  </button>
                  <button onClick={handleCopyImage} className="flex-1 border-2 border-white bg-transparent text-white font-mono text-xs font-bold uppercase tracking-widest py-3 hover:bg-white/5">
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

// ─── Card Content (code-rendered, no AI backgrounds) ─────────────────────────

function CardContent({ type, data }: { type: CardType; data: Record<string, string> }) {
  if (type === "concept") return <ConceptCard data={data} />;
  if (type === "portfolio") return <PortfolioCard data={data} />;
  if (type === "debrief") return <DebriefCard data={data} />;
  if (type === "graduation") return <GraduationCard data={data} />;
  return null;
}

function ConceptCard({ data }: { data: Record<string, string> }) {
  return (
    <div style={{ width: 1080, height: 1080, backgroundColor: "#0A0A0A", position: "relative", overflow: "hidden" }}>
      {/* Purple accent bar top */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 6, backgroundColor: "#7F77DD" }} />
      {/* Purple vertical bar left */}
      <div style={{ position: "absolute", top: 0, left: 0, width: 6, height: "60%", backgroundColor: "#7F77DD" }} />
      {/* White border */}
      <div style={{ position: "absolute", inset: 40, border: "2px solid #ffffff20" }} />

      {/* Content */}
      <div style={{ position: "absolute", top: 100, left: 80, right: 80, bottom: 140 }}>
        <p style={{ fontSize: 18, color: "#7F77DD", letterSpacing: 6, textTransform: "uppercase", fontWeight: 700 }}>
          {data.tier ?? "Knowledge Vault"}
        </p>
        <p style={{ fontSize: 64, fontWeight: 900, color: "#FFFFFF", lineHeight: 1.15, marginTop: 20 }}>
          {data.conceptName ?? ""}
        </p>
        <div style={{ width: 60, height: 4, backgroundColor: "#7F77DD", marginTop: 24, marginBottom: 24 }} />
        <p style={{ fontSize: 24, color: "#ffffff90", lineHeight: 1.6, maxWidth: 850 }}>
          {data.definition ?? ""}
        </p>
      </div>

      {/* Footer */}
      <div style={{ position: "absolute", bottom: 40, left: 80, right: 80, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p style={{ fontSize: 16, color: "#ffffff40" }}>
          {data.playerName ? `${data.playerName} · ${data.unlocked} of 23` : "#BLKExchange"}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 24, fontWeight: 900, color: "#FFFFFF" }}>BLK</span>
          <span style={{ fontSize: 24, fontWeight: 900, color: "#7F77DD" }}>X</span>
          <span style={{ fontSize: 14, color: "#ffffff40", marginLeft: 12 }}>blkexchange.com</span>
        </div>
      </div>
    </div>
  );
}

function PortfolioCard({ data }: { data: Record<string, string> }) {
  const isPositive = !data.change?.startsWith("-");
  const changeColor = isPositive ? "#22c55e" : "#ef4444";

  return (
    <div style={{ width: 1080, height: 1080, backgroundColor: "#0A0A0A", position: "relative", overflow: "hidden" }}>
      {/* Green/red accent bar top based on performance */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 6, backgroundColor: changeColor }} />
      {/* White border */}
      <div style={{ position: "absolute", inset: 40, border: "2px solid #ffffff20" }} />
      {/* Decorative lines (ticker tape feel) */}
      <div style={{ position: "absolute", top: 60, left: 60, right: 60, height: 40, display: "flex", gap: 8, opacity: 0.15 }}>
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} style={{ width: 3, height: Math.random() * 30 + 10, backgroundColor: i % 3 === 0 ? "#ef4444" : "#22c55e", alignSelf: "flex-end" }} />
        ))}
      </div>

      {/* Content */}
      <div style={{ position: "absolute", top: 160, left: 80, right: 80 }}>
        <p style={{ fontSize: 18, color: "#7F77DD", letterSpacing: 6, textTransform: "uppercase", fontWeight: 700 }}>
          My Portfolio
        </p>
        <p style={{ fontSize: 96, fontWeight: 900, color: "#FFFFFF", lineHeight: 1, marginTop: 16 }}>
          {data.value ?? "$10,000.00"}
        </p>
        <p style={{ fontSize: 48, fontWeight: 900, color: changeColor, marginTop: 8 }}>
          {data.change ?? "+0.00%"}
        </p>

        {/* Stats row */}
        <div style={{ display: "flex", gap: 60, marginTop: 60 }}>
          <div style={{ borderLeft: "3px solid #ffffff20", paddingLeft: 20 }}>
            <p style={{ fontSize: 14, color: "#ffffff40", textTransform: "uppercase", letterSpacing: 3 }}>Holdings</p>
            <p style={{ fontSize: 42, fontWeight: 900, color: "#FFFFFF" }}>{data.holdings ?? "0"}</p>
          </div>
          <div style={{ borderLeft: "3px solid #ffffff20", paddingLeft: 20 }}>
            <p style={{ fontSize: 14, color: "#ffffff40", textTransform: "uppercase", letterSpacing: 3 }}>Sectors</p>
            <p style={{ fontSize: 42, fontWeight: 900, color: "#FFFFFF" }}>{data.sectors ?? "0"}</p>
          </div>
          <div style={{ borderLeft: "3px solid #FDE04740", paddingLeft: 20 }}>
            <p style={{ fontSize: 14, color: "#ffffff40", textTransform: "uppercase", letterSpacing: 3 }}>Concepts</p>
            <p style={{ fontSize: 42, fontWeight: 900, color: "#FDE047" }}>{data.concepts ?? "0"}/23</p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ position: "absolute", bottom: 120, left: 80, right: 80, height: 2, backgroundColor: "#ffffff15" }} />

      {/* Footer */}
      <div style={{ position: "absolute", bottom: 40, left: 80, right: 80, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p style={{ fontSize: 16, color: "#ffffff40" }}>
          {data.playerName || "Learn to Invest. Trade the Culture."}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 24, fontWeight: 900, color: "#FFFFFF" }}>BLK</span>
          <span style={{ fontSize: 24, fontWeight: 900, color: "#7F77DD" }}>X</span>
          <span style={{ fontSize: 14, color: "#ffffff40", marginLeft: 12 }}>blkexchange.com</span>
        </div>
      </div>
    </div>
  );
}

function DebriefCard({ data }: { data: Record<string, string> }) {
  return (
    <div style={{ width: 1080, height: 1080, backgroundColor: "#0A0A0A", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 6, backgroundColor: "#7F77DD" }} />
      <div style={{ position: "absolute", inset: 40, border: "2px solid #ffffff20" }} />

      <div style={{ position: "absolute", top: 100, left: 80, right: 80, bottom: 140 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#7F77DD" }} />
          <p style={{ fontSize: 18, color: "#7F77DD", letterSpacing: 6, textTransform: "uppercase", fontWeight: 700 }}>
            Session Debrief
          </p>
        </div>

        <div style={{ borderLeft: "4px solid #7F77DD", paddingLeft: 28, marginBottom: 40 }}>
          <p style={{ fontSize: 26, color: "#ffffffcc", lineHeight: 1.6 }}>
            {data.excerpt ?? ""}
          </p>
        </div>

        <div style={{ display: "flex", gap: 48 }}>
          <div>
            <p style={{ fontSize: 14, color: "#ffffff40", textTransform: "uppercase", letterSpacing: 3 }}>Trades</p>
            <p style={{ fontSize: 36, fontWeight: 900, color: "#FFFFFF" }}>{data.trades ?? "0"}</p>
          </div>
          <div>
            <p style={{ fontSize: 14, color: "#ffffff40", textTransform: "uppercase", letterSpacing: 3 }}>Concepts</p>
            <p style={{ fontSize: 36, fontWeight: 900, color: "#FDE047" }}>{data.concepts ?? "0"}</p>
          </div>
          <div>
            <p style={{ fontSize: 14, color: "#ffffff40", textTransform: "uppercase", letterSpacing: 3 }}>P&L</p>
            <p style={{ fontSize: 36, fontWeight: 900, color: data.pnl?.startsWith("-") ? "#ef4444" : "#22c55e" }}>{data.pnl ?? ""}</p>
          </div>
        </div>
      </div>

      <div style={{ position: "absolute", bottom: 40, left: 80, right: 80, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p style={{ fontSize: 16, color: "#ffffff40" }}>{data.playerName ?? ""}</p>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 24, fontWeight: 900, color: "#FFFFFF" }}>BLK</span>
          <span style={{ fontSize: 24, fontWeight: 900, color: "#7F77DD" }}>X</span>
          <span style={{ fontSize: 14, color: "#ffffff40", marginLeft: 12 }}>blkexchange.com</span>
        </div>
      </div>
    </div>
  );
}

function GraduationCard({ data }: { data: Record<string, string> }) {
  return (
    <div style={{ width: 1080, height: 1080, backgroundColor: "#0A0A0A", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 6, backgroundColor: "#FDE047" }} />
      <div style={{ position: "absolute", inset: 40, border: "2px solid #FDE04730" }} />
      {/* Gold star */}
      <div style={{ position: "absolute", top: 80, left: 80, fontSize: 48, color: "#FDE047" }}>★</div>

      <div style={{ position: "absolute", top: 160, left: 80, right: 80, bottom: 140, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
        <p style={{ fontSize: 18, color: "#FDE047", letterSpacing: 8, textTransform: "uppercase", fontWeight: 700, marginBottom: 32 }}>
          Welcome to the Real Exchange
        </p>
        <p style={{ fontSize: 48, fontWeight: 900, color: "#FFFFFF", lineHeight: 1.3, maxWidth: 800 }}>
          {data.message ?? "From sim to real. From learning to earning."}
        </p>

        <div style={{ display: "flex", gap: 60, marginTop: 60 }}>
          <div>
            <p style={{ fontSize: 14, color: "#ffffff40", textTransform: "uppercase", letterSpacing: 3 }}>Concepts</p>
            <p style={{ fontSize: 42, fontWeight: 900, color: "#FDE047" }}>{data.concepts ?? "23"}/23</p>
          </div>
          <div>
            <p style={{ fontSize: 14, color: "#ffffff40", textTransform: "uppercase", letterSpacing: 3 }}>Score</p>
            <p style={{ fontSize: 42, fontWeight: 900, color: "#FFFFFF" }}>{data.score ?? "0"}</p>
          </div>
        </div>
      </div>

      <div style={{ position: "absolute", bottom: 40, left: 80, right: 80, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p style={{ fontSize: 16, color: "#ffffff40" }}>{data.playerName ?? ""}</p>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 24, fontWeight: 900, color: "#FFFFFF" }}>BLK</span>
          <span style={{ fontSize: 24, fontWeight: 900, color: "#FDE047" }}>X</span>
          <span style={{ fontSize: 14, color: "#ffffff40", marginLeft: 12 }}>blkexchange.com</span>
        </div>
      </div>
    </div>
  );
}
