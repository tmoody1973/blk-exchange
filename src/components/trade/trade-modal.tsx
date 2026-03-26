"use client";

import { useState, useEffect, useCallback } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { CONCEPTS } from "@/lib/constants/concepts";
import { CONCEPT_CONTENT } from "@/data/concepts";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TradePreview } from "./trade-preview";

type StockData = {
  _id: Id<"stocks">;
  symbol: string;
  name: string;
  priceInCents: number;
};

type TradeModalProps = {
  stock: StockData;
  playerId: Id<"players">;
  playerCash: number;
  currentHoldingShares: number;
  isOpen: boolean;
  onClose: () => void;
  initialType?: "buy" | "sell";
};

const QUICK_AMOUNTS = [
  { label: "$100", cents: 10_000 },
  { label: "$500", cents: 50_000 },
  { label: "$1,000", cents: 100_000 },
  { label: "$2,500", cents: 250_000 },
];

function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return isMobile;
}

export function TradeModal({
  stock,
  playerId,
  playerCash,
  currentHoldingShares,
  isOpen,
  onClose,
  initialType = "buy",
}: TradeModalProps) {
  const [tradeType, setTradeType] = useState<"buy" | "sell">(initialType);
  const [amountInput, setAmountInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isMobile = useIsMobile();

  const executeTrade = useMutation(api.trades.executeTrade);
  const checkBehaviorTriggers = useMutation(api.vault.checkBehaviorTriggers);
  const unlockConcept = useMutation(api.vault.unlockConcept);
  const updateDebt = useMutation(api.curriculumDebt.updateDebt);

  // Fetch total portfolio value for the 25% limit calculation
  const portfolioValue = useQuery(api.players.getPortfolioValue, { playerId });
  const totalPortfolioValueInCents =
    portfolioValue?.totalValueInCents ?? playerCash;

  // Sync initialType whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setTradeType(initialType);
      setAmountInput("");
      setError(null);
      setSuccessMessage(null);
    }
  }, [isOpen, initialType]);

  const amountInCents = Math.round(parseFloat(amountInput || "0") * 100);

  const handleQuickAmount = useCallback((cents: number) => {
    setAmountInput((cents / 100).toFixed(2));
    setError(null);
  }, []);

  const handleAmountChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      // Allow only valid dollar input: digits and up to 2 decimal places
      if (/^\d*\.?\d{0,2}$/.test(val) || val === "") {
        setAmountInput(val);
        setError(null);
      }
    },
    []
  );

  const handleConfirm = useCallback(async () => {
    if (amountInCents <= 0) {
      setError("Enter a valid amount");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await executeTrade({
        playerId,
        stockId: stock._id,
        type: tradeType,
        amountInCents,
      });

      const sharesStr = result.shares.toFixed(4);
      const dollarStr = `$${(result.amountInCents / 100).toFixed(2)}`;
      setSuccessMessage(
        `${tradeType === "buy" ? "Bought" : "Sold"} ${sharesStr} ${result.symbol} for ${dollarStr}`
      );
      setAmountInput("");

      // Check behavior triggers and unlock concepts asynchronously
      void (async () => {
        try {
          const newUnlockIds = await checkBehaviorTriggers({ playerId });
          for (const conceptId of newUnlockIds) {
            const concept = CONCEPTS.find((c) => c.id === conceptId);
            const content = CONCEPT_CONTENT[conceptId];
            if (concept && content) {
              await unlockConcept({
                playerId,
                conceptId: concept.id,
                conceptName: concept.name,
                tier: concept.tier,
                triggerType: "behavior",
                definition: content.definition,
                realWorldExample: content.realWorldExample,
              });
            }
          }
          // Update curriculum debt after unlocking
          if (newUnlockIds.length > 0) {
            await updateDebt({ playerId });
          }
        } catch (err) {
          // Non-critical — log and continue
          console.error("[TradeModal] Behavior trigger check failed:", err);
        }
      })();

      // Auto-close after brief success display
      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
      }, 1800);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Trade failed. Please try again.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }, [amountInCents, executeTrade, playerId, stock._id, tradeType, onClose]);

  const confirmColor = tradeType === "buy" ? "#22c55e" : "#ef4444";
  const confirmBgColor = tradeType === "buy" ? "#22c55e20" : "#ef444420";

  const modalContent = (
    <div className="space-y-4">
      {/* BUY / SELL toggle */}
      <div className="flex border-2 border-[#ffffff]" style={{ boxShadow: "4px 4px 0px 0px #ffffff" }}>
        <button
          onClick={() => {
            setTradeType("buy");
            setError(null);
          }}
          className="flex-1 py-2 font-mono font-bold text-sm uppercase tracking-widest transition-colors"
          style={{
            backgroundColor: tradeType === "buy" ? "#7F77DD" : "transparent",
            color: tradeType === "buy" ? "#ffffff" : "#ffffff60",
            borderRight: "2px solid #ffffff",
          }}
        >
          Buy
        </button>
        <button
          onClick={() => {
            setTradeType("sell");
            setError(null);
          }}
          className="flex-1 py-2 font-mono font-bold text-sm uppercase tracking-widest transition-colors"
          style={{
            backgroundColor: tradeType === "sell" ? "#7F77DD" : "transparent",
            color: tradeType === "sell" ? "#ffffff" : "#ffffff60",
          }}
        >
          Sell
        </button>
      </div>

      {/* Dollar amount input */}
      <div>
        <label className="font-mono text-xs text-white/50 uppercase tracking-wider block mb-1">
          Amount (USD)
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-white/50 text-sm pointer-events-none">
            $
          </span>
          <input
            type="text"
            inputMode="decimal"
            placeholder="0.00"
            value={amountInput}
            onChange={handleAmountChange}
            disabled={isSubmitting}
            className="w-full pl-7 pr-4 py-2 border-2 border-[#ffffff] bg-[#0e0e0e] font-mono text-white text-sm focus:outline-none focus:border-[#7F77DD] disabled:opacity-50"
          />
        </div>
      </div>

      {/* Quick amount buttons */}
      <div className="grid grid-cols-4 gap-2">
        {QUICK_AMOUNTS.map(({ label, cents }) => (
          <button
            key={cents}
            onClick={() => handleQuickAmount(cents)}
            disabled={isSubmitting}
            className="border-2 border-[#ffffff] bg-transparent text-white font-mono text-xs py-2 uppercase tracking-wider hover:bg-white/10 transition-colors disabled:opacity-50"
            style={{ boxShadow: "2px 2px 0px 0px #ffffff" }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Trade preview */}
      <TradePreview
        type={tradeType}
        amountInCents={amountInCents}
        stock={stock}
        playerCash={playerCash}
        currentHoldingShares={currentHoldingShares}
        totalPortfolioValueInCents={totalPortfolioValueInCents}
      />

      {/* Error message */}
      {error && (
        <div className="border-2 border-[#ef4444] bg-[#ef4444]/10 p-3">
          <p className="font-mono text-xs text-[#ef4444]">{error}</p>
        </div>
      )}

      {/* Success message */}
      {successMessage && (
        <div className="border-2 border-[#22c55e] bg-[#22c55e]/10 p-3">
          <p className="font-mono text-xs text-[#22c55e]">{successMessage}</p>
        </div>
      )}

      {/* Confirm button */}
      <button
        onClick={handleConfirm}
        disabled={isSubmitting || amountInCents <= 0 || !!successMessage}
        className="w-full border-2 border-[#ffffff] font-mono font-bold text-sm py-3 uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          backgroundColor: confirmBgColor,
          color: confirmColor,
          boxShadow: isSubmitting ? "none" : "4px 4px 0px 0px #ffffff",
        }}
      >
        {isSubmitting
          ? "Executing..."
          : `Confirm ${tradeType === "buy" ? "Buy" : "Sell"}`}
      </button>

      {/* Available cash reminder */}
      <p className="font-mono text-xs text-white/30 text-center">
        Available cash: ${(playerCash / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </p>
    </div>
  );

  const title = `Trade ${stock.symbol}`;

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <SheetContent
          side="bottom"
          className="bg-[#0e0e0e] border-t-2 border-[#ffffff] p-0 max-h-[90vh] overflow-y-auto"
        >
          <SheetHeader className="px-4 pt-4 pb-0">
            <SheetTitle className="font-mono font-bold text-white text-sm uppercase tracking-widest">
              {title}
            </SheetTitle>
          </SheetHeader>
          <div className="p-4">{modalContent}</div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="bg-[#0e0e0e] border-2 border-[#ffffff] p-0 max-w-md"
        style={{ boxShadow: "8px 8px 0px 0px #ffffff" }}
      >
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="font-mono font-bold text-white text-sm uppercase tracking-widest">
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="px-6 pb-6 pt-4">{modalContent}</div>
      </DialogContent>
    </Dialog>
  );
}
