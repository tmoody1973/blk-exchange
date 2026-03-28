"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { BarChart3, Wallet, BookOpen, User } from "lucide-react";
import { BottomTabs } from "@/components/layout/bottom-tabs";
import { SectorMarquee } from "@/components/market/sector-marquee";
import { BLKIndex } from "@/components/market/blk-index";
import { MarketAlert } from "@/components/market/market-alert";
import { useSession } from "@/lib/hooks/use-session";

const NAV_ITEMS = [
  { href: "/market", label: "Market", icon: BarChart3 },
  { href: "/portfolio", label: "Portfolio", icon: Wallet },
  { href: "/vault", label: "Vault", icon: BookOpen },
  { href: "/profile", label: "Me", icon: User },
] as const;

function DesktopNav() {
  const pathname = usePathname();

  return (
    <nav className="hidden lg:flex items-center gap-1 border-b-2 border-white bg-[#0e0e0e] px-4 py-2">
      {/* Logo */}
      <Link href="/market" className="mr-6 flex items-center gap-1">
        <span className="text-lg font-bold" style={{ color: "#7F77DD" }}>BLK</span>
        <span className="text-lg font-bold text-white">EXCHANGE</span>
      </Link>

      {/* Nav links */}
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const isActive = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-2 px-3 py-1.5 font-mono text-sm transition-colors"
            style={{
              color: isActive ? "#7F77DD" : "#ffffff",
              borderBottom: isActive ? "2px solid #7F77DD" : "2px solid transparent",
            }}
          >
            <Icon size={16} />
            {label}
          </Link>
        );
      })}

      {/* BLK Index on the right */}
      <div className="ml-auto">
        <BLKIndex />
      </div>
    </nav>
  );
}

function AppLayoutInner({ children }: { children: React.ReactNode }) {
  const { user, isLoaded, isSignedIn } = useUser();
  const getOrCreate = useMutation(api.players.getOrCreate);

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      getOrCreate({
        clerkId: user.id,
        name: user.fullName ?? user.username ?? "Player",
      }).catch(console.error);
    }
  }, [isLoaded, isSignedIn, user, getOrCreate]);

  const player = useQuery(
    api.players.getPlayer,
    isLoaded && isSignedIn && user ? { clerkId: user.id } : "skip"
  );

  useSession({ playerId: player?._id ?? null });

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#0e0e0e]">
      {/* Sector marquee — always visible at the very top */}
      <div className="sticky top-0 z-40">
        <SectorMarquee />
      </div>

      {/* Desktop top nav */}
      <DesktopNav />

      {/* Mobile top bar with BLK Index */}
      <div className="flex items-center gap-4 border-b-2 border-white bg-[#0e0e0e] px-4 py-2 lg:hidden">
        <span className="text-sm font-bold" style={{ color: "#7F77DD" }}>BLK</span>
        <BLKIndex />
      </div>

      {/* Page content — bottom padding on mobile for tab bar */}
      <main className="flex-1 overflow-auto pb-16 lg:pb-0">
        {children}
      </main>

      {/* Mobile bottom tabs */}
      <BottomTabs />

      {/* Market alert overlay */}
      <MarketAlert />
    </div>
  );
}

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayoutInner>{children}</AppLayoutInner>;
}
