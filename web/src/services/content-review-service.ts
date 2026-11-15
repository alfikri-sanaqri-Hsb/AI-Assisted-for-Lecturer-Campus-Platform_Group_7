import {
  materialRepository,
  questionBankRepository,
  tryoutRepository,
} from "@/repositories";
import type { ContentStatus, ContentType, ContentAuditTrail } from "@/types";

export interface UnifiedReviewItem {
  id: string;
  originalId: string;
  title: string;
  contentType: ContentType;
  subtest: string;
  author: string;
  submissionDate: string;
  status: ContentStatus;
  summary: string;
  rejectionReason?: string;
  history: ContentAuditTrail[];
  details?: Record<string, string | number | boolean>;
}

export class ContentReviewService {
  /**
   * Mengumpulkan semua konten akademik dari materi, bank soal, dan paket tryout
   * ke dalam format seragam untuk antrean kurasi Admin.
   */
  async getUnifiedReviewItems(): Promise<UnifiedReviewItem[]> {
    const [materials, questions, tryouts] = await Promise.all([
      materialRepository.getAll(),
      questionBankRepository.getAll(),
      tryoutRepository.getAll(),
    ]);

    const reviewItems: UnifiedReviewItem[] = [];

    materials.forEach((m) => {
      reviewItems.push({
        id: `rev-mat-${m.id}`,
        originalId: m.id,
        title: m.title,
        contentType: "MATERI",
        subtest: m.subtest,
        author: m.authorName,
        submissionDate: m.updatedAt,
        status: m.status,
        summary: m.summary || m.content.slice(0, 100),
        rejectionReason: m.rejectionReason,
        history: m.history,
        details: {
          Format: m.format,
          "Total Akses": `${m.totalAccess}x`,
          "Status Aktif": m.isActive ? "Aktif" : "Nonaktif",
        },
      });
    });

    questions.forEach((q) => {
      reviewItems.push({
        id: `rev-q-${q.id}`,
        originalId: q.id,
        title: `${q.code}: ${q.topic}`,
        contentType: "BANK_SOAL",
        subtest: q.subtest,
        author: q.authorName,
        submissionDate: q.updatedAt,
        status: q.status,
        summary: q.questionText,
        rejectionReason: q.rejectionReason,
        history: q.history,
        details: {
          Kode: q.code,
          Tingkat: q.difficulty,
          "Kunci Jawaban": q.correctAnswer,
          "Kemiripan Duplikasi": q.duplicateFlag ? `${q.duplicateFlag.similarityScore}% (${q.duplicateFlag.isDuplicate ? "Potensi Duplikasi" : "Unik"})` : "Belum Dicek",
        },
      });
    });

    tryouts.forEach((t) => {
      reviewItems.push({
        id: `rev-to-${t.id}`,
        originalId: t.id,
        title: t.title,
        contentType: "PAKET_TRYOUT",
        subtest: "Semua Subtes UTBK",
        author: t.authorName,
        submissionDate: t.updatedAt,
        status: t.status,
        summary: t.description,
        rejectionReason: t.rejectionReason,
        history: t.history,
        details: {
          Target: t.targetBatch,
          Durasi: `${t.durationMinutes} Menit`,
          "Total Soal": `${t.totalQuestions} Butir`,
          "Permohonan Penarikan": t.withdrawalRequested ? `Ya: ${t.withdrawalReason}` : "Tidak",
        },
      });
    });

    return reviewItems;
  }

  /**
   * Menyetujui konten (Hanya Admin).
   */
  async approveItem(
    item: UnifiedReviewItem,
    adminName: string
  ): Promise<void> {
    if (item.contentType === "MATERI") {
      await materialRepository.updateStatus(
        item.originalId,
        "APPROVED",
        { role: "ADMIN", name: adminName },
        "Materi lolos kurasi naskah."
      );
    } else if (item.contentType === "BANK_SOAL") {
      await questionBankRepository.updateStatus(
        item.originalId,
        "APPROVED",
        { role: "ADMIN", name: adminName },
        "Soal disetujui untuk dimasukkan ke Bank Soal."
      );
    } else if (item.contentType === "PAKET_TRYOUT") {
      await tryoutRepository.updateStatus(
        item.originalId,
        "APPROVED",
        { role: "ADMIN", name: adminName },
        "Paket tryout disetujui kurikulum."
      );
    }
  }

  /**
   * Menerbitkan konten yang disetujui (Hanya Admin).
   */
  async publishItem(
    item: UnifiedReviewItem,
    adminName: string
  ): Promise<void> {
    if (item.contentType === "MATERI") {
      await materialRepository.updateStatus(
        item.originalId,
        "PUBLISHED",
        { role: "ADMIN", name: adminName },
        "Materi diterbitkan untuk siswa."
      );
    } else if (item.contentType === "BANK_SOAL") {
      await questionBankRepository.updateStatus(
        item.originalId,
        "PUBLISHED",
        { role: "ADMIN", name: adminName },
        "Soal dipublikasikan ke aplikasi."
      );
    } else if (item.contentType === "PAKET_TRYOUT") {
      await tryoutRepository.updateStatus(
        item.originalId,
        "PUBLISHED",
        { role: "ADMIN", name: adminName },
        "Paket tryout diterbitkan."
      );
    }
  }

  /**
   * Menolak konten dengan alasan wajib (Hanya Admin).
   */
  async rejectItem(
    item: UnifiedReviewItem,
    adminName: string,
    reason: string
  ): Promise<void> {
    if (!reason || reason.trim() === "") {
      throw new Error("Alasan penolakan konten wajib dicantumkan agar mentor dapat memperbaikinya.");
    }

    if (item.contentType === "MATERI") {
      await materialRepository.updateStatus(
        item.originalId,
        "REJECTED",
        { role: "ADMIN", name: adminName },
        reason
      );
    } else if (item.contentType === "BANK_SOAL") {
      await questionBankRepository.updateStatus(
        item.originalId,
        "REJECTED",
        { role: "ADMIN", name: adminName },
        reason
      );
    } else if (item.contentType === "PAKET_TRYOUT") {
      await tryoutRepository.updateStatus(
        item.originalId,
        "REJECTED",
        { role: "ADMIN", name: adminName },
        reason
      );
    }
  }

  /**
   * Menonaktifkan konten yang sudah terbit tanpa mengubah naskah asli (Hanya Admin).
   */
  async deactivateItem(
    item: UnifiedReviewItem,
    adminName: string,
    reason: string
  ): Promise<void> {
    const note = reason || "Konten dinonaktifkan sementara dari akses publik.";
    if (item.contentType === "MATERI") {
      await materialRepository.updateStatus(
        item.originalId,
        "DEACTIVATED",
        { role: "ADMIN", name: adminName },
        note
      );
    } else if (item.contentType === "BANK_SOAL") {
      await questionBankRepository.updateStatus(
        item.originalId,
        "DEACTIVATED",
        { role: "ADMIN", name: adminName },
        note
      );
    } else if (item.contentType === "PAKET_TRYOUT") {
      await tryoutRepository.updateStatus(
        item.originalId,
        "DEACTIVATED",
        { role: "ADMIN", name: adminName },
        note
      );
    }
  }
}

export const contentReviewService = new ContentReviewService();
