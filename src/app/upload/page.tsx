import { TranscriptUploadForm } from "@/components/Upload/TranscriptUploadForm";
import { APP_TAGLINE } from "@/lib/constants";

export default function UploadPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Upload Transcript
        </h1>
        <p className="mt-1 text-slate-500">
          {APP_TAGLINE}. Only customer speech is analyzed — Neuron7 team members are automatically filtered out.
        </p>
      </div>

      <TranscriptUploadForm />
    </div>
  );
}
