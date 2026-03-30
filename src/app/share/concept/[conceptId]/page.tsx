import { Metadata } from "next";
import { redirect } from "next/navigation";

const CONCEPT_NAMES: Record<string, string> = {
  "supply-demand": "Supply & Demand",
  "bull-bear": "Bull & Bear Markets",
  "buy-sell-basics": "Buy & Sell Basics",
  "profit-loss": "Profit & Loss",
  "portfolio-value": "Portfolio Value",
  diversification: "Diversification",
  "sector-correlation": "Sector Correlation",
  "emotional-investing": "Emotional Investing",
  "consumer-spending": "Consumer Spending Power",
  "economic-multiplier": "Economic Multiplier",
  "dividend-investing": "Dividend Investing",
  "halo-effect": "Halo Effect",
  "competitive-displacement": "Competitive Displacement",
  "pe-ratio": "P/E Ratio",
  "economic-moat": "Economic Moat",
  "risk-adjusted-return": "Risk-Adjusted Return",
  "dollar-cost-avg": "Dollar Cost Averaging",
  "acquisition-economics": "Acquisition Economics",
  "vc-dilution": "VC Dilution",
  "portfolio-rebalancing": "Portfolio Rebalancing",
  inflation: "Inflation",
  "consumer-confidence": "Consumer Confidence",
  "black-dollar": "The Black Dollar",
};

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ conceptId: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}): Promise<Metadata> {
  const { conceptId } = await params;
  const sp = await searchParams;
  const conceptName = CONCEPT_NAMES[conceptId] ?? "Financial Concept";
  const player = sp.player ?? "";
  const unlocked = sp.unlocked ?? "";

  const ogParams = new URLSearchParams();
  if (player) ogParams.set("player", player);
  if (unlocked) ogParams.set("unlocked", unlocked);
  ogParams.set("total", "23");

  const ogUrl = `https://blkexchange.com/api/og/${conceptId}?${ogParams.toString()}`;
  const title = player
    ? `${player} unlocked ${conceptName} on BLK Exchange`
    : `${conceptName} - BLK Exchange Knowledge Vault`;

  return {
    title,
    description: `Learn investing concepts through gameplay. ${conceptName} is one of 23 concepts in the BLK Exchange Knowledge Vault.`,
    openGraph: {
      title,
      description: "Learn to Invest. Trade the Culture.",
      images: [{ url: ogUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      images: [ogUrl],
    },
  };
}

export default async function ShareConceptPage({
  params,
}: {
  params: Promise<{ conceptId: string }>;
}) {
  const { conceptId } = await params;
  redirect(`/vault?highlight=${conceptId}`);
}
