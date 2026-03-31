import { Metadata } from "next";
import { redirect } from "next/navigation";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}): Promise<Metadata> {
  const sp = await searchParams;
  const player = sp.player ?? "Trader";
  const value = sp.value ?? "$10,000.00";
  const change = sp.change ?? "+0.00%";
  const holdings = sp.holdings ?? "0";
  const sectors = sp.sectors ?? "0";
  const concepts = sp.concepts ?? "0";

  const ogParams = new URLSearchParams();
  ogParams.set("player", player);
  ogParams.set("value", value);
  ogParams.set("change", change);
  ogParams.set("holdings", holdings);
  ogParams.set("sectors", sectors);
  ogParams.set("concepts", concepts);

  const ogUrl = `https://blkexchange.com/api/og/portfolio?${ogParams.toString()}`;
  const title = `${player}'s Portfolio on BLK Exchange: ${value}`;

  return {
    title,
    description: `${holdings} holdings across ${sectors} sectors. ${concepts} of 23 concepts unlocked. Learn to Invest. Trade the Culture.`,
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

export default async function SharePortfolioPage() {
  redirect("/portfolio");
}
