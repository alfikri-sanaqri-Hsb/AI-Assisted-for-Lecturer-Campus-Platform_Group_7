"use client";

import { useState, useEffect } from "react";
import { DataTable } from "@/components/ui/data-table/data-table";
import { StatusBadge } from "@/components/ui/data-table/status-badge";
import { GlassModal } from "@/components/ui/data-table/table-modal";
import { Icon } from "@/components/ui/icon";
import { questionBankService } from "@/services";
import type { QuestionBankItem, QuestionDifficulty, ContentStatus } from "@/types";
import type { ColumnDef, FormField } from "@/components/ui/data-table/types";

const ACTIVE_MENTOR_ID = "mnt-01"; // Dr. Hendra Gunawan
const ACTIVE_MENTOR_NAME = "Dr. Hendra Gunawan, M.Si.";

export function MentorQuestionAuthoring() {
  const [questions, setQuestions] = useState<QuestionBankItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal Detail & Kunci
  const [detailItem, setDetailItem] = useState<QuestionBankItem | null>(null);

  const loadData = async () => {
    try {
      const data = await questionBankService.getQuestionsByMentor(ACTIVE_MENTOR_ID);
      setQuestions(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmitForReview = async (id: string) => {
    await questionBankService.submitForReview(id, ACTIVE_MENTOR_NAME, ACTIVE_MENTOR_ID);
    loadData();
  };

  const columns: ColumnDef<QuestionBankItem>[] = [
    {
      key: "code",
      header: "Kode & Subtes",
      sortable: true,
      render: (row) => (
        <div>
          <span className="font-bold text-ink">{row.code}</span>
          <p className="text-xs text-brand-600 font-medium">{row.subtest}</p>
        </div>
      ),
    },
    {
      key: "topic",
      header: "Topik & Narasi Soal",
      sortable: true,
      render: (row) => (
        <div className="max-w-md">
          <p className="font-semibold text-ink line-clamp-1">{row.topic}</p>
          <p className="text-xs text-muted line-clamp-2 mt-0.5">{row.questionText}</p>
        </div>
      ),
    },
    {
      key: "difficulty",
      header: "Tingkat",
      sortable: true,
      render: (row) => (
        <span
          className={`inline-flex rounded-lg px-2 py-0.5 text-xs font-semibold ${
            row.difficulty === "Mudah"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : row.difficulty === "Sedang"
              ? "bg-amber-50 text-amber-700 border border-amber-200"
              : "bg-rose-50 text-rose-700 border border-rose-200"
          }`}
        >
          {row.difficulty}
        </span>
      ),
    },
    {
      key: "duplicateFlag",
      header: "Deteksi Kemiripan",
      render: (row) => {
        if (!row.duplicateFlag) return <span className="text-muted text-xs">-</span>;
        if (row.duplicateFlag.isDuplicate) {
          return (
            <span
              title={row.duplicateFlag.reason}
              className="inline-flex rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-700 border border-rose-200 animate-pulse"
            >
              ⚠️ {row.duplicateFlag.similarityScore}% Mirip
            </span>
          );
        }
        return (
          <span
            title={row.duplicateFlag.reason}
            className="inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200"
          >
            ✓ Unik ({row.duplicateFlag.similarityScore}%)
          </span>
        );
      },
    },
    {
      key: "status",
      header: "Status Soal",
      sortable: true,
      render: (row) => <StatusBadge status={row.status} />,
    },
  ];

  const formFields: FormField[] = [
    { name: "code", label: "Kode Butir Soal", type: "text", required: true, placeholder: "Contoh: SOAL-PK-010" },
    {
      name: "subtest",
      label: "Mata Uji Subtes",
      type: "select",
      required: true,
      options: [
        { label: "Penalaran Umum (PU)", value: "Penalaran Umum (PU)" },
        { label: "Pengetahuan Kuantitatif (PK)", value: "Pengetahuan Kuantitatif (PK)" },
        { label: "Pemahaman Bacaan & Menulis (PBM)", value: "Pemahaman Bacaan & Menulis (PBM)" },
        { label: "Pengetahuan & Pemahaman Umum (PPU)", value: "Pengetahuan & Pemahaman Umum (PPU)" },
        { label: "Literasi Bahasa Indonesia", value: "Literasi Bahasa Indonesia" },
        { label: "Literasi Bahasa Inggris", value: "Literasi Bahasa Inggris" },
        { label: "Penalaran Matematika (PM)", value: "Penalaran Matematika (PM)" },
      ],
      defaultValue: "Pengetahuan Kuantitatif (PK)",
    },
    { name: "topic", label: "Topik / Bab Materi", type: "text", required: true, placeholder: "Contoh: Fungsi Polinomial & Sisa Bagi" },
    {
      name: "difficulty",
      label: "Tingkat Kesulitan",
      type: "select",
      required: true,
      options: [
        { label: "Mudah", value: "Mudah" },
        { label: "Sedang", value: "Sedang" },
        { label: "Sukar", value: "Sukar" },
      ],
      defaultValue: "Sedang",
    },
    { name: "questionText", label: "Narasi Naskah Soal", type: "textarea", required: true, placeholder: "Tuliskan naskah butir soal secara lengkap..." },
    { name: "optA", label: "Pilihan Jawaban A", type: "text", required: true, placeholder: "Teks opsi A" },
    { name: "optB", label: "Pilihan Jawaban B", type: "text", required: true, placeholder: "Teks opsi B" },
    { name: "optC", label: "Pilihan Jawaban C", type: "text", required: true, placeholder: "Teks opsi C" },
    { name: "optD", label: "Pilihan Jawaban D", type: "text", required: true, placeholder: "Teks opsi D" },
    { name: "optE", label: "Pilihan Jawaban E", type: "text", required: true, placeholder: "Teks opsi E" },
    {
      name: "correctAnswer",
      label: "Kunci Jawaban Benar",
      type: "select",
      required: true,
      options: [
        { label: "A", value: "A" },
        { label: "B", value: "B" },
        { label: "C", value: "C" },
        { label: "D", value: "D" },
        { label: "E", value: "E" },
      ],
      defaultValue: "A",
    },
    { name: "explanation", label: "Pembahasan & Analisis Solusi", type: "textarea", required: true, placeholder: "Langkah penyelesaian lengkap..." },
    {
      name: "status",
      label: "Status Awal",
      type: "select",
      required: true,
      options: [
        { label: "Simpan sebagai Draf (DRAFT)", value: "DRAFT" },
        { label: "Langsung Ajukan ke Admin (SUBMITTED)", value: "SUBMITTED" },
      ],
      defaultValue: "DRAFT",
    },
  ];

  const handleCreate = async (newFields: Record<string, string | number>) => {
    await questionBankService.createQuestion(
      {
        code: String(newFields.code),
        subtest: String(newFields.subtest),
        topic: String(newFields.topic),
        difficulty: (newFields.difficulty as QuestionDifficulty) || "Sedang",
        questionText: String(newFields.questionText),
        options: [
          { key: "A", text: String(newFields.optA || "Opsi A") },
          { key: "B", text: String(newFields.optB || "Opsi B") },
          { key: "C", text: String(newFields.optC || "Opsi C") },
          { key: "D", text: String(newFields.optD || "Opsi D") },
          { key: "E", text: String(newFields.optE || "Opsi E") },
        ],
        correctAnswer: (newFields.correctAnswer as "A" | "B" | "C" | "D" | "E") || "A",
        explanation: String(newFields.explanation),
        authorId: ACTIVE_MENTOR_ID,
        authorName: ACTIVE_MENTOR_NAME,
        status: (newFields.status as ContentStatus) || "DRAFT",
        isActive: true,
      },
      "mentor"
    );
    loadData();
  };

  const handleUpdate = async (id: string | number, updated: Record<string, string | number>) => {
    try {
      await questionBankService.updateQuestionContent(String(id), updated as Partial<QuestionBankItem>, "mentor", ACTIVE_MENTOR_ID);
      loadData();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Gagal memperbarui soal");
    }
  };

  const handleDelete = async (id: string | number) => {
    try {
      await questionBankService.deleteQuestion(String(id), "mentor", ACTIVE_MENTOR_ID);
      loadData();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Gagal menghapus soal");
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-sm text-muted">Memuat Bank Soal...</div>;
  }

  return (
    <>
      <DataTable<QuestionBankItem>
        title="Bank Soal Akademik Saya"
        description="Susun butir soal UTBK, simpan draf, lakukan pengecekan duplikasi otomatis, ajukan kurasi ke administrator, dan perbaiki butir soal yang ditolak."
        columns={columns}
        data={questions}
        searchPlaceholder="Cari kode soal, topik, atau narasi..."
        searchKeys={["code", "subtest", "topic", "questionText"]}
        filters={[
          {
            key: "status",
            label: "Status",
            options: [
              { label: "Diterbitkan (PUBLISHED)", value: "PUBLISHED" },
              { label: "Menunggu Verifikasi (SUBMITTED)", value: "SUBMITTED" },
              { label: "Draft (DRAFT)", value: "DRAFT" },
              { label: "Perlu Revisi / Ditolak (REJECTED)", value: "REJECTED" },
            ],
          },
          {
            key: "difficulty",
            label: "Tingkat Kesulitan",
            options: [
              { label: "Mudah", value: "Mudah" },
              { label: "Sedang", value: "Sedang" },
              { label: "Sukar", value: "Sukar" },
            ],
          },
        ]}
        formFields={formFields}
        onItemCreate={handleCreate}
        onItemUpdate={handleUpdate}
        onItemDelete={handleDelete}
        customRowActions={(item) => (
          <div className="flex items-center gap-1 mr-1">
            <button
              type="button"
              onClick={() => setDetailItem(item)}
              title="Periksa Butir Soal & Kunci"
              className="grid size-8 place-items-center rounded-lg text-brand-600 hover:bg-brand-50 transition-colors"
            >
              <Icon name="eye" className="size-4" />
            </button>

            {/* Tombol Ajukan ke Admin jika DRAFT atau REJECTED */}
            {(item.status === "DRAFT" || item.status === "REJECTED") && (
              <button
                type="button"
                onClick={() => handleSubmitForReview(item.id)}
                title="Ajukan ke Admin untuk Diverifikasi"
                className="inline-flex items-center gap-1 rounded-lg bg-brand-500 hover:bg-brand-600 text-white px-2 py-1 text-xs font-semibold shadow-xs transition-colors"
              >
                <Icon name="review" className="size-3.5" />
                <span>Ajukan</span>
              </button>
            )}
          </div>
        )}
        exportFileName="bank-soal-mentor"
      />

      {/* Modal Telaah Butir Soal Mentor */}
      <GlassModal
        isOpen={!!detailItem}
        onClose={() => setDetailItem(null)}
        title={`Rincian Soal: ${detailItem?.code || ""}`}
        subtitle={`${detailItem?.subtest || ""} • Topik: ${detailItem?.topic || ""}`}
        maxWidth="max-w-2xl"
      >
        {detailItem && (
          <div className="space-y-4 text-xs sm:text-sm">
            {detailItem.status === "REJECTED" && detailItem.rejectionReason && (
              <div className="rounded-xl border border-rose-200 bg-rose-50/80 p-3.5 text-rose-950 leading-relaxed">
                <p className="font-bold flex items-center gap-1.5 text-rose-700">
                  <Icon name="alert" className="size-4" />
                  <span>Catatan Revisi dari Administrator:</span>
                </p>
                <p className="mt-1 font-medium">{detailItem.rejectionReason}</p>
                <p className="mt-2 text-[11px] text-rose-800">
                  Klik tombol Ubah pada baris tabel untuk merevisi narasi atau opsi soal sesuai catatan di atas, kemudian klik &apos;Ajukan&apos;.
                </p>
              </div>
            )}

            {detailItem.duplicateFlag && (
              <div
                className={`rounded-xl border p-3 leading-relaxed ${
                  detailItem.duplicateFlag.isDuplicate
                    ? "border-rose-200 bg-rose-50/70 text-rose-900"
                    : "border-emerald-200 bg-emerald-50/70 text-emerald-900"
                }`}
              >
                <p className="font-bold">
                  Hasil Pemeriksaan Duplikasi: {detailItem.duplicateFlag.similarityScore}%
                </p>
                <p className="mt-1 text-xs">{detailItem.duplicateFlag.reason}</p>
              </div>
            )}

            <div className="rounded-xl border border-line/80 bg-white/70 p-4">
              <p className="font-bold text-muted text-xs uppercase tracking-wider mb-2">Narasi Soal:</p>
              <p className="text-ink leading-relaxed whitespace-pre-wrap">{detailItem.questionText}</p>
            </div>

            <div className="rounded-xl border border-line/80 bg-white/70 p-4 space-y-2">
              <p className="font-bold text-muted text-xs uppercase tracking-wider mb-1">Pilihan Jawaban:</p>
              {detailItem.options.map((opt) => {
                const isCorrect = opt.key === detailItem.correctAnswer;
                return (
                  <div
                    key={opt.key}
                    className={`flex items-start gap-2.5 rounded-lg p-2.5 ${
                      isCorrect
                        ? "bg-emerald-50/80 border border-emerald-300 font-semibold text-emerald-950"
                        : "bg-white/60 border border-line/60 text-ink"
                    }`}
                  >
                    <span className="font-bold shrink-0">{opt.key}.</span>
                    <span className="flex-1">{opt.text}</span>
                    {isCorrect && (
                      <span className="shrink-0 rounded bg-emerald-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                        Kunci Jawaban
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="rounded-xl border border-brand-100 bg-brand-50/50 p-4 leading-relaxed text-brand-950">
              <p className="font-bold text-xs uppercase tracking-wider mb-1 text-brand-700">
                Pembahasan & Solusi:
              </p>
              <p className="whitespace-pre-wrap">{detailItem.explanation}</p>
            </div>

            <div className="flex items-center justify-between border-t border-line/60 pt-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-muted">Status:</span>
                <StatusBadge status={detailItem.status} />
              </div>
              <button
                type="button"
                onClick={() => setDetailItem(null)}
                className="rounded-xl bg-brand-500 hover:bg-brand-600 px-5 py-2 text-xs font-semibold text-white shadow-xs"
              >
                Tutup
              </button>
            </div>
          </div>
        )}
      </GlassModal>
    </>
  );
}
