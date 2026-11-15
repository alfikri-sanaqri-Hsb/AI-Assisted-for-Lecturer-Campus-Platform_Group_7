import type { ContentStatus, ContentAuditTrail } from "./content";

export type QuestionDifficulty = "Mudah" | "Sedang" | "Sukar";

export interface QuestionOption {
  key: "A" | "B" | "C" | "D" | "E";
  text: string;
  imageUrl?: string;
}

export interface DuplicateDetectionResult {
  isDuplicate: boolean;
  matchedWithId?: string;
  matchedWithTitle?: string;
  similarityScore: number;
  reason: string;
}

export interface QuestionBankItem {
  id: string;
  code: string;
  subtest: string;
  topic: string;
  difficulty: QuestionDifficulty;
  questionText: string;
  imageUrl?: string;
  options: QuestionOption[];
  correctAnswer: "A" | "B" | "C" | "D" | "E";
  explanation: string;
  authorId: string;
  authorName: string;
  status: ContentStatus;
  rejectionReason?: string;
  isActive: boolean;
  duplicateFlag?: DuplicateDetectionResult;
  history: ContentAuditTrail[];
  createdAt: string;
  updatedAt: string;
}
