export type ContentStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "APPROVED"
  | "REJECTED"
  | "PUBLISHED"
  | "DEACTIVATED";

export type ContentType = "MATERI" | "BANK_SOAL" | "PAKET_TRYOUT";

export interface ContentAuditTrail {
  id: string;
  timestamp: string;
  actorRole: "ADMIN" | "MENTOR";
  actorName: string;
  action: string;
  previousStatus?: ContentStatus;
  newStatus: ContentStatus;
  notes?: string;
}

export const CONTENT_STATUS_LABELS: Record<ContentStatus, { label: string; badgeVariant: "neutral" | "brand" | "success" | "warning" | "danger" | "muted" }> = {
  DRAFT: { label: "Draf", badgeVariant: "neutral" },
  SUBMITTED: { label: "Menunggu Verifikasi", badgeVariant: "warning" },
  APPROVED: { label: "Disetujui", badgeVariant: "brand" },
  REJECTED: { label: "Ditolak", badgeVariant: "danger" },
  PUBLISHED: { label: "Diterbitkan", badgeVariant: "success" },
  DEACTIVATED: { label: "Dinonaktifkan", badgeVariant: "muted" },
};
