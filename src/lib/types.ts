export type Disposition = "red" | "yellow" | "green";

export interface TranscriptSegment {
  speaker: string;
  text: string;
  timestamp?: string;
}

export interface ParsedTranscript {
  title: string;
  date: string;
  segments: TranscriptSegment[];
  rawText: string;
}

export interface CustomerAnalysis {
  id: string;
  customerName: string;
  meetingTitle: string;
  meetingDate: string;
  disposition: Disposition;
  score: number;
  confidence: number;
  summary: string;
  keySignals: string[];
  customerQuotes: string[];
  speakersIdentified: string[];
  analyzedAt: string;
}

export interface CustomerHealth {
  customerName: string;
  currentDisposition: Disposition;
  currentScore: number;
  trend: "improving" | "stable" | "declining";
  analysisCount: number;
  lastMeetingDate: string;
  analyses: CustomerAnalysis[];
}

export interface AnalyzeRequest {
  transcript: ParsedTranscript;
  customerName: string;
  neuron7Speakers?: string[];
}

export interface AnalyzeResponse {
  analysis: CustomerAnalysis;
}

export interface ExportPayload {
  exportedAt: string;
  version: string;
  customers: CustomerHealth[];
  analyses: CustomerAnalysis[];
}
