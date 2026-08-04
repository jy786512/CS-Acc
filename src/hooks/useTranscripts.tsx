"use client";

import { createContext, useCallback, useContext, useState } from "react";
import type { CustomerAnalysis } from "@/lib/types";
import {
  addAnalysis,
  deleteAnalysis,
  importAnalyses,
  loadAnalyses,
} from "@/lib/storage";

interface TranscriptContextValue {
  analyses: CustomerAnalysis[];
  isLoaded: boolean;
  add: (analysis: CustomerAnalysis) => void;
  remove: (id: string) => void;
  importData: (data: CustomerAnalysis[]) => void;
  refresh: () => void;
}

const TranscriptContext = createContext<TranscriptContextValue | null>(null);

export function TranscriptProvider({ children }: { children: React.ReactNode }) {
  const [analyses, setAnalyses] = useState<CustomerAnalysis[]>(() => loadAnalyses());
  const [isLoaded] = useState(true);

  const refresh = useCallback(() => {
    setAnalyses(loadAnalyses());
  }, []);

  const add = useCallback((analysis: CustomerAnalysis) => {
    setAnalyses(addAnalysis(analysis));
  }, []);

  const remove = useCallback((id: string) => {
    setAnalyses(deleteAnalysis(id));
  }, []);

  const importData = useCallback((data: CustomerAnalysis[]) => {
    setAnalyses(importAnalyses(data));
  }, []);

  return (
    <TranscriptContext.Provider
      value={{ analyses, isLoaded, add, remove, importData, refresh }}
    >
      {children}
    </TranscriptContext.Provider>
  );
}

export function useTranscripts() {
  const ctx = useContext(TranscriptContext);
  if (!ctx) {
    throw new Error("useTranscripts must be used within TranscriptProvider");
  }
  return ctx;
}
