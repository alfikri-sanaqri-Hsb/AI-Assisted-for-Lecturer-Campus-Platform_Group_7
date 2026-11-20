"use client";

import { useState, useEffect } from "react";
import { DataTable } from "@/components/ui/data-table/data-table";
import { StatusBadge } from "@/components/ui/data-table/status-badge";
import { GlassModal } from "@/components/ui/data-table/table-modal";
import { Icon } from "@/components/ui/icon";
import { ErrorState } from "@/components/ui/async-state";
import { studentService } from "@/services";
import type { Student } from "@/types";
import type { ColumnDef } from "@/components/ui/data-table/types";
import { ACTIVE_MOCK_MENTOR } from "@/config/mock-identities";

export function MentorStudentBinaanManagement() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Modal Feedback Bimbingan
  const [feedbackStudent, setFeedbackStudent] = useState<Student | null>(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const loadData = async () => {
    try {
      // Hanya mengambil siswa binaan aktif milik mentor ini
      const data = await studentService.getAssignedStudents(ACTIVE_MOCK_MENTOR.id);
      setStudents(data);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Siswa binaan gagal dimuat.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => { void loadData(); }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const handleOpenFeedback = (student: Student) => {
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

  const columns: ColumnDef<Student>[] = [
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
            <p className="text-xs text-muted">{row.school}</p>
          </div>
        </div>
      ),
    },
    {
      key: "targetMajor",
      header: "Target Kelulusan SNBT",
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-semibold text-ink text-xs sm:text-sm">{row.targetMajor}</p>
          <p className="text-xs text-brand-600 font-medium">{row.targetCampus}</p>
        </div>
      ),
    },
    {
      key: "tryoutCount",
      header: "Tryout Diikuti",
      sortable: true,
      className: "text-center",
      render: (row) => <span className="font-semibold text-ink tabular-nums">{row.tryoutCount}x</span>,
    },
    {
      key: "avgScore",
      header: "Rata-rata Skor",
      sortable: true,
      render: (row) => (
        <span className="font-bold text-brand-600 tabular-nums">{row.avgScore}</span>
      ),
    },
    {
      key: "lastActive",
      header: "Aktivitas Terakhir",
      sortable: true,
      render: (row) => <span className="text-muted text-xs">{row.lastActive || "Hari ini"}</span>,
    },
    {
      key: "status",
      header: "Status Binaan",
      sortable: true,
      render: (row) => <StatusBadge status={row.status} />,
    },
  ];

  if (loading) {
    return <div className="p-8 text-center text-sm text-muted">Memuat siswa binaan...</div>;
  }
  if (loadError) return <ErrorState message={loadError} onRetry={() => { setLoadError(null); void loadData(); }} />;

  return (
    <>
      <div className="rounded-2xl border border-sky-100 bg-sky-50/60 p-4 text-xs text-sky-950 leading-relaxed backdrop-blur-xs flex items-start gap-3">
        <span className="grid size-6 shrink-0 place-items-center rounded-xl bg-sky-500 text-white shadow-xs">
          <Icon name="users" className="size-3.5" />
        </span>
        <div>
          <p className="font-bold">Batasan Otorisasi Mentor (Bagian 5 & 10):</p>
          <p className="text-sky-800/90 mt-0.5">
            Mentor hanya berwenang memantau perkembangan akademik dan memberikan feedback bagi siswa yang memiliki penugasan (assignment) aktif.
            Mentor tidak dapat mengakses siswa di luar binaannya dan tidak memiliki kewenangan mengubah data master siswa.
          </p>
        </div>
      </div>

      <DataTable<Student>
        title="Daftar Siswa Binaan Saya"
        description="Pantau konsistensi pengerjaan tryout, capaian skor SNBT, target program studi impian, dan sampaikan catatan bimbingan intensif."
        columns={columns}
        data={students}
        searchPlaceholder="Cari siswa binaan, target jurusan, atau asal sekolah..."
        searchKeys={["name", "targetMajor", "targetCampus", "school"]}
        capabilities={{ delete: false }}
        fieldLabels={{
          name: "Nama Siswa Binaan",
          school: "Asal Sekolah",
          grade: "Jenjang / Kelas",
          targetMajor: "Program Studi Impian",
          targetCampus: "Universitas / PTN Tujuan",
          tryoutCount: "Jumlah Partisipasi Tryout",
          avgScore: "Rata-rata Skor SNBT",
          status: "Status Bimbingan",
          lastActive: "Aktivitas Terakhir",
          notes: "Catatan Pembinaan Mentor",
        }}
        customRowActions={(item) => (
          <button
            type="button"
            onClick={() => handleOpenFeedback(item)}
            title="Beri Catatan Bimbingan"
            className="inline-flex items-center gap-1 rounded-lg bg-brand-50 hover:bg-brand-100 text-brand-700 px-2.5 py-1 text-xs font-semibold border border-brand-200/60 transition-colors mr-1"
          >
            <Icon name="clipboard" className="size-3.5" />
            <span className="hidden sm:inline">Beri Feedback</span>
          </button>
        )}
        exportFileName="siswa-binaan-mentor"
      />

      {/* Modal Interaktif: Feedback Bimbingan */}
      <GlassModal
        isOpen={!!feedbackStudent}
        onClose={() => setFeedbackStudent(null)}
        title={`Beri Feedback: ${feedbackStudent?.name || ""}`}
        subtitle="Sampaikan evaluasi belajar, saran subtes yang perlu ditingkatkan, atau arahan persiapan tryout."
      >
        {feedbackSubmitted ? (
          <div className="flex flex-col items-center justify-center py-6 text-center animate-in zoom-in-95">
            <span className="grid size-12 place-items-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
              <Icon name="check" className="size-6" />
            </span>
            <p className="mt-3 text-base font-bold text-ink">Catatan Bimbingan Terkirim!</p>
            <p className="mt-1 text-xs text-muted">
              Siswa akan melihat feedback bimbingan ini pada aplikasi pembelajaran mobile mereka.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmitFeedback} className="space-y-4">
            <div className="rounded-xl border border-brand-100 bg-brand-50/60 p-3 text-xs leading-relaxed text-brand-900">
              <p className="font-semibold">Target Kelulusan Siswa:</p>
              <p>
                {feedbackStudent?.targetMajor} &bull; {feedbackStudent?.targetCampus} (Rata-rata Skor: {feedbackStudent?.avgScore})
              </p>
            </div>

            <div>
              <label htmlFor="mentor-feedback-text" className="block text-xs font-semibold text-ink mb-1.5">
                Catatan Evaluasi & Rekomendasi Belajar <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="mentor-feedback-text"
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                required
                rows={4}
                placeholder="Contoh: Tingkatkan latihan pada subtes Pengetahuan Kuantitatif modul aljabar kuadrat, pertahankan konsistensi kecepatan membaca silogisme..."
                className="w-full rounded-xl border border-line bg-white/80 px-3.5 py-2.5 text-xs sm:text-sm text-ink backdrop-blur-xs transition-colors focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-line/60 pt-4">
              <button
                type="button"
                onClick={() => setFeedbackStudent(null)}
                className="rounded-xl border border-line bg-white/80 px-4 py-2 text-xs font-semibold text-ink hover:bg-white"
              >
                Batal
              </button>
              <button
                type="submit"
                className="rounded-xl bg-brand-500 hover:bg-brand-600 px-5 py-2 text-xs font-semibold text-white shadow-xs"
              >
                Kirim Catatan Bimbingan
              </button>
            </div>
          </form>
        )}
      </GlassModal>
    </>
  );
}
