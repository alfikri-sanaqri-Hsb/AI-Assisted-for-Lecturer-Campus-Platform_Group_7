import { questionBankRepository } from "@/repositories";
import type { QuestionBankItem, DuplicateDetectionResult } from "@/types";

/**
 * Normalisasi teks untuk analisis kemiripan:
 * Menghapus tanda baca, angka penomor, spasi berlebih, dan mengubah ke huruf kecil.
 */
function normalizeText(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2);
}

/**
 * Menghitung koefisien kemiripan Jaccard antara dua kumpulan token kata.
 */
function calculateJaccardSimilarity(tokensA: string[], tokensB: string[]): number {
  if (tokensA.length === 0 || tokensB.length === 0) return 0;
  const setA = new Set(tokensA);
  const setB = new Set(tokensB);

  let intersectionCount = 0;
  setA.forEach((token) => {
    if (setB.has(token)) intersectionCount++;
  });

  const unionCount = new Set([...setA, ...setB]).size;
  if (unionCount === 0) return 0;

  return Math.round((intersectionCount / unionCount) * 100);
}

export class QuestionBankService {
  /**
   * Menjalankan analisis kemiripan naskah soal terhadap repositori soal
   * (khususnya soal-soal yang sebelumnya DITOLAK atau sudah terdaftar).
   */
  async checkDuplication(
    questionText: string,
    topic: string,
    excludeId?: string
  ): Promise<DuplicateDetectionResult> {
    const allQuestions = await questionBankRepository.getAll();
    const targetTokens = normalizeText(`${topic} ${questionText}`);

    let highestScore = 0;
    let matchedItem: QuestionBankItem | null = null;
    let isMatchWithRejected = false;

    for (const q of allQuestions) {
      if (q.id === excludeId) continue;

      const itemTokens = normalizeText(`${q.topic} ${q.questionText}`);
      const score = calculateJaccardSimilarity(targetTokens, itemTokens);

      if (score > highestScore) {
        highestScore = score;
        matchedItem = q;
        isMatchWithRejected = q.status === "REJECTED";
      }
    }

    // Ambang batas kemiripan: >= 65% dianggap potensi duplikasi
    if (highestScore >= 65 && matchedItem) {
      return {
        isDuplicate: true,
        matchedWithId: matchedItem.id,
        matchedWithTitle: `${matchedItem.code} (${matchedItem.topic})`,
        similarityScore: highestScore,
        reason: isMatchWithRejected
          ? `Soal terdeteksi memiliki kemiripan tinggi (${highestScore}%) dengan soal yang sebelumnya DITOLAK (${matchedItem.code}). Sesuai aturan, soal ini tidak boleh dipublikasikan otomatis dan memerlukan verifikasi manual Admin.`
          : `Soal terdeteksi memiliki kemiripan struktur (${highestScore}%) dengan soal ${matchedItem.code}. Perlu verifikasi kebaruan butir soal.`,
      };
    }

    return {
      isDuplicate: false,
      similarityScore: highestScore,
      reason: "Struktur dan isi soal teridentifikasi unik berdasarkan basis data soal saat ini.",
    };
  }

  async getAllQuestions(): Promise<QuestionBankItem[]> {
    return questionBankRepository.getAll();
  }

  async getQuestionsByMentor(mentorId: string): Promise<QuestionBankItem[]> {
    return questionBankRepository.getByAuthorId(mentorId);
  }

  async getQuestionById(id: string): Promise<QuestionBankItem | null> {
    return questionBankRepository.getById(id);
  }

  /**
   * Membuat draf soal baru (Kewenangan Mentor).
   */
  async createQuestion(
    data: Omit<QuestionBankItem, "id" | "history" | "createdAt" | "updatedAt" | "duplicateFlag">,
    requesterRole: "admin" | "mentor"
  ): Promise<QuestionBankItem> {
    if (requesterRole !== "mentor") {
      throw new Error("Akses Ditolak: Pembuatan draf butir soal merupakan kewenangan Mentor/Tim Akademik.");
    }

    const dupCheck = await this.checkDuplication(data.questionText, data.topic);

    return questionBankRepository.create({
      ...data,
      duplicateFlag: dupCheck,
    });
  }

