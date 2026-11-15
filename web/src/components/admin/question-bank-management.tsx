"use client";

import { useState, useEffect } from "react";
import { DataTable } from "@/components/ui/data-table/data-table";
import { StatusBadge } from "@/components/ui/data-table/status-badge";
import { GlassModal } from "@/components/ui/data-table/table-modal";
import { Icon } from "@/components/ui/icon";
import { questionBankService } from "@/services";
import type { QuestionBankItem } from "@/types";
import type { ColumnDef } from "@/components/ui/data-table/types";

export function AdminQuestionBankManagement() {
  const [questions, setQuestions] = useState<QuestionBankItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal Penolakan
  const [rejectItem, setRejectItem] = useState<QuestionBankItem | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  // Modal Detail Lengkap Soal (Teks, Opsi A-E, Pembahasan, Status Duplikasi)
  const [viewDetailItem, setViewDetailItem] = useState<QuestionBankItem | null>(null);

  const loadData = async () => {
    try {
      const data = await questionBankService.getAllQuestions();
      setQuestions(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApprove = async (id: string) => {
    await questionBankService.approveQuestion(id, "Administrator Alfary");
    loadData();
  };

  const handlePublish = async (id: string) => {
    await questionBankService.publishQuestion(id, "Administrator Alfary");
    loadData();
  };

  const handleConfirmReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectItem || !rejectionReason.trim()) return;
    await questionBankService.rejectQuestion(rejectItem.id, "Administrator Alfary", rejectionReason);
    setRejectItem(null);
    setRejectionReason("");
    loadData();
  };

  const handleDeactivate = async (id: string) => {
    await questionBankService.deactivateQuestion(
      id,
      "Administrator Alfary",
      "Dinonaktifkan sementara dari Bank Soal aktif oleh Admin."
    );
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
      key: "authorName",
      header: "Penyusun",
      sortable: true,
      render: (row) => <span className="font-medium text-xs text-ink">{row.authorName}</span>,
    },
    {
      key: "duplicateFlag",
      header: "Cek Duplikasi",
      render: (row) => {
        if (!row.duplicateFlag) return <span className="text-muted text-xs">-</span>;
        if (row.duplicateFlag.isDuplicate) {
          return (
            <span
              title={row.duplicateFlag.reason}
              className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-bold text-rose-700 border border-rose-200 animate-pulse"
            >
              ⚠️ {row.duplicateFlag.similarityScore}% Mirip
            </span>
          );
        }
        return (
          <span
            title={row.duplicateFlag.reason}
            className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200"
          >
            ✓ Unik ({row.duplicateFlag.similarityScore}%)
          </span>
        );
      },
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (row) => <StatusBadge status={row.status} />,
    },
  ];

  if (loading) {
    return <div className="p-8 text-center text-sm text-muted">Memuat data Bank Soal...</div>;
  }

  return (
    <>
      <DataTable<QuestionBankItem>
        title="Repositori & Kurasi Bank Soal UTBK-SNBT"
        description="Periksa butir soal yang diajukan mentor, evaluasi kunci jawaban dan analisis duplikasi, setujui, terbitkan, atau tolak dengan catatan perbaikan."
        columns={columns}
        data={questions}
        searchPlaceholder="Cari kode soal, topik, subtes, atau narasi..."
        searchKeys={["code", "subtest", "topic", "questionText", "authorName"]}
        filters={[
          {
            key: "status",
            label: "Status",
            options: [
              { label: "Diterbitkan (PUBLISHED)", value: "PUBLISHED" },
              { label: "Menunggu Verifikasi (SUBMITTED)", value: "SUBMITTED" },
              { label: "Disetujui (APPROVED)", value: "APPROVED" },
              { label: "Ditolak (REJECTED)", value: "REJECTED" },
              { label: "Dinonaktifkan (DEACTIVATED)", value: "DEACTIVATED" },
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
        customRowActions={(item) => (
          <div className="flex items-center gap-1 mr-1">
            {/* Tombol Lihat Detail Soal */}
            <button
              type="button"
              onClick={() => setViewDetailItem(item)}
              title="Periksa Butir Soal & Kunci"
              className="grid size-8 place-items-center rounded-lg text-brand-600 hover:bg-brand-50 transition-colors"
            >
              <Icon name="eye" className="size-4" />
            </button>

            {/* Aksi Verifikasi untuk Admin */}
            {item.status === "SUBMITTED" && (
              <>
                <button
                  type="button"
                  onClick={() => handleApprove(item.id)}
                  title="Setujui Soal"
                  className="grid size-8 place-items-center rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                >
                  <Icon name="check" className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRejectItem(item);
                    setRejectionReason("");
                  }}
                  title="Tolak Soal dengan Alasan"
                  className="grid size-8 place-items-center rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <Icon name="close" className="size-4" />
                </button>
              </>
            )}

            {item.status === "APPROVED" && (
              <button
                type="button"
                onClick={() => handlePublish(item.id)}
                title="Terbitkan ke Aplikasi"
                className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-2 py-1 text-xs font-semibold border border-emerald-200 transition-colors"
              >
                <Icon name="check" className="size-3.5" />
                <span>Terbitkan</span>
              </button>
            )}

            {item.status === "PUBLISHED" && (
              <button
                type="button"
                onClick={() => handleDeactivate(item.id)}
                title="Nonaktifkan Soal (Tanpa Mengubah Naskah Asli)"
                className="inline-flex items-center gap-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-rose-50 hover:text-rose-700 px-2 py-1 text-xs font-semibold border border-line transition-colors"
              >
                <Icon name="trash" className="size-3" />
                <span>Nonaktifkan</span>
              </button>
            )}
          </div>
        )}
        exportFileName="bank-soal-admin"
      />

      {/* Modal Telaah Rinci Butir Soal */}
      <GlassModal
        isOpen={!!viewDetailItem}
        onClose={() => setViewDetailItem(null)}
        title={`Telaah Soal: ${viewDetailItem?.code || ""}`}
        subtitle={`${viewDetailItem?.subtest || ""} • Topik: ${viewDetailItem?.topic || ""}`}
        maxWidth="max-w-2xl"
      >
        {viewDetailItem && (
          <div className="space-y-4 text-xs sm:text-sm">
            {/* Peringatan Duplikasi Jika Ada */}
            {viewDetailItem.duplicateFlag?.isDuplicate && (
              <div className="rounded-xl border border-rose-200 bg-rose-50/80 p-3 text-rose-900 leading-relaxed">
                <p className="font-bold flex items-center gap-1.5">
                  <Icon name="alert" className="size-4 text-rose-600" />
                  <span>Peringatan Deteksi Duplikasi Konten:</span>
                </p>
                <p className="mt-1">{viewDetailItem.duplicateFlag.reason}</p>
                <p className="mt-1 text-[11px] font-semibold text-rose-700">
                  Keputusan Verifikasi: Admin wajib meneliti apakah butir soal ini memiliki kebaruan materi atau sekadar duplikasi dari naskah sebelumnya.
                </p>
              </div>
            )}

            {/* Narasi Soal */}
            <div className="rounded-xl border border-line/80 bg-white/70 p-4">
              <p className="font-bold text-muted text-xs uppercase tracking-wider mb-2">Narasi Soal:</p>
              <p className="text-ink leading-relaxed whitespace-pre-wrap">{viewDetailItem.questionText}</p>
              {viewDetailItem.imageUrl && (
                <div className="mt-3 p-2 bg-slate-50 rounded-lg border border-slate-200 text-xs text-muted">
                  [Gambar pendukung soal: {viewDetailItem.imageUrl}]
                </div>
              )}
            </div>

            {/* Pilihan Jawaban A-E */}
            <div className="rounded-xl border border-line/80 bg-white/70 p-4 space-y-2">
              <p className="font-bold text-muted text-xs uppercase tracking-wider mb-1">Pilihan Jawaban:</p>
              {viewDetailItem.options.map((opt) => {
                const isCorrect = opt.key === viewDetailItem.correctAnswer;
                return (
                  <div
                    key={opt.key}
                    className={`flex items-start gap-2.5 rounded-lg p-2.5 transition-colors ${
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

            {/* Pembahasan */}
            <div className="rounded-xl border border-brand-100 bg-brand-50/50 p-4 leading-relaxed text-brand-950">
              <p className="font-bold text-xs uppercase tracking-wider mb-1 text-brand-700">
                Pembahasan & Trik Cepat:
              </p>
              <p className="whitespace-pre-wrap">{viewDetailItem.explanation}</p>
            </div>

            <div className="flex items-center justify-between border-t border-line/60 pt-4 text-xs text-muted">
              <span>Penyusun: <strong className="text-ink">{viewDetailItem.authorName}</strong></span>
              <button
                type="button"
                onClick={() => setViewDetailItem(null)}
                className="rounded-xl bg-brand-500 hover:bg-brand-600 px-5 py-2 text-xs font-semibold text-white shadow-xs"
              >
                Tutup
              </button>
            </div>
          </div>
        )}
      </GlassModal>

      {/* Modal Tolak Soal */}
      <GlassModal
        isOpen={!!rejectItem}
        onClose={() => setRejectItem(null)}
        title={`Tolak Soal: ${rejectItem?.code || ""}`}
        subtitle="Berikan instruksi revisi yang jelas agar mentor dapat memperbaiki soal ini."
      >
        <form onSubmit={handleConfirmReject} className="space-y-4">
          <div>
            <label htmlFor="alasan-tolak-soal" className="block text-xs font-semibold text-ink mb-1.5">
              Alasan Penolakan Soal <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="alasan-tolak-soal"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              required
              rows={4}
              placeholder="Contoh: Kunci jawaban pada opsi C memiliki ambiguitas dengan opsi B, perbaiki pengecoh kalimat atau tambahkan pembatas premis..."
              className="w-full rounded-xl border border-line bg-white/80 px-3.5 py-2.5 text-xs sm:text-sm text-ink backdrop-blur-xs transition-colors focus:border-rose-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            />
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-line/60 pt-4">
            <button
              type="button"
              onClick={() => setRejectItem(null)}
              className="rounded-xl border border-line bg-white/80 px-4 py-2 text-xs font-semibold text-ink hover:bg-white"
            >
              Batal
            </button>
            <button
              type="submit"
              className="rounded-xl bg-rose-600 hover:bg-rose-700 px-5 py-2 text-xs font-semibold text-white shadow-xs"
            >
              Kirim Penolakan ke Mentor
            </button>
          </div>
        </form>
      </GlassModal>
    </>
  );
}
