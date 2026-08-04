"use client";

import { STORAGE_KEY } from "./constants";
import type { CustomerAnalysis, CustomerHealth } from "./types";

export function loadAnalyses(): CustomerAnalysis[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as CustomerAnalysis[];
  } catch {
    return [];
  }
}

export function saveAnalyses(analyses: CustomerAnalysis[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(analyses));
}

export function addAnalysis(analysis: CustomerAnalysis): CustomerAnalysis[] {
  const existing = loadAnalyses();
  const updated = [analysis, ...existing];
  saveAnalyses(updated);
  return updated;
}

export function deleteAnalysis(id: string): CustomerAnalysis[] {
  const updated = loadAnalyses().filter((a) => a.id !== id);
  saveAnalyses(updated);
  return updated;
}

export function importAnalyses(analyses: CustomerAnalysis[]): CustomerAnalysis[] {
  const existing = loadAnalyses();
  const merged = [...analyses, ...existing];
  const deduped = merged.filter(
    (item, index, arr) => arr.findIndex((a) => a.id === item.id) === index
  );
  saveAnalyses(deduped);
  return deduped;
}

function dispositionToScore(disposition: CustomerAnalysis["disposition"]): number {
  switch (disposition) {
    case "green":
      return 85;
    case "yellow":
      return 55;
    case "red":
      return 25;
  }
}

function calculateTrend(
  analyses: CustomerAnalysis[]
): "improving" | "stable" | "declining" {
  if (analyses.length < 2) return "stable";

  const sorted = [...analyses].sort(
    (a, b) => new Date(a.meetingDate).getTime() - new Date(b.meetingDate).getTime()
  );

  const recent = sorted.slice(-3);
  if (recent.length < 2) return "stable";

  const firstScore = recent[0].score;
  const lastScore = recent[recent.length - 1].score;
  const diff = lastScore - firstScore;

  if (diff > 10) return "improving";
  if (diff < -10) return "declining";
  return "stable";
}

export function buildCustomerHealthMap(
  analyses: CustomerAnalysis[]
): CustomerHealth[] {
  const byCustomer = new Map<string, CustomerAnalysis[]>();

  for (const analysis of analyses) {
    const key = analysis.customerName.trim();
    if (!byCustomer.has(key)) byCustomer.set(key, []);
    byCustomer.get(key)!.push(analysis);
  }

  const healthList: CustomerHealth[] = [];

  for (const [customerName, customerAnalyses] of byCustomer) {
    const sorted = [...customerAnalyses].sort(
      (a, b) => new Date(b.meetingDate).getTime() - new Date(a.meetingDate).getTime()
    );
    const latest = sorted[0];

    healthList.push({
      customerName,
      currentDisposition: latest.disposition,
      currentScore: latest.score || dispositionToScore(latest.disposition),
      trend: calculateTrend(sorted),
      analysisCount: sorted.length,
      lastMeetingDate: latest.meetingDate,
      analyses: sorted,
    });
  }

  return healthList.sort((a, b) => a.customerName.localeCompare(b.customerName));
}
