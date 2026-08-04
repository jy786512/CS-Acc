export const NEURON7_KEYWORDS = [
  "neuron7",
  "neuron 7",
  "n7",
  "@neuron7.ai",
];

export const DISPOSITION_CONFIG = {
  red: {
    label: "At Risk",
    color: "#ef4444",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    textColor: "text-red-700",
    meterGradient: "from-red-400 to-red-600",
    description: "Customer shows frustration, dissatisfaction, or churn risk",
  },
  yellow: {
    label: "Needs Attention",
    color: "#eab308",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    textColor: "text-amber-700",
    meterGradient: "from-amber-400 to-amber-600",
    description: "Mixed signals or neutral tone — monitor closely",
  },
  green: {
    label: "Healthy",
    color: "#22c55e",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    textColor: "text-emerald-700",
    meterGradient: "from-emerald-400 to-emerald-600",
    description: "Positive engagement and satisfaction",
  },
} as const;

export const STORAGE_KEY = "cs-acc-analyses";

export const APP_NAME = "Customer Pulse";
export const APP_TAGLINE = "AI-powered customer sentiment from meeting transcripts";
