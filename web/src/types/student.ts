export type StudentStatus = "Aktif" | "Nonaktif" | "Menunggu Aktivasi";

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  grade: string;
  school: string;
  targetMajor: string;
  targetCampus: string;
  status: StudentStatus;
  tryoutCount: number;
  avgScore: number;
  joinedAt: string;
  assignedMentorId?: string;
  assignedMentorName?: string;
  lastActive?: string;
  notes?: string;
}
