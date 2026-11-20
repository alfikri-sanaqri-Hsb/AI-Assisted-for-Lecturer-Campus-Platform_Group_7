"use client";

import { ErrorState } from "@/components/ui/async-state";

export default function MentorError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <ErrorState message={error.message || "Panel mentor gagal dimuat."} onRetry={reset} />;
}
