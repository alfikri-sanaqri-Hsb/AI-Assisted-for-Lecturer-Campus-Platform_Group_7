"use client";

import { useState, useEffect } from "react";
import { DataTable } from "@/components/ui/data-table/data-table";
import { StatusBadge } from "@/components/ui/data-table/status-badge";
import { Icon } from "@/components/ui/icon";
import { scheduleService } from "@/services";
import type { ScheduleItem } from "@/types";
import type { ColumnDef } from "@/components/ui/data-table/types";

const ACTIVE_MENTOR_ID = "mnt-01"; // Dr. Hendra Gunawan

export function MentorScheduleView() {
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const data = await scheduleService.getSchedulesByMentor(ACTIVE_MENTOR_ID);
      setSchedules(data);
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

  if (loading) {
    return <div className="p-8 text-center text-sm text-muted">Memuat jadwal bimbingan...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Box Batasan Kewenangan Mentor Terhadap Jadwal */}
      <div className="rounded-2xl border border-sky-100 bg-sky-50/70 p-4 text-xs text-sky-950 leading-relaxed backdrop-blur-xs flex items-start gap-3">
        <span className="grid size-6 shrink-0 place-items-center rounded-xl bg-sky-500 text-white shadow-xs">
          <Icon name="calendar" className="size-3.5" />
        </span>
        <div>
          <p className="font-bold">Ketentuan Jadwal Pembinaan Mentor (Bagian 6.G):</p>
          <p className="text-sky-800/90 mt-0.5">
            Jadwal ketersediaan dan sesi bimbingan diatur oleh Administrator melalui briefing atau koordinasi terlebih dahulu.
            Mentor dapat melihat seluruh sesi yang terhubung dengannya, membuka ruang kelas tatap muka daring, namun tidak memiliki kewenangan mengubah jadwal yang telah ditetapkan Admin.
          </p>
        </div>
      </div>

      <DataTable<ScheduleItem>
        title="Jadwal Bimbingan & Mentoring Saya"
        description="Daftar agenda sesi tatap muka daring, konsultasi bimbingan, dan briefing akademik yang ditugaskan administrator kepada Anda."
        columns={columns}
        data={schedules}
        searchPlaceholder="Cari agenda atau tanggal..."
        searchKeys={["title", "date", "platform", "notes"]}
        filters={[
          {
            key: "status",
            label: "Status",
            options: [
              { label: "Terjadwal", value: "Terjadwal" },
              { label: "Berlangsung", value: "Berlangsung" },
              { label: "Selesai", value: "Selesai" },
            ],
          },
        ]}
        fieldLabels={{
          title: "Nama Agenda",
          type: "Tipe Agenda",
          date: "Tanggal Pelaksanaan",
          startTime: "Jam Mulai",
          endTime: "Jam Selesai",
          platform: "Platform Tatap Muka",
          meetUrl: "Tautan Virtual Meeting",
          status: "Status Pelaksanaan",
          notes: "Catatan Bimbingan / Materi",
          createdAt: "Ditetapkan Pada",
        }}
        customRowActions={(item) => (
          item.meetUrl ? (
            <a
              href={item.meetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-lg bg-brand-500 hover:bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition-colors mr-1"
            >
              <span>Masuk Sesi</span>
              <Icon name="chevron-right" className="size-3" />
            </a>
          ) : null
        )}
        exportFileName="jadwal-mentor-sahabat-alfary"
      />
    </div>
  );
}
