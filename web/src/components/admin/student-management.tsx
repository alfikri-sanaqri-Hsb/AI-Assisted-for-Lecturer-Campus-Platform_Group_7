"use client";

import { useState, useEffect } from "react";
import { DataTable } from "@/components/ui/data-table/data-table";
import { StatusBadge } from "@/components/ui/data-table/status-badge";
import { studentService } from "@/services";
import type { Student, StudentStatus } from "@/types";
import type { ColumnDef, FormField } from "@/components/ui/data-table/types";
import { normalizeEmail, validateEmail } from "@/lib/validation/email";
import { normalizePhone, validatePhone } from "@/lib/validation/phone";
import { ErrorState } from "@/components/ui/async-state";

export function AdminStudentManagement() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const data = await studentService.getAllStudents();
      setStudents(data);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Data siswa gagal dimuat.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => { void loadData(); }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const columns: ColumnDef<Student>[] = [
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
      header: "Sekolah & Kelas",
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-medium text-ink">{row.school}</p>
          <p className="text-xs text-muted">{row.grade}</p>
        </div>
      ),
    },
    {
      key: "phone",
      header: "No. Telepon",
      render: (row) => <span className="text-xs text-ink">{row.phone}</span>,
    },
    {
      key: "targetMajor",
      header: "Target Jurusan & PTN",
      sortable: true,
      render: (row) => (
        <span className="inline-flex rounded-lg bg-white/70 px-2.5 py-1 text-xs font-semibold text-brand-700 border border-brand-100">
          {row.targetMajor} ({row.targetCampus})
        </span>
      ),
    },
    {
      key: "tryoutCount",
      header: "Tryout",
      sortable: true,
      className: "text-center",
      render: (row) => <span className="font-semibold text-ink tabular-nums">{row.tryoutCount}x</span>,
    },
    {
      key: "avgScore",
      header: "Rata-rata Skor",
      sortable: true,
      render: (row) => <span className="font-bold text-brand-600 tabular-nums">{row.avgScore}</span>,
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (row) => <StatusBadge status={row.status} />,
    },
  ];

  const formFields: FormField[] = [
    { name: "name", label: "Nama Lengkap Siswa", type: "text", required: true, placeholder: "Contoh: Budi Pratama" },
    {
      name: "email",
      label: "Email Siswa",
      type: "email",
      required: true,
      placeholder: "nama@gmail.com",
      helpText: "Gunakan email aktif milik siswa.",
      normalize: normalizeEmail,
      validate: validateEmail,
    },
    {
      name: "phone",
      label: "Nomor WhatsApp / Telepon",
      type: "tel",
      required: true,
      placeholder: "0812-3456-7890",
      helpText: "Diawali 08, 10–13 digit. Spasi dan tanda hubung dibuang otomatis.",
      normalize: normalizePhone,
      validate: validatePhone,
    },
    {
      name: "grade",
      label: "Jenjang / Kelas",
      type: "select",
      required: true,
      options: [
        { label: "Kelas 12 SMA", value: "Kelas 12 SMA" },
        { label: "Gap Year", value: "Gap Year" },
        { label: "Alumni", value: "Alumni" },
      ],
      defaultValue: "Kelas 12 SMA",
    },
    { name: "school", label: "Asal Sekolah", type: "text", required: true, placeholder: "Contoh: SMAN 8 Jakarta" },
    { name: "targetMajor", label: "Target Program Studi", type: "text", required: true, placeholder: "Contoh: Kedokteran" },
    { name: "targetCampus", label: "Universitas / PTN Tujuan", type: "text", required: true, placeholder: "Contoh: Universitas Indonesia" },
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
    { name: "notes", label: "Catatan Pembinaan", type: "textarea", placeholder: "Catatan khusus bimbingan akademik..." },
  ];

  const handleCreate = async (newFields: Record<string, string | number>) => {
    await studentService.createStudent(
      {
        name: String(newFields.name),
        email: String(newFields.email),
        phone: String(newFields.phone || "-"),
        grade: String(newFields.grade || "Kelas 12 SMA"),
        school: String(newFields.school),
        targetMajor: String(newFields.targetMajor),
        targetCampus: String(newFields.targetCampus || "PTN"),
        status: (newFields.status as StudentStatus) || "Aktif",
        tryoutCount: 0,
        avgScore: Number(newFields.avgScore || 650),
        notes: String(newFields.notes || ""),
      },
      "admin"
    );
    loadData();
  };

  const handleUpdate = async (id: string | number, updated: Record<string, string | number>) => {
    await studentService.updateStudent(String(id), updated as Partial<Student>, "admin");
    loadData();
  };

  const handleDelete = async (id: string | number) => {
    await studentService.deleteStudent(String(id), "admin");
    loadData();
  };

  if (loadError) return <ErrorState message={loadError} onRetry={() => { setLoadError(null); void loadData(); }} />;
  if (loading) {
    return <div className="p-8 text-center text-sm text-muted">Memuat data siswa...</div>;
  }

  return (
    <DataTable<Student>
      title="Manajemen Siswa UTBK-SNBT"
      description="Kelola akun siswa terdaftar, pantau target jurusan PTN impian, dan data profil secara lengkap."
      columns={columns}
      data={students}
      searchPlaceholder="Cari siswa, email, sekolah, atau jurusan..."
      searchKeys={["name", "email", "school", "targetMajor", "targetCampus"]}
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
        {
          key: "grade",
          label: "Jenjang",
          options: [
            { label: "Kelas 12 SMA", value: "Kelas 12 SMA" },
            { label: "Gap Year", value: "Gap Year" },
          ],
        },
      ]}
      formFields={formFields}
      onItemCreate={handleCreate}
      onItemUpdate={handleUpdate}
      onItemDelete={handleDelete}
      capabilities={{ delete: true }}
      fieldLabels={{
        name: "Nama Lengkap",
        email: "Email Resmi",
        phone: "No. Telepon / WhatsApp",
        grade: "Jenjang / Kelas",
        school: "Asal Sekolah",
        targetMajor: "Target Jurusan",
        targetCampus: "PTN Tujuan",
        tryoutCount: "Jumlah Partisipasi Tryout",
        avgScore: "Rata-rata Skor SNBT",
        status: "Status Akun",
        joinedAt: "Tanggal Registrasi",
        assignedMentorName: "Mentor Pembimbing",
        lastActive: "Aktivitas Terakhir",
        notes: "Catatan Bimbingan",
      }}
      exportFileName="data-siswa-sahabat-alfary"
    />
  );
}
