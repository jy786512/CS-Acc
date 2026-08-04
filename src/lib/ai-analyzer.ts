import { GoogleGenerativeAI } from "@google/generative-ai";
import { v4 as uuidv4 } from "uuid";
import type { AnalyzeRequest, CustomerAnalysis, Disposition } from "@/lib/types";
import {
  filterCustomerSegments,
  formatCustomerTranscript,
  getCustomerSpeakers,
} from "@/lib/speaker-filter";

const SYSTEM_PROMPT = `You are a customer success analyst for Neuron7, an AI company. Your job is to analyze meeting transcript excerpts from CUSTOMER speakers only (never Neuron7 employees) and assess customer disposition/health.

Classify customer disposition as:
- GREEN: Customer is satisfied, engaged, positive, expressing appreciation, excited about outcomes, collaborative
- YELLOW: Mixed signals, neutral tone, minor concerns, uncertainty, needs follow-up, polite but cautious
- RED: Frustrated, dissatisfied, at risk of churn, escalating issues, negative sentiment, blocked, disappointed

Provide a score from 0-100 where:
- 0-35 = red territory
- 36-65 = yellow territory  
- 66-100 = green territory

Be specific and cite actual language patterns. Focus on tone, sentiment, urgency, and relationship health signals.`;

function dispositionFromScore(score: number): Disposition {
  if (score >= 66) return "green";
  if (score >= 36) return "yellow";
  return "red";
}

function fallbackAnalysis(
  request: AnalyzeRequest,
  customerText: string,
  speakers: string[]
): CustomerAnalysis {
  const negativeWords = [
    "frustrated", "disappointed", "unhappy", "concerned", "issue", "problem",
    "delay", "broken", "not working", "cancel", "churn", "escalate", "urgent",
  ];
  const positiveWords = [
    "great", "excellent", "love", "thank", "appreciate", "excited", "happy",
    "perfect", "amazing", "helpful", "works well", "looking forward",
  ];

  const lower = customerText.toLowerCase();
  let score = 55;
  for (const word of negativeWords) {
    if (lower.includes(word)) score -= 8;
  }
  for (const word of positiveWords) {
    if (lower.includes(word)) score += 8;
  }
  score = Math.max(0, Math.min(100, score));

  const disposition = dispositionFromScore(score);

  return {
    id: uuidv4(),
    customerName: request.customerName,
    meetingTitle: request.transcript.title,
    meetingDate: request.transcript.date,
    disposition,
    score,
    confidence: 0.5,
    summary: `Rule-based analysis (${disposition.toUpperCase()}). Configure GEMINI_API_KEY for AI-powered insights.`,
    keySignals: [
      disposition === "red"
        ? "Negative language patterns detected"
        : disposition === "green"
          ? "Positive language patterns detected"
          : "Mixed or neutral language patterns",
    ],
    customerQuotes: customerText.split("\n\n").slice(0, 2).map((q) => q.slice(0, 200)),
    speakersIdentified: speakers,
    analyzedAt: new Date().toISOString(),
  };
}

export async function analyzeTranscript(
  request: AnalyzeRequest
): Promise<CustomerAnalysis> {
  const customerSegments = filterCustomerSegments(
    request.transcript,
    request.neuron7Speakers
  );
  const customerText = formatCustomerTranscript(customerSegments);
  const speakers = getCustomerSpeakers(
    request.transcript,
    request.neuron7Speakers
  );

  if (!customerText.trim()) {
    throw new Error(
      "No customer speech found. All speakers appear to be Neuron7 team members. Check speaker labels or add custom Neuron7 speaker names."
    );
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return fallbackAnalysis(request, customerText, speakers);
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: SYSTEM_PROMPT,
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.3,
    },
  });

  const userPrompt = `Analyze this customer meeting transcript for customer "${request.customerName}".

Meeting: ${request.transcript.title}
Date: ${request.transcript.date}
Customer speakers identified: ${speakers.join(", ")}

CUSTOMER SPEECH ONLY (Neuron7 team speech excluded):
---
${customerText.slice(0, 12000)}
---

Respond with JSON only:
{
  "disposition": "red" | "yellow" | "green",
  "score": number (0-100),
  "confidence": number (0-1),
  "summary": "2-3 sentence summary of customer tone and health",
  "keySignals": ["signal 1", "signal 2", "signal 3"],
  "customerQuotes": ["notable quote 1", "notable quote 2"]
}`;

  try {
    const result = await model.generateContent(userPrompt);
    const content = result.response.text();
    if (!content) {
      return fallbackAnalysis(request, customerText, speakers);
    }

    const parsed = JSON.parse(content) as {
      disposition: Disposition;
      score: number;
      confidence: number;
      summary: string;
      keySignals: string[];
      customerQuotes: string[];
    };

    const score = Math.max(0, Math.min(100, parsed.score ?? 55));
    const disposition = parsed.disposition ?? dispositionFromScore(score);

    return {
      id: uuidv4(),
      customerName: request.customerName,
      meetingTitle: request.transcript.title,
      meetingDate: request.transcript.date,
      disposition,
      score,
      confidence: Math.max(0, Math.min(1, parsed.confidence ?? 0.8)),
      summary: parsed.summary ?? "Analysis complete.",
      keySignals: parsed.keySignals ?? [],
      customerQuotes: parsed.customerQuotes ?? [],
      speakersIdentified: speakers,
      analyzedAt: new Date().toISOString(),
    };
  } catch {
    return fallbackAnalysis(request, customerText, speakers);
  }
}
