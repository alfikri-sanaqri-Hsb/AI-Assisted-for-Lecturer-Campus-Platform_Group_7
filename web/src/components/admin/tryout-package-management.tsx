"use client";

import { useState, useEffect } from "react";
import { DataTable } from "@/components/ui/data-table/data-table";
import { StatusBadge } from "@/components/ui/data-table/status-badge";
import { GlassModal } from "@/components/ui/data-table/table-modal";
import { Icon } from "@/components/ui/icon";
import { tryoutService } from "@/services";
import type { TryoutPackage } from "@/types";
import type { ColumnDef } from "@/components/ui/data-table/types";

export function AdminTryoutManagement() {
  const [tryouts, setTryouts] = useState<TryoutPackage[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal Penolakan
  const [rejectItem, setRejectItem] = useState<TryoutPackage | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  // Modal Rincian Subtes
  const [viewItem, setViewItem] = useState<TryoutPackage | null>(null);

  const loadData = async () => {
    try {
      const data = await tryoutService.getAllTryouts();
      setTryouts(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApprove = async (id: string) => {
    await tryoutService.approveTryout(id, "Administrator Alfary");
    loadData();
  };

  const handlePublish = async (id: string) => {
    await tryoutService.publishTryout(id, "Administrator Alfary");
    loadData();
  };

  const handleConfirmReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectItem || !rejectionReason.trim()) return;
    await tryoutService.rejectTryout(rejectItem.id, "Administrator Alfary", rejectionReason);
    setRejectItem(null);
    setRejectionReason("");
    loadData();
  };

  const handleDeactivate = async (id: string) => {
    await tryoutService.deactivateTryout(
      id,
      "Administrator Alfary",
      "Paket tryout dinonaktifkan sementara dari jadwal aktif simulasi."
    );
    loadData();
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
      render: (row) => <span className="font-semibold text-ink tabular-nums">{row.totalQuestions} soal</span>,
    },
    {
      key: "authorName",
      header: "Mentor Penanggung Jawab",
      sortable: true,
      render: (row) => <span className="font-medium text-xs text-ink">{row.authorName}</span>,
    },
    {
      key: "withdrawalRequested",
      header: "Permohonan Tarik",
      render: (row) => {
        if (!row.withdrawalRequested) return <span className="text-muted text-xs">-</span>;
        return (
          <span
            title={row.withdrawalReason}
            className="inline-flex rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-700 border border-rose-200 animate-pulse"
          >
            ⚠️ Tarik Diajukan
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
    return <div className="p-8 text-center text-sm text-muted">Memuat data paket tryout...</div>;
  }

  return (
    <>
      <DataTable<TryoutPackage>
        title="Pengelolaan & Publikasi Paket TryOut SNBT"
        description="Periksa komposisi paket simulasi, bobot subtes, setujui permohonan penerbitan, atau tangani permohonan penarikan paket dari mentor."
        columns={columns}
        data={tryouts}
        searchPlaceholder="Cari judul tryout, target batch, atau mentor..."
        searchKeys={["title", "targetBatch", "authorName", "description"]}
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
        ]}
        customRowActions={(item) => (
          <div className="flex items-center gap-1 mr-1">
            {/* Tombol Lihat Komposisi Subtes */}
            <button
              type="button"
              onClick={() => setViewItem(item)}
              title="Lihat Komposisi Subtes & Rincian"
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
                  title="Setujui Paket"
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
                  title="Tolak Paket dengan Alasan"
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
                title="Terbitkan ke Jadwal Siswa"
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
                title="Nonaktifkan Paket (Tanpa Mengubah Isi Asli)"
                className="inline-flex items-center gap-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-rose-50 hover:text-rose-700 px-2 py-1 text-xs font-semibold border border-line transition-colors"
              >
                <Icon name="trash" className="size-3" />
                <span>Nonaktifkan</span>
              </button>
            )}
          </div>
        )}
        exportFileName="paket-tryout-admin"
      />

      {/* Modal Komposisi Subtes Paket Tryout */}
      <GlassModal
        isOpen={!!viewItem}
        onClose={() => setViewItem(null)}
        title={`Komposisi: ${viewItem?.title || ""}`}
        subtitle={`Target: ${viewItem?.targetBatch || ""} • Durasi Total: ${viewItem?.durationMinutes || 0} Menit`}
        maxWidth="max-w-xl"
      >
        {viewItem && (
          <div className="space-y-4 text-xs sm:text-sm">
            {viewItem.withdrawalRequested && (
              <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-3 text-amber-900 leading-relaxed">
                <p className="font-bold">Permohonan Penarikan dari Mentor:</p>
                <p className="mt-1">{viewItem.withdrawalReason}</p>
                <button
                  type="button"
                  onClick={() => {
                    handleDeactivate(viewItem.id);
                    setViewItem(null);
                  }}
                  className="mt-2 rounded-lg bg-amber-600 hover:bg-amber-700 px-3 py-1 font-semibold text-white transition-colors"
                >
                  Setujui Penarikan & Nonaktifkan Paket
                </button>
              </div>
            )}

            <div className="rounded-xl border border-line/80 bg-white/70 p-4">
              <p className="font-bold text-muted text-xs uppercase tracking-wider mb-1">Deskripsi Paket:</p>
              <p className="text-ink leading-relaxed">{viewItem.description}</p>
            </div>

            <div className="rounded-xl border border-line/80 bg-white/70 p-4 space-y-2">
              <p className="font-bold text-muted text-xs uppercase tracking-wider mb-2">Rincian Alokasi Subtes:</p>
              {viewItem.subtests.map((sub, idx) => (
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

            <div className="flex justify-end border-t border-line/60 pt-4">
              <button
                type="button"
                onClick={() => setViewItem(null)}
                className="rounded-xl bg-brand-500 hover:bg-brand-600 px-5 py-2 text-xs font-semibold text-white shadow-xs"
              >
                Tutup
              </button>
            </div>
          </div>
        )}
      </GlassModal>

      {/* Modal Tolak Paket Tryout */}
      <GlassModal
        isOpen={!!rejectItem}
        onClose={() => setRejectItem(null)}
        title={`Tolak Paket: ${rejectItem?.title || ""}`}
        subtitle="Berikan instruksi revisi yang jelas agar mentor dapat memperbaiki komposisi paket ini."
      >
        <form onSubmit={handleConfirmReject} className="space-y-4">
          <div>
            <label htmlFor="alasan-tolak-paket" className="block text-xs font-semibold text-ink mb-1.5">
              Alasan Penolakan Paket TryOut <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="alasan-tolak-paket"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              required
              rows={4}
              placeholder="Contoh: Durasi waktu subtes Penalaran Matematika belum proporsional dengan 20 butir soal, sesuaikan alokasi waktu menjadi minimal 40 menit..."
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
