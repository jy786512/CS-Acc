"use client";

import type { Disposition } from "@/lib/types";
import { DISPOSITION_CONFIG } from "@/lib/constants";

interface HealthMeterProps {
  score: number;
  disposition: Disposition;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export function HealthMeter({
  score,
  disposition,
  size = "md",
  showLabel = true,
}: HealthMeterProps) {
  const config = DISPOSITION_CONFIG[disposition];
  const heights = { sm: "h-2", md: "h-3", lg: "h-4" };

  return (
    <div className="w-full">
      {showLabel && (
        <div className="mb-1.5 flex items-center justify-between text-sm">
          <span className="font-medium text-slate-700">Health Score</span>
          <span className="font-semibold tabular-nums" style={{ color: config.color }}>
            {score}
          </span>
        </div>
      )}
      <div className={`relative w-full overflow-hidden rounded-full bg-slate-100 ${heights[size]}`}>
        <div
          className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${config.meterGradient} transition-all duration-700 ease-out`}
          style={{ width: `${score}%` }}
        />
        <div className="absolute inset-0 flex">
          <div className="flex-1 border-r border-white/30" />
          <div className="flex-1 border-r border-white/30" />
          <div className="flex-1" />
        </div>
      </div>
      <div className="mt-1 flex justify-between text-[10px] text-slate-400">
        <span>At Risk</span>
        <span>Monitor</span>
        <span>Healthy</span>
      </div>
    </div>
  );
}
