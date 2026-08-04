"use client";

import { Users, AlertTriangle, CheckCircle2, BarChart3 } from "lucide-react";
import type { CustomerHealth } from "@/lib/types";

interface StatsOverviewProps {
  customers: CustomerHealth[];
}

export function StatsOverview({ customers }: StatsOverviewProps) {
  const total = customers.length;
  const green = customers.filter((c) => c.currentDisposition === "green").length;
  const yellow = customers.filter((c) => c.currentDisposition === "yellow").length;
  const red = customers.filter((c) => c.currentDisposition === "red").length;
  const avgScore =
    total > 0
      ? Math.round(customers.reduce((sum, c) => sum + c.currentScore, 0) / total)
      : 0;

  const stats = [
    { label: "Total Customers", value: total, icon: Users },
    { label: "Healthy", value: green, icon: CheckCircle2 },
    { label: "Needs Attention", value: yellow, icon: BarChart3 },
    { label: "At Risk", value: red, icon: AlertTriangle },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {stats.map((stat) => (
        <div key={stat.label} className="ds-card !p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-md border border-border p-2.5">
              <stat.icon className="h-5 w-5 text-muted" />
            </div>
            <div>
              <p className="text-metric tabular-nums text-foreground">{stat.value}</p>
              <p className="text-label-sm">{stat.label}</p>
            </div>
          </div>
        </div>
      ))}
      <div className="ds-card !p-5 border-white/20">
        <p className="text-label-sm">Avg Health Score</p>
        <p className="mt-1 text-metric tabular-nums text-foreground">{avgScore}</p>
        <p className="mt-1 text-label-xs">Across all customers</p>
      </div>
    </div>
  );
}
