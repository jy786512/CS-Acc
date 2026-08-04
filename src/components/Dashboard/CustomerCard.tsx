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
  improving: { icon: TrendingUp, label: "Improving" },
  stable: { icon: Minus, label: "Stable" },
  declining: { icon: TrendingDown, label: "Declining" },
};

export function CustomerCard({ customer, onClick }: CustomerCardProps) {
  const trend = trendConfig[customer.trend];
  const TrendIcon = trend.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full ds-card text-left transition-all hover:border-white/20 focus:outline-none focus:border-[var(--ds-border-focus)]"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold tracking-tight text-foreground">
            {customer.customerName}
          </h3>
          <p className="mt-0.5 text-label-sm">
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
        <span className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-xs font-medium text-muted">
          <TrendIcon className="h-3.5 w-3.5" />
          {trend.label}
        </span>
        <span className="text-label-xs">
          Last: {new Date(customer.lastMeetingDate).toLocaleDateString()}
        </span>
      </div>
    </button>
  );
}
