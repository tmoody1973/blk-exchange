"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { BottomTabs } from "@/components/layout/bottom-tabs";
import { SectorMarquee } from "@/components/market/sector-marquee";
import { BLKIndex } from "@/components/market/blk-index";
import { MarketAlert } from "@/components/market/market-alert";

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

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full flex-col bg-[#0e0e0e]">
        {/* Sector marquee — always visible at the very top */}
        <div className="sticky top-0 z-40">
          <SectorMarquee />
        </div>

        {/* Main content area */}
        <div className="flex flex-1">
          {/* Desktop sidebar — hidden below lg */}
          <div className="hidden lg:block">
            <AppSidebar />
          </div>

          {/* Page content */}
          <main className="flex flex-1 flex-col min-w-0">
            {/* Desktop top bar with sidebar trigger + BLK Index */}
            <div className="hidden lg:flex items-center gap-4 border-b-2 border-border bg-[#0e0e0e] px-4 py-2">
              <SidebarTrigger />
              <BLKIndex />
            </div>

            {/* Mobile top bar with BLK Index */}
            <div className="flex items-center gap-4 border-b-2 border-border bg-[#0e0e0e] px-4 py-2 lg:hidden">
              <BLKIndex />
            </div>

            {/* Page content with bottom padding on mobile for the tab bar */}
            <div className="flex-1 overflow-auto pb-16 lg:pb-0">
              {children}
            </div>
          </main>
        </div>

        {/* Mobile bottom tabs — hidden at lg+ */}
        <BottomTabs />
      </div>

      {/* Market alert overlay — renders on all pages */}
      <MarketAlert />
    </SidebarProvider>
  );
}

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayoutInner>{children}</AppLayoutInner>;
}
