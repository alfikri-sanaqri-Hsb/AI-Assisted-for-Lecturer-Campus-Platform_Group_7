import type { ContentStatus, ContentAuditTrail } from "./content";

export interface TryoutSubtestDetail {
  name: string;
  questionCount: number;
  durationMinutes: number;
}

export interface TryoutPackage {
  id: string;
  title: string;
  description: string;
  targetBatch: string;
  durationMinutes: number;
  totalQuestions: number;
  subtests: TryoutSubtestDetail[];
  questionIds: string[];
  authorId: string;
  authorName: string;
  status: ContentStatus;
  rejectionReason?: string;
  isActive: boolean;
  withdrawalRequested?: boolean;
  withdrawalReason?: string;
  history: ContentAuditTrail[];
  createdAt: string;
  updatedAt: string;
}
