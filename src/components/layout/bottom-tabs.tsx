"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Wallet, BookOpen, Trophy, User } from "lucide-react";

const TABS = [
  { href: "/market", label: "Market", icon: BarChart3 },
  { href: "/portfolio", label: "Portfolio", icon: Wallet },
  { href: "/vault", label: "Vault", icon: BookOpen },
  { href: "/boards", label: "Boards", icon: Trophy },
  { href: "/profile", label: "Me", icon: User },
] as const;

export function BottomTabs() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-stretch border-t-2 border-border bg-[#0e0e0e] lg:hidden"
      aria-label="Mobile navigation"
    >
      {TABS.map(({ href, label, icon: Icon }) => {
        const isActive = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            data-tour={`nav-${label.toLowerCase()}`}
            className="flex flex-1 flex-col items-center justify-center gap-1 text-xs font-mono transition-colors"
            style={{ color: isActive ? "#7F77DD" : "#ffffff" }}
            aria-current={isActive ? "page" : undefined}
          >
            <Icon
              size={20}
              strokeWidth={isActive ? 2.5 : 1.5}
              aria-hidden="true"
            />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
