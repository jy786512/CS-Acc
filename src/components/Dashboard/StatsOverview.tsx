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
    {
      label: "Total Customers",
      value: total,
      icon: Users,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      label: "Healthy",
      value: green,
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Needs Attention",
      value: yellow,
      icon: BarChart3,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "At Risk",
      value: red,
      icon: AlertTriangle,
      color: "text-red-600",
      bg: "bg-red-50",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className={`rounded-xl p-2.5 ${stat.bg}`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold tabular-nums text-slate-900">{stat.value}</p>
              <p className="text-sm text-slate-500">{stat.label}</p>
            </div>
          </div>
        </div>
      ))}
      <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-indigo-500 to-violet-600 p-5 text-white shadow-lg shadow-indigo-500/20">
        <p className="text-sm font-medium text-indigo-100">Avg Health Score</p>
        <p className="mt-1 text-3xl font-bold tabular-nums">{avgScore}</p>
        <p className="mt-1 text-xs text-indigo-200">Across all customers</p>
      </div>
    </div>
  );
}
