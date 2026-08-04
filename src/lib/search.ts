import type { CustomerAnalysis } from "./types";

export function filterAnalyses(
  analyses: CustomerAnalysis[],
  query: string
): CustomerAnalysis[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return [];

  return analyses
    .filter((analysis) => {
      const haystack = [
        analysis.customerName,
        analysis.meetingTitle,
        analysis.summary,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(trimmed);
    })
    .sort(
      (a, b) =>
        new Date(b.meetingDate).getTime() - new Date(a.meetingDate).getTime()
    );
}
