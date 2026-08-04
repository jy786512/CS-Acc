import type { ParsedTranscript, TranscriptSegment } from "./types";

function normalizeDate(input?: string): string {
  if (!input) return new Date().toISOString().split("T")[0];
  const parsed = new Date(input);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString().split("T")[0];
  }
  return new Date().toISOString().split("T")[0];
}

function parsePlainText(content: string, title?: string): ParsedTranscript {
  const segments: TranscriptSegment[] = [];
  const lines = content.split(/\r?\n/);
  let currentSpeaker = "";
  let currentText = "";
  let currentTimestamp = "";

  const speakerPattern = /^(.+?):\s*(.*)$/;
  const timestampSpeakerPattern =
    /^(?:\[(\d{1,2}:\d{2}(?::\d{2})?(?:\.\d{3})?)\]\s*)?(.+?):\s*(.*)$/;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const tsMatch = trimmed.match(timestampSpeakerPattern);
    if (tsMatch) {
      if (currentSpeaker && currentText) {
        segments.push({
          speaker: currentSpeaker,
          text: currentText.trim(),
          timestamp: currentTimestamp || undefined,
        });
      }
      currentTimestamp = tsMatch[1] || "";
      currentSpeaker = tsMatch[2].trim();
      currentText = tsMatch[3];
      continue;
    }

    const match = trimmed.match(speakerPattern);
    if (match && match[1].length < 60) {
      if (currentSpeaker && currentText) {
        segments.push({
          speaker: currentSpeaker,
          text: currentText.trim(),
          timestamp: currentTimestamp || undefined,
        });
      }
      currentSpeaker = match[1].trim();
      currentText = match[2];
    } else if (currentSpeaker) {
      currentText += (currentText ? " " : "") + trimmed;
    }
  }

  if (currentSpeaker && currentText) {
    segments.push({
      speaker: currentSpeaker,
      text: currentText.trim(),
      timestamp: currentTimestamp || undefined,
    });
  }

  return {
    title: title || "Untitled Meeting",
    date: normalizeDate(),
    segments,
    rawText: content,
  };
}

function parseVttOrSrt(content: string, title?: string): ParsedTranscript {
  const segments: TranscriptSegment[] = [];
  const blocks = content.split(/\n\n+/);

  for (const block of blocks) {
    const lines = block.split(/\r?\n/).filter(Boolean);
    if (lines.length < 2) continue;

    const textLines: string[] = [];
    let timestamp = "";

    for (const line of lines) {
      if (/^\d+$/.test(line)) continue;
      if (line.includes("-->")) {
        timestamp = line.split("-->")[0]?.trim() || "";
        continue;
      }
      textLines.push(line);
    }

    const fullText = textLines.join(" ");
    const speakerMatch = fullText.match(/^<v\s+([^>]+)>(.+)<\/v>$/i);
    if (speakerMatch) {
      segments.push({
        speaker: speakerMatch[1].trim(),
        text: speakerMatch[2].trim(),
        timestamp: timestamp || undefined,
      });
      continue;
    }

    const colonMatch = fullText.match(/^(.+?):\s*(.+)$/);
    if (colonMatch && colonMatch[1].length < 60) {
      segments.push({
        speaker: colonMatch[1].trim(),
        text: colonMatch[2].trim(),
        timestamp: timestamp || undefined,
      });
    } else if (fullText) {
      segments.push({ speaker: "Unknown", text: fullText, timestamp: timestamp || undefined });
    }
  }

  return {
    title: title || "Untitled Meeting",
    date: normalizeDate(),
    segments,
    rawText: content,
  };
}

function parseJson(content: string, title?: string): ParsedTranscript | null {
  try {
    const data = JSON.parse(content);
    const segments: TranscriptSegment[] = [];

    if (Array.isArray(data)) {
      for (const item of data) {
        if (item.speaker && item.text) {
          segments.push({
            speaker: String(item.speaker),
            text: String(item.text),
            timestamp: item.timestamp || item.start_time || undefined,
          });
        } else if (item.name && item.words) {
          segments.push({
            speaker: String(item.name),
            text: String(item.words),
            timestamp: item.start_time || undefined,
          });
        }
      }
    } else if (data.transcript && Array.isArray(data.transcript)) {
      for (const item of data.transcript) {
        segments.push({
          speaker: String(item.speaker || item.name || "Unknown"),
          text: String(item.text || item.words || ""),
          timestamp: item.timestamp || item.start || undefined,
        });
      }
    } else if (data.segments && Array.isArray(data.segments)) {
      for (const item of data.segments) {
        segments.push({
          speaker: String(item.speaker || "Unknown"),
          text: String(item.text || ""),
          timestamp: item.start || undefined,
        });
      }
    } else {
      return null;
    }

    return {
      title: title || data.title || data.meeting_title || "Untitled Meeting",
      date: normalizeDate(data.date || data.meeting_date || data.created_at),
      segments,
      rawText: content,
    };
  } catch {
    return null;
  }
}

export function parseTranscript(
  content: string,
  filename?: string,
  title?: string
): ParsedTranscript {
  const inferredTitle =
    title || filename?.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ") || "Untitled Meeting";

  if (filename?.endsWith(".json") || content.trimStart().startsWith("{") || content.trimStart().startsWith("[")) {
    const jsonResult = parseJson(content, inferredTitle);
    if (jsonResult && jsonResult.segments.length > 0) return jsonResult;
  }

  if (filename?.endsWith(".vtt") || filename?.endsWith(".srt") || content.includes("-->")) {
    const vttResult = parseVttOrSrt(content, inferredTitle);
    if (vttResult.segments.length > 0) return vttResult;
  }

  return parsePlainText(content, inferredTitle);
}

export function getUniqueSpeakers(transcript: ParsedTranscript): string[] {
  return [...new Set(transcript.segments.map((s) => s.speaker))];
}
