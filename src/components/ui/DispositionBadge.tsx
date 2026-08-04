"use client";

import type { Disposition } from "@/lib/types";
import { DISPOSITION_CONFIG } from "@/lib/constants";

interface DispositionBadgeProps {
  disposition: Disposition;
  size?: "sm" | "md" | "lg";
}

export function DispositionBadge({ disposition, size = "md" }: DispositionBadgeProps) {
  const config = DISPOSITION_CONFIG[disposition];
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-1.5 text-base",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium border ${config.bgColor} ${config.textColor} ${config.borderColor} ${sizeClasses[size]}`}
    >
      <span
        className="h-2 w-2 rounded-full"
        style={{ backgroundColor: config.color }}
      />
      {config.label}
    </span>
  );
}