  /**
   * Mengedit draf soal (Kewenangan Mentor).
   * Aturan: Soal yang sudah PUBLISHED dilarang diedit langsung oleh Mentor!
   * Admin dilarang mengubah isi soal.
   */
  async updateQuestionContent(
    id: string,
    data: Partial<QuestionBankItem>,
    requesterRole: "admin" | "mentor",
    mentorId?: string
  ): Promise<QuestionBankItem> {
    if (requesterRole === "admin") {
      throw new Error("Akses Ditolak: Administrator dilarang mengedit isi naskah asli soal.");
    }

    const existing = await questionBankRepository.getById(id);
    if (!existing) throw new Error("Soal tidak ditemukan.");

    if (existing.authorId !== mentorId) {
      throw new Error("Akses Ditolak: Anda hanya berwenang mengedit soal yang Anda susun.");
    }

    if (existing.status === "PUBLISHED") {
      throw new Error("Akses Ditolak: Soal yang sudah terbit di aplikasi tidak boleh diedit langsung oleh Mentor.");
    }

    let dupCheck = existing.duplicateFlag;
    if (data.questionText || data.topic) {
      dupCheck = await this.checkDuplication(
        data.questionText || existing.questionText,
        data.topic || existing.topic,
        id
      );
    }

    return questionBankRepository.update(id, {
      ...data,
      duplicateFlag: dupCheck,
    });
  }

  /**
   * Mengajukan soal untuk diverifikasi Admin (Mentor).
   */
  async submitForReview(id: string, mentorName: string, mentorId: string): Promise<QuestionBankItem> {
    const existing = await questionBankRepository.getById(id);
    if (!existing) throw new Error("Soal tidak ditemukan.");
    if (existing.authorId !== mentorId) throw new Error("Akses Ditolak: Bukan penyusun soal.");

    return questionBankRepository.updateStatus(
      id,
      "SUBMITTED",
      { role: "MENTOR", name: mentorName },
      "Soal diajukan untuk verifikasi administrator."
    );
  }

  /**
   * Menyetujui soal (Admin).
   */
  async approveQuestion(id: string, adminName: string): Promise<QuestionBankItem> {
    const existing = await questionBankRepository.getById(id);
    if (!existing) throw new Error("Soal tidak ditemukan.");

    if (existing.duplicateFlag?.isDuplicate && existing.duplicateFlag.matchedWithId) {
      // Pastikan Admin sadar akan penandaan kemiripan
    }

    return questionBankRepository.updateStatus(
      id,
      "APPROVED",
      { role: "ADMIN", name: adminName },
      "Soal disetujui kurasi akademik."
    );
  }

  /**
   * Menerbitkan soal ke Bank Soal publik (Admin).
   */
  async publishQuestion(id: string, adminName: string): Promise<QuestionBankItem> {
    return questionBankRepository.updateStatus(
      id,
      "PUBLISHED",
      { role: "ADMIN", name: adminName },
      "Soal diterbitkan ke platform aktif."
    );
  }

  /**
   * Menolak soal dengan catatan/alasan wajib (Admin).
   */
  async rejectQuestion(id: string, adminName: string, reason: string): Promise<QuestionBankItem> {
    if (!reason || reason.trim() === "") {
      throw new Error("Alasan penolakan soal wajib diisi.");
    }
    return questionBankRepository.updateStatus(
      id,
      "REJECTED",
      { role: "ADMIN", name: adminName },
      reason
    );
  }

  /**
   * Menonaktifkan soal yang telah terbit tanpa menghapus naskah asli (Admin).
   */
  async deactivateQuestion(id: string, adminName: string, reason: string): Promise<QuestionBankItem> {
    return questionBankRepository.updateStatus(
      id,
      "DEACTIVATED",
      { role: "ADMIN", name: adminName },
      reason || "Soal dinonaktifkan sementara dari paket aktif."
    );
  }

  /**
   * Menghapus draf atau soal yang ditolak (Mentor).
   */
  async deleteQuestion(id: string, requesterRole: "admin" | "mentor", mentorId?: string): Promise<boolean> {
    const existing = await questionBankRepository.getById(id);
    if (!existing) return false;

    if (requesterRole === "mentor") {
      if (existing.authorId !== mentorId) {
        throw new Error("Akses Ditolak: Hanya boleh menghapus soal yang Anda buat.");
      }
      if (existing.status !== "DRAFT" && existing.status !== "REJECTED") {
        throw new Error("Akses Ditolak: Hanya soal berstatus Draf atau Ditolak yang dapat dihapus oleh Mentor.");
      }
    }

    return questionBankRepository.delete(id);
  }
}

export const questionBankService = new QuestionBankService();
