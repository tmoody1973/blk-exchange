"use client";

interface VaultProgressProps {
  unlocked: number;
  total: number;
}

export function VaultProgress({ unlocked, total }: VaultProgressProps) {
  const percent = total > 0 ? Math.round((unlocked / total) * 100) : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span
          className="font-mono text-sm font-bold"
          style={{ color: "#FDE047" }}
        >
          {unlocked} of {total} investing concepts
        </span>
        <span className="font-mono text-xs" style={{ color: "#ffffff60" }}>
          {percent}%
        </span>
      </div>

      {/* Custom progress bar — avoids overriding the shared Progress component */}
      <div
        className="relative h-3 w-full border-2 overflow-hidden"
        style={{ borderColor: "#ffffff", backgroundColor: "#0e0e0e" }}
      >
        <div
          className="absolute inset-y-0 left-0 transition-all duration-500"
          style={{
            width: `${percent}%`,
            backgroundColor: "#FDE047",
          }}
        />
      </div>
    </div>
  );
}
