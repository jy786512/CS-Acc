export const NEURON7_KEYWORDS = [
  "neuron7",
  "neuron 7",
  "n7",
  "@neuron7.ai",
];

export const DISPOSITION_CONFIG = {
  red: {
    label: "At Risk",
    color: "var(--ds-lum-risk)",
    bgColor: "bg-white/[0.03]",
    borderColor: "border-white/10",
    textColor: "text-[var(--ds-lum-risk)]",
    meterFill: "bg-[var(--ds-lum-risk)]",
    description: "Customer shows frustration, dissatisfaction, or churn risk",
  },
  yellow: {
    label: "Needs Attention",
    color: "var(--ds-lum-attention)",
    bgColor: "bg-white/[0.05]",
    borderColor: "border-white/15",
    textColor: "text-[var(--ds-lum-attention)]",
    meterFill: "bg-[var(--ds-lum-attention)]",
    description: "Mixed signals or neutral tone — monitor closely",
  },
  green: {
    label: "Healthy",
    color: "var(--ds-lum-healthy)",
    bgColor: "bg-white/[0.08]",
    borderColor: "border-white/20",
    textColor: "text-[var(--ds-lum-healthy)]",
    meterFill: "bg-[var(--ds-lum-healthy)]",
    description: "Positive engagement and satisfaction",
  },
} as const;

export const STORAGE_KEY = "cs-acc-analyses";

export const APP_NAME = "Customer Pulse";
export const APP_TAGLINE = "AI-powered customer sentiment from meeting transcripts";
