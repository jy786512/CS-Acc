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
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
        onKeyDown={() => {}}
        role="presentation"
      />
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">{customer.customerName}</h2>
            <p className="text-sm text-slate-500">
              {customer.analysisCount} meetings · Trend: {customer.trend}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
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
            <h3 className="text-sm font-medium text-slate-700">Health Trend</h3>
            <div className="mt-2">
              <TrendChart analyses={customer.analyses} customerName={customer.customerName} />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-slate-700">Meeting History</h3>
            <div className="mt-2 space-y-2">
              {customer.analyses.map((analysis) => (
                <button
                  key={analysis.id}
                  type="button"
                  onClick={() => setSelectedAnalysis(analysis)}
                  className={`w-full rounded-xl border p-3 text-left transition-all ${
                    selectedAnalysis?.id === analysis.id
                      ? "border-indigo-200 bg-indigo-50/50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-900">{analysis.meetingTitle}</span>
                    <DispositionBadge disposition={analysis.disposition} size="sm" />
                  </div>
                  <div className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                    <Calendar className="h-3 w-3" />
                    {new Date(analysis.meetingDate).toLocaleDateString()}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {selectedAnalysis && (
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm leading-relaxed text-slate-700">{selectedAnalysis.summary}</p>
              {selectedAnalysis.customerQuotes.length > 0 && (
                <div className="mt-3 space-y-2">
                  {selectedAnalysis.customerQuotes.map((quote, i) => (
                    <div key={i} className="flex gap-2 text-sm italic text-slate-600">
                      <Quote className="mt-0.5 h-4 w-4 shrink-0 text-slate-300" />
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
