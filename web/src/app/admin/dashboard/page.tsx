import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { WelcomeBanner } from "@/components/dashboard/welcome-banner";
import { SimulationBanner } from "@/components/dashboard/simulation-badge";
import { StatSection } from "@/components/dashboard/stat-section";
import { ContentFlowPanel } from "@/components/dashboard/content-flow-panel";
import { Icon, type IconName } from "@/components/ui/icon";
import { dashboardService } from "@/services";

export const metadata: Metadata = {
  title: "Dashboard Admin | Sahabat Alfary",
  description: "Pusat kendali dan manajemen operasional platform persiapan UTBK-SNBT Sahabat Alfary.",
};

export default async function AdminDashboardPage() {
  const data = await dashboardService.getAdminDashboardMetrics();

  const stats = [
    {
      id: "students",
      label: "Total Siswa Terdaftar",
      value: data.totalStudents,
      hint: `${data.activeStudents} aktif, ${data.inactiveStudents} nonaktif/menunggu`,
      icon: "users" as IconName,
    },
    {
      id: "mentors",
      label: "Tenaga Mentor Ahli",
      value: data.totalMentors,
      hint: `${data.activeMentors} aktif mengajar bimbingan`,
      icon: "mentor" as IconName,
    },
    {
      id: "pending-reviews",
      label: "Menunggu Verifikasi",
      value: data.pendingReviewsCount,
      hint: `${data.publishedContentCount} terbit, ${data.rejectedContentCount} perlu revisi`,
      icon: "review" as IconName,
    },
    {
      id: "tryouts",
      label: "Paket TryOut SNBT",
      value: data.totalTryouts,
      hint: "Simulasi TPS, Literasi & Penalaran",
      icon: "clipboard" as IconName,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard Administrator"
        description="Pusat pemantauan metrik, tata kelola pengguna, dan kurasi akademik UTBK-SNBT Sahabat Alfary."
      />

      <SimulationBanner />

      <WelcomeBanner
        id="judul-sambutan-admin"
        eyebrow="Portal Administrator Sahabat Alfary"
        heading="Selamat Datang di Pusat Kendali Platform"
        text="Kelola pendaftaran siswa, verifikasi data mentor, pantau hasil tryout berkala, serta kurasi dan setujui materi pembelajaran dalam satu ekosistem terpadu."
      />

      <StatSection
        id="judul-ringkasan-admin"
        title="Ringkasan Kinerja Platform (Data Riil Sistem)"
        stats={stats}
      />

      {/* Akses Cepat Modul Operasional Admin */}
      <section aria-labelledby="modul-cepat-admin" className="space-y-3">
        <h2 id="modul-cepat-admin" className="text-base font-bold text-ink">
          Pusat Operasional & Menu Utama
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/admin/students"
            className="group flex flex-col justify-between rounded-card border border-line/80 bg-white/70 p-4 shadow-glass transition-all hover:bg-white hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-brand-50 text-brand-600 border border-brand-100 group-hover:scale-105 transition-transform">
                <Icon name="users" className="size-5" />
              </span>
              <div>
                <p className="font-semibold text-ink group-hover:text-brand-600 transition-colors">
                  Kelola Siswa
                </p>
                <p className="text-xs text-muted">{data.totalStudents} siswa terdaftar</p>
              </div>
            </div>
            <span className="mt-3 text-xs font-semibold text-brand-600 inline-flex items-center gap-1">
              Buka Manajemen Siswa &rarr;
            </span>
          </Link>

          <Link
            href="/admin/mentors"
            className="group flex flex-col justify-between rounded-card border border-line/80 bg-white/70 p-4 shadow-glass transition-all hover:bg-white hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-brand-50 text-brand-600 border border-brand-100 group-hover:scale-105 transition-transform">
                <Icon name="mentor" className="size-5" />
              </span>
              <div>
                <p className="font-semibold text-ink group-hover:text-brand-600 transition-colors">
                  Daftar Mentor
                </p>
                <p className="text-xs text-muted">{data.totalMentors} tenaga pengajar</p>
              </div>
            </div>
            <span className="mt-3 text-xs font-semibold text-brand-600 inline-flex items-center gap-1">
              Buka Data Mentor &rarr;
            </span>
          </Link>

          <Link
            href="/admin/content-review"
            className="group flex flex-col justify-between rounded-card border border-line/80 bg-white/70 p-4 shadow-glass transition-all hover:bg-white hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-amber-50 text-amber-700 border border-amber-200 group-hover:scale-105 transition-transform">
                <Icon name="review" className="size-5" />
              </span>
              <div>
                <p className="font-semibold text-ink group-hover:text-brand-600 transition-colors">
                  Peninjauan Konten
                </p>
                <p className="text-xs text-amber-700 font-semibold">{data.pendingReviewsCount} menunggu kurasi</p>
              </div>
            </div>
            <span className="mt-3 text-xs font-semibold text-brand-600 inline-flex items-center gap-1">
              Buka Antrean Kurasi &rarr;
            </span>
          </Link>

          <Link
            href="/admin/schedules"
            className="group flex flex-col justify-between rounded-card border border-line/80 bg-white/70 p-4 shadow-glass transition-all hover:bg-white hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-brand-50 text-brand-600 border border-brand-100 group-hover:scale-105 transition-transform">
                <Icon name="calendar" className="size-5" />
              </span>
              <div>
                <p className="font-semibold text-ink group-hover:text-brand-600 transition-colors">
                  Jadwal Akademik
                </p>
                <p className="text-xs text-muted">{data.upcomingSchedules.length} agenda terdekat</p>
              </div>
            </div>
            <span className="mt-3 text-xs font-semibold text-brand-600 inline-flex items-center gap-1">
              Atur Jadwal & Sesi &rarr;
            </span>
          </Link>
        </div>
      </section>

      {/* Grid Alur & Aktivitas Audit Sistem */}
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-5">
          <ContentFlowPanel
            id="judul-alur-admin"
            title="Alur Standar Kurasi Konten"
            description="Panduan tahapan peninjauan naskah modul, bank soal, dan paket tryout sebelum terbit secara publik."
          />

          {/* Agenda Terdekat */}
          <div className="rounded-card border border-line/80 bg-white/70 p-5 shadow-glass backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-line/60 pb-3">
              <div>
                <h3 className="font-bold text-ink">Agenda & Sesi Terdekat</h3>
                <p className="text-xs text-muted">Jadwal bimbingan, kelas live, dan briefing mentor yang telah ditetapkan.</p>
              </div>
              <Link
                href="/admin/schedules"
                className="text-xs font-semibold text-brand-600 hover:underline"
              >
                Lihat Semua Jadwal &rarr;
              </Link>
            </div>

            <div className="mt-3 divide-y divide-line/60">
              {data.upcomingSchedules.length === 0 ? (
                <p className="py-4 text-center text-xs text-muted">Belum ada agenda terjadwal.</p>
              ) : (
                data.upcomingSchedules.map((sch) => (
                  <div key={sch.id} className="flex items-center justify-between py-2.5 text-xs">
                    <div>
                      <p className="font-semibold text-ink">{sch.title}</p>
                      <p className="text-muted">
                        {sch.date} &bull; {sch.startTime} - {sch.endTime} WIB &bull; {sch.mentorName}
                      </p>
                    </div>
                    <span className="rounded-lg bg-brand-50 px-2.5 py-1 font-semibold text-brand-700 border border-brand-100">
                      {sch.type}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Audit Log Aktivitas Terbaru */}
        <div className="rounded-card border border-line/80 bg-white/70 p-5 shadow-glass backdrop-blur-md flex flex-col">
          <div className="border-b border-line/60 pb-3">
            <h3 className="font-bold text-ink">Log Aktivitas Terbaru</h3>
            <p className="text-xs text-muted">Pencatatan tindakan sensitif dan persetujuan konten.</p>
          </div>

          <div className="mt-3 flex-1 overflow-y-auto space-y-3">
            {data.recentActivities.length === 0 ? (
              <p className="py-6 text-center text-xs text-muted">Belum ada aktivitas tercatat.</p>
            ) : (
              data.recentActivities.map((act) => (
                <div key={act.id} className="rounded-xl border border-line/60 bg-white/60 p-3 text-xs leading-relaxed">
                  <div className="flex items-center justify-between gap-1 text-[11px] text-muted">
                    <span className="font-semibold text-brand-700">{act.actorName}</span>
                    <span>{act.timestamp.split(",")[0]}</span>
                  </div>
                  <p className="font-bold text-ink mt-0.5">{act.action}</p>
                  <p className="text-muted text-[11px] line-clamp-2 mt-0.5">{act.details}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
