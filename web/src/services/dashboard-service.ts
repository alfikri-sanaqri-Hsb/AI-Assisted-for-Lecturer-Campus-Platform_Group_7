import {
  studentRepository,
  mentorRepository,
  materialRepository,
  questionBankRepository,
  tryoutRepository,
  scheduleRepository,
  auditRepository,
} from "@/repositories";
import type { AuditLog, ScheduleItem } from "@/types";

export interface AdminDashboardData {
  totalStudents: number;
  activeStudents: number;
  inactiveStudents: number;
  totalMentors: number;
  activeMentors: number;
  pendingReviewsCount: number;
  publishedContentCount: number;
  rejectedContentCount: number;
  totalTryouts: number;
  upcomingSchedules: ScheduleItem[];
  recentActivities: AuditLog[];
}

export interface MentorDashboardData {
  assignedStudentsCount: number;
  ownMaterialsCount: number;
  ownQuestionsCount: number;
  ownTryoutsCount: number;
  pendingReviewCount: number;
  publishedCount: number;
  needsRevisionCount: number;
  upcomingSchedules: ScheduleItem[];
  recentActivities: AuditLog[];
}

export class DashboardService {
  /**
   * Mengambil metrik operasional riil Admin langsung dari repository (bukan angka palsu).
   */
  async getAdminDashboardMetrics(): Promise<AdminDashboardData> {
    const [
      students,
      mentors,
      materials,
      questions,
      tryouts,
      schedules,
      auditLogs,
    ] = await Promise.all([
      studentRepository.getAll(),
      mentorRepository.getAll(),
      materialRepository.getAll(),
      questionBankRepository.getAll(),
      tryoutRepository.getAll(),
      scheduleRepository.getAll(),
      auditRepository.getAll(),
    ]);

    const activeStudents = students.filter((s) => s.status === "Aktif").length;
    const inactiveStudents = students.filter((s) => s.status !== "Aktif").length;
    const activeMentors = mentors.filter((m) => m.status === "Aktif").length;

    const allContent = [...materials, ...questions, ...tryouts];
    const pendingReviewsCount = allContent.filter((c) => c.status === "SUBMITTED").length;
    const publishedContentCount = allContent.filter((c) => c.status === "PUBLISHED").length;
    const rejectedContentCount = allContent.filter((c) => c.status === "REJECTED").length;

    const upcomingSchedules = schedules
      .filter((s) => s.status === "Terjadwal")
      .slice(0, 5);

    return {
      totalStudents: students.length,
      activeStudents,
      inactiveStudents,
      totalMentors: mentors.length,
      activeMentors,
      pendingReviewsCount,
      publishedContentCount,
      rejectedContentCount,
      totalTryouts: tryouts.length,
      upcomingSchedules,
      recentActivities: auditLogs.slice(0, 8),
    };
  }

  /**
   * Mengambil ringkasan beban bimbingan dan kurasi naskah untuk Mentor tertentu.
   */
  async getMentorDashboardMetrics(mentorId: string): Promise<MentorDashboardData> {
    const [
      students,
      materials,
      questions,
      tryouts,
      schedules,
      auditLogs,
    ] = await Promise.all([
      studentRepository.getByMentorId(mentorId),
      materialRepository.getByAuthorId(mentorId),
      questionBankRepository.getByAuthorId(mentorId),
      tryoutRepository.getByAuthorId(mentorId),
      scheduleRepository.getByMentorId(mentorId),
      auditRepository.getAll(),
    ]);

    const ownContent = [...materials, ...questions, ...tryouts];
    const pendingReviewCount = ownContent.filter((c) => c.status === "SUBMITTED").length;
    const publishedCount = ownContent.filter((c) => c.status === "PUBLISHED").length;
    const needsRevisionCount = ownContent.filter((c) => c.status === "REJECTED").length;

    const upcomingSchedules = schedules
      .filter((s) => s.status === "Terjadwal")
      .slice(0, 5);

    return {
      assignedStudentsCount: students.length,
      ownMaterialsCount: materials.length,
      ownQuestionsCount: questions.length,
      ownTryoutsCount: tryouts.length,
      pendingReviewCount,
      publishedCount,
      needsRevisionCount,
      upcomingSchedules,
      recentActivities: auditLogs.slice(0, 6),
    };
  }
}

export const dashboardService = new DashboardService();
