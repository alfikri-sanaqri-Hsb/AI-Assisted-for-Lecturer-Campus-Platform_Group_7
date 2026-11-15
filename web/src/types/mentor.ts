export type MentorStatus = "Aktif" | "Menunggu Verifikasi" | "Cuti" | "Nonaktif";

export interface MentorPermissions {
  canCreateMaterials: boolean;
  canCreateQuestions: boolean;
  canCreateTryouts: boolean;
  canDirectPublish: boolean; // default false, must go through Admin verification
}

export interface Mentor {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  status: MentorStatus;
  assignedStudentsCount: number;
  materialsCount: number;
  questionsCount: number;
  tryoutsCount: number;
  rating: number;
  joinedAt: string;
  bio?: string;
  permissions: MentorPermissions;
}
