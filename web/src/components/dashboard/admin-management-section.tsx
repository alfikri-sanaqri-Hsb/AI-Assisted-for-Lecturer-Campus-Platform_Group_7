"use client";

import { useState } from "react";
import { DataTable } from "@/components/ui/data-table/data-table";
import { StatusBadge } from "@/components/ui/data-table/status-badge";
import { Icon } from "@/components/ui/icon";
import {
  MOCK_STUDENTS,
  MOCK_MENTORS,
  MOCK_ADMIN_MATERIALS,
  MOCK_CONTENT_REVIEWS,
  type StudentItem,
  type MentorItem,
  type AdminMaterialItem,
  type ContentReviewItem,
} from "@/data/mock/management-data";
import type { ColumnDef, FormField } from "@/components/ui/data-table/types";

export type AdminManagementTab = "students" | "mentors" | "materials" | "reviews";

export function AdminManagementSection({
  initialTab = "students",
  showTabs = true,
}: {
  initialTab?: AdminManagementTab;
  showTabs?: boolean;
} = {}) {
  const [activeTab, setActiveTab] = useState<AdminManagementTab>(initialTab);

  // Kolom Siswa
  const studentColumns: ColumnDef<StudentItem>[] = [
    {
      key: "name",
      header: "Siswa",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand-100 text-xs font-bold text-brand-700 ring-1 ring-brand-500/20">
            {row.name.slice(0, 2).toUpperCase()}
          </span>
          <div className="leading-tight">
            <p className="font-semibold text-ink">{row.name}</p>
            <p className="text-xs text-muted">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "school",
      header: "Asal Sekolah",
      sortable: true,
      render: (row) => <span className="font-medium text-ink">{row.school}</span>,
    },
    {
      key: "targetMajor",
      header: "Target Jurusan & PTN",
      sortable: true,
      render: (row) => (
        <span className="inline-flex rounded-lg bg-white/70 px-2.5 py-1 text-xs font-semibold text-brand-700 border border-brand-100">
          {row.targetMajor}
        </span>
      ),
    },
    {
      key: "tryoutCount",
      header: "Tryout",
      sortable: true,
      className: "text-center",
      render: (row) => (
        <span className="font-semibold text-ink tabular-nums">{row.tryoutCount}x</span>
      ),
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
      key: "status",
      header: "Status",
      sortable: true,
      render: (row) => <StatusBadge status={row.status} />,
    },
  ];

  const studentFormFields: FormField[] = [
    { name: "name", label: "Nama Lengkap Siswa", type: "text", required: true, placeholder: "Contoh: Budi Pratama" },
    { name: "email", label: "Email Siswa", type: "text", required: true, placeholder: "nama@student.sch.id" },
    { name: "school", label: "Asal Sekolah", type: "text", required: true, placeholder: "Contoh: SMAN 8 Jakarta" },
    { name: "targetMajor", label: "Target Jurusan & PTN", type: "text", required: true, placeholder: "Contoh: Teknik Informatika (ITB)" },
    {
      name: "status",
      label: "Status Akun",
      type: "select",
      required: true,
      options: [
        { label: "Aktif", value: "Aktif" },
        { label: "Menunggu Aktivasi", value: "Menunggu Aktivasi" },
        { label: "Nonaktif", value: "Nonaktif" },
      ],
      defaultValue: "Aktif",
    },
    { name: "avgScore", label: "Nilai Simulasi Awal", type: "number", defaultValue: 650 },
  ];

  // Kolom Mentor
  const mentorColumns: ColumnDef<MentorItem>[] = [
    {
      key: "name",
      header: "Mentor",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand-500 text-xs font-bold text-white shadow-xs">
            {row.name.slice(0, 2).toUpperCase()}
          </span>
          <div className="leading-tight">
            <p className="font-semibold text-ink">{row.name}</p>
            <p className="text-xs text-muted">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "subject",
      header: "Spesialisasi Subtes",
      sortable: true,
      render: (row) => (
        <span className="font-medium text-ink bg-white/60 px-2.5 py-1 rounded-lg border border-line text-xs">
          {row.subject}
        </span>
      ),
    },
    {
      key: "assignedStudentsCount",
      header: "Siswa Binaan",
      sortable: true,
      className: "text-center",
      render: (row) => (
        <span className="font-semibold text-ink tabular-nums">{row.assignedStudentsCount} siswa</span>
      ),
    },
    {
      key: "materialsCount",
      header: "Materi / Modul",
      sortable: true,
      className: "text-center",
      render: (row) => (
        <span className="font-semibold text-ink tabular-nums">{row.materialsCount} materi</span>
      ),
    },
    {
      key: "rating",
      header: "Rating",
      sortable: true,
      render: (row) => (
        <span className="inline-flex items-center gap-1 font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200/60 text-xs">
          ⭐ {row.rating.toFixed(1)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (row) => <StatusBadge status={row.status} />,
    },
  ];

  const mentorFormFields: FormField[] = [
    { name: "name", label: "Nama Mentor Lengkap & Gelar", type: "text", required: true, placeholder: "Contoh: Dr. Rian Pratama, M.Si." },
    { name: "email", label: "Email Resmi Mentor", type: "text", required: true, placeholder: "nama.mentor@alfary.id" },
    {
      name: "subject",
      label: "Spesialisasi Subtes",
      type: "select",
      required: true,
      options: [
        { label: "Penalaran Umum (PU)", value: "Penalaran Umum (PU)" },
        { label: "Pengetahuan Kuantitatif (PK)", value: "Pengetahuan Kuantitatif (PK)" },
        { label: "Literasi Bahasa Indonesia & Inggris", value: "Literasi Bahasa Indonesia & Inggris" },
        { label: "Pemahaman Bacaan & Menulis (PBM)", value: "Pemahaman Bacaan & Menulis (PBM)" },
        { label: "Penalaran Matematika", value: "Penalaran Matematika" },
      ],
    },
    {
      name: "status",
      label: "Status Verifikasi",
      type: "select",
      required: true,
      options: [
        { label: "Aktif", value: "Aktif" },
        { label: "Menunggu Verifikasi", value: "Menunggu Verifikasi" },
        { label: "Cuti", value: "Cuti" },
      ],
      defaultValue: "Aktif",
    },
  ];

  // Kolom Materi Pembelajaran Admin
  const adminMaterialColumns: ColumnDef<AdminMaterialItem>[] = [
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
      key: "type",
      header: "Format",
      sortable: true,
      render: (row) => (
        <span className="font-medium text-xs text-muted bg-white/70 px-2 py-0.5 rounded-lg border border-line">
          {row.type}
        </span>
      ),
    },
    {
      key: "author",
      header: "Mentor Penyusun",
      sortable: true,
      render: (row) => <span className="font-medium text-ink">{row.author}</span>,
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
      key: "updatedAt",
      header: "Diperbarui",
      sortable: true,
      render: (row) => <span className="text-muted text-xs">{row.updatedAt}</span>,
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (row) => <StatusBadge status={row.status} />,
    },
  ];

  const adminMaterialFormFields: FormField[] = [
    { name: "title", label: "Judul Materi / Modul", type: "text", required: true, placeholder: "Contoh: Masteri Pola Silogisme" },
    {
      name: "subtest",
      label: "Mata Uji Subtes UTBK",
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
        { label: "Bank Soal", value: "Bank Soal" },
      ],
    },
    { name: "author", label: "Mentor Penanggung Jawab", type: "text", required: true, placeholder: "Contoh: Dr. Hendra Gunawan, M.Si." },
    {
      name: "status",
      label: "Status Publikasi",
      type: "select",
      required: true,
      options: [
        { label: "Diterbitkan", value: "Diterbitkan" },
        { label: "Draft", value: "Draft" },
        { label: "Dalam Peninjauan", value: "Dalam Peninjauan" },
        { label: "Perlu Revisi", value: "Perlu Revisi" },
      ],
      defaultValue: "Diterbitkan",
    },
  ];

  // Kolom Peninjauan Konten
  const [reviews, setReviews] = useState<ContentReviewItem[]>(MOCK_CONTENT_REVIEWS);

  const reviewColumns: ColumnDef<ContentReviewItem>[] = [
    {
      key: "title",
      header: "Judul Konten",
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-semibold text-ink line-clamp-1">{row.title}</p>
          <p className="text-xs text-brand-600 font-medium">{row.subject}</p>
        </div>
      ),
    },
    {
      key: "contentType",
      header: "Tipe",
      sortable: true,
      render: (row) => (
        <span className="font-medium text-xs text-muted">{row.contentType}</span>
      ),
    },
    {
      key: "author",
      header: "Penyusun / Mentor",
      sortable: true,
      render: (row) => <span className="font-medium text-ink">{row.author}</span>,
    },
    {
      key: "submissionDate",
      header: "Tanggal Masuk",
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

  const handleApproveContent = (id: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "Disetujui" } : r))
    );
  };

  const handleRequestRevision = (id: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "Perlu Revisi" } : r))
    );
  };

  return (
    <section aria-labelledby="manajemen-admin-judul" className="space-y-4">
      {/* Tab Navigation Glassmorphism (hanya ditampilkan jika showTabs = true) */}
      {showTabs && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line/60 pb-2">
          <div>
            <h2 id="manajemen-admin-judul" className="text-lg font-bold text-ink">
              Modul Manajemen Platform
            </h2>
            <p className="text-xs text-muted">
              Kelola data operasional siswa, mentor, dan kurasi konten pembelajaran secara terintegrasi.
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
              <span>Data Siswa</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("mentors")}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                activeTab === "mentors"
                  ? "bg-brand-500 text-white shadow-xs shadow-brand-500/25"
                  : "text-muted hover:text-ink hover:bg-white/60"
              }`}
            >
              <Icon name="mentor" className="size-4" />
              <span>Daftar Mentor</span>
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
              <span>Materi</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("reviews")}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                activeTab === "reviews"
                  ? "bg-brand-500 text-white shadow-xs shadow-brand-500/25"
                  : "text-muted hover:text-ink hover:bg-white/60"
              }`}
            >
              <Icon name="review" className="size-4" />
              <span>Peninjauan Konten</span>
            </button>
          </div>
        </div>
      )}

      {/* Konten Tab Aktif */}
      {activeTab === "students" && (
        <DataTable<StudentItem>
          title="Manajemen Siswa UTBK-SNBT"
          description="Pantau perkembangan pendaftaran, aktivitas tryout, dan target PTN siswa binaan Sahabat Alfary."
          columns={studentColumns}
          data={MOCK_STUDENTS}
          searchPlaceholder="Cari siswa, email, atau asal sekolah..."
          searchKeys={["name", "email", "school", "targetMajor"]}
          filters={[
            {
              key: "status",
              label: "Status",
              options: [
                { label: "Aktif", value: "Aktif" },
                { label: "Menunggu Aktivasi", value: "Menunggu Aktivasi" },
                { label: "Nonaktif", value: "Nonaktif" },
              ],
            },
          ]}
          formFields={studentFormFields}
          fieldLabels={{
            name: "Nama Siswa",
            email: "Email",
            school: "Asal Sekolah",
            targetMajor: "Target Jurusan & PTN",
            tryoutCount: "Jumlah Tryout",
            avgScore: "Rata-rata Skor",
            status: "Status Akun",
            joinedAt: "Terdaftar Pada",
          }}
          exportFileName="data-siswa-sahabat-alfary"
        />
      )}

      {activeTab === "mentors" && (
        <DataTable<MentorItem>
          title="Manajemen Mentor Akademik"
          description="Daftar tenaga pengajar ahli dan mentor pembimbing intensif persiapan UTBK-SNBT."
          columns={mentorColumns}
          data={MOCK_MENTORS}
          searchPlaceholder="Cari mentor, email, atau subtes keahlian..."
          searchKeys={["name", "email", "subject"]}
          filters={[
            {
              key: "status",
              label: "Status",
              options: [
                { label: "Aktif", value: "Aktif" },
                { label: "Menunggu Verifikasi", value: "Menunggu Verifikasi" },
                { label: "Cuti", value: "Cuti" },
              ],
            },
          ]}
          formFields={mentorFormFields}
          fieldLabels={{
            name: "Nama Mentor",
            email: "Email Resmi",
            subject: "Spesialisasi Subtes",
            assignedStudentsCount: "Jumlah Siswa Binaan",
            materialsCount: "Materi / Modul",
            status: "Status",
            rating: "Rating Pengajaran",
            joinedAt: "Bergabung Pada",
          }}
          exportFileName="data-mentor-sahabat-alfary"
        />
      )}

      {activeTab === "materials" && (
        <DataTable<AdminMaterialItem>
          title="Manajemen Materi Pembelajaran Platform"
          description="Kelola kurikulum modul pembelajaran, naskah materi teori, dan paket soal persiapan UTBK-SNBT."
          columns={adminMaterialColumns}
          data={MOCK_ADMIN_MATERIALS}
          searchPlaceholder="Cari judul materi, subtes, atau mentor penyusun..."
          searchKeys={["title", "subtest", "author", "type"]}
          filters={[
            {
              key: "status",
              label: "Status",
              options: [
                { label: "Diterbitkan", value: "Diterbitkan" },
                { label: "Draft", value: "Draft" },
                { label: "Dalam Peninjauan", value: "Dalam Peninjauan" },
                { label: "Perlu Revisi", value: "Perlu Revisi" },
              ],
            },
            {
              key: "type",
              label: "Format",
              options: [
                { label: "Modul Ringkasan", value: "Modul Ringkasan" },
                { label: "Paket Latihan Soal", value: "Paket Latihan Soal" },
                { label: "Pembahasan Video", value: "Pembahasan Video" },
                { label: "Bank Soal", value: "Bank Soal" },
              ],
            },
          ]}
          formFields={adminMaterialFormFields}
          fieldLabels={{
            title: "Judul Materi / Modul",
            subtest: "Mata Uji Subtes",
            type: "Format Konten",
            author: "Mentor Penanggung Jawab",
            totalAccess: "Total Akses Siswa",
            status: "Status Publikasi",
            updatedAt: "Terakhir Diperbarui",
          }}
          exportFileName="materi-pembelajaran-admin"
        />
      )}

      {activeTab === "reviews" && (
        <DataTable<ContentReviewItem>
          title="Kurasi & Peninjauan Konten Pembelajaran"
          description="Evaluasi modul materi, bank soal, dan paket tryout yang diajukan mentor sebelum dipublikasikan ke siswa."
          columns={reviewColumns}
          data={reviews}
          searchPlaceholder="Cari judul konten, mentor pengunggah, atau subtes..."
          searchKeys={["title", "author", "subject", "contentType"]}
          filters={[
            {
              key: "status",
              label: "Status Peninjauan",
              options: [
                { label: "Menunggu Peninjauan", value: "Menunggu Peninjauan" },
                { label: "Disetujui", value: "Disetujui" },
                { label: "Perlu Revisi", value: "Perlu Revisi" },
              ],
            },
            {
              key: "contentType",
              label: "Tipe Konten",
              options: [
                { label: "Materi Pembelajaran", value: "Materi Pembelajaran" },
                { label: "Bank Soal", value: "Bank Soal" },
                { label: "Paket Tryout", value: "Paket Tryout" },
              ],
            },
          ]}
          fieldLabels={{
            title: "Judul Konten",
            contentType: "Tipe Konten",
            subject: "Mata Uji Subtes",
            author: "Penyusun / Mentor",
            submissionDate: "Tanggal Pengajuan",
            status: "Status Peninjauan",
            questionCount: "Jumlah Soal",
            notes: "Catatan Evaluasi / Telaah",
          }}
          customRowActions={(item) => (
            <div className="flex items-center gap-1 mr-1">
              {item.status !== "Disetujui" && (
                <button
                  type="button"
                  onClick={() => handleApproveContent(item.id)}
                  title="Setujui & Publikasikan"
                  className="grid size-8 place-items-center rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                >
                  <Icon name="check" className="size-4" />
                </button>
              )}
              {item.status !== "Perlu Revisi" && (
                <button
                  type="button"
                  onClick={() => handleRequestRevision(item.id)}
                  title="Minta Revisi ke Mentor"
                  className="grid size-8 place-items-center rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <Icon name="revise" className="size-4" />
                </button>
              )}
            </div>
          )}
          exportFileName="kurasi-konten-sahabat-alfary"
        />
      )}
    </section>
  );
}
