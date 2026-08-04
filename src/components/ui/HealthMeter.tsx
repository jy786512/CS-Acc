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
  const heights = { sm: "h-1.5", md: "h-2", lg: "h-3" };

  return (
    <div className="w-full">
      {showLabel && (
        <div className="mb-1.5 flex items-center justify-between text-sm">
          <span className="font-medium text-muted">Health Score</span>
          <span
            className="font-semibold tabular-nums text-foreground"
            style={{ opacity: score / 100 + 0.2 }}
          >
            {score}
          </span>
        </div>
      )}
      <div
        className={`relative w-full overflow-hidden rounded-full bg-white/[0.06] ${heights[size]}`}
      >
        <div
          className={`absolute inset-y-0 left-0 rounded-full ${config.meterFill} transition-all duration-700 ease-out`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}
