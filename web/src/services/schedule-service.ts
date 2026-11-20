import { scheduleRepository } from "@/repositories";
import type { ScheduleItem, ScheduleStatus } from "@/types";
import { validateScheduleSlot } from "@/lib/validation/schedule";

export class ScheduleService {
  /**
   * Mengambil seluruh jadwal platform (Kewenangan Admin).
   */
  async getAllSchedules(): Promise<ScheduleItem[]> {
    return scheduleRepository.getAll();
  }

  /**
   * Mengambil jadwal yang terhubung dengan mentor tertentu (Kewenangan Mentor).
   */
  async getSchedulesByMentor(mentorId: string): Promise<ScheduleItem[]> {
    return scheduleRepository.getByMentorId(mentorId);
  }

  /**
   * Mendeteksi potensi bentrok jadwal pada tanggal dan jam yang sama untuk mentor tertentu.
   */
  async checkConflicts(
    date: string,
    startTime: string,
    endTime: string,
    mentorId: string,
    excludeId?: string
  ): Promise<ScheduleItem[]> {
    return scheduleRepository.checkConflicts(date, startTime, endTime, mentorId, excludeId);
  }

  /**
   * Membuat jadwal baru (Hanya Admin).
   */
  async createSchedule(
    data: Omit<ScheduleItem, "id" | "createdAt">,
    requesterRole: "admin" | "mentor"
  ): Promise<ScheduleItem> {
    if (requesterRole !== "admin") {
      throw new Error("Akses Ditolak: Pengelolaan jadwal merupakan tanggung jawab Administrator sepenuhnya berdasarkan koordinasi dengan Mentor.");
    }

    // Validasi tanggal dan jam (aturan ditegakkan di service, bukan hanya di formulir)
    const slotError = validateScheduleSlot({
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
    });
    if (slotError) throw new Error(slotError);

    // Validasi bentrok jadwal
    const conflicts = await this.checkConflicts(data.date, data.startTime, data.endTime, data.mentorId);
    if (conflicts.length > 0) {
      const conflictTitles = conflicts.map((c) => `"${c.title}" (${c.startTime} - ${c.endTime})`).join(", ");
      throw new Error(`Peringatan Konflik Jadwal: Mentor telah memiliki agenda pada rentang waktu ini: ${conflictTitles}. Silakan sesuaikan jam atau pilih mentor lain.`);
    }

    return scheduleRepository.create(data);
  }

  /**
   * Mengedit jadwal (Hanya Admin).
   * Mentor dilarang mengubah jadwal yang telah ditetapkan Admin.
   */
  async updateSchedule(
    id: string,
    data: Partial<ScheduleItem>,
    requesterRole: "admin" | "mentor"
  ): Promise<ScheduleItem> {
    if (requesterRole !== "admin") {
      throw new Error("Akses Ditolak: Mentor tidak memiliki kewenangan mengubah jadwal yang ditetapkan Admin.");
    }

    const existing = await scheduleRepository.getById(id);
    if (!existing) throw new Error("Jadwal tidak ditemukan.");

    const mentorId = data.mentorId || existing.mentorId;
    const date = data.date || existing.date;
    const startTime = data.startTime || existing.startTime;
    const endTime = data.endTime || existing.endTime;

    // Validasi tanggal dan jam. Bila slot tidak berubah dari data lama, tidak
    // divalidasi ulang, supaya jadwal lama tetap bisa diedit (mis. statusnya).
    const slotError = validateScheduleSlot(
      { date, startTime, endTime },
      { date: existing.date, startTime: existing.startTime, endTime: existing.endTime }
    );
    if (slotError) throw new Error(slotError);

    if (data.startTime || data.endTime || data.date || data.mentorId) {
      const conflicts = await this.checkConflicts(date, startTime, endTime, mentorId, id);
      if (conflicts.length > 0) {
        const conflictTitles = conflicts.map((c) => `"${c.title}" (${c.startTime} - ${c.endTime})`).join(", ");
        throw new Error(`Peringatan Konflik Jadwal: Terdapat jadwal lain yang berbenturan: ${conflictTitles}.`);
      }
    }

    return scheduleRepository.update(id, data);
  }

  /**
   * Mengubah status jadwal (Hanya Admin).
   */
  async updateScheduleStatus(
    id: string,
    status: ScheduleStatus,
    requesterRole: "admin" | "mentor"
  ): Promise<ScheduleItem> {
    if (requesterRole !== "admin") {
      throw new Error("Akses Ditolak: Hanya Administrator yang berwenang memperbarui status jadwal.");
    }
    return scheduleRepository.update(id, { status });
  }

  /**
   * Menghapus jadwal (Hanya Admin).
   */
  async deleteSchedule(id: string, requesterRole: "admin" | "mentor"): Promise<boolean> {
    if (requesterRole !== "admin") {
      throw new Error("Akses Ditolak: Hanya Administrator yang dapat membatalkan atau menghapus jadwal.");
    }
    return scheduleRepository.delete(id);
  }
}

export const scheduleService = new ScheduleService();
