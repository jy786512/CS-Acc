"use client";

import { LineChart, Line, Tooltip, ResponsiveContainer } from "recharts";
import type { CustomerAnalysis } from "@/lib/types";

interface TrendChartProps {
  analyses: CustomerAnalysis[];
  customerName?: string;
}

const CHART_LINE = "oklch(0.985 0 0)";

export function TrendChart({ analyses, customerName }: TrendChartProps) {
  const filtered = customerName
    ? analyses.filter((a) => a.customerName === customerName)
    : analyses;

  const data = [...filtered]
    .sort((a, b) => new Date(a.meetingDate).getTime() - new Date(b.meetingDate).getTime())
    .map((a) => ({
      date: new Date(a.meetingDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      score: a.score,
      disposition: a.disposition,
      meeting: a.meetingTitle,
    }));

  if (data.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-border">
        <p className="text-label-sm">No trend data yet</p>
      </div>
    );
  }

  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
          <Tooltip
            contentStyle={{
              background: "oklch(0.269 0 0)",
              borderRadius: "8px",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 4px 24px -4px rgba(0,0,0,0.5)",
              color: "oklch(0.985 0 0)",
              fontSize: "12px",
            }}
            formatter={(value, _name, props) => [
              `${value} (${String(props.payload?.disposition ?? "").toUpperCase()})`,
              "Health Score",
            ]}
            labelFormatter={(_label, payload) =>
              payload?.[0]?.payload?.meeting
                ? `${payload[0].payload.meeting}`
                : _label
            }
          />
          <Line
            type="monotone"
            dataKey="score"
            stroke={CHART_LINE}
            strokeWidth={2}
            dot={{ fill: CHART_LINE, strokeWidth: 0, r: 4 }}
            activeDot={{ r: 5, fill: CHART_LINE, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
