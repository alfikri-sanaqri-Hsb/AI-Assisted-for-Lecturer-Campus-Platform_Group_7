import type { ContentStatus, ContentAuditTrail } from "./content";

export type MaterialFormat =
  | "Modul Ringkasan"
  | "Paket Latihan Soal"
  | "Pembahasan Video"
  | "E-Book Teori";

export interface LearningMaterial {
  id: string;
  title: string;
  subtest: string;
  format: MaterialFormat;
  content: string;
  summary: string;
  authorId: string;
  authorName: string;
  status: ContentStatus;
  rejectionReason?: string;
  isActive: boolean;
  totalAccess: number;
  history: ContentAuditTrail[];
  createdAt: string;
  updatedAt: string;
}
