import { mentorRepository } from "@/repositories";
import type { Mentor, MentorPermissions, MentorStatus } from "@/types";

export class MentorService {
  /**
   * Mengambil seluruh daftar mentor (Kewenangan Admin).
   */
  async getAllMentors(): Promise<Mentor[]> {
    return mentorRepository.getAll();
  }

  /**
   * Mengambil detail mentor berdasarkan ID.
   */
  async getMentorById(id: string): Promise<Mentor | null> {
    return mentorRepository.getById(id);
  }

  /**
   * Menambahkan data mentor baru (Hanya Admin).
   */
  async createMentor(
    data: Omit<Mentor, "id" | "joinedAt">,
    requesterRole: "admin" | "mentor"
  ): Promise<Mentor> {
    if (requesterRole !== "admin") {
      throw new Error("Akses Ditolak: Hanya Administrator yang berwenang menambahkan mentor.");
    }
    return mentorRepository.create(data);
  }

  /**
   * Memperbarui informasi mentor (Hanya Admin).
   */
  async updateMentor(
    id: string,
    data: Partial<Mentor>,
    requesterRole: "admin" | "mentor"
  ): Promise<Mentor> {
    if (requesterRole !== "admin") {
      throw new Error("Akses Ditolak: Hanya Administrator yang berwenang mengubah profil umum mentor.");
    }
    return mentorRepository.update(id, data);
  }

  /**
   * Mengelola status aktif / verifikasi / cuti mentor (Hanya Admin).
   */
  async updateMentorStatus(
    id: string,
    status: MentorStatus,
    requesterRole: "admin" | "mentor"
  ): Promise<Mentor> {
    if (requesterRole !== "admin") {
      throw new Error("Akses Ditolak: Hanya Administrator yang dapat mengubah status mentor.");
    }
    return mentorRepository.update(id, { status });
  }

  /**
   * Mengatur kewenangan dan izin pembuatan konten mentor (Hanya Admin).
   */
  async updateMentorPermissions(
    id: string,
    permissions: MentorPermissions,
    requesterRole: "admin" | "mentor"
  ): Promise<Mentor> {
    if (requesterRole !== "admin") {
      throw new Error("Akses Ditolak: Hanya Administrator yang berwenang mengatur kewenangan mentor.");
    }
    return mentorRepository.updatePermissions(id, permissions);
  }

  /**
   * Menghapus mentor (Hanya Admin).
   */
  async deleteMentor(id: string, requesterRole: "admin" | "mentor"): Promise<boolean> {
    if (requesterRole !== "admin") {
      throw new Error("Akses Ditolak: Hanya Administrator yang berwenang menghapus mentor.");
    }
    return mentorRepository.delete(id);
  }
}

export const mentorService = new MentorService();
