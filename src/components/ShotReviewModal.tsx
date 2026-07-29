"use client";

interface ShotReviewModalProps {
  previewUrl: string;
  submitting: boolean;
  onApprove: () => void;
  onRetake: () => void;
}

export default function ShotReviewModal({
  previewUrl,
  submitting,
  onApprove,
  onRetake,
}: ShotReviewModalProps) {
  return (
    <div className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm px-6">
      <p className="mb-4 text-sm font-medium text-white/60">
        Last shot — how does it look?
      </p>

      <img
        src={previewUrl}
        alt="Captured shot"
        className="max-h-[65vh] w-auto max-w-full rounded-2xl border border-white/10 shadow-2xl object-contain"
      />

      <div className="mt-8 flex w-full max-w-sm gap-3">
        <button
          onClick={onRetake}
          disabled={submitting}
          className="flex-1 rounded-xl border border-white/15 bg-white/5 py-3.5 text-sm font-semibold text-white/80 hover:bg-white/10 transition-all duration-200 disabled:opacity-50"
        >
          Retake
        </button>
        <button
          onClick={onApprove}
          disabled={submitting}
          className="flex-1 rounded-xl bg-gradient-to-r from-sp-coral to-sp-magenta py-3.5 text-sm font-semibold text-white hover:shadow-lg hover:shadow-sp-magenta/25 transition-all duration-200 disabled:opacity-50"
        >
          {submitting ? "Sending..." : "Use This Photo"}
        </button>
      </div>
    </div>
  );
}
