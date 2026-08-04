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
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-foreground" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Customer Health Dashboard
          </h1>
          <p className="mt-1 text-label-sm">{APP_TAGLINE}</p>
        </div>
        <Link href="/upload" className="ds-btn-primary">
          <Plus className="h-4 w-4" />
          Analyze Transcript
        </Link>
      </div>

      {analyses.length === 0 ? (
        <div className="flex flex-col items-center justify-center ds-card border-dashed py-20">
          <div className="rounded-lg border border-border p-4">
            <Activity className="h-10 w-10 text-muted" />
          </div>
          <h2 className="mt-4 text-xl font-semibold text-foreground">No analyses yet</h2>
          <p className="mt-2 max-w-md text-center text-label-sm">
            Upload a meeting transcript to analyze customer tone and track disposition over time.
          </p>
          <Link href="/upload" className="mt-6 ds-btn-primary">
            <Plus className="h-4 w-4" />
            Upload Your First Transcript
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          <StatsOverview customers={customers} />

          <div>
            <h2 className="mb-4 text-lg font-semibold tracking-tight text-foreground">
              Customer Health
            </h2>
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

          <div className="ds-card">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              Overall Health Trend
            </h2>
            <p className="mt-1 text-label-sm">Score progression across all analyzed meetings</p>
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
