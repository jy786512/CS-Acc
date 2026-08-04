import type { CustomerAnalysis, ExportPayload } from "./types";
import { buildCustomerHealthMap } from "./storage";

export function buildExportPayload(analyses: CustomerAnalysis[]): ExportPayload {
  return {
    exportedAt: new Date().toISOString(),
    version: "1.0",
    customers: buildCustomerHealthMap(analyses),
    analyses: analyses.sort(
      (a, b) => new Date(b.meetingDate).getTime() - new Date(a.meetingDate).getTime()
    ),
  };
}

export function exportToJson(analyses: CustomerAnalysis[]): string {
  return JSON.stringify(buildExportPayload(analyses), null, 2);
}

export function exportToCsv(analyses: CustomerAnalysis[]): string {
  const customers = buildCustomerHealthMap(analyses);
  const headers = [
    "customer_name",
    "current_disposition",
    "current_score",
    "trend",
    "analysis_count",
    "last_meeting_date",
  ];

  const rows = customers.map((c) =>
    [
      c.customerName,
      c.currentDisposition,
      c.currentScore,
      c.trend,
      c.analysisCount,
      c.lastMeetingDate,
    ]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(",")
  );

  return [headers.join(","), ...rows].join("\n");
}

export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function parseImportPayload(content: string): CustomerAnalysis[] {
  const data = JSON.parse(content);

  if (Array.isArray(data)) {
    return data as CustomerAnalysis[];
  }

  if (data.analyses && Array.isArray(data.analyses)) {
    return data.analyses as CustomerAnalysis[];
  }

  throw new Error("Invalid import format. Expected analyses array or export payload.");
}
