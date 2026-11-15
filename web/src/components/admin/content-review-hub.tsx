"use client";

import { useState, useEffect } from "react";
import { DataTable } from "@/components/ui/data-table/data-table";
import { StatusBadge } from "@/components/ui/data-table/status-badge";
import { GlassModal } from "@/components/ui/data-table/table-modal";
import { Icon } from "@/components/ui/icon";
import { contentReviewService, type UnifiedReviewItem } from "@/services";
import type { ColumnDef } from "@/components/ui/data-table/types";

export function AdminContentReviewHub() {
  const [items, setItems] = useState<UnifiedReviewItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal Penolakan
  const [rejectTarget, setRejectTarget] = useState<UnifiedReviewItem | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  // Modal Detail Telaah Konten & Audit
  const [detailTarget, setDetailTarget] = useState<UnifiedReviewItem | null>(null);

  const loadData = async () => {
    try {
      const data = await contentReviewService.getUnifiedReviewItems();
      setItems(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApprove = async (item: UnifiedReviewItem) => {
    await contentReviewService.approveItem(item, "Administrator Alfary");
    loadData();
  };

  const handlePublish = async (item: UnifiedReviewItem) => {
    await contentReviewService.publishItem(item, "Administrator Alfary");
    loadData();
  };

  const handleConfirmReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectTarget || !rejectionReason.trim()) return;
    await contentReviewService.rejectItem(rejectTarget, "Administrator Alfary", rejectionReason);
    setRejectTarget(null);
    setRejectionReason("");
    loadData();
  };

  const handleDeactivate = async (item: UnifiedReviewItem) => {
    await contentReviewService.deactivateItem(
      item,
      "Administrator Alfary",
      "Dinonaktifkan sementara dari akses publik."
    );
    loadData();
  };

  const columns: ColumnDef<UnifiedReviewItem>[] = [
    {
      key: "title",
      header: "Judul & Topik Konten",
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-semibold text-ink line-clamp-1">{row.title}</p>
          <p className="text-xs text-brand-600 font-medium">{row.subtest}</p>
        </div>
      ),
    },
    {
      key: "contentType",
      header: "Tipe Konten",
      sortable: true,
      render: (row) => (
        <span className="font-medium text-xs text-muted bg-white/70 px-2.5 py-1 rounded-lg border border-line">
          {row.contentType === "MATERI"
            ? "Materi Pembelajaran"
            : row.contentType === "BANK_SOAL"
            ? "Bank Soal"
            : "Paket TryOut"}
        </span>
      ),
    },
    {
      key: "author",
      header: "Mentor Penyusun",
      sortable: true,
      render: (row) => <span className="font-medium text-ink text-xs">{row.author}</span>,
    },
    {
      key: "submissionDate",
      header: "Tanggal Pengajuan",
      sortable: true,
      render: (row) => <span className="text-muted text-xs">{row.submissionDate}</span>,
    },
    {
      key: "status",
      header: "Status Peninjauan",
      sortable: true,
      render: (row) => <StatusBadge status={row.status} />,
    },
  ];

  if (loading) {
    return <div className="p-8 text-center text-sm text-muted">Memuat antrean kurasi konten...</div>;
  }

  return (
    <>
      <DataTable<UnifiedReviewItem>
        title="Pusat Kurasi & Peninjauan Konten Akademik"
        description="Antrean terpadu untuk evaluasi naskah materi, butir bank soal, dan paket tryout sebelum diterbitkan ke aplikasi siswa."
        columns={columns}
        data={items}
        searchPlaceholder="Cari judul konten, mentor pengunggah, atau subtes..."
        searchKeys={["title", "author", "subtest", "summary"]}
        filters={[
          {
            key: "status",
            label: "Status Peninjauan",
            options: [
              { label: "Menunggu Verifikasi (SUBMITTED)", value: "SUBMITTED" },
              { label: "Disetujui (APPROVED)", value: "APPROVED" },
              { label: "Diterbitkan (PUBLISHED)", value: "PUBLISHED" },
              { label: "Ditolak / Perlu Revisi (REJECTED)", value: "REJECTED" },
              { label: "Dinonaktifkan (DEACTIVATED)", value: "DEACTIVATED" },
            ],
          },
          {
            key: "contentType",
            label: "Tipe Konten",
            options: [
              { label: "Materi Pembelajaran", value: "MATERI" },
              { label: "Bank Soal", value: "BANK_SOAL" },
              { label: "Paket TryOut", value: "PAKET_TRYOUT" },
            ],
          },
        ]}
        customRowActions={(item) => (
          <div className="flex items-center gap-1 mr-1">
            {/* Tombol Telaah Rinci */}
            <button
              type="button"
              onClick={() => setDetailTarget(item)}
              title="Telaah Detail & Riwayat Kurasi"
              className="grid size-8 place-items-center rounded-lg text-brand-600 hover:bg-brand-50 transition-colors"
            >
              <Icon name="eye" className="size-4" />
            </button>

            {/* Aksi Verifikasi untuk Status SUBMITTED */}
            {item.status === "SUBMITTED" && (
              <>
                <button
                  type="button"
                  onClick={() => handleApprove(item)}
                  title="Setujui Konten"
                  className="grid size-8 place-items-center rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                >
                  <Icon name="check" className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRejectTarget(item);
                    setRejectionReason("");
                  }}
                  title="Tolak dengan Alasan Tertulis"
                  className="grid size-8 place-items-center rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <Icon name="close" className="size-4" />
                </button>
              </>
            )}

            {item.status === "APPROVED" && (
              <button
                type="button"
                onClick={() => handlePublish(item)}
                title="Terbitkan ke Aplikasi Siswa"
                className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-2 py-1 text-xs font-semibold border border-emerald-200 transition-colors"
              >
                <Icon name="check" className="size-3.5" />
                <span>Terbitkan</span>
              </button>
            )}

            {item.status === "PUBLISHED" && (
              <button
                type="button"
                onClick={() => handleDeactivate(item)}
                title="Nonaktifkan Konten (Tanpa Mengubah Isi Asli)"
                className="inline-flex items-center gap-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-rose-50 hover:text-rose-700 px-2 py-1 text-xs font-semibold border border-line transition-colors"
              >
                <Icon name="trash" className="size-3" />
                <span>Nonaktifkan</span>
              </button>
            )}
          </div>
        )}
        exportFileName="kurasi-konten-admin"
      />

      {/* Modal Telaah Rinci Konten */}
      <GlassModal
        isOpen={!!detailTarget}
        onClose={() => setDetailTarget(null)}
        title={`Telaah Konten: ${detailTarget?.title || ""}`}
        subtitle={`Tipe: ${detailTarget?.contentType || ""} • Penyusun: ${detailTarget?.author || ""}`}
        maxWidth="max-w-2xl"
      >
        {detailTarget && (
          <div className="space-y-4 text-xs sm:text-sm">
            {detailTarget.rejectionReason && (
              <div className="rounded-xl border border-rose-200 bg-rose-50/80 p-3 text-rose-900 leading-relaxed">
                <p className="font-bold">Catatan Penolakan / Revisi Sebelumnya:</p>
                <p className="mt-1">{detailTarget.rejectionReason}</p>
              </div>
            )}

            <div className="rounded-xl border border-line/80 bg-white/70 p-4">
              <p className="font-bold text-muted text-xs uppercase tracking-wider mb-1">Ringkasan / Isi Naskah:</p>
              <p className="text-ink leading-relaxed whitespace-pre-wrap">{detailTarget.summary}</p>
            </div>

            {/* Rincian Tambahan */}
            {detailTarget.details && (
              <div className="grid grid-cols-2 gap-2 rounded-xl border border-line/80 bg-white/60 p-3">
                {Object.entries(detailTarget.details).map(([k, v]) => (
                  <div key={k} className="text-xs">
                    <span className="text-muted font-medium">{k}: </span>
                    <strong className="text-ink">{String(v)}</strong>
                  </div>
                ))}
              </div>
            )}

            {/* Riwayat Kurasi */}
            <div className="rounded-xl border border-line/80 bg-white/70 p-4 space-y-2">
              <p className="font-bold text-muted text-xs uppercase tracking-wider mb-2">Riwayat Audit & Verifikasi:</p>
              {(!detailTarget.history || detailTarget.history.length === 0) ? (
                <p className="text-muted text-xs">Belum ada riwayat tercatat.</p>
              ) : (
                detailTarget.history.map((h) => (
                  <div key={h.id} className="rounded-lg bg-white/80 p-2.5 border border-line/60 text-xs">
                    <div className="flex items-center justify-between text-muted text-[11px]">
                      <span className="font-semibold text-brand-700">{h.actorName} ({h.actorRole})</span>
                      <span>{h.timestamp}</span>
                    </div>
                    <p className="font-bold text-ink mt-0.5">{h.action}</p>
                    {h.notes && <p className="text-muted mt-1 italic">&ldquo;{h.notes}&rdquo;</p>}
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-end border-t border-line/60 pt-4">
              <button
                type="button"
                onClick={() => setDetailTarget(null)}
                className="rounded-xl bg-brand-500 hover:bg-brand-600 px-5 py-2 text-xs font-semibold text-white shadow-xs"
              >
                Tutup
              </button>
            </div>
          </div>
        )}
      </GlassModal>

      {/* Modal Tolak Konten dengan Catatan Wajib */}
      <GlassModal
        isOpen={!!rejectTarget}
        onClose={() => setRejectTarget(null)}
        title={`Tolak Konten: ${rejectTarget?.title || ""}`}
        subtitle="Cantumkan instruksi perbaikan yang jelas agar mentor dapat memperbaiki naskah ini."
      >
        <form onSubmit={handleConfirmReject} className="space-y-4">
          <div>
            <label htmlFor="alasan-tolak-kurasi" className="block text-xs font-semibold text-ink mb-1.5">
              Alasan Penolakan / Catatan Perbaikan <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="alasan-tolak-kurasi"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              required
              rows={4}
              placeholder="Jelaskan alasan penolakan secara spesifik..."
              className="w-full rounded-xl border border-line bg-white/80 px-3.5 py-2.5 text-xs sm:text-sm text-ink backdrop-blur-xs transition-colors focus:border-rose-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            />
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-line/60 pt-4">
            <button
              type="button"
              onClick={() => setRejectTarget(null)}
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
