export type ScheduleType =
  | "Sesi Mentoring"
  | "Kelas Akademik"
  | "Briefing Mentor"
  | "Simulasi Tryout";

export type ScheduleStatus =
  | "Terjadwal"
  | "Berlangsung"
  | "Selesai"
  | "Dibatalkan";

export interface ScheduleItem {
  id: string;
  title: string;
  type: ScheduleType;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  mentorId: string;
  mentorName: string;
  studentIds?: string[];
  studentNames?: string[];
  platform: "Zoom" | "Google Meet" | "Aplikasi Internal";
  meetUrl?: string;
  status: ScheduleStatus;
  notes?: string;
  managedByAdmin: boolean;
  createdAt: string;
}
