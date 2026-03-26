"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { CONCEPTS } from "@/lib/constants/concepts";
import type { ConceptTier } from "@/lib/constants/concepts";
import { VaultProgress } from "@/components/vault/vault-progress";
import { TierProgress } from "@/components/vault/tier-progress";
import { ConceptCard } from "@/components/vault/concept-card";
import { LockedCard } from "@/components/vault/locked-card";

const TOTAL_CONCEPTS = CONCEPTS.length; // 23

const TIERS: { tier: ConceptTier; total: number }[] = [
  { tier: "foundation", total: 5 },
  { tier: "intermediate", total: 8 },
  { tier: "advanced", total: 7 },
  { tier: "economics", total: 3 },
];

export default function VaultPage() {
  const { user, isLoaded } = useUser();

  const player = useQuery(
    api.players.getPlayer,
    isLoaded && user ? { clerkId: user.id } : "skip"
  );

  const vault = useQuery(
    api.vault.getVault,
    player ? { playerId: player._id } : "skip"
  );

  // Loading state
  if (!isLoaded || player === undefined || vault === undefined) {
    return (
      <div className="min-h-screen bg-[#0e0e0e] flex items-center justify-center">
        <p className="font-mono text-white/50 text-sm">Loading vault...</p>
      </div>
    );
  }

  if (player === null) {
    return (
      <div className="min-h-screen bg-[#0e0e0e] flex items-center justify-center">
        <p className="font-mono text-white/30 text-sm">Player not found.</p>
      </div>
    );
  }

  // Build lookup map: conceptId → vault entry
  const unlockedMap = new Map(vault.map((v) => [v.conceptId, v]));

  // Count unlocked per tier
  const tierCounts = new Map<ConceptTier, number>(
    TIERS.map(({ tier }) => [
      tier,
      CONCEPTS.filter((c) => c.tier === tier && unlockedMap.has(c.id)).length,
    ])
  );

  return (
    <div className="min-h-screen bg-[#0e0e0e] p-4 lg:p-6 pb-24 lg:pb-8">
      {/* Page header */}
      <div className="mb-6">
        <h1
          className="font-mono font-bold text-2xl tracking-widest uppercase"
          style={{ color: "#FDE047" }}
        >
          Knowledge Vault
        </h1>
        <p className="font-mono text-white/40 text-sm mt-1">
          Unlock concepts by trading and experiencing events.
        </p>
      </div>

      {/* Overall progress */}
      <div
        className="border-2 border-[#ffffff] p-4 mb-6"
        style={{ backgroundColor: "#1a1a1a", boxShadow: "4px 4px 0px 0px #FDE047" }}
      >
        <VaultProgress unlocked={vault.length} total={TOTAL_CONCEPTS} />
      </div>

      {/* Tier progress row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {TIERS.map(({ tier, total }) => (
          <div
            key={tier}
            className="border-2 border-[#ffffff30] p-3"
            style={{ backgroundColor: "#1a1a1a" }}
          >
            <TierProgress
              tier={tier}
              unlocked={tierCounts.get(tier) ?? 0}
              total={total}
            />
          </div>
        ))}
      </div>

      {/* Concepts by tier */}
      <div className="space-y-10">
        {TIERS.map(({ tier }) => {
          const tierConcepts = CONCEPTS.filter((c) => c.tier === tier);

          return (
            <section key={tier}>
              <h2
                className="font-mono text-xs font-bold uppercase tracking-widest mb-3"
                style={{ color: "#ffffff60" }}
              >
                {tier.charAt(0).toUpperCase() + tier.slice(1)} Concepts
              </h2>

              <div className="space-y-2">
                {tierConcepts.map((concept) => {
                  const entry = unlockedMap.get(concept.id);

                  if (entry) {
                    return (
                      <ConceptCard
                        key={concept.id}
                        conceptId={concept.id}
                        conceptName={entry.conceptName}
                        tier={entry.tier}
                        definition={entry.definition}
                        realWorldExample={entry.realWorldExample}
                        triggerType={entry.triggerType}
                        triggerEventHeadline={entry.triggerEventHeadline}
                        portfolioValueAtUnlock={entry.portfolioValueAtUnlock}
                        unlockedAt={entry.unlockedAt}
                      />
                    );
                  }

                  return <LockedCard key={concept.id} tier={concept.tier} />;
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
