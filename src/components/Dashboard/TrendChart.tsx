"use client";

import { useId } from "react";
import { LineChart, Line, Tooltip, ResponsiveContainer } from "recharts";
import type { CustomerAnalysis, Disposition } from "@/lib/types";

interface TrendChartProps {
  analyses: CustomerAnalysis[];
  customerName?: string;
}

const DISPOSITION_CHART_COLORS: Record<Disposition, string> = {
  red: "var(--ds-chart-red)",
  yellow: "var(--ds-chart-yellow)",
  green: "var(--ds-chart-green)",
};

function colorForDisposition(disposition: Disposition | undefined): string {
  if (!disposition) return "var(--ds-chart-line)";
  return DISPOSITION_CHART_COLORS[disposition];
}

interface ChartPoint {
  date: string;
  score: number;
  disposition: Disposition;
  meeting: string;
}

function ScoreDot({
  cx,
  cy,
  payload,
  active = false,
}: {
  cx?: number;
  cy?: number;
  payload?: ChartPoint;
  active?: boolean;
}) {
  if (cx == null || cy == null || !payload) return null;
  const color = colorForDisposition(payload.disposition);
  return (
    <circle
      cx={cx}
      cy={cy}
      r={active ? 6 : 4}
      fill={color}
      stroke="var(--ds-bg-card)"
      strokeWidth={active ? 2 : 1.5}
    />
  );
}

export function TrendChart({ analyses, customerName }: TrendChartProps) {
  const gradientId = useId().replace(/:/g, "");

  const filtered = customerName
    ? analyses.filter((a) => a.customerName === customerName)
    : analyses;

  const data: ChartPoint[] = [...filtered]
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

  const gradientStops =
    data.length === 1
      ? [
          { offset: "0%", color: colorForDisposition(data[0].disposition) },
          { offset: "100%", color: colorForDisposition(data[0].disposition) },
        ]
      : data.map((point, index) => ({
          offset: `${(index / (data.length - 1)) * 100}%`,
          color: colorForDisposition(point.disposition),
        }));

  return (
    <div className="w-full">
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
                {gradientStops.map((stop) => (
                  <stop
                    key={stop.offset}
                    offset={stop.offset}
                    stopColor={stop.color}
                  />
                ))}
              </linearGradient>
            </defs>
            <Tooltip
              contentStyle={{
                background: "oklch(0.269 0 0)",
                borderRadius: "8px",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "0 4px 24px -4px rgba(0,0,0,0.5)",
                color: "oklch(0.985 0 0)",
                fontSize: "12px",
              }}
              formatter={(value, _name, props) => {
                const disposition = props.payload?.disposition as Disposition | undefined;
                const color = colorForDisposition(disposition);
                return [
                  <span key="score" style={{ color }}>
                    {String(value)} ({String(disposition ?? "").toUpperCase()})
                  </span>,
                  "Health Score",
                ];
              }}
              labelFormatter={(_label, payload) =>
                payload?.[0]?.payload?.meeting
                  ? `${payload[0].payload.meeting}`
                  : _label
              }
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke={`url(#${gradientId})`}
              strokeWidth={2.5}
              dot={<ScoreDot />}
              activeDot={<ScoreDot active />}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-4">
        {(
          [
            ["green", "Healthy"],
            ["yellow", "Needs Attention"],
            ["red", "At Risk"],
          ] as const
        ).map(([key, label]) => (
          <div key={key} className="flex items-center gap-1.5 text-label-xs">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: DISPOSITION_CHART_COLORS[key] }}
            />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
