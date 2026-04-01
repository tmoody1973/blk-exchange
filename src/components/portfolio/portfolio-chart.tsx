"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

interface PortfolioChartProps {
  playerId: Id<"players">;
  currentValueInCents: number;
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatValue(cents: number): string {
  return `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export function PortfolioChart({ playerId, currentValueInCents }: PortfolioChartProps) {
  const sessions = useQuery(api.sessions.getRecentSessions, { playerId });

  if (sessions === undefined) {
    return (
      <div
        className="border-2 border-white bg-[#1a1a1a] p-4"
        style={{ boxShadow: "4px 4px 0px 0px #ffffff" }}
      >
        <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-white/50 mb-3">
          Portfolio History
        </h2>
        <div className="h-48 bg-white/5 animate-pulse" />
      </div>
    );
  }

  // Build data points from session history (oldest first)
  const completedSessions = sessions
    .filter((s) => s.endedAt && s.portfolioEndValueInCents !== undefined)
    .reverse();

  // Start with $10,000 seed
  const dataPoints = [
    { time: completedSessions[0]?.startedAt ?? Date.now() - 86400000, value: 1000000, label: "Start" },
  ];

  for (const session of completedSessions) {
    dataPoints.push({
      time: session.startedAt,
      value: session.portfolioStartValueInCents,
      label: formatDate(session.startedAt),
    });
    if (session.portfolioEndValueInCents !== undefined) {
      dataPoints.push({
        time: session.endedAt ?? session.startedAt,
        value: session.portfolioEndValueInCents,
        label: formatDate(session.endedAt ?? session.startedAt),
      });
    }
  }

  // Add current value as the last point
  dataPoints.push({
    time: Date.now(),
    value: currentValueInCents,
    label: "Now",
  });

  const chartData = dataPoints.map((d) => ({
    name: d.label,
    value: d.value / 100,
  }));

  const startValue = 10000;
  const currentValue = currentValueInCents / 100;
  const isPositive = currentValue >= startValue;
  const lineColor = isPositive ? "#22c55e" : "#ef4444";

  if (chartData.length < 2) {
    return (
      <div
        className="border-2 border-white bg-[#1a1a1a] p-4"
        style={{ boxShadow: "4px 4px 0px 0px #ffffff" }}
      >
        <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-white/50 mb-3">
          Portfolio History
        </h2>
        <div className="h-48 flex items-center justify-center">
          <p className="font-mono text-white/30 text-sm">
            Complete a session to see your portfolio chart.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="border-2 border-white bg-[#1a1a1a] p-4"
      style={{ boxShadow: "4px 4px 0px 0px #ffffff" }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-white/50">
          Portfolio History
        </h2>
        <span
          className="font-mono text-sm font-bold"
          style={{ color: lineColor }}
        >
          {formatValue(currentValueInCents)}
        </span>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
          <XAxis
            dataKey="name"
            tick={{ fontSize: 10, fill: "#ffffff40", fontFamily: "Courier New" }}
            axisLine={{ stroke: "#ffffff15" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: "#ffffff40", fontFamily: "Courier New" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            domain={["dataMin - 500", "dataMax + 500"]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1a1a1a",
              border: "2px solid #ffffff30",
              fontFamily: "Courier New",
              fontSize: 12,
              color: "#ffffff",
            }}
            formatter={(value) => [`$${Number(value).toLocaleString("en-US", { minimumFractionDigits: 2 })}`, "Value"]}
          />
          <ReferenceLine
            y={startValue}
            stroke="#ffffff20"
            strokeDasharray="3 3"
            label={{
              value: "$10,000",
              position: "right",
              fill: "#ffffff30",
              fontSize: 10,
              fontFamily: "Courier New",
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={lineColor}
            strokeWidth={2}
            dot={{ r: 3, fill: lineColor, stroke: lineColor }}
            activeDot={{ r: 5, fill: lineColor }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
