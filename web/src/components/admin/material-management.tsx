"use client";

import { useState, useEffect } from "react";
import { DataTable } from "@/components/ui/data-table/data-table";
import { StatusBadge } from "@/components/ui/data-table/status-badge";
import { GlassModal } from "@/components/ui/data-table/table-modal";
import { Icon } from "@/components/ui/icon";
import { materialService } from "@/services";
import type { LearningMaterial } from "@/types";
import type { ColumnDef } from "@/components/ui/data-table/types";

export function AdminMaterialManagement() {
  const [materials, setMaterials] = useState<LearningMaterial[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal Penolakan / Revisi
  const [rejectItem, setRejectItem] = useState<LearningMaterial | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  // Modal Riwayat Audit
  const [historyItem, setHistoryItem] = useState<LearningMaterial | null>(null);

  const loadData = async () => {
    try {
      const data = await materialService.getAllMaterials();
      setMaterials(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApprove = async (id: string) => {
    await materialService.approveMaterial(id, "Administrator Alfary");
    loadData();
  };

  const handlePublish = async (id: string) => {
    await materialService.publishMaterial(id, "Administrator Alfary");
    loadData();
  };

  const handleConfirmReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectItem || !rejectionReason.trim()) return;
    await materialService.rejectMaterial(rejectItem.id, "Administrator Alfary", rejectionReason);
    setRejectItem(null);
    setRejectionReason("");
    loadData();
  };

  const handleDeactivate = async (id: string) => {
    await materialService.deactivateMaterial(
      id,
      "Administrator Alfary",
      "Dinonaktifkan sementara oleh Admin untuk peninjauan materi berkala."
    );
    loadData();
  };

  const columns: ColumnDef<LearningMaterial>[] = [
    {
      key: "title",
      header: "Judul Materi / Modul",
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-semibold text-ink line-clamp-1">{row.title}</p>
          <p className="text-xs text-brand-600 font-medium">{row.subtest}</p>
        </div>
      ),
    },
    {
      key: "format",
      header: "Format",
      sortable: true,
      render: (row) => (
        <span className="font-medium text-xs text-muted bg-white/70 px-2 py-0.5 rounded-lg border border-line">
          {row.format}
        </span>
      ),
    },
    {
      key: "authorName",
      header: "Mentor Penyusun",
      sortable: true,
      render: (row) => <span className="font-medium text-ink">{row.authorName}</span>,
    },
    {
      key: "totalAccess",
      header: "Total Akses",
      sortable: true,
      className: "text-center",
      render: (row) => (
        <span className="font-semibold text-ink tabular-nums">{row.totalAccess.toLocaleString("id-ID")}x</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: "updatedAt",
      header: "Diperbarui",
      sortable: true,
      render: (row) => <span className="text-muted text-xs">{row.updatedAt}</span>,
    },
  ];

  if (loading) {
    return <div className="p-8 text-center text-sm text-muted">Memuat data materi...</div>;
  }

  return (
    <>
      <DataTable<LearningMaterial>
        title="Kurikulum Materi Pembelajaran Platform"
        description="Verifikasi naskah materi teori yang diajukan mentor, terbitkan materi yang lolos kurasi, atau nonaktifkan materi terbit tanpa mengubah isi aslinya."
        columns={columns}
        data={materials}
        searchPlaceholder="Cari judul materi, subtes, atau nama mentor..."
        searchKeys={["title", "subtest", "authorName", "format"]}
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
            key: "format",
            label: "Format",
            options: [
              { label: "Modul Ringkasan", value: "Modul Ringkasan" },
              { label: "Paket Latihan Soal", value: "Paket Latihan Soal" },
              { label: "Pembahasan Video", value: "Pembahasan Video" },
            ],
          },
        ]}
        fieldLabels={{
          title: "Judul Materi",
          subtest: "Mata Uji Subtes",
          format: "Format Modul",
          summary: "Ringkasan Pembahasan",
          content: "Naskah Materi Lengkap",
          authorName: "Mentor Penyusun",
          status: "Status Publikasi",
          totalAccess: "Total Akses Siswa",
          rejectionReason: "Catatan / Alasan Penolakan",
          updatedAt: "Terakhir Diperbarui",
          createdAt: "Tanggal Dibuat",
        }}
        customRowActions={(item) => (
          <div className="flex items-center gap-1 mr-1">
            {/* Tombol Lihat Riwayat Transisi Status */}
            <button
              type="button"
              onClick={() => setHistoryItem(item)}
              title="Lihat Riwayat Kurasi & Status"
              className="grid size-8 place-items-center rounded-lg text-muted hover:bg-slate-100 transition-colors"
            >
              <Icon name="review" className="size-4" />
            </button>

            {/* Aksi Verifikasi untuk Admin */}
            {item.status === "SUBMITTED" && (
              <>
                <button
                  type="button"
                  onClick={() => handleApprove(item.id)}
                  title="Setujui Materi"
                  className="grid size-8 place-items-center rounded-lg text-brand-600 hover:bg-brand-50 transition-colors"
                >
                  <Icon name="check" className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRejectItem(item);
                    setRejectionReason("");
                  }}
                  title="Tolak dengan Alasan"
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
                title="Terbitkan ke Siswa"
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
                title="Nonaktifkan Materi (Tanpa Mengubah Isi Asli)"
                className="inline-flex items-center gap-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-rose-50 hover:text-rose-700 px-2 py-1 text-xs font-semibold border border-line transition-colors"
              >
                <Icon name="trash" className="size-3" />
                <span>Nonaktifkan</span>
              </button>
            )}
          </div>
        )}
        exportFileName="materi-pembelajaran-admin"
      />

      {/* Modal Tolak Materi */}
      <GlassModal
        isOpen={!!rejectItem}
        onClose={() => setRejectItem(null)}
        title={`Tolak Materi: ${rejectItem?.title || ""}`}
        subtitle="Berikan umpan balik atau alasan jelas agar mentor dapat memperbaiki materi ini."
      >
        <form onSubmit={handleConfirmReject} className="space-y-4">
          <div>
            <label htmlFor="alasan-tolak-materi" className="block text-xs font-semibold text-ink mb-1.5">
              Alasan Penolakan / Catatan Perbaikan <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="alasan-tolak-materi"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              required
              rows={4}
              placeholder="Contoh: Pembahasan silogisme pada contoh 4 belum sesuai standar SNBT terbaru, perbaiki bagian kesimpulan kontraposisi..."
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

      {/* Modal Riwayat Audit Status Konten */}
      <GlassModal
        isOpen={!!historyItem}
        onClose={() => setHistoryItem(null)}
        title={`Riwayat Kurasi: ${historyItem?.title || ""}`}
        subtitle="Pencatatan riwayat setiap tindakan persetujuan, penolakan, publikasi, dan penonaktifan."
      >
        <div className="space-y-3">
          {(!historyItem?.history || historyItem.history.length === 0) ? (
            <p className="py-4 text-center text-xs text-muted">Belum ada riwayat tercatat untuk materi ini.</p>
          ) : (
            historyItem.history.map((h) => (
              <div key={h.id} className="rounded-xl border border-line/60 bg-white/70 p-3 text-xs leading-relaxed">
                <div className="flex items-center justify-between text-muted text-[11px]">
                  <span className="font-semibold text-brand-700">{h.actorName} ({h.actorRole})</span>
                  <span>{h.timestamp}</span>
                </div>
                <p className="font-bold text-ink mt-0.5">{h.action}</p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-muted">Status baru:</span>
                  <StatusBadge status={h.newStatus} />
                </div>
                {h.notes && (
                  <p className="mt-1.5 rounded-lg bg-slate-50 p-2 text-slate-700 border border-slate-200/60">
                    <strong>Catatan:</strong> {h.notes}
                  </p>
                )}
              </div>
            ))
          )}

          <div className="flex justify-end border-t border-line/60 pt-4">
            <button
              type="button"
              onClick={() => setHistoryItem(null)}
              className="rounded-xl bg-brand-500 hover:bg-brand-600 px-5 py-2 text-xs font-semibold text-white shadow-xs"
            >
              Tutup
            </button>
          </div>
        </div>
      </GlassModal>
    </>
  );
}
