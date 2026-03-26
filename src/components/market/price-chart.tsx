"use client";

import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type PricePoint = {
  timestamp: number;
  priceInCents: number;
};

type TimeRange = "1D" | "1W" | "1M" | "ALL";

type PriceChartProps = {
  priceHistory: PricePoint[];
};

const TIME_RANGES: TimeRange[] = ["1D", "1W", "1M", "ALL"];

function filterByRange(data: PricePoint[], range: TimeRange): PricePoint[] {
  if (range === "ALL" || data.length === 0) return data;

  const now = data[data.length - 1].timestamp;
  const msPerDay = 24 * 60 * 60 * 1000;

  const cutoffs: Record<TimeRange, number> = {
    "1D": now - msPerDay,
    "1W": now - 7 * msPerDay,
    "1M": now - 30 * msPerDay,
    ALL: 0,
  };

  const cutoff = cutoffs[range];
  const filtered = data.filter((d) => d.timestamp >= cutoff);
  return filtered.length > 0 ? filtered : data;
}

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

type TooltipPayload = {
  value?: number;
};

type CustomTooltipProps = {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: number;
};

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  const price = payload[0]?.value;

  return (
    <div
      className="border-2 border-[#ffffff] bg-[#1a1a1a] px-3 py-2 font-mono text-xs"
      style={{ boxShadow: "2px 2px 0px 0px #ffffff" }}
    >
      {label !== undefined && (
        <div className="text-white/50 mb-1">{formatDate(label)}</div>
      )}
      {price !== undefined && (
        <div className="text-white font-bold">{formatPrice(price)}</div>
      )}
    </div>
  );
}

export function PriceChart({ priceHistory }: PriceChartProps) {
  const [range, setRange] = useState<TimeRange>("ALL");

  const filtered = filterByRange(priceHistory, range);

  const first = filtered[0]?.priceInCents ?? 0;
  const last = filtered[filtered.length - 1]?.priceInCents ?? 0;
  const isUp = last >= first;
  const lineColor = isUp ? "#22c55e" : "#ef4444";
  const fillColor = isUp ? "#22c55e" : "#ef4444";

  const minPrice = Math.min(...filtered.map((d) => d.priceInCents));
  const maxPrice = Math.max(...filtered.map((d) => d.priceInCents));
  const padding = Math.max((maxPrice - minPrice) * 0.1, 100);

  return (
    <div className="w-full">
      <Tabs
        value={range}
        onValueChange={(v) => setRange(v as TimeRange)}
        className="mb-4"
      >
        <TabsList className="bg-[#1a1a1a] border-2 border-[#ffffff] h-10">
          {TIME_RANGES.map((r) => (
            <TabsTrigger
              key={r}
              value={r}
              className="font-mono text-xs data-[state=active]:bg-[#7F77DD] data-[state=active]:text-white data-[state=active]:border-[#ffffff]"
            >
              {r}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div
        className="border-2 border-[#ffffff] bg-[#1a1a1a]"
        style={{ boxShadow: "4px 4px 0px 0px #ffffff" }}
      >
        {filtered.length < 2 ? (
          <div className="flex items-center justify-center h-48 font-mono text-white/30 text-sm">
            Not enough data for this range
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart
              data={filtered}
              margin={{ top: 12, right: 12, bottom: 8, left: 8 }}
            >
              <defs>
                <linearGradient
                  id={`priceGradient-${isUp ? "up" : "down"}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={fillColor}
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor={fillColor}
                    stopOpacity={0.02}
                  />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="timestamp"
                tickFormatter={formatDate}
                tick={{ fill: "#ffffff80", fontSize: 10, fontFamily: "Courier New" }}
                axisLine={{ stroke: "#ffffff30" }}
                tickLine={false}
                minTickGap={60}
              />
              <YAxis
                domain={[minPrice - padding, maxPrice + padding]}
                tickFormatter={(v: number) => formatPrice(v)}
                tick={{ fill: "#ffffff80", fontSize: 10, fontFamily: "Courier New" }}
                axisLine={false}
                tickLine={false}
                width={70}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ stroke: "#ffffff40", strokeWidth: 1 }}
              />
              <Area
                type="monotone"
                dataKey="priceInCents"
                stroke={lineColor}
                strokeWidth={2}
                fill={`url(#priceGradient-${isUp ? "up" : "down"})`}
                isAnimationActive={false}
                dot={false}
                activeDot={{ r: 4, fill: lineColor, stroke: "#ffffff", strokeWidth: 1 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
