"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Activity, Search } from "lucide-react";
import { useTranscripts } from "@/hooks/useTranscripts";
import { buildCustomerHealthMap } from "@/lib/storage";
import { filterAnalyses } from "@/lib/search";
import { StatsOverview } from "@/components/Dashboard/StatsOverview";
import { CustomerCard } from "@/components/Dashboard/CustomerCard";
import { TrendChart } from "@/components/Dashboard/TrendChart";
import { ExportPanel } from "@/components/Dashboard/ExportPanel";
import { CustomerDetailModal } from "@/components/Dashboard/CustomerDetailModal";
import { MeetingSearchResults } from "@/components/Dashboard/MeetingSearchResults";
import type { CustomerAnalysis } from "@/lib/types";
import { APP_TAGLINE } from "@/lib/constants";

export default function DashboardPage() {
  const { analyses, isLoaded, importData, remove } = useTranscripts();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomerName, setSelectedCustomerName] = useState<string | null>(null);
  const [selectedAnalysisId, setSelectedAnalysisId] = useState<string | null>(null);

  const customers = useMemo(() => buildCustomerHealthMap(analyses), [analyses]);
  const searchResults = useMemo(
    () => filterAnalyses(analyses, searchQuery),
    [analyses, searchQuery]
  );

  const selectedCustomer = useMemo(
    () => customers.find((c) => c.customerName === selectedCustomerName) ?? null,
    [customers, selectedCustomerName]
  );

  const openCustomerModal = (customerName: string, analysisId?: string) => {
    setSelectedCustomerName(customerName);
    setSelectedAnalysisId(analysisId ?? null);
  };

  const handleSearchSelect = (analysis: CustomerAnalysis) => {
    openCustomerModal(analysis.customerName, analysis.id);
  };

  const closeCustomerModal = () => {
    setSelectedCustomerName(null);
    setSelectedAnalysisId(null);
  };

  if (!isLoaded) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-foreground" />
      </div>
    );
  }

  const isSearching = searchQuery.trim().length > 0;

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
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search meetings by customer, title, or summary..."
              className="ds-input pl-9"
            />
          </div>

          <StatsOverview customers={customers} />

          <div>
            <h2 className="mb-4 text-lg font-semibold tracking-tight text-foreground">
              {isSearching ? "Search Results" : "Customer Health"}
            </h2>
            {isSearching ? (
              <MeetingSearchResults results={searchResults} onSelect={handleSearchSelect} />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {customers.map((customer) => (
                  <CustomerCard
                    key={customer.customerName}
                    customer={customer}
                    onClick={() => openCustomerModal(customer.customerName)}
                  />
                ))}
              </div>
            )}
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
          key={`${selectedCustomer.customerName}-${selectedAnalysisId ?? "default"}`}
          customer={selectedCustomer}
          initialAnalysisId={selectedAnalysisId}
          onClose={closeCustomerModal}
          onDelete={remove}
        />
      )}
    </div>
  );
}
