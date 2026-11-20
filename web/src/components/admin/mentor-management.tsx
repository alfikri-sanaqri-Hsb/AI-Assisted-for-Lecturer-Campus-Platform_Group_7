"use client";

import { useState, useEffect } from "react";
import { DataTable } from "@/components/ui/data-table/data-table";
import { StatusBadge } from "@/components/ui/data-table/status-badge";
import { GlassModal } from "@/components/ui/data-table/table-modal";
import { Icon } from "@/components/ui/icon";
import { ErrorState } from "@/components/ui/async-state";
import { mentorService } from "@/services";
import type { Mentor, MentorStatus } from "@/types";
import type { ColumnDef, FormField } from "@/components/ui/data-table/types";
import { normalizeEmail, validateEmail } from "@/lib/validation/email";
import { normalizePhone, validatePhone } from "@/lib/validation/phone";

export function AdminMentorManagement() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Modal kelola kewenangan mentor
  const [permissionMentor, setPermissionMentor] = useState<Mentor | null>(null);
  const [permMaterials, setPermMaterials] = useState(true);
  const [permQuestions, setPermQuestions] = useState(true);
  const [permTryouts, setPermTryouts] = useState(false);

  const loadData = async () => {
    try {
      const data = await mentorService.getAllMentors();
      setMentors(data);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Data mentor gagal dimuat.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => { void loadData(); }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const handleOpenPermissions = (m: Mentor) => {
    setPermissionMentor(m);
    setPermMaterials(m.permissions.canCreateMaterials);
    setPermQuestions(m.permissions.canCreateQuestions);
    setPermTryouts(m.permissions.canCreateTryouts);
  };

  const handleSavePermissions = async () => {
    if (!permissionMentor) return;
    await mentorService.updateMentorPermissions(
      permissionMentor.id,
      {
        canCreateMaterials: permMaterials,
        canCreateQuestions: permQuestions,
        canCreateTryouts: permTryouts,
        canDirectPublish: false,
      },
      "admin"
    );
    setPermissionMentor(null);
    loadData();
  };

  const columns: ColumnDef<Mentor>[] = [
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
        <span className="font-semibold text-ink tabular-nums">{row.materialsCount} modul</span>
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

  const formFields: FormField[] = [
    { name: "name", label: "Nama Mentor Lengkap & Gelar", type: "text", required: true, placeholder: "Contoh: Dr. Rian Pratama, M.Si." },
    {
      name: "email",
      label: "Email Resmi Mentor",
      type: "email",
      required: true,
      placeholder: "nama.mentor@alfary.id",
      helpText: "Gunakan alamat email aktif milik mentor.",
      normalize: normalizeEmail,
      validate: validateEmail,
    },
    {
      name: "phone",
      label: "Nomor WhatsApp / Kontak",
      type: "tel",
      required: true,
      placeholder: "0812-3456-7890",
      helpText: "Diawali 08, 10–13 digit. Spasi dan tanda hubung dibuang otomatis.",
      normalize: normalizePhone,
      validate: validatePhone,
    },
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
        { label: "Penalaran Matematika & TPS", value: "Penalaran Matematika & TPS" },
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
        { label: "Nonaktif", value: "Nonaktif" },
      ],
      defaultValue: "Aktif",
    },
    { name: "bio", label: "Biografi Singkat & Kredensial", type: "textarea", placeholder: "Lulusan dan keahlian mengajar..." },
  ];

  const handleCreate = async (newFields: Record<string, string | number>) => {
    await mentorService.createMentor(
      {
        name: String(newFields.name),
        email: String(newFields.email),
        phone: String(newFields.phone || "-"),
        subject: String(newFields.subject),
        status: (newFields.status as MentorStatus) || "Aktif",
        assignedStudentsCount: 0,
        materialsCount: 0,
        questionsCount: 0,
        tryoutsCount: 0,
        rating: 5.0,
        bio: String(newFields.bio || ""),
        permissions: {
          canCreateMaterials: true,
          canCreateQuestions: true,
          canCreateTryouts: false,
          canDirectPublish: false,
        },
      },
      "admin"
    );
    loadData();
  };

  const handleUpdate = async (id: string | number, updated: Record<string, string | number>) => {
    await mentorService.updateMentor(String(id), updated as Partial<Mentor>, "admin");
    loadData();
  };

  const handleDelete = async (id: string | number) => {
    await mentorService.deleteMentor(String(id), "admin");
    loadData();
  };

  if (loadError) return <ErrorState message={loadError} onRetry={() => { setLoadError(null); void loadData(); }} />;
  if (loading) {
    return <div className="p-8 text-center text-sm text-muted">Memuat data mentor...</div>;
  }

  return (
    <>
      <DataTable<Mentor>
        title="Daftar Mentor & Tim Akademik"
        description="Kelola data mentor, spesialisasi subtes pengajaran, atur kewenangan konten akademik, dan pantau status aktif."
        columns={columns}
        data={mentors}
        searchPlaceholder="Cari mentor, email, atau subtes..."
        searchKeys={["name", "email", "subject"]}
        filters={[
          {
            key: "status",
            label: "Status",
            options: [
              { label: "Aktif", value: "Aktif" },
              { label: "Menunggu Verifikasi", value: "Menunggu Verifikasi" },
              { label: "Cuti", value: "Cuti" },
              { label: "Nonaktif", value: "Nonaktif" },
            ],
          },
        ]}
        formFields={formFields}
        onItemCreate={handleCreate}
        onItemUpdate={handleUpdate}
        onItemDelete={handleDelete}
        capabilities={{ delete: true }}
        fieldLabels={{
          name: "Nama Lengkap & Gelar",
          email: "Email Resmi",
          phone: "Nomor WhatsApp",
          subject: "Spesialisasi Subtes UTBK",
          assignedStudentsCount: "Jumlah Siswa Binaan",
          materialsCount: "Jumlah Materi Disusun",
          questionsCount: "Jumlah Soal",
          tryoutsCount: "Jumlah Paket TryOut",
          rating: "Rating Pengajaran Siswa",
          status: "Status Verifikasi",
          joinedAt: "Tanggal Bergabung",
          bio: "Biografi & Kredensial",
        }}
        customRowActions={(item) => (
          <button
            type="button"
            onClick={() => handleOpenPermissions(item)}
            title="Kelola Izin & Kewenangan Mentor"
            className="inline-flex items-center gap-1 rounded-lg bg-brand-50 hover:bg-brand-100 text-brand-700 px-2.5 py-1 text-xs font-semibold border border-brand-200/60 transition-colors mr-1"
          >
            <Icon name="settings" className="size-3.5" />
            <span className="hidden xl:inline">Kewenangan</span>
          </button>
        )}
        exportFileName="data-mentor-sahabat-alfary"
      />

      {/* Modal Pengaturan Kewenangan Mentor */}
      <GlassModal
        isOpen={!!permissionMentor}
        onClose={() => setPermissionMentor(null)}
        title={`Kewenangan: ${permissionMentor?.name || ""}`}
        subtitle="Atur batas hak akses pembuatan materi, bank soal, dan paket tryout untuk mentor ini."
      >
        <div className="space-y-4">
          <div className="rounded-xl border border-line/80 bg-white/60 p-4 space-y-3">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="text-sm font-semibold text-ink">Menyusun Materi Pembelajaran</p>
                <p className="text-xs text-muted">Izinkan mentor membuat modul ringkasan teori dan pembahasan materi.</p>
              </div>
              <input
                type="checkbox"
                checked={permMaterials}
                onChange={(e) => setPermMaterials(e.target.checked)}
                className="size-4 rounded border-line text-brand-500 focus:ring-brand-500/20"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer border-t border-line/60 pt-3">
              <div>
                <p className="text-sm font-semibold text-ink">Menyusun Naskah Bank Soal</p>
                <p className="text-xs text-muted">Izinkan mentor menyusun butir soal latihan dan kunci jawaban.</p>
              </div>
              <input
                type="checkbox"
                checked={permQuestions}
                onChange={(e) => setPermQuestions(e.target.checked)}
                className="size-4 rounded border-line text-brand-500 focus:ring-brand-500/20"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer border-t border-line/60 pt-3">
              <div>
                <p className="text-sm font-semibold text-ink">Menyusun Paket TryOut Akbar</p>
                <p className="text-xs text-muted">Izinkan mentor menyusun bundel paket tryout skala nasional.</p>
              </div>
              <input
                type="checkbox"
                checked={permTryouts}
                onChange={(e) => setPermTryouts(e.target.checked)}
                className="size-4 rounded border-line text-brand-500 focus:ring-brand-500/20"
              />
            </label>
          </div>

          <div className="rounded-xl bg-amber-50/80 border border-amber-200/80 p-3 text-xs text-amber-900 leading-relaxed">
            <strong>Catatan Kebijakan Platform:</strong> Seluruh konten yang disusun mentor tetap wajib melewati verifikasi Administrator sebelum dapat diterbitkan ke aplikasi siswa. Mentor tidak dapat mempublikasikan konten secara langsung.
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-line/60 pt-4">
            <button
              type="button"
              onClick={() => setPermissionMentor(null)}
              className="rounded-xl border border-line bg-white/80 px-4 py-2 text-xs font-semibold text-ink hover:bg-white"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSavePermissions}
              className="rounded-xl bg-brand-500 hover:bg-brand-600 px-5 py-2 text-xs font-semibold text-white shadow-xs"
            >
              Simpan Kewenangan
            </button>
          </div>
        </div>
      </GlassModal>
    </>
  );
}
