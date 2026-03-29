export const dynamic = "force-dynamic";

export default function OfflinePage() {
  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "#0A0A0A",
        fontFamily: "'Courier New', monospace",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        color: "#FFFFFF",
      }}
    >
      {/* Logo */}
      <div
        style={{
          fontSize: "36px",
          fontWeight: 900,
          letterSpacing: "-1px",
          marginBottom: "32px",
        }}
      >
        BLK<span style={{ color: "#7F77DD" }}>X</span>
      </div>

      {/* Neobrutalist card */}
      <div
        style={{
          background: "#1A1A1A",
          border: "2px solid #FFFFFF",
          boxShadow: "4px 4px 0px #7F77DD",
          padding: "32px 28px",
          maxWidth: "360px",
          width: "100%",
          textAlign: "center",
        }}
      >
        {/* Status icon */}
        <div
          style={{
            fontSize: "40px",
            marginBottom: "16px",
            lineHeight: 1,
          }}
        >
          ⚡
        </div>

        <div
          style={{
            fontSize: "11px",
            letterSpacing: "3px",
            textTransform: "uppercase",
            color: "#EF4444",
            marginBottom: "12px",
            fontWeight: 700,
          }}
        >
          MARKET OFFLINE
        </div>

        <div
          style={{
            fontSize: "22px",
            fontWeight: 900,
            marginBottom: "12px",
            lineHeight: 1.2,
          }}
        >
          NO CONNECTION
        </div>

        <div
          style={{
            fontSize: "13px",
            color: "#E5E5E5",
            opacity: 0.7,
            lineHeight: 1.6,
            marginBottom: "28px",
          }}
        >
          Markets need a live connection to move.
          <br />
          Check your network and try again.
        </div>

        {/* Retry button */}
        <button
          onClick={() => window.location.reload()}
          style={{
            width: "100%",
            padding: "14px",
            background: "#7F77DD",
            color: "#FFFFFF",
            fontFamily: "'Courier New', monospace",
            fontSize: "13px",
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: "2px",
            cursor: "pointer",
            border: "2px solid #FFFFFF",
            boxShadow: "3px 3px 0px #FFFFFF",
          }}
        >
          ↻ RETRY
        </button>
      </div>

      {/* Version */}
      <div
        style={{
          position: "fixed",
          bottom: "24px",
          fontSize: "9px",
          letterSpacing: "2px",
          opacity: 0.15,
          textTransform: "uppercase",
        }}
      >
        v1.0.0 · HACKONOMICS 2026
      </div>
    </div>
  );
}
