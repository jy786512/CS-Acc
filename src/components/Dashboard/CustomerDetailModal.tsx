"use client";

import { useState } from "react";
import { X, Calendar, Quote } from "lucide-react";
import type { CustomerHealth } from "@/lib/types";
import { DispositionBadge } from "@/components/ui/DispositionBadge";
import { HealthMeter } from "@/components/ui/HealthMeter";
import { TrendChart } from "@/components/Dashboard/TrendChart";

interface CustomerDetailModalProps {
  customer: CustomerHealth;
  onClose: () => void;
}

export function CustomerDetailModal({ customer, onClose }: CustomerDetailModalProps) {
  const [selectedAnalysis, setSelectedAnalysis] = useState(customer.analyses[0]);

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
                <button
                  key={analysis.id}
                  type="button"
                  onClick={() => setSelectedAnalysis(analysis)}
                  className={`w-full rounded-lg border p-3 text-left transition-all ${
                    selectedAnalysis?.id === analysis.id
                      ? "border-white/20 bg-white/[0.05]"
                      : "border-border hover:border-white/15"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground">{analysis.meetingTitle}</span>
                    <DispositionBadge disposition={analysis.disposition} size="sm" />
                  </div>
                  <div className="mt-1 flex items-center gap-1 text-label-xs">
                    <Calendar className="h-3 w-3" />
                    {new Date(analysis.meetingDate).toLocaleDateString()}
                  </div>
                </button>
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
