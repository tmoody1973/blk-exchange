"use client";

import { useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser, SignOutButton } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { BarChart3, Wallet, BookOpen, User, LogOut } from "lucide-react";
import dynamic from "next/dynamic";
import { BottomTabs } from "@/components/layout/bottom-tabs";
import { GameStatusBar } from "@/components/game/status-bar";
import { SectorMarquee } from "@/components/market/sector-marquee";
import { BLKIndex } from "@/components/market/blk-index";
import { useSession } from "@/lib/hooks/use-session";

const Walkthrough = dynamic(
  () => import("@/components/onboarding/walkthrough").then((m) => m.Walkthrough),
  { ssr: false }
);
const DebriefPrompt = dynamic(
  () => import("@/components/game/debrief-prompt").then((m) => m.DebriefPrompt),
  { ssr: false }
);
const MarketAlert = dynamic(
  () => import("@/components/market/market-alert").then((m) => m.MarketAlert),
  { ssr: false }
);

const NAV_ITEMS = [
  { href: "/market", label: "Market", icon: BarChart3 },
  { href: "/portfolio", label: "Portfolio", icon: Wallet },
  { href: "/vault", label: "Vault", icon: BookOpen },
  { href: "/profile", label: "Me", icon: User },
] as const;

const HOW_TO_PLAY_HREF = "/how-to-play";

function DesktopNav() {
  const pathname = usePathname();

  return (
    <nav className="hidden lg:flex items-center gap-1 border-b-2 border-white bg-[#0e0e0e] px-4 py-2">
      <Link href="/market" className="mr-6 flex items-center gap-1">
        <span className="text-lg font-bold" style={{ color: "#7F77DD" }}>BLK</span>
        <span className="text-lg font-bold text-white">EXCHANGE</span>
      </Link>

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

      <Link
        href={HOW_TO_PLAY_HREF}
        className="flex items-center gap-2 px-3 py-1.5 font-mono text-sm transition-colors ml-2"
        style={{
          color: "#ffffff80",
          borderBottom: "2px solid transparent",
        }}
      >
        How to Play
      </Link>

      <div className="ml-auto flex items-center gap-4">
        <BLKIndex />
        <SignOutButton redirectUrl="/">
          <button className="flex items-center gap-1.5 font-mono text-xs text-white/40 hover:text-white transition-colors">
            <LogOut size={14} />
            Sign Out
          </button>
        </SignOutButton>
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

  const { sessionId, eventsExperienced, endSession } = useSession({ playerId: player?._id ?? null });

  // Get active session start time
  const activeSession = useQuery(
    api.sessions.getActiveSession,
    player?._id ? { playerId: player._id } : "skip"
  );

  // Session event tracking — increment when a new market alert fires
  const incrementEvents = useMutation(api.sessions.incrementEventsExperienced);
  const handleNewEvent = useCallback(() => {
    if (sessionId) {
      incrementEvents({ sessionId: sessionId as Id<"sessions"> }).catch(() => {});
    }
  }, [sessionId, incrementEvents]);

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#0e0e0e]">
      <div className="sticky top-0 z-40">
        <SectorMarquee />
      </div>

      <DesktopNav />

      <div className="flex items-center gap-4 border-b-2 border-white bg-[#0e0e0e] px-4 py-2 lg:hidden">
        <span className="text-sm font-bold" style={{ color: "#7F77DD" }}>BLK</span>
        <BLKIndex />
      </div>

      {/* Game status bar */}
      {player?._id && (
        <div className="px-4 py-2">
          <GameStatusBar
            playerId={player._id}
            sessionStartedAt={activeSession?.startedAt ?? null}
            eventsExperienced={eventsExperienced}
          />
        </div>
      )}

      <main className="flex-1 overflow-auto pb-16 lg:pb-0">
        {children}
      </main>

      <BottomTabs />
      <MarketAlert onNewEvent={handleNewEvent} />
      <Walkthrough />

      {/* Debrief prompt — shows at 45 min or 5+ events */}
      <DebriefPrompt
        sessionStartedAt={activeSession?.startedAt ?? null}
        eventsExperienced={eventsExperienced}
        sessionId={sessionId}
        onRequestDebrief={endSession}
      />
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
