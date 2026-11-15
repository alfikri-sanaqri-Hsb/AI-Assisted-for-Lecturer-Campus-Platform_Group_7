"use client";

import { useState, useEffect } from "react";
import { DataTable } from "@/components/ui/data-table/data-table";
import { StatusBadge } from "@/components/ui/data-table/status-badge";
import { Icon } from "@/components/ui/icon";
import { scheduleService, mentorService } from "@/services";
import type { ScheduleItem, Mentor, ScheduleType, ScheduleStatus } from "@/types";
import type { ColumnDef, FormField } from "@/components/ui/data-table/types";

export function AdminScheduleManagement() {
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [schData, mntData] = await Promise.all([
        scheduleService.getAllSchedules(),
        mentorService.getAllMentors(),
      ]);
      setSchedules(schData);
      setMentors(mntData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
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
      render: (row) => (
        <div>
          <p className="font-semibold text-ink text-xs sm:text-sm">{row.date}</p>
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

  const mentorOptions = mentors.map((m) => ({
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
      options: mentorOptions.length > 0 ? mentorOptions : [{ label: "Dr. Hendra Gunawan, M.Si.", value: "mnt-01" }],
    },
    { name: "date", label: "Tanggal Pelaksanaan (YYYY-MM-DD)", type: "text", required: true, placeholder: "2026-11-20" },
    { name: "startTime", label: "Jam Mulai (HH:MM)", type: "text", required: true, placeholder: "16:00" },
    { name: "endTime", label: "Jam Selesai (HH:MM)", type: "text", required: true, placeholder: "17:30" },
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

  const handleCreate = async (newFields: Record<string, string | number>) => {
    const selectedMentor = mentors.find((m) => m.id === String(newFields.mentorId)) || mentors[0];
    try {
      await scheduleService.createSchedule(
        {
          title: String(newFields.title),
          type: (newFields.type as ScheduleType) || "Sesi Mentoring",
          date: String(newFields.date),
          startTime: String(newFields.startTime),
          endTime: String(newFields.endTime),
          mentorId: selectedMentor ? selectedMentor.id : "mnt-01",
          mentorName: selectedMentor ? selectedMentor.name : "Mentor Sahabat Alfary",
          platform: (newFields.platform as "Zoom" | "Google Meet" | "Aplikasi Internal") || "Zoom",
          meetUrl: String(newFields.meetUrl || ""),
          status: (newFields.status as ScheduleStatus) || "Terjadwal",
          notes: String(newFields.notes || ""),
          managedByAdmin: true,
        },
        "admin"
      );
      loadData();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Gagal membuat jadwal");
    }
  };

  const handleUpdate = async (id: string | number, updated: Record<string, string | number>) => {
    try {
      await scheduleService.updateSchedule(String(id), updated as Partial<ScheduleItem>, "admin");
      loadData();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Gagal memperbarui jadwal");
    }
  };

  const handleDelete = async (id: string | number) => {
    await scheduleService.deleteSchedule(String(id), "admin");
    loadData();
  };

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
