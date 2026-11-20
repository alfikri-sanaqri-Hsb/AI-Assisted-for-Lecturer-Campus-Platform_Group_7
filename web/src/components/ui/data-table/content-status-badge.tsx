import { CONTENT_STATUS_LABELS, type ContentStatus } from "@/types";
import { StatusBadge } from "./status-badge";
import type { FilterOption } from "./types";

/**
 * Lencana dan label status konten (Materi, Bank Soal, Paket TryOut).
 *
 * Sumber kebenaran tunggal adalah CONTENT_STATUS_LABELS di types/content.ts.
 * Nilai status di data tetap berupa enum (mis. "SUBMITTED"); teks yang tampil
 * ke pengguna selalu berbahasa Indonesia.
 */

/** Label Indonesia untuk sebuah status (mis. "SUBMITTED" -> "Menunggu Verifikasi"). */
export function contentStatusLabel(status: ContentStatus): string {
  return CONTENT_STATUS_LABELS[status]?.label ?? String(status);
}

export function ContentStatusBadge({ status }: { status: ContentStatus }) {
  const meta = CONTENT_STATUS_LABELS[status];
  if (!meta) {
    // Nilai tak dikenal (mis. dari data lama): tampilkan apa adanya, netral.
    return <StatusBadge status={String(status)} variant="neutral" />;
  }
  return <StatusBadge status={meta.label} variant={meta.badgeVariant} />;
}

/**
 * Opsi filter status berlabel Indonesia. Nilai filter tetap berupa enum, jadi
 * logika pemfilteran di DataTable tidak berubah; hanya teks opsinya.
 */
export function contentStatusFilterOptions(
  statuses: ContentStatus[]
): FilterOption[] {
  return statuses.map((status) => ({
    label: contentStatusLabel(status),
    value: status,
  }));
}
