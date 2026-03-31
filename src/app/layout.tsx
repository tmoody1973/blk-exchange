import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#0A0A0A",
};

export const metadata: Metadata = {
  title: "BLK Exchange — Learn to Invest. Trade the Culture.",
  description:
    "A real-time cultural stock market simulator where players trade 36 fictional Black-economy companies. Real cultural news moves the market. AI teaches 23 investing concepts through gameplay.",
  metadataBase: new URL("https://blkexchange.com"),
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "BLKX",
    startupImage: [
      {
        url: "/splash/apple-splash-1320x2868.png",
        media:
          "screen and (device-width: 440px) and (device-height: 956px) and (-webkit-device-pixel-ratio: 3)",
      },
      {
        url: "/splash/apple-splash-1206x2622.png",
        media:
          "screen and (device-width: 402px) and (device-height: 874px) and (-webkit-device-pixel-ratio: 3)",
      },
      {
        url: "/splash/apple-splash-1170x2532.png",
        media:
          "screen and (device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)",
      },
      {
        url: "/splash/apple-splash-750x1334.png",
        media:
          "screen and (device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)",
      },
    ],
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    apple: "/icons/apple-touch-icon-180.png",
  },
  openGraph: {
    title: "BLK Exchange — Learn to Invest. Trade the Culture.",
    description:
      "Trade 36 Black-economy companies. Real cultural news moves the market. Claude and Groq teach 23 investing concepts through gameplay — not lectures.",
    url: "https://blkexchange.com",
    siteName: "BLK Exchange",
    images: [
      {
        url: "/blk-exchange-social-card.png?v=2",
        width: 1200,
        height: 630,
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
    images: ["/blk-exchange-social-card.png?v=2"],
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
