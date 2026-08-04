"use client";

import { Calendar } from "lucide-react";
import type { CustomerAnalysis } from "@/lib/types";
import { DispositionBadge } from "@/components/ui/DispositionBadge";

interface MeetingSearchResultsProps {
  results: CustomerAnalysis[];
  onSelect: (analysis: CustomerAnalysis) => void;
}

export function MeetingSearchResults({ results, onSelect }: MeetingSearchResultsProps) {
  if (results.length === 0) {
    return (
      <div className="ds-card border-dashed py-12 text-center">
        <p className="text-label-sm">No meetings match your search</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {results.map((analysis) => (
        <button
          key={analysis.id}
          type="button"
          onClick={() => onSelect(analysis)}
          className="w-full rounded-lg border border-border p-4 text-left transition-all hover:border-white/15"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-medium text-foreground">{analysis.meetingTitle}</p>
              <p className="mt-0.5 text-label-sm">{analysis.customerName}</p>
            </div>
            <DispositionBadge disposition={analysis.disposition} size="sm" />
          </div>
          <div className="mt-2 flex items-center gap-1 text-label-xs">
            <Calendar className="h-3 w-3" />
            {new Date(analysis.meetingDate).toLocaleDateString()}
          </div>
        </button>
      ))}
    </div>
  );
}
