export const SECTORS = [
  { id: "media", name: "Media & Content", color: "#FF6B6B" },
  { id: "streaming", name: "Streaming", color: "#4ECDC4" },
  { id: "music", name: "Music", color: "#45B7D1" },
  { id: "gaming", name: "Gaming", color: "#96CEB4" },
  { id: "sportswear", name: "Sportswear", color: "#FFEAA7" },
  { id: "fashion", name: "Streetwear & Fashion", color: "#DDA0DD" },
  { id: "publishing", name: "Publishing", color: "#98D8C8" },
  { id: "beauty", name: "Beauty & Wellness", color: "#F7DC6F" },
  { id: "finance", name: "Finance & Banking", color: "#82E0AA" },
  { id: "realestate", name: "Real Estate", color: "#F0B27A" },
  { id: "sports", name: "Sports & Athletics", color: "#85C1E9" },
  { id: "entertainment", name: "Entertainment", color: "#C39BD3" },
] as const;

export type SectorId = typeof SECTORS[number]["id"];
