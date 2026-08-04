"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Activity } from "lucide-react";
import { useTranscripts } from "@/hooks/useTranscripts";
import { buildCustomerHealthMap } from "@/lib/storage";
import { StatsOverview } from "@/components/Dashboard/StatsOverview";
import { CustomerCard } from "@/components/Dashboard/CustomerCard";
import { TrendChart } from "@/components/Dashboard/TrendChart";
import { ExportPanel } from "@/components/Dashboard/ExportPanel";
import { CustomerDetailModal } from "@/components/Dashboard/CustomerDetailModal";
import type { CustomerHealth } from "@/lib/types";
import { APP_TAGLINE } from "@/lib/constants";

export default function DashboardPage() {
  const { analyses, isLoaded, importData } = useTranscripts();
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerHealth | null>(null);

  const customers = useMemo(() => buildCustomerHealthMap(analyses), [analyses]);

  if (!isLoaded) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Customer Health Dashboard
          </h1>
          <p className="mt-1 text-slate-500">{APP_TAGLINE}</p>
        </div>
        <Link
          href="/upload"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-500/25 transition-all hover:from-indigo-700 hover:to-violet-700"
        >
          <Plus className="h-4 w-4" />
          Analyze Transcript
        </Link>
      </div>

      {analyses.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-20">
          <div className="rounded-2xl bg-indigo-50 p-4">
            <Activity className="h-10 w-10 text-indigo-500" />
          </div>
          <h2 className="mt-4 text-xl font-semibold text-slate-900">No analyses yet</h2>
          <p className="mt-2 max-w-md text-center text-sm text-slate-500">
            Upload a meeting transcript to analyze customer tone and track disposition over time.
          </p>
          <Link
            href="/upload"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" />
            Upload Your First Transcript
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          <StatsOverview customers={customers} />

          <div>
            <h2 className="mb-4 text-lg font-semibold text-slate-900">Customer Health</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {customers.map((customer) => (
                <CustomerCard
                  key={customer.customerName}
                  customer={customer}
                  onClick={() => setSelectedCustomer(customer)}
                />
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Overall Health Trend</h2>
            <p className="mt-1 text-sm text-slate-500">
              Score progression across all analyzed meetings
            </p>
            <div className="mt-4">
              <TrendChart analyses={analyses} />
            </div>
          </div>

          <ExportPanel analyses={analyses} onImport={importData} />
        </div>
      )}

      {selectedCustomer && (
        <CustomerDetailModal
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
        />
      )}
    </div>
  );
}
