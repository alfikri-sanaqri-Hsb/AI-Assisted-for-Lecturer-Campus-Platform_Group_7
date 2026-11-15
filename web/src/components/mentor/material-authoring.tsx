"use client";

import { useState, useEffect } from "react";
import { DataTable } from "@/components/ui/data-table/data-table";
import { StatusBadge } from "@/components/ui/data-table/status-badge";
import { GlassModal } from "@/components/ui/data-table/table-modal";
import { Icon } from "@/components/ui/icon";
import { materialService } from "@/services";
import type { LearningMaterial, MaterialFormat, ContentStatus } from "@/types";
import type { ColumnDef, FormField } from "@/components/ui/data-table/types";

const ACTIVE_MENTOR_ID = "mnt-01"; // Dr. Hendra Gunawan
const ACTIVE_MENTOR_NAME = "Dr. Hendra Gunawan, M.Si.";

export function MentorMaterialAuthoring() {
  const [materials, setMaterials] = useState<LearningMaterial[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal Detail & Riwayat
  const [detailItem, setDetailItem] = useState<LearningMaterial | null>(null);

  const loadData = async () => {
    try {
      const data = await materialService.getMaterialsByMentor(ACTIVE_MENTOR_ID);
      setMaterials(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmitForReview = async (id: string) => {
    await materialService.submitForReview(id, ACTIVE_MENTOR_NAME, ACTIVE_MENTOR_ID);
    loadData();
  };

  const columns: ColumnDef<LearningMaterial>[] = [
    {
      key: "title",
      header: "Judul Modul / Materi",
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-semibold text-ink line-clamp-1">{row.title}</p>
          <p className="text-xs text-muted">Diperbarui: {row.updatedAt}</p>
        </div>
      ),
    },
    {
      key: "subtest",
      header: "Subtes SNBT",
      sortable: true,
      render: (row) => (
        <span className="font-medium text-xs text-brand-700 bg-brand-50 px-2 py-0.5 rounded-lg border border-brand-200">
          {row.subtest}
        </span>
      ),
    },
    {
      key: "format",
      header: "Format Modul",
      sortable: true,
      render: (row) => (
        <span className="font-medium text-xs text-muted bg-white/70 px-2 py-0.5 rounded-lg border border-line">
          {row.format}
        </span>
      ),
    },
    {
      key: "totalAccess",
      header: "Akses Siswa",
      sortable: true,
      className: "text-center",
      render: (row) => (
        <span className="font-semibold text-ink tabular-nums">{row.totalAccess.toLocaleString("id-ID")}x</span>
      ),
    },
    {
      key: "status",
      header: "Status Kurasi",
      sortable: true,
      render: (row) => <StatusBadge status={row.status} />,
    },
  ];

  const formFields: FormField[] = [
    { name: "title", label: "Judul Materi / Modul", type: "text", required: true, placeholder: "Contoh: Strategi Aljabar Persamaan Kuadrat SNBT" },
    {
      name: "subtest",
      label: "Mata Uji Subtes SNBT",
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
    {
      name: "format",
      label: "Format Modul",
      type: "select",
      required: true,
      options: [
        { label: "Modul Ringkasan", value: "Modul Ringkasan" },
        { label: "Paket Latihan Soal", value: "Paket Latihan Soal" },
        { label: "Pembahasan Video", value: "Pembahasan Video" },
        { label: "E-Book Teori", value: "E-Book Teori" },
      ],
      defaultValue: "Modul Ringkasan",
    },
    { name: "summary", label: "Ringkasan Pembahasan", type: "text", required: true, placeholder: "Ringkasan 1-2 kalimat mengenai materi ini..." },
    { name: "content", label: "Isi Naskah / Teks Teori", type: "textarea", required: true, placeholder: "Tuliskan materi pembelajaran secara lengkap..." },
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
    await materialService.createMaterial(
      {
        title: String(newFields.title),
        subtest: String(newFields.subtest),
        format: (newFields.format as MaterialFormat) || "Modul Ringkasan",
        summary: String(newFields.summary),
        content: String(newFields.content),
        authorId: ACTIVE_MENTOR_ID,
        authorName: ACTIVE_MENTOR_NAME,
        status: (newFields.status as ContentStatus) || "DRAFT",
        isActive: true,
        totalAccess: 0,
      },
      "mentor"
    );
    loadData();
  };

  const handleUpdate = async (id: string | number, updated: Record<string, string | number>) => {
    try {
      await materialService.updateMaterialContent(String(id), updated as Partial<LearningMaterial>, "mentor", ACTIVE_MENTOR_ID);
      loadData();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Gagal memperbarui materi");
    }
  };

  const handleDelete = async (id: string | number) => {
    try {
      await materialService.deleteMaterial(String(id), "mentor", ACTIVE_MENTOR_ID);
      loadData();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Gagal menghapus materi");
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-sm text-muted">Memuat materi...</div>;
  }

  return (
    <>
      <DataTable<LearningMaterial>
        title="Koleksi Materi Pembelajaran Saya"
        description="Susun modul ringkasan teori, latihan soal, simpan draf, ajukan verifikasi ke administrator, dan perbaiki naskah yang ditolak."
        columns={columns}
        data={materials}
        searchPlaceholder="Cari judul modul atau subtes..."
        searchKeys={["title", "subtest", "format", "summary"]}
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
        fieldLabels={{
          title: "Judul Modul",
          subtest: "Mata Uji Subtes",
          format: "Format Modul",
          summary: "Ringkasan",
          content: "Isi Naskah",
          status: "Status Kurasi",
          rejectionReason: "Catatan Penolakan Admin",
          updatedAt: "Terakhir Diperbarui",
        }}
        customRowActions={(item) => (
          <div className="flex items-center gap-1 mr-1">
            <button
              type="button"
              onClick={() => setDetailItem(item)}
              title="Lihat Detail Naskah & Riwayat"
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
        exportFileName="materi-mentor-sahabat-alfary"
      />

      {/* Modal Detail Materi & Catatan Revisi */}
      <GlassModal
        isOpen={!!detailItem}
        onClose={() => setDetailItem(null)}
        title={`Rincian Materi: ${detailItem?.title || ""}`}
        subtitle={`Subtes: ${detailItem?.subtest || ""} • Format: ${detailItem?.format || ""}`}
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
                  Klik tombol Ubah pada baris tabel untuk memperbaiki naskah sesuai catatan di atas, kemudian klik &apos;Ajukan&apos;.
                </p>
              </div>
            )}

            <div className="rounded-xl border border-line/80 bg-white/70 p-4">
              <p className="font-bold text-muted text-xs uppercase tracking-wider mb-1">Ringkasan:</p>
              <p className="text-ink leading-relaxed">{detailItem.summary}</p>
            </div>

            <div className="rounded-xl border border-line/80 bg-white/70 p-4">
              <p className="font-bold text-muted text-xs uppercase tracking-wider mb-1">Naskah Pembahasan:</p>
              <p className="text-ink leading-relaxed whitespace-pre-wrap">{detailItem.content}</p>
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
