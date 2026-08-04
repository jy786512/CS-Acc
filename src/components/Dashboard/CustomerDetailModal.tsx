"use client";

import { useState } from "react";
import { X, Calendar, Quote, Trash2 } from "lucide-react";
import type { CustomerHealth } from "@/lib/types";
import { DispositionBadge } from "@/components/ui/DispositionBadge";
import { HealthMeter } from "@/components/ui/HealthMeter";
import { TrendChart } from "@/components/Dashboard/TrendChart";

interface CustomerDetailModalProps {
  customer: CustomerHealth;
  initialAnalysisId?: string | null;
  onClose: () => void;
  onDelete: (id: string) => void;
}

export function CustomerDetailModal({
  customer,
  initialAnalysisId,
  onClose,
  onDelete,
}: CustomerDetailModalProps) {
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [selectedAnalysisId, setSelectedAnalysisId] = useState(
    () => initialAnalysisId ?? customer.analyses[0]?.id ?? null
  );

  const selectedAnalysis =
    customer.analyses.find((a) => a.id === selectedAnalysisId) ?? customer.analyses[0];

  const handleDelete = (id: string) => {
    onDelete(id);
    setConfirmDeleteId(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        onKeyDown={() => {}}
        role="presentation"
      />
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-border bg-card shadow-[var(--ds-shadow-card)]">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold text-foreground">{customer.customerName}</h2>
            <p className="text-label-sm">
              {customer.analysisCount} meetings · Trend: {customer.trend}
            </p>
          </div>
          <button type="button" onClick={onClose} className="ds-btn-ghost !p-2">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <DispositionBadge disposition={customer.currentDisposition} size="lg" />
            <HealthMeter
              score={customer.currentScore}
              disposition={customer.currentDisposition}
              size="lg"
            />
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted">Health Trend</h3>
            <div className="mt-2">
              <TrendChart analyses={customer.analyses} customerName={customer.customerName} />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted">Meeting History</h3>
            <div className="mt-2 space-y-2">
              {customer.analyses.map((analysis) => (
                <div
                  key={analysis.id}
                  className={`rounded-lg border transition-all ${
                    selectedAnalysis?.id === analysis.id
                      ? "border-white/20 bg-white/[0.05]"
                      : "border-border"
                  }`}
                >
                  {confirmDeleteId === analysis.id ? (
                    <div className="p-3">
                      <p className="text-sm text-foreground">Delete this meeting?</p>
                      <p className="mt-1 text-label-xs">
                        This cannot be undone.{" "}
                        {customer.analysisCount === 1 &&
                          "This is the only meeting — the customer will be removed from the dashboard."}
                      </p>
                      <div className="mt-3 flex gap-2">
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(null)}
                          className="ds-btn-secondary"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(analysis.id)}
                          className="rounded-md border border-red-500/40 px-3 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-stretch">
                      <button
                        type="button"
                        onClick={() => setSelectedAnalysisId(analysis.id)}
                        className="min-w-0 flex-1 p-3 text-left hover:border-white/15"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-medium text-foreground">{analysis.meetingTitle}</span>
                          <DispositionBadge disposition={analysis.disposition} size="sm" />
                        </div>
                        <div className="mt-1 flex items-center gap-1 text-label-xs">
                          <Calendar className="h-3 w-3" />
                          {new Date(analysis.meetingDate).toLocaleDateString()}
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setConfirmDeleteId(analysis.id);
                        }}
                        className="ds-btn-ghost shrink-0 self-center !px-3 text-muted hover:text-red-400"
                        aria-label={`Delete ${analysis.meetingTitle}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {selectedAnalysis && (
            <div className="rounded-lg border border-border bg-white/[0.03] p-4">
              <p className="text-sm leading-relaxed text-foreground/90">
                {selectedAnalysis.summary}
              </p>
              {selectedAnalysis.customerQuotes.length > 0 && (
                <div className="mt-3 space-y-2">
                  {selectedAnalysis.customerQuotes.map((quote, i) => (
                    <div key={i} className="flex gap-2 text-sm italic text-muted">
                      <Quote className="mt-0.5 h-4 w-4 shrink-0 opacity-50" />
                      &ldquo;{quote}&rdquo;
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
