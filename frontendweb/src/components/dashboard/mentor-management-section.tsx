"use client";

import { useState } from "react";
import { DataTable } from "@/components/ui/data-table/data-table";
import { StatusBadge } from "@/components/ui/data-table/status-badge";
import { Icon } from "@/components/ui/icon";
import { GlassModal } from "@/components/ui/data-table/table-modal";
import {
  MOCK_ASSIGNED_STUDENTS,
  MOCK_MENTOR_MATERIALS,
  type MentorStudentItem,
  type MentorMaterialItem,
} from "@/data/mock/management-data";
import type { ColumnDef, FormField } from "@/components/ui/data-table/types";

export type MentorManagementTab = "students" | "materials";

export function MentorManagementSection({
  initialTab = "students",
  showTabs = true,
}: {
  initialTab?: MentorManagementTab;
  showTabs?: boolean;
} = {}) {
  const [activeTab, setActiveTab] = useState<MentorManagementTab>(initialTab);

  // Feedback Modal State for Mentor
  const [feedbackStudent, setFeedbackStudent] = useState<MentorStudentItem | null>(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const handleOpenFeedback = (student: MentorStudentItem) => {
    setFeedbackStudent(student);
    setFeedbackText("");
    setFeedbackSubmitted(false);
  };

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackSubmitted(true);
    setTimeout(() => {
      setFeedbackStudent(null);
      setFeedbackSubmitted(false);
    }, 1500);
  };

  // Kolom Siswa Binaan
  const studentColumns: ColumnDef<MentorStudentItem>[] = [
    {
      key: "name",
      header: "Siswa Binaan",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand-50 text-xs font-bold text-brand-600 ring-1 ring-brand-500/20">
            {row.name.slice(0, 2).toUpperCase()}
          </span>
          <div className="leading-tight">
            <p className="font-semibold text-ink">{row.name}</p>
            <p className="text-xs text-muted">{row.lastActive}</p>
          </div>
        </div>
      ),
    },
    {
      key: "targetMajor",
      header: "Target Kelulusan",
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-semibold text-ink text-xs sm:text-sm">{row.targetMajor}</p>
          <p className="text-xs text-brand-600 font-medium">{row.targetCampus}</p>
        </div>
      ),
    },
    {
      key: "progressPercent",
      header: "Progres Belajar",
      sortable: true,
      render: (row) => (
        <div className="w-36">
          <div className="flex items-center justify-between text-xs font-semibold text-ink mb-1">
            <span>{row.progressPercent}%</span>
            <span className="text-[10px] text-muted">target tercapai</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200/70">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                row.progressPercent >= 80
                  ? "bg-emerald-500"
                  : row.progressPercent >= 60
                  ? "bg-brand-500"
                  : "bg-amber-500"
              }`}
              style={{ width: `${row.progressPercent}%` }}
            />
          </div>
        </div>
      ),
    },
    {
      key: "lastTryoutScore",
      header: "Skor Tryout Terakhir",
      sortable: true,
      render: (row) => (
        <span className="font-bold text-brand-600 tabular-nums">{row.lastTryoutScore}</span>
      ),
    },
    {
      key: "consultationStatus",
      header: "Status Konsultasi",
      sortable: true,
      render: (row) => <StatusBadge status={row.consultationStatus} />,
    },
  ];

  const studentFormFields: FormField[] = [
    { name: "name", label: "Nama Siswa", type: "text", required: true, placeholder: "Contoh: Rizky Ramadhan" },
    { name: "targetMajor", label: "Program Studi Target", type: "text", required: true, placeholder: "Contoh: Kedokteran" },
    { name: "targetCampus", label: "Universitas / PTN Impian", type: "text", required: true, placeholder: "Contoh: Universitas Indonesia" },
    { name: "lastTryoutScore", label: "Skor Tryout Awal", type: "number", defaultValue: 650 },
    {
      name: "consultationStatus",
      label: "Status Konsultasi",
      type: "select",
      options: [
        { label: "Terjadwal", value: "Terjadwal" },
        { label: "Perlu Feedback", value: "Perlu Feedback" },
        { label: "Selesai", value: "Selesai" },
      ],
      defaultValue: "Terjadwal",
    },
  ];

  // Kolom Materi & Soal Mentor
  const materialColumns: ColumnDef<MentorMaterialItem>[] = [
    {
      key: "title",
      header: "Judul Materi / Modul",
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-semibold text-ink line-clamp-1">{row.title}</p>
          <p className="text-xs text-muted">Terakhir diperbarui: {row.updatedAt}</p>
        </div>
      ),
    },
    {
      key: "category",
      header: "Kategori Subtes",
      sortable: true,
      render: (row) => <StatusBadge status={row.category} variant="brand" />,
    },
    {
      key: "type",
      header: "Format Modul",
      sortable: true,
      render: (row) => (
        <span className="font-medium text-xs text-muted bg-white/70 px-2 py-0.5 rounded-lg border border-line">
          {row.type}
        </span>
      ),
    },
    {
      key: "totalViews",
      header: "Tayangan Siswa",
      sortable: true,
      className: "text-center",
      render: (row) => (
        <span className="font-semibold text-ink tabular-nums">{row.totalViews}x</span>
      ),
    },
    {
      key: "status",
      header: "Status Kurasi",
      sortable: true,
      render: (row) => <StatusBadge status={row.status} />,
    },
  ];

  const materialFormFields: FormField[] = [
    { name: "title", label: "Judul Modul / Paket Soal", type: "text", required: true, placeholder: "Contoh: Strategi Penalaran Deduktif & Silogisme" },
    {
      name: "category",
      label: "Kategori Subtes SNBT",
      type: "select",
      required: true,
      options: [
        { label: "Penalaran Umum", value: "Penalaran Umum" },
        { label: "Pengetahuan Kuantitatif", value: "Pengetahuan Kuantitatif" },
        { label: "Literasi Bahasa", value: "Literasi Bahasa" },
        { label: "Penalaran Matematika", value: "Penalaran Matematika" },
      ],
    },
    {
      name: "type",
      label: "Format Konten",
      type: "select",
      required: true,
      options: [
        { label: "Modul Ringkasan", value: "Modul Ringkasan" },
        { label: "Paket Latihan Soal", value: "Paket Latihan Soal" },
        { label: "Pembahasan Video", value: "Pembahasan Video" },
      ],
    },
    {
      name: "status",
      label: "Status Publikasi",
      type: "select",
      required: true,
      options: [
        { label: "Draft", value: "Draft" },
        { label: "Diajukan", value: "Diajukan" },
      ],
      defaultValue: "Draft",
    },
  ];

  return (
    <section aria-labelledby="manajemen-mentor-judul" className="space-y-4">
      {/* Header & Tab Navigation (hanya ditampilkan jika showTabs = true) */}
      {showTabs && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line/60 pb-2">
          <div>
            <h2 id="manajemen-mentor-judul" className="text-lg font-bold text-ink">
              Pusat Kerja & Bimbingan Mentor
            </h2>
            <p className="text-xs text-muted">
              Kelola perkembangan belajar siswa binaan dan susun materi pembelajaran persiapan UTBK-SNBT.
            </p>
          </div>

          <div className="flex items-center gap-1.5 rounded-2xl bg-white/70 p-1.5 border border-white/80 shadow-xs backdrop-blur-md">
            <button
              type="button"
              onClick={() => setActiveTab("students")}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                activeTab === "students"
                  ? "bg-brand-500 text-white shadow-xs shadow-brand-500/25"
                  : "text-muted hover:text-ink hover:bg-white/60"
              }`}
            >
              <Icon name="users" className="size-4" />
              <span>Siswa Binaan</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("materials")}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                activeTab === "materials"
                  ? "bg-brand-500 text-white shadow-xs shadow-brand-500/25"
                  : "text-muted hover:text-ink hover:bg-white/60"
              }`}
            >
              <Icon name="book" className="size-4" />
              <span>Materi & Soal Saya</span>
            </button>
          </div>
        </div>
      )}

      {/* Konten Tab Siswa Binaan */}
      {activeTab === "students" && (
        <DataTable<MentorStudentItem>
          title="Daftar Siswa Binaan Saya"
          description="Pantau konsistensi pengerjaan tryout, capaian skor, dan berikan feedback bimbingan secara personal."
          columns={studentColumns}
          data={MOCK_ASSIGNED_STUDENTS}
          searchPlaceholder="Cari siswa, jurusan, atau kampus impian..."
          searchKeys={["name", "targetMajor", "targetCampus"]}
          filters={[
            {
              key: "consultationStatus",
              label: "Konsultasi",
              options: [
                { label: "Terjadwal", value: "Terjadwal" },
                { label: "Perlu Feedback", value: "Perlu Feedback" },
                { label: "Selesai", value: "Selesai" },
              ],
            },
          ]}
          formFields={studentFormFields}
          fieldLabels={{
            name: "Nama Siswa",
            targetMajor: "Program Studi Impian",
            targetCampus: "Universitas Tujuan",
            progressPercent: "Progres Belajar (%)",
            lastTryoutScore: "Skor Tryout Terakhir",
            consultationStatus: "Status Bimbingan",
            lastActive: "Aktivitas Terakhir",
          }}
          customRowActions={(item) => (
            <button
              type="button"
              onClick={() => handleOpenFeedback(item)}
              title="Beri Feedback Bimbingan"
              className="inline-flex items-center gap-1 rounded-lg bg-brand-50 hover:bg-brand-100 text-brand-700 px-2 py-1 text-xs font-semibold border border-brand-200/60 transition-colors mr-1"
            >
              <Icon name="clipboard" className="size-3.5" />
              <span className="hidden xl:inline">Feedback</span>
            </button>
          )}
          exportFileName="siswa-binaan-mentor"
        />
      )}

      {/* Konten Tab Materi & Soal */}
      {activeTab === "materials" && (
        <DataTable<MentorMaterialItem>
          title="Koleksi Materi & Bank Soal Mentor"
          description="Daftar materi ringkasan, latihan soal, dan pembahasan yang Anda buat dan diajukan untuk ditinjau administrator."
          columns={materialColumns}
          data={MOCK_MENTOR_MATERIALS}
          searchPlaceholder="Cari judul modul atau kategori subtes..."
          searchKeys={["title", "category", "type"]}
          filters={[
            {
              key: "status",
              label: "Status",
              options: [
                { label: "Diterbitkan", value: "Diterbitkan" },
                { label: "Diajukan", value: "Diajukan" },
                { label: "Draft", value: "Draft" },
                { label: "Perlu Revisi", value: "Perlu Revisi" },
              ],
            },
            {
              key: "category",
              label: "Subtes",
              options: [
                { label: "Penalaran Umum", value: "Penalaran Umum" },
                { label: "Pengetahuan Kuantitatif", value: "Pengetahuan Kuantitatif" },
                { label: "Literasi Bahasa", value: "Literasi Bahasa" },
                { label: "Penalaran Matematika", value: "Penalaran Matematika" },
              ],
            },
          ]}
          formFields={materialFormFields}
          fieldLabels={{
            title: "Judul Modul / Latihan Soal",
            category: "Subtes Materi",
            type: "Format Konten",
            status: "Status Publikasi",
            updatedAt: "Terakhir Diperbarui",
            totalViews: "Jumlah Tayangan Siswa",
          }}
          exportFileName="materi-mentor-sahabat-alfary"
        />
      )}

      {/* Modal Interaktif: Berikan Feedback ke Siswa Binaan */}
      <GlassModal
        isOpen={!!feedbackStudent}
        onClose={() => setFeedbackStudent(null)}
        title={`Beri Feedback: ${feedbackStudent?.name || ""}`}
        subtitle="Sampaikan evaluasi belajar, rekomendasi subtes yang perlu diperkuat, atau jadwal sesi tatap muka."
      >
        {feedbackSubmitted ? (
          <div className="flex flex-col items-center justify-center py-6 text-center animate-in zoom-in-95">
            <span className="grid size-12 place-items-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
              <Icon name="check" className="size-6" />
            </span>
            <p className="mt-3 text-base font-bold text-ink">Feedback Berhasil Terkirim!</p>
            <p className="mt-1 text-xs text-muted">
              Siswa akan menerima pemberitahuan di aplikasi pembelajaran mereka.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmitFeedback} className="space-y-4">
            <div className="rounded-xl border border-brand-100 bg-brand-50/60 p-3 text-xs leading-relaxed text-brand-900">
              <p className="font-semibold">Target Siswa:</p>
              <p>
                {feedbackStudent?.targetMajor} - {feedbackStudent?.targetCampus} (Skor Terakhir: {feedbackStudent?.lastTryoutScore})
              </p>
            </div>

            <div>
              <label htmlFor="mentor-feedback-area" className="block text-xs font-semibold text-ink mb-1.5">
                Catatan Bimbingan & Rekomendasi Belajar <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="mentor-feedback-area"
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                required
                rows={4}
                placeholder="Contoh: Perbanyak latihan pada subtes Pengetahuan Kuantitatif modul 3, fokus pada penalaran logika silogisme..."
                className="w-full rounded-xl border border-line bg-white/80 px-3.5 py-2.5 text-xs sm:text-sm text-ink backdrop-blur-xs transition-colors focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-line/60 pt-4">
              <button
                type="button"
                onClick={() => setFeedbackStudent(null)}
                className="rounded-xl border border-line bg-white/80 px-4 py-2 text-xs font-semibold text-ink hover:bg-white transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="rounded-xl bg-brand-500 hover:bg-brand-600 px-5 py-2 text-xs font-semibold text-white shadow-xs shadow-brand-500/25 transition-colors focus-visible:outline-2 focus-visible:outline-brand-600"
              >
                Kirim Feedback
              </button>
            </div>
          </form>
        )}
      </GlassModal>
    </section>
  );
}
