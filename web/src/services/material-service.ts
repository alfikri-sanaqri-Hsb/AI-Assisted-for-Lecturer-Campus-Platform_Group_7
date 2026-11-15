import { materialRepository } from "@/repositories";
import type { LearningMaterial } from "@/types";

export class MaterialService {
  /**
   * Mengambil semua materi (Admin melihat semua).
   */
  async getAllMaterials(): Promise<LearningMaterial[]> {
    return materialRepository.getAll();
  }

  /**
   * Mengambil materi milik mentor tertentu (Mentor hanya melihat materi buatannya).
   */
  async getMaterialsByMentor(mentorId: string): Promise<LearningMaterial[]> {
    return materialRepository.getByAuthorId(mentorId);
  }

  /**
   * Mengambil detail materi.
   */
  async getMaterialById(id: string): Promise<LearningMaterial | null> {
    return materialRepository.getById(id);
  }

  /**
   * Membuat materi pembelajaran baru (Kewenangan Mentor).
   */
  async createMaterial(
    data: Omit<LearningMaterial, "id" | "history" | "createdAt" | "updatedAt">,
    requesterRole: "admin" | "mentor"
  ): Promise<LearningMaterial> {
    if (requesterRole !== "mentor") {
      throw new Error("Akses Ditolak: Pembuatan materi baru merupakan kewenangan Mentor/Tim Akademik.");
    }
    return materialRepository.create(data);
  }

  /**
   * Mengedit materi pembelajaran (Kewenangan Mentor).
   * Aturan: Konten yang sudah TERBIT (PUBLISHED) tidak boleh diedit langsung oleh Mentor!
   * Admin dilarang mengubah isi naskah asli materi.
   */
  async updateMaterialContent(
    id: string,
    data: Partial<LearningMaterial>,
    requesterRole: "admin" | "mentor",
    mentorId?: string
  ): Promise<LearningMaterial> {
    if (requesterRole === "admin") {
      throw new Error("Akses Ditolak: Administrator dilarang mengedit isi materi asli akademik.");
    }

    const existing = await materialRepository.getById(id);
    if (!existing) {
      throw new Error("Materi tidak ditemukan.");
    }

    if (existing.authorId !== mentorId) {
      throw new Error("Akses Ditolak: Anda hanya dapat mengedit materi yang Anda susun.");
    }

    if (existing.status === "PUBLISHED") {
      throw new Error("Akses Ditolak: Materi yang sudah diterbitkan tidak boleh diedit langsung. Ajukan penarikan atau revisi melalui Admin.");
    }

    return materialRepository.update(id, data);
  }

  /**
   * Mengajukan materi untuk ditinjau Admin (Mentor).
   */
  async submitForReview(
    id: string,
    mentorName: string,
    mentorId: string
  ): Promise<LearningMaterial> {
    const existing = await materialRepository.getById(id);
    if (!existing) throw new Error("Materi tidak ditemukan.");
    if (existing.authorId !== mentorId) throw new Error("Akses Ditolak: Bukan pemilik materi.");

    return materialRepository.updateStatus(
      id,
      "SUBMITTED",
      { role: "MENTOR", name: mentorName },
      "Materi diajukan oleh mentor untuk diverifikasi admin."
    );
  }

  /**
   * Menyetujui materi (Admin).
   */
  async approveMaterial(id: string, adminName: string): Promise<LearningMaterial> {
    return materialRepository.updateStatus(
      id,
      "APPROVED",
      { role: "ADMIN", name: adminName },
      "Materi disetujui untuk diterbitkan."
    );
  }

  /**
   * Menerbitkan materi ke aplikasi siswa (Admin).
   */
  async publishMaterial(id: string, adminName: string): Promise<LearningMaterial> {
    return materialRepository.updateStatus(
      id,
      "PUBLISHED",
      { role: "ADMIN", name: adminName },
      "Materi dipublikasikan ke siswa."
    );
  }

  /**
   * Menolak materi dengan alasan wajib (Admin).
   */
  async rejectMaterial(
    id: string,
    adminName: string,
    reason: string
  ): Promise<LearningMaterial> {
    if (!reason || reason.trim() === "") {
      throw new Error("Alasan penolakan materi wajib disertakan.");
    }
    return materialRepository.updateStatus(
      id,
      "REJECTED",
      { role: "ADMIN", name: adminName },
      reason
    );
  }

  /**
   * Menonaktifkan materi yang sudah terbit tanpa mengubah isi aslinya (Admin).
   */
  async deactivateMaterial(
    id: string,
    adminName: string,
    reason: string
  ): Promise<LearningMaterial> {
    return materialRepository.updateStatus(
      id,
      "DEACTIVATED",
      { role: "ADMIN", name: adminName },
      reason || "Materi dinonaktifkan sementara dari akses publik."
    );
  }

  /**
   * Menghapus materi (Mentor hanya boleh menghapus materi miliknya yang berstatus DRAFT atau REJECTED).
   */
  async deleteMaterial(
    id: string,
    requesterRole: "admin" | "mentor",
    mentorId?: string
  ): Promise<boolean> {
    const existing = await materialRepository.getById(id);
    if (!existing) return false;

    if (requesterRole === "mentor") {
      if (existing.authorId !== mentorId) {
        throw new Error("Akses Ditolak: Hanya boleh menghapus materi milik sendiri.");
      }
      if (existing.status !== "DRAFT" && existing.status !== "REJECTED") {
        throw new Error("Akses Ditolak: Hanya materi berstatus Draft atau Ditolak yang dapat dihapus oleh Mentor.");
      }
    }

    return materialRepository.delete(id);
  }
}

export const materialService = new MaterialService();
