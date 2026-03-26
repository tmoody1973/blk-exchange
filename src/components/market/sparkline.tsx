"use client";

import { LineChart, Line, ResponsiveContainer } from "recharts";

type SparklineProps = {
  data: Array<{ timestamp: number; priceInCents: number }>;
};

export function Sparkline({ data }: SparklineProps) {
  if (!data || data.length < 2) {
    return <div style={{ width: 80, height: 32 }} />;
  }

  const first = data[0].priceInCents;
  const last = data[data.length - 1].priceInCents;
  const isUp = last >= first;
  const color = isUp ? "#22c55e" : "#ef4444";

  return (
    <div style={{ width: 80, height: 32 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey="priceInCents"
            stroke={color}
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
