"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import type { CustomerAnalysis } from "@/lib/types";

interface TrendChartProps {
  analyses: CustomerAnalysis[];
  customerName?: string;
}

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
      <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50">
        <p className="text-sm text-slate-500">No trend data yet</p>
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12, fill: "#64748b" }}
            axisLine={{ stroke: "#e2e8f0" }}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 12, fill: "#64748b" }}
            axisLine={{ stroke: "#e2e8f0" }}
          />
          <ReferenceLine y={66} stroke="#22c55e" strokeDasharray="4 4" strokeOpacity={0.4} />
          <ReferenceLine y={36} stroke="#ef4444" strokeDasharray="4 4" strokeOpacity={0.4} />
          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
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
            stroke="#6366f1"
            strokeWidth={2.5}
            dot={{ fill: "#6366f1", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: "#4f46e5" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
