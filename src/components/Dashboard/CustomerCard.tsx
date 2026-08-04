"use client";

import { TrendingDown, TrendingUp, Minus } from "lucide-react";
import type { CustomerHealth } from "@/lib/types";
import { DispositionBadge } from "@/components/ui/DispositionBadge";
import { HealthMeter } from "@/components/ui/HealthMeter";

interface CustomerCardProps {
  customer: CustomerHealth;
  onClick?: () => void;
}

const trendConfig = {
  improving: {
    icon: TrendingUp,
    label: "Improving",
    className: "text-emerald-600 bg-emerald-50",
  },
  stable: {
    icon: Minus,
    label: "Stable",
    className: "text-slate-600 bg-slate-50",
  },
  declining: {
    icon: TrendingDown,
    label: "Declining",
    className: "text-red-600 bg-red-50",
  },
};

export function CustomerCard({ customer, onClick }: CustomerCardProps) {
  const trend = trendConfig[customer.trend];
  const TrendIcon = trend.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full rounded-2xl border border-slate-200/80 bg-white p-5 text-left shadow-sm transition-all hover:border-indigo-200 hover:shadow-md hover:shadow-indigo-500/5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold text-slate-900 group-hover:text-indigo-700 transition-colors">
            {customer.customerName}
          </h3>
          <p className="mt-0.5 text-sm text-slate-500">
            {customer.analysisCount} meeting{customer.analysisCount !== 1 ? "s" : ""} analyzed
          </p>
        </div>
        <DispositionBadge disposition={customer.currentDisposition} />
      </div>

      <HealthMeter
        score={customer.currentScore}
        disposition={customer.currentDisposition}
      />

      <div className="mt-4 flex items-center justify-between">
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${trend.className}`}
        >
          <TrendIcon className="h-3.5 w-3.5" />
          {trend.label}
        </span>
        <span className="text-xs text-slate-400">
          Last: {new Date(customer.lastMeetingDate).toLocaleDateString()}
        </span>
      </div>
    </button>
  );
}
