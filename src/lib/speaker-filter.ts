import { NEURON7_KEYWORDS } from "./constants";
import type { ParsedTranscript, TranscriptSegment } from "./types";

function normalizeSpeakerName(name: string): string {
  return name.toLowerCase().trim();
}

export function isNeuron7Speaker(
  speaker: string,
  additionalNeuron7Speakers: string[] = []
): boolean {
  const normalized = normalizeSpeakerName(speaker);
  const allKeywords = [
    ...NEURON7_KEYWORDS,
    ...additionalNeuron7Speakers.map(normalizeSpeakerName),
  ];

  return allKeywords.some(
    (keyword) => normalized.includes(keyword) || keyword.includes(normalized)
  );
}

export function filterCustomerSegments(
  transcript: ParsedTranscript,
  neuron7Speakers: string[] = []
): TranscriptSegment[] {
  return transcript.segments.filter(
    (segment) => !isNeuron7Speaker(segment.speaker, neuron7Speakers)
  );
}

export function getCustomerSpeakers(
  transcript: ParsedTranscript,
  neuron7Speakers: string[] = []
): string[] {
  const speakers = transcript.segments
    .filter((s) => !isNeuron7Speaker(s.speaker, neuron7Speakers))
    .map((s) => s.speaker);

  return [...new Set(speakers)];
}

export function formatCustomerTranscript(
  segments: TranscriptSegment[]
): string {
  return segments
    .map((s) => {
      const prefix = s.timestamp ? `[${s.timestamp}] ` : "";
      return `${prefix}${s.speaker}: ${s.text}`;
    })
    .join("\n\n");
}
