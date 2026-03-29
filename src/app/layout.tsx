import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "BLK Exchange — Learn to Invest. Trade the Culture.",
  description:
    "A real-time cultural stock market simulator where players trade 36 fictional Black-economy companies. Real cultural news moves the market. AI teaches 23 investing concepts through gameplay.",
  metadataBase: new URL("https://blk-exchange.vercel.app"),
  openGraph: {
    title: "BLK Exchange — Learn to Invest. Trade the Culture.",
    description:
      "Trade 36 Black-economy companies. Real cultural news moves the market. Claude and Groq teach 23 investing concepts through gameplay — not lectures.",
    url: "https://blk-exchange.vercel.app",
    siteName: "BLK Exchange",
    images: [
      {
        url: "/blk-exchange-social-card.png",
        width: 1392,
        height: 752,
        alt: "BLK Exchange — Learn to Invest. Trade the Culture.",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BLK Exchange — Learn to Invest. Trade the Culture.",
    description:
      "Trade 36 Black-economy companies. Real cultural news moves the market. AI teaches you why.",
    images: ["/blk-exchange-social-card.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
