"use client";

import { ErrorState } from "@/components/ui/async-state";

export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <ErrorState message={error.message || "Panel administrator gagal dimuat."} onRetry={reset} />;
}
