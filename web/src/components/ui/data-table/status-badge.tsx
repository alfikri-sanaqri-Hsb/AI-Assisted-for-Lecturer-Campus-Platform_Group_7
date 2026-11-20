import type { ReactNode } from "react";

export type BadgeVariant =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "brand"
  | "neutral"
  | "muted";

/**
 * Menentukan warna otomatis dari teks status. Urutan pengecekan penting:
 * kata negatif (mis. "nonaktif") harus dicek lebih dulu daripada kata positif
 * yang menjadi bagiannya (mis. "aktif"), kalau tidak "Nonaktif" tampil hijau.
 */
function detectVariant(status: string): BadgeVariant {
  const normalized = status.toLowerCase();

  if (
    normalized.includes("nonaktif") ||
    normalized.includes("revisi") ||
    normalized.includes("tolak") ||
    normalized.includes("batal")
  ) {
    return "danger";
  }

  if (
    normalized.includes("tunggu") ||
    normalized.includes("pending") ||
    normalized.includes("proses") ||
    normalized.includes("jadwal") ||
    normalized.includes("belum")
  ) {
    return "warning";
  }

  if (
    normalized.includes("aktif") ||
    normalized.includes("terbit") ||
    normalized.includes("setuju") ||
    normalized.includes("selesai") ||
    normalized.includes("lulus")
  ) {
    return "success";
  }

  if (
    normalized.includes("tps") ||
    normalized.includes("snbt") ||
    normalized.includes("utbk") ||
    normalized.includes("kuantitatif") ||
    normalized.includes("penalaran")
  ) {
    return "brand";
  }

  return "neutral";
}

const variantStyles: Record<BadgeVariant, string> = {
  brand:
    "bg-brand-50 text-brand-700 border-brand-200/80 ring-1 ring-brand-500/15",
  success:
    "bg-emerald-50 text-emerald-700 border-emerald-200/80 ring-1 ring-emerald-500/15",
  warning:
    "bg-amber-50 text-amber-800 border-amber-200/80 ring-1 ring-amber-500/15",
  danger:
    "bg-rose-50 text-rose-700 border-rose-200/80 ring-1 ring-rose-500/15",
  info: "bg-sky-50 text-sky-700 border-sky-200/80 ring-1 ring-sky-500/15",
  neutral:
    "bg-slate-100 text-slate-700 border-slate-200/80 ring-1 ring-slate-400/15",
  muted:
    "bg-slate-50 text-slate-500 border-slate-200/80 ring-1 ring-slate-300/15",
};

const dotColors: Record<BadgeVariant, string> = {
  brand: "bg-brand-500",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  danger: "bg-rose-500",
  info: "bg-sky-500",
  neutral: "bg-slate-400",
  muted: "bg-slate-300",
};

export function StatusBadge({
  status,
  variant,
  icon,
}: {
  status: string;
  variant?: BadgeVariant;
  icon?: ReactNode;
}) {
  const chosenVariant = variant ?? detectVariant(status);

  return (
    <span
      className={`inline-flex max-w-full items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold leading-4 backdrop-blur-xs transition-colors ${variantStyles[chosenVariant]}`}
    >
      {icon ? (
        icon
      ) : (
        <span
          className={`size-1.5 rounded-full ${dotColors[chosenVariant]}`}
          aria-hidden="true"
        />
      )}
      <span className="min-w-0 break-words">{status}</span>
    </span>
  );
}
