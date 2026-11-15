import { settingsRepository, auditRepository } from "@/repositories";
import type { AdminSettings, MentorProfile, AuditLog } from "@/types";

export class SettingsService {
  async getAdminSettings(): Promise<AdminSettings> {
    return settingsRepository.getSettings();
  }

  async updateAdminSettings(
    data: Partial<AdminSettings>,
    requesterRole: "admin" | "mentor"
  ): Promise<AdminSettings> {
    if (requesterRole !== "admin") {
      throw new Error("Akses Ditolak: Hanya Administrator yang berwenang mengubah pengaturan sistem.");
    }
    return settingsRepository.updateSettings(data);
  }

  async getMentorProfile(mentorId: string): Promise<MentorProfile> {
    return settingsRepository.getMentorProfile(mentorId);
  }

  async updateMentorProfile(
    mentorId: string,
    data: Partial<MentorProfile>,
    requesterRole: "admin" | "mentor"
  ): Promise<MentorProfile> {
    if (requesterRole !== "mentor") {
      throw new Error("Akses Ditolak: Hanya Mentor terkait yang dapat memperbarui profilnya.");
    }
    return settingsRepository.updateMentorProfile(mentorId, data);
  }

  async getAuditLogs(): Promise<AuditLog[]> {
    return auditRepository.getAll();
  }
}

export const settingsService = new SettingsService();
