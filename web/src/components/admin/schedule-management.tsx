"use client";

import { useState, useEffect } from "react";
import { DataTable } from "@/components/ui/data-table/data-table";
import { StatusBadge } from "@/components/ui/data-table/status-badge";
import { Icon } from "@/components/ui/icon";
import { scheduleService, mentorService } from "@/services";
import type { ScheduleItem, Mentor, ScheduleType, ScheduleStatus } from "@/types";
import type { ColumnDef, FormField } from "@/components/ui/data-table/types";
import { ErrorState } from "@/components/ui/async-state";
import { formatDateId } from "@/lib/format";
import {
  SCHEDULE_CLOSE_TIME,
  SCHEDULE_OPEN_TIME,
  todayIsoWIB,
  validateScheduleDate,
  validateScheduleRange,
  validateScheduleTime,
} from "@/lib/validation/schedule";

export function AdminScheduleManagement() {
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const [schData, mntData] = await Promise.all([
        scheduleService.getAllSchedules(),
        mentorService.getAllMentors(),
      ]);
      setSchedules(schData);
      setMentors(mntData);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Jadwal gagal dimuat.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => { void loadData(); }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const columns: ColumnDef<ScheduleItem>[] = [
    {
      key: "title",
      header: "Nama Agenda / Sesi",
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-semibold text-ink">{row.title}</p>
          <p className="text-xs text-muted">{row.notes || "Sesi terjadwal"}</p>
        </div>
      ),
    },
    {
      key: "type",
      header: "Tipe Agenda",
      sortable: true,
      render: (row) => (
        <span className="inline-flex rounded-lg bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700 border border-brand-100">
          {row.type}
        </span>
      ),
    },
    {
      key: "date",
      header: "Waktu & Tanggal",
      sortable: true,
      // Urut kronologis: tanggal dulu, lalu jam mulai.
      sortValue: (row) => `${row.date} ${row.startTime}`,
      render: (row) => (
        <div>
          <p className="font-semibold text-ink text-xs sm:text-sm">{formatDateId(row.date)}</p>
          <p className="text-xs text-muted font-mono">{row.startTime} - {row.endTime} WIB</p>
        </div>
      ),
    },
    {
      key: "mentorName",
      header: "Mentor Penanggung Jawab",
      sortable: true,
      render: (row) => (
        <span className="font-medium text-xs text-ink">{row.mentorName}</span>
      ),
    },
    {
      key: "platform",
      header: "Media Tatap Muka",
      render: (row) => (
        <div>
          <span className="font-medium text-xs text-ink">{row.platform}</span>
          {row.meetUrl && (
            <a
              href={row.meetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-[11px] text-brand-600 hover:underline truncate max-w-[140px]"
            >
              Tautan Sesi &rarr;
            </a>
          )}
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (row) => <StatusBadge status={row.status} />,
    },
  ];

  // Hanya mentor berstatus Aktif yang dapat ditugaskan pada jadwal.
  const mentorOptions = mentors
    .filter((m) => m.status === "Aktif")
    .map((m) => ({
      label: `${m.name} (${m.subject})`,
      value: m.id,
    }));

  const formFields: FormField[] = [
    { name: "title", label: "Nama Agenda / Sesi", type: "text", required: true, placeholder: "Contoh: Bimbingan Intensif Penalaran Umum" },
    {
      name: "type",
      label: "Tipe Jadwal",
      type: "select",
      required: true,
      options: [
        { label: "Sesi Mentoring", value: "Sesi Mentoring" },
        { label: "Kelas Akademik", value: "Kelas Akademik" },
        { label: "Briefing Mentor", value: "Briefing Mentor" },
        { label: "Simulasi Tryout", value: "Simulasi Tryout" },
      ],
      defaultValue: "Sesi Mentoring",
    },
    {
      name: "mentorId",
      label: "Pilih Tenaga Mentor",
      type: "select",
      required: true,
      helpText: "Hanya mentor berstatus Aktif yang dapat dipilih.",
      options:
        mentorOptions.length > 0
          ? mentorOptions
          : [{ label: "Belum ada mentor aktif", value: "" }],
    },
    {
      name: "date",
      label: "Tanggal Pelaksanaan",
      type: "date",
      required: true,
      minValue: todayIsoWIB,
      helpText: "Pilih dari kalender. Tanggal yang sudah lewat tidak dapat dipilih.",
      validate: (value, _values, initial) => validateScheduleDate(value, initial),
    },
    {
      name: "startTime",
      label: "Jam Mulai",
      type: "time",
      required: true,
      step: 300,
      minValue: SCHEDULE_OPEN_TIME,
      maxValue: SCHEDULE_CLOSE_TIME,
      helpText: `Jam operasional ${SCHEDULE_OPEN_TIME}\u2013${SCHEDULE_CLOSE_TIME} WIB.`,
      validate: (value, _values, initial) =>
        value === initial ? null : validateScheduleTime(value, "Jam mulai"),
    },
    {
      name: "endTime",
      label: "Jam Selesai",
      type: "time",
      required: true,
      step: 300,
      minValue: SCHEDULE_OPEN_TIME,
      maxValue: SCHEDULE_CLOSE_TIME,
      helpText: "Harus setelah jam mulai.",
      validate: (value, values, initial) =>
        (value === initial ? null : validateScheduleTime(value, "Jam selesai")) ??
        (values.startTime ? validateScheduleRange(values.startTime, value) : null),
    },
    {
      name: "platform",
      label: "Platform Tatap Muka",
      type: "select",
      required: true,
      options: [
        { label: "Zoom", value: "Zoom" },
        { label: "Google Meet", value: "Google Meet" },
        { label: "Aplikasi Internal", value: "Aplikasi Internal" },
      ],
      defaultValue: "Zoom",
    },
    { name: "meetUrl", label: "Tautan Ruang Virtual", type: "text", placeholder: "https://zoom.us/j/..." },
    {
      name: "status",
      label: "Status Pelaksanaan",
      type: "select",
      required: true,
      options: [
        { label: "Terjadwal", value: "Terjadwal" },
        { label: "Berlangsung", value: "Berlangsung" },
        { label: "Selesai", value: "Selesai" },
        { label: "Dibatalkan", value: "Dibatalkan" },
      ],
      defaultValue: "Terjadwal",
    },
    { name: "notes", label: "Catatan Briefing / Materi", type: "textarea", placeholder: "Pokok bahasan sesi..." },
  ];

  /** Mencari mentor; melempar galat (tampil di formulir) bila tidak ada. */
  const findMentor = (id: string): Mentor => {
    const mentor = mentors.find((m) => m.id === id);
    if (!mentor) {
      throw new Error("Mentor yang dipilih tidak ditemukan. Pilih mentor dari daftar.");
    }
    return mentor;
  };

  const handleCreate = async (newFields: Record<string, string | number>) => {
    const selectedMentor = findMentor(String(newFields.mentorId));
    await scheduleService.createSchedule(
      {
        title: String(newFields.title),
        type: (newFields.type as ScheduleType) || "Sesi Mentoring",
        date: String(newFields.date),
        startTime: String(newFields.startTime),
        endTime: String(newFields.endTime),
        mentorId: selectedMentor.id,
        mentorName: selectedMentor.name,
        platform: (newFields.platform as "Zoom" | "Google Meet" | "Aplikasi Internal") || "Zoom",
        meetUrl: String(newFields.meetUrl || ""),
        status: (newFields.status as ScheduleStatus) || "Terjadwal",
        notes: String(newFields.notes || ""),
        managedByAdmin: true,
      },
      "admin"
    );
    void loadData();
  };

  const handleUpdate = async (id: string | number, updated: Record<string, string | number>) => {
    const patch: Partial<ScheduleItem> = { ...(updated as Partial<ScheduleItem>) };
    // Nama mentor disimpan terpisah; harus ikut diperbarui saat mentor diganti.
    if (updated.mentorId !== undefined) {
      patch.mentorName = findMentor(String(updated.mentorId)).name;
    }
    await scheduleService.updateSchedule(String(id), patch, "admin");
    void loadData();
  };

  const handleDelete = async (id: string | number) => {
    await scheduleService.deleteSchedule(String(id), "admin");
    void loadData();
  };

  if (loadError) return <ErrorState message={loadError} onRetry={() => { setLoadError(null); void loadData(); }} />;
  if (loading) {
    return <div className="p-8 text-center text-sm text-muted">Memuat jadwal...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Box Penjelasan Kewenangan Jadwal */}
      <div className="rounded-2xl border border-brand-100 bg-brand-50/70 p-4 text-xs text-brand-900 leading-relaxed backdrop-blur-xs flex items-start gap-3">
        <span className="grid size-6 shrink-0 place-items-center rounded-xl bg-brand-500 text-white shadow-xs">
          <Icon name="calendar" className="size-3.5" />
        </span>
        <div>
          <p className="font-bold text-ink">Kewenangan Pengelolaan Jadwal Administrator:</p>
          <p className="text-muted mt-0.5">
            Jadwal ketersediaan mentor dan sesi akademik diatur sepenuhnya oleh Administrator melalui koordinasi atau briefing bersama mentor.
            Sistem secara otomatis mendeteksi bentrok waktu (konflik interval) untuk memastikan seorang mentor tidak ditugaskan pada dua agenda bersamaan.
          </p>
        </div>
      </div>

      <DataTable<ScheduleItem>
        title="Jadwal Akademik & Mentoring Sahabat Alfary"
        description="Atur jadwal kelas daring, sesi konsultasi bimbingan, briefing mentor, dan waktu simulasi tryout nasional."
        columns={columns}
        data={schedules}
        searchPlaceholder="Cari nama agenda, mentor, atau tanggal..."
        searchKeys={["title", "mentorName", "date", "platform", "notes"]}
        filters={[
          {
            key: "status",
            label: "Status",
            options: [
              { label: "Terjadwal", value: "Terjadwal" },
              { label: "Berlangsung", value: "Berlangsung" },
              { label: "Selesai", value: "Selesai" },
              { label: "Dibatalkan", value: "Dibatalkan" },
            ],
          },
          {
            key: "type",
            label: "Tipe",
            options: [
              { label: "Sesi Mentoring", value: "Sesi Mentoring" },
              { label: "Kelas Akademik", value: "Kelas Akademik" },
              { label: "Briefing Mentor", value: "Briefing Mentor" },
              { label: "Simulasi Tryout", value: "Simulasi Tryout" },
            ],
          },
        ]}
        formFields={formFields}
        onItemCreate={handleCreate}
        onItemUpdate={handleUpdate}
        onItemDelete={handleDelete}
        capabilities={{ delete: true }}
        fieldLabels={{
          title: "Nama Agenda",
          type: "Tipe Agenda",
          date: "Tanggal Pelaksanaan",
          startTime: "Jam Mulai",
          endTime: "Jam Selesai",
          mentorName: "Mentor Bertugas",
          platform: "Platform Tatap Muka",
          meetUrl: "Tautan Virtual Meeting",
          status: "Status Pelaksanaan",
          notes: "Catatan Bimbingan / Materi",
          createdAt: "Ditetapkan Pada",
        }}
        exportFileName="jadwal-akademik-admin"
      />
    </div>
  );
}
