"use client";

import { useState, useEffect } from "react";
import { DataTable } from "@/components/ui/data-table/data-table";
import { StatusBadge } from "@/components/ui/data-table/status-badge";
import { GlassModal } from "@/components/ui/data-table/table-modal";
import { Icon } from "@/components/ui/icon";
import { tryoutService } from "@/services";
import type { TryoutPackage, ContentStatus } from "@/types";
import type { ColumnDef, FormField } from "@/components/ui/data-table/types";

const ACTIVE_MENTOR_ID = "mnt-01"; // Dr. Hendra Gunawan
const ACTIVE_MENTOR_NAME = "Dr. Hendra Gunawan, M.Si.";

export function MentorTryoutAuthoring() {
  const [tryouts, setTryouts] = useState<TryoutPackage[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal Penarikan Paket Terbit ke Admin
  const [withdrawTarget, setWithdrawTarget] = useState<TryoutPackage | null>(null);
  const [withdrawReason, setWithdrawReason] = useState("");

  // Modal Detail Komposisi
  const [detailItem, setDetailItem] = useState<TryoutPackage | null>(null);

  const loadData = async () => {
    try {
      const data = await tryoutService.getTryoutsByMentor(ACTIVE_MENTOR_ID);
      setTryouts(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmitForReview = async (id: string) => {
    await tryoutService.submitForReview(id, ACTIVE_MENTOR_NAME, ACTIVE_MENTOR_ID);
    loadData();
  };

  const handleConfirmWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!withdrawTarget || !withdrawReason.trim()) return;
    try {
      await tryoutService.requestWithdrawal(withdrawTarget.id, ACTIVE_MENTOR_ID, withdrawReason);
      setWithdrawTarget(null);
      setWithdrawReason("");
      loadData();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Gagal mengajukan penarikan");
    }
  };

  const columns: ColumnDef<TryoutPackage>[] = [
    {
      key: "title",
      header: "Judul Paket TryOut",
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-semibold text-ink line-clamp-1">{row.title}</p>
          <p className="text-xs text-brand-600 font-medium">{row.targetBatch}</p>
        </div>
      ),
    },
    {
      key: "durationMinutes",
      header: "Durasi Waktu",
      sortable: true,
      className: "text-center",
      render: (row) => <span className="font-semibold text-ink tabular-nums">{row.durationMinutes} menit</span>,
    },
    {
      key: "totalQuestions",
      header: "Jumlah Butir Soal",
      sortable: true,
      className: "text-center",
      render: (row) => <span className="font-semibold text-ink tabular-nums">{row.totalQuestions} butir</span>,
    },
    {
      key: "withdrawalRequested",
      header: "Status Penarikan",
      render: (row) => {
        if (!row.withdrawalRequested) return <span className="text-muted text-xs">-</span>;
        return (
          <span
            title={row.withdrawalReason}
            className="inline-flex rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-200"
          >
            Diajukan ke Admin
          </span>
        );
      },
    },
    {
      key: "status",
      header: "Status Kurasi",
      sortable: true,
      render: (row) => <StatusBadge status={row.status} />,
    },
  ];

  const formFields: FormField[] = [
    { name: "title", label: "Judul Paket TryOut", type: "text", required: true, placeholder: "Contoh: Paket Simulasi UTBK-SNBT Intensif 02" },
    { name: "targetBatch", label: "Target Batch / Gelombang", type: "text", required: true, placeholder: "Contoh: UTBK-SNBT 2026 Gelombang 1" },
    { name: "durationMinutes", label: "Durasi Waktu Pengerjaan (Menit)", type: "number", required: true, defaultValue: 195 },
    { name: "totalQuestions", label: "Total Jumlah Butir Soal", type: "number", required: true, defaultValue: 155 },
    { name: "description", label: "Deskripsi & Petunjuk Simulasi", type: "textarea", required: true, placeholder: "Tuliskan cakupan subtes dan panduan pengerjaan paket..." },
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
    await tryoutService.createTryoutPackage(
      {
        title: String(newFields.title),
        description: String(newFields.description),
        targetBatch: String(newFields.targetBatch),
        durationMinutes: Number(newFields.durationMinutes || 195),
        totalQuestions: Number(newFields.totalQuestions || 155),
        subtests: [
          { name: "Penalaran Umum (PU)", questionCount: 30, durationMinutes: 30 },
          { name: "Pengetahuan Kuantitatif (PK)", questionCount: 20, durationMinutes: 20 },
          { name: "Pemahaman Bacaan & Menulis (PBM)", questionCount: 25, durationMinutes: 25 },
          { name: "Literasi Bahasa Indonesia & Inggris", questionCount: 40, durationMinutes: 60 },
          { name: "Penalaran Matematika (PM)", questionCount: 20, durationMinutes: 40 },
        ],
        questionIds: ["q-01", "q-02"],
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
      await tryoutService.updateTryoutContent(String(id), updated as Partial<TryoutPackage>, "mentor", ACTIVE_MENTOR_ID);
      loadData();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Gagal memperbarui paket tryout");
    }
  };

  const handleDelete = async (id: string | number) => {
    try {
      await tryoutService.deleteTryout(String(id), "mentor", ACTIVE_MENTOR_ID);
      loadData();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Gagal menghapus paket tryout");
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-sm text-muted">Memuat paket tryout...</div>;
  }

  return (
    <>
      <DataTable<TryoutPackage>
        title="Paket TryOut SNBT Saya"
        description="Susun paket simulasi UTBK, kelola alokasi subtes sebelum terbit, ajukan verifikasi ke administrator, atau ajukan penarikan untuk paket yang telah terbit."
        columns={columns}
        data={tryouts}
        searchPlaceholder="Cari paket tryout, target batch, atau deskripsi..."
        searchKeys={["title", "targetBatch", "description"]}
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
              title="Lihat Komposisi Subtes"
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

            {/* Tombol Ajukan Permohonan Penarikan untuk Paket PUBLISHED */}
            {item.status === "PUBLISHED" && !item.withdrawalRequested && (
              <button
                type="button"
                onClick={() => {
                  setWithdrawTarget(item);
                  setWithdrawReason("");
                }}
                title="Ajukan Penarikan Paket Terbit ke Admin"
                className="inline-flex items-center gap-1 rounded-lg bg-amber-50 text-amber-800 hover:bg-amber-100 px-2 py-1 text-xs font-semibold border border-amber-200 transition-colors"
              >
                <Icon name="revise" className="size-3.5" />
                <span>Tarik Paket</span>
              </button>
            )}
          </div>
        )}
        exportFileName="paket-tryout-mentor"
      />

      {/* Modal Detail Komposisi Subtes */}
      <GlassModal
        isOpen={!!detailItem}
        onClose={() => setDetailItem(null)}
        title={`Komposisi: ${detailItem?.title || ""}`}
        subtitle={`Target: ${detailItem?.targetBatch || ""} • Durasi: ${detailItem?.durationMinutes || 0} Menit`}
        maxWidth="max-w-xl"
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
              </div>
            )}

            <div className="rounded-xl border border-line/80 bg-white/70 p-4">
              <p className="font-bold text-muted text-xs uppercase tracking-wider mb-1">Deskripsi:</p>
              <p className="text-ink leading-relaxed">{detailItem.description}</p>
            </div>

            <div className="rounded-xl border border-line/80 bg-white/70 p-4 space-y-2">
              <p className="font-bold text-muted text-xs uppercase tracking-wider mb-2">Alokasi Subtes:</p>
              {detailItem.subtests.map((sub, idx) => (
                <div key={idx} className="flex items-center justify-between rounded-lg bg-white/60 p-2.5 border border-line/60">
                  <span className="font-semibold text-ink">{sub.name}</span>
                  <div className="flex items-center gap-3 text-xs text-muted">
                    <span>{sub.questionCount} Butir</span>
                    <span className="rounded bg-brand-50 px-2 py-0.5 font-bold text-brand-700 border border-brand-100">
                      {sub.durationMinutes} mnt
                    </span>
                  </div>
                </div>
              ))}
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

      {/* Modal Ajukan Penarikan Paket Terbit ke Admin */}
      <GlassModal
        isOpen={!!withdrawTarget}
        onClose={() => setWithdrawTarget(null)}
        title={`Ajukan Penarikan: ${withdrawTarget?.title || ""}`}
        subtitle="Sesuai kebijakan platform, paket yang telah terbit tidak boleh diedit mentor secara langsung. Penarikan harus diajukan kepada Administrator."
      >
        <form onSubmit={handleConfirmWithdraw} className="space-y-4">
          <div>
            <label htmlFor="alasan-tarik-paket" className="block text-xs font-semibold text-ink mb-1.5">
              Alasan Permohonan Penarikan Paket <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="alasan-tarik-paket"
              value={withdrawReason}
              onChange={(e) => setWithdrawReason(e.target.value)}
              required
              rows={4}
              placeholder="Jelaskan alasan penarikan paket, misalnya: terdapat kunci jawaban yang perlu dikalibrasi ulang atau pembaruan silabus..."
              className="w-full rounded-xl border border-line bg-white/80 px-3.5 py-2.5 text-xs sm:text-sm text-ink backdrop-blur-xs transition-colors focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            />
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-line/60 pt-4">
            <button
              type="button"
              onClick={() => setWithdrawTarget(null)}
              className="rounded-xl border border-line bg-white/80 px-4 py-2 text-xs font-semibold text-ink hover:bg-white"
            >
              Batal
            </button>
            <button
              type="submit"
              className="rounded-xl bg-amber-600 hover:bg-amber-700 px-5 py-2 text-xs font-semibold text-white shadow-xs"
            >
              Kirim Permohonan ke Admin
            </button>
          </div>
        </form>
      </GlassModal>
    </>
  );
}
