"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Upload,
  FileText,
  Loader2,
  Sparkles,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { parseTranscript, getUniqueSpeakers } from "@/lib/transcript-parser";
import { getCustomerSpeakers, isNeuron7Speaker } from "@/lib/speaker-filter";
import { useTranscripts } from "@/hooks/useTranscripts";
import { DispositionBadge } from "@/components/ui/DispositionBadge";
import { HealthMeter } from "@/components/ui/HealthMeter";
import type { CustomerAnalysis, ParsedTranscript } from "@/lib/types";

export function TranscriptUploadForm() {
  const router = useRouter();
  const { add } = useTranscripts();
  const [file, setFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [meetingTitle, setMeetingTitle] = useState("");
  const [meetingDate, setMeetingDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [neuron7Speakers, setNeuron7Speakers] = useState("");
  const [parsed, setParsed] = useState<ParsedTranscript | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CustomerAnalysis | null>(null);
  const [inputMode, setInputMode] = useState<"upload" | "paste">("upload");

  const handleParse = useCallback(async () => {
    setError(null);
    setResult(null);

    let content = pastedText;
    let filename = "pasted.txt";

    if (inputMode === "upload") {
      if (!file) {
        setError("Please select a transcript file.");
        return;
      }
      content = await file.text();
      filename = file.name;
    } else if (!pastedText.trim()) {
      setError("Please paste transcript content.");
      return;
    }

    const transcript = parseTranscript(content, filename, meetingTitle || undefined);
    transcript.date = meetingDate;
    if (meetingTitle) transcript.title = meetingTitle;

    setParsed(transcript);

    if (transcript.segments.length === 0) {
      setError(
        "Could not parse any speaker segments. Try a format like 'Speaker Name: what they said'."
      );
    }
  }, [file, pastedText, inputMode, meetingTitle, meetingDate]);

  const handleAnalyze = async () => {
    if (!parsed) {
      await handleParse();
      return;
    }

    if (!customerName.trim()) {
      setError("Customer name is required.");
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const customNeuron7 = neuron7Speakers
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transcript: parsed,
          customerName: customerName.trim(),
          neuron7Speakers: customNeuron7,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Analysis failed");
      }

      setResult(data.analysis);
      add(data.analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const customNeuron7List = neuron7Speakers
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const allSpeakers = parsed ? getUniqueSpeakers(parsed) : [];
  const customerSpeakers = parsed
    ? getCustomerSpeakers(parsed, customNeuron7List)
    : [];

  return (
    <div className="space-y-6">
      <div className="ds-card">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">Meeting Details</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-muted">Customer Name *</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Acme Corp"
              className="mt-1.5 ds-input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted">Meeting Title</label>
            <input
              type="text"
              value={meetingTitle}
              onChange={(e) => setMeetingTitle(e.target.value)}
              placeholder="Q3 Business Review"
              className="mt-1.5 ds-input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted">Meeting Date</label>
            <input
              type="date"
              value={meetingDate}
              onChange={(e) => setMeetingDate(e.target.value)}
              className="mt-1.5 ds-input [color-scheme:dark]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted">
              Additional Neuron7 Speakers
            </label>
            <input
              type="text"
              value={neuron7Speakers}
              onChange={(e) => setNeuron7Speakers(e.target.value)}
              placeholder="John Smith, Jane Doe (comma-separated)"
              className="mt-1.5 ds-input"
            />
            <p className="mt-1 text-label-xs">
              Speakers containing &quot;neuron7&quot; are auto-filtered
            </p>
          </div>
        </div>
      </div>

      <div className="ds-card">
        <div className="flex items-center gap-2 border-b border-border pb-4">
          <button
            type="button"
            onClick={() => setInputMode("upload")}
            className={`flex items-center gap-2 ${
              inputMode === "upload" ? "ds-btn-ghost-active" : "ds-btn-ghost"
            }`}
          >
            <Upload className="h-4 w-4" />
            Upload File
          </button>
          <button
            type="button"
            onClick={() => setInputMode("paste")}
            className={`flex items-center gap-2 ${
              inputMode === "paste" ? "ds-btn-ghost-active" : "ds-btn-ghost"
            }`}
          >
            <FileText className="h-4 w-4" />
            Paste Transcript
          </button>
        </div>

        <div className="mt-4">
          {inputMode === "upload" ? (
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-border bg-white/[0.02] px-6 py-12 transition-colors hover:border-white/20 hover:bg-white/[0.04]">
              <Upload className="h-10 w-10 text-muted" />
              <p className="mt-3 text-sm font-medium text-foreground">
                {file ? file.name : "Drop a transcript file or click to browse"}
              </p>
              <p className="mt-1 text-label-xs">Supports .txt, .vtt, .srt, .json</p>
              <input
                type="file"
                accept=".txt,.vtt,.srt,.json,.csv"
                onChange={(e) => {
                  setFile(e.target.files?.[0] || null);
                  setParsed(null);
                  setResult(null);
                }}
                className="hidden"
              />
            </label>
          ) : (
            <textarea
              value={pastedText}
              onChange={(e) => {
                setPastedText(e.target.value);
                setParsed(null);
                setResult(null);
              }}
              placeholder={`Paste your transcript here...

Example format:
Sarah (Acme): We're really happy with the progress so far.
John (Neuron7): Great to hear! Let me share the roadmap.
Sarah (Acme): Actually, we have some concerns about the timeline.`}
              rows={12}
              className="ds-input font-mono"
            />
          )}
        </div>

        <div className="mt-4 flex gap-3">
          <button type="button" onClick={handleParse} className="ds-btn-secondary">
            Preview Speakers
          </button>
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="ds-btn-primary"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Analyze Customer Tone
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-lg border border-white/15 bg-white/[0.03] p-4">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-[var(--ds-lum-risk)]" />
          <p className="text-sm text-[var(--ds-lum-attention)]">{error}</p>
        </div>
      )}

      {parsed && parsed.segments.length > 0 && (
        <div className="ds-card">
          <h3 className="text-lg font-semibold tracking-tight text-foreground">
            Speaker Preview
          </h3>
          <p className="mt-1 text-label-sm">
            Only customer speakers (non-Neuron7) will be analyzed
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {allSpeakers.map((speaker) => {
              const isN7 = isNeuron7Speaker(speaker, customNeuron7List);
              return (
                <span
                  key={speaker}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium ${
                    isN7
                      ? "border-border text-muted line-through opacity-50"
                      : "border-white/20 text-foreground bg-white/[0.05]"
                  }`}
                >
                  {isN7 ? "—" : "✓"} {speaker}
                  {isN7 && <span className="text-label-xs">(Neuron7)</span>}
                </span>
              );
            })}
          </div>
          {customerSpeakers.length === 0 && (
            <p className="mt-3 text-sm text-[var(--ds-lum-attention)]">
              No customer speakers detected. Add custom Neuron7 speaker names if needed.
            </p>
          )}
        </div>
      )}

      {result && (
        <div className="ds-card border-white/20">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-foreground" />
              <div>
                <h3 className="text-lg font-semibold text-foreground">Analysis Complete</h3>
                <p className="text-label-sm">{result.meetingTitle}</p>
              </div>
            </div>
            <DispositionBadge disposition={result.disposition} size="lg" />
          </div>

          <div className="mt-6">
            <HealthMeter score={result.score} disposition={result.disposition} size="lg" />
          </div>

          <p className="mt-4 text-sm leading-relaxed text-muted">{result.summary}</p>

          {result.keySignals.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-muted">Key Signals</h4>
              <ul className="mt-2 space-y-1">
                {result.keySignals.map((signal, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground" />
                    {signal}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            type="button"
            onClick={() => router.push("/")}
            className="mt-6 ds-btn-primary"
          >
            View on Dashboard →
          </button>
        </div>
      )}
    </div>
  );
}
