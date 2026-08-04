"use client";

import { useRef } from "react";
import { Download, Upload, FileJson, FileSpreadsheet } from "lucide-react";
import type { CustomerAnalysis } from "@/lib/types";
import {
  downloadFile,
  exportToCsv,
  exportToJson,
  parseImportPayload,
} from "@/lib/export";

interface ExportPanelProps {
  analyses: CustomerAnalysis[];
  onImport: (data: CustomerAnalysis[]) => void;
}

export function ExportPanel({ analyses, onImport }: ExportPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportJson = () => {
    const content = exportToJson(analyses);
    downloadFile(
      content,
      `customer-health-${new Date().toISOString().split("T")[0]}.json`,
      "application/json"
    );
  };

  const handleExportCsv = () => {
    const content = exportToCsv(analyses);
    downloadFile(
      content,
      `customer-health-${new Date().toISOString().split("T")[0]}.csv`,
      "text/csv"
    );
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const imported = parseImportPayload(content);
        onImport(imported);
      } catch (err) {
        alert(err instanceof Error ? err.message : "Import failed");
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  return (
    <div className="ds-card">
      <h3 className="text-lg font-semibold tracking-tight text-foreground">Export & Import</h3>
      <p className="mt-1 text-label-sm">
        Export customer health data for your project management tool or import previous exports.
      </p>

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleExportJson}
          disabled={analyses.length === 0}
          className="ds-btn-primary"
        >
          <FileJson className="h-4 w-4" />
          Export JSON
        </button>
        <button
          type="button"
          onClick={handleExportCsv}
          disabled={analyses.length === 0}
          className="ds-btn-secondary"
        >
          <FileSpreadsheet className="h-4 w-4" />
          Export CSV
        </button>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="ds-btn-secondary"
        >
          <Upload className="h-4 w-4" />
          Import Data
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          className="hidden"
        />
      </div>

      <div className="mt-4 rounded-lg border border-border bg-white/[0.03] p-4">
        <div className="flex items-start gap-2">
          <Download className="mt-0.5 h-4 w-4 shrink-0 text-muted" />
          <div className="text-label-xs">
            <p className="font-medium text-muted">PM Tool Integration</p>
            <p className="mt-1">
              JSON exports include full analysis history with disposition, scores, trends, and key
              signals — ready to feed into your project management customer health metric.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
