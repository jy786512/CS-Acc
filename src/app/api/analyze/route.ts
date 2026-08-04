import { NextRequest, NextResponse } from "next/server";
import { analyzeTranscript } from "@/lib/ai-analyzer";
import type { AnalyzeRequest } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as AnalyzeRequest;

    if (!body.transcript || !body.customerName?.trim()) {
      return NextResponse.json(
        { error: "Transcript and customer name are required." },
        { status: 400 }
      );
    }

    const analysis = await analyzeTranscript(body);
    return NextResponse.json({ analysis });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Analysis failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
