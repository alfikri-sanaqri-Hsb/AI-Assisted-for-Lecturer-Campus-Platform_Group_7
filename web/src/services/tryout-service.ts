import { tryoutRepository } from "@/repositories";
import type { TryoutPackage } from "@/types";

export class TryoutService {
  async getAllTryouts(): Promise<TryoutPackage[]> {
    return tryoutRepository.getAll();
  }

  async getTryoutsByMentor(mentorId: string): Promise<TryoutPackage[]> {
    return tryoutRepository.getByAuthorId(mentorId);
  }

  async getTryoutById(id: string): Promise<TryoutPackage | null> {
    return tryoutRepository.getById(id);
  }

  /**
   * Membuat paket tryout baru (Kewenangan Mentor).
   */
  async createTryoutPackage(
    data: Omit<TryoutPackage, "id" | "history" | "createdAt" | "updatedAt">,
    requesterRole: "admin" | "mentor"
  ): Promise<TryoutPackage> {
    if (requesterRole !== "mentor") {
      throw new Error("Akses Ditolak: Pembuatan paket TryOut merupakan kewenangan Mentor/Tim Akademik.");
    }
    return tryoutRepository.create(data);
  }

  /**
   * Mengedit paket tryout sebelum terbit (Kewenangan Mentor).
   * Aturan: Paket yang SUDAH DITERBITKAN tidak boleh diedit langsung oleh Mentor!
   */
  async updateTryoutContent(
    id: string,
    data: Partial<TryoutPackage>,
    requesterRole: "admin" | "mentor",
    mentorId?: string
  ): Promise<TryoutPackage> {
    if (requesterRole === "admin") {
      throw new Error("Akses Ditolak: Administrator tidak mengedit komposisi isi naskah paket akademik.");
    }

    const existing = await tryoutRepository.getById(id);
    if (!existing) throw new Error("Paket TryOut tidak ditemukan.");

    if (existing.authorId !== mentorId) {
      throw new Error("Akses Ditolak: Anda hanya berwenang mengedit paket yang Anda susun.");
    }

    if (existing.status === "PUBLISHED") {
      throw new Error("Akses Ditolak: Paket yang sudah diterbitkan tidak boleh diedit langsung oleh Mentor. Ajukan penarikan kepada Admin.");
    }

    return tryoutRepository.update(id, data);
  }

  /**
   * Mengajukan permohonan penarikan paket terbit kepada Admin (Mentor).
   */
  async requestWithdrawal(id: string, mentorId: string, reason: string): Promise<TryoutPackage> {
    const existing = await tryoutRepository.getById(id);
    if (!existing) throw new Error("Paket TryOut tidak ditemukan.");
    if (existing.authorId !== mentorId) throw new Error("Akses Ditolak: Bukan penyusun paket ini.");
    if (!reason || reason.trim() === "") throw new Error("Alasan permohonan penarikan paket wajib diisi.");

    return tryoutRepository.requestWithdrawal(id, reason);
  }

  /**
   * Mengajukan paket untuk verifikasi Admin (Mentor).
   */
  async submitForReview(id: string, mentorName: string, mentorId: string): Promise<TryoutPackage> {
    const existing = await tryoutRepository.getById(id);
    if (!existing) throw new Error("Paket TryOut tidak ditemukan.");
    if (existing.authorId !== mentorId) throw new Error("Akses Ditolak: Bukan penyusun paket.");

    return tryoutRepository.updateStatus(
      id,
      "SUBMITTED",
      { role: "MENTOR", name: mentorName },
      "Paket tryout diajukan untuk verifikasi kurikulum."
    );
  }

  /**
   * Menyetujui paket tryout (Admin).
   */
  async approveTryout(id: string, adminName: string): Promise<TryoutPackage> {
    return tryoutRepository.updateStatus(
      id,
      "APPROVED",
      { role: "ADMIN", name: adminName },
      "Paket tryout disetujui kurasi."
    );
  }

  /**
   * Menerbitkan paket tryout ke jadwal ujian siswa (Admin).
   */
  async publishTryout(id: string, adminName: string): Promise<TryoutPackage> {
    return tryoutRepository.updateStatus(
      id,
      "PUBLISHED",
      { role: "ADMIN", name: adminName },
      "Paket tryout resmi diterbitkan untuk jadwal simulasi UTBK."
    );
  }

  /**
   * Menolak paket tryout dengan alasan wajib (Admin).
   */
  async rejectTryout(id: string, adminName: string, reason: string): Promise<TryoutPackage> {
    if (!reason || reason.trim() === "") throw new Error("Alasan penolakan paket wajib disertakan.");
    return tryoutRepository.updateStatus(
      id,
      "REJECTED",
      { role: "ADMIN", name: adminName },
      reason
    );
  }

  /**
   * Menonaktifkan paket tryout yang telah terbit (Admin).
   */
  async deactivateTryout(id: string, adminName: string, reason: string): Promise<TryoutPackage> {
    return tryoutRepository.updateStatus(
      id,
      "DEACTIVATED",
      { role: "ADMIN", name: adminName },
      reason || "Paket tryout dinonaktifkan dari jadwal aktif."
    );
  }

  /**
   * Menghapus paket (Hanya diperbolehkan untuk draf atau paket ditolak).
   */
  async deleteTryout(id: string, requesterRole: "admin" | "mentor", mentorId?: string): Promise<boolean> {
    const existing = await tryoutRepository.getById(id);
    if (!existing) return false;

    if (requesterRole === "mentor") {
      if (existing.authorId !== mentorId) {
        throw new Error("Akses Ditolak: Hanya boleh menghapus paket buatan sendiri.");
      }
      if (existing.status !== "DRAFT" && existing.status !== "REJECTED") {
        throw new Error("Akses Ditolak: Hanya paket berstatus Draft atau Ditolak yang dapat dihapus oleh Mentor.");
      }
    }

    return tryoutRepository.delete(id);
  }
}

export const tryoutService = new TryoutService();
