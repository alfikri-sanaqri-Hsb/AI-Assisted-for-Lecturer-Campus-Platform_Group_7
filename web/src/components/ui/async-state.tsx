import { Icon } from "@/components/ui/icon";

export function LoadingState({ label = "Memuat data..." }: { label?: string }) {
  return (
    <div role="status" aria-live="polite" className="flex min-h-32 items-center justify-center p-8 text-sm text-muted">
      <span className="mr-2 inline-block size-4 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" aria-hidden="true" />
      {label}
    </div>
  );
}

export function ErrorState({
  message = "Data tidak dapat dimuat.",
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-800">
      <div className="flex items-start gap-3">
        <Icon name="alert" className="mt-0.5 size-5 shrink-0 text-rose-600" />
        <div>
          <p className="font-semibold">Terjadi kendala saat memuat data.</p>
          <p className="mt-1">{message}</p>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="mt-4 rounded-lg bg-rose-600 px-3 py-2 text-xs font-semibold text-white hover:bg-rose-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700"
            >
              Coba lagi
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Pemberitahuan ringkas hasil sebuah aksi (galat atau sukses), ditempatkan di
 * atas tabel. Berbeda dengan ErrorState yang menggantikan seluruh halaman,
 * ini tidak membuang konten yang sedang dilihat pengguna.
 */
export function ActionAlert({
  tone,
  message,
  onDismiss,
}: {
  tone: "error" | "success";
  message: string;
  onDismiss?: () => void;
}) {
  const isError = tone === "error";
  return (
    <div
      role={isError ? "alert" : "status"}
      className={`mb-4 flex items-start gap-2.5 rounded-xl border px-3.5 py-3 text-xs leading-relaxed ${
        isError
          ? "border-rose-200 bg-rose-50 text-rose-800"
          : "border-emerald-200 bg-emerald-50 text-emerald-800"
      }`}
    >
      <Icon
        name={isError ? "alert" : "check"}
        className={`mt-0.5 size-4 shrink-0 ${isError ? "text-rose-600" : "text-emerald-600"}`}
      />
      <p className="min-w-0 flex-1 break-words font-medium">{message}</p>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Tutup pemberitahuan"
          className="shrink-0 rounded-md p-0.5 opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-current"
        >
          <Icon name="close" className="size-3.5" />
        </button>
      )}
    </div>
  );
}
