import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { WelcomeBanner } from "@/components/dashboard/welcome-banner";
import { SimulationBanner } from "@/components/dashboard/simulation-badge";
import { StatSection } from "@/components/dashboard/stat-section";
import { ContentFlowPanel } from "@/components/dashboard/content-flow-panel";
import { Icon, type IconName } from "@/components/ui/icon";
import { dashboardService } from "@/services";
import { ACTIVE_MOCK_MENTOR } from "@/config/mock-identities";

export const metadata: Metadata = {
  title: "Dashboard Mentor | Sahabat Alfary",
  description: "Portal kerja dan pembinaan intensif persiapan UTBK-SNBT untuk mentor Sahabat Alfary.",
};

export default async function MentorDashboardPage() {
  const data = await dashboardService.getMentorDashboardMetrics(ACTIVE_MOCK_MENTOR.id);

  const stats = [
    {
      id: "assigned-students",
      label: "Siswa Binaan Aktif",
      value: data.assignedStudentsCount,
      hint: "Siswa persiapan SNBT yang ditugaskan",
      icon: "users" as IconName,
    },
    {
      id: "own-materials",
      label: "Materi Saya",
      value: data.ownMaterialsCount,
      hint: `${data.publishedCount} modul telah terbit ke siswa`,
      icon: "book" as IconName,
    },
    {
      id: "own-questions",
      label: "Bank Soal Saya",
      value: data.ownQuestionsCount,
      hint: `${data.pendingReviewCount} butir menunggu verifikasi`,
      icon: "file" as IconName,
    },
    {
      id: "needs-revision",
      label: "Perlu Revisi / Ditolak",
      value: data.needsRevisionCount,
      hint: "Catatan perbaikan kurikulum dari admin",
      icon: "revise" as IconName,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard Mentor Akademik"
        description="Pantau pencapaian belajar siswa binaan dan kelola modul materi persiapan UTBK-SNBT."
      />

      <SimulationBanner />

      <WelcomeBanner
        id="judul-sambutan-mentor"
        eyebrow="Portal Mentor Akademik Sahabat Alfary"
        heading="Selamat Mengajar, Mentor Sahabat Alfary"
        text="Bimbing siswa binaan Anda mencapai skor target PTN impian, periksa hasil latihan tryout, susun naskah materi dan butir soal latihan, serta ajukan paket tryout ke admin."
      />

      <StatSection
        id="judul-ringkasan-mentor"
        title="Ringkasan Beban Bimbingan & Konten Akademik"
        stats={stats}
      />

      {/* Akses Cepat Menu Kerja Mentor */}
      <section aria-labelledby="modul-cepat-mentor" className="space-y-3">
        <h2 id="modul-cepat-mentor" className="text-base font-bold text-ink">
          Pusat Kerja Akademik
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/mentor/students"
            className="group flex flex-col justify-between rounded-card border border-line/80 bg-white/70 p-4 shadow-glass transition-all hover:bg-white hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-brand-50 text-brand-600 border border-brand-100 group-hover:scale-105 transition-transform">
                <Icon name="users" className="size-5" />
              </span>
              <div>
                <p className="font-semibold text-ink group-hover:text-brand-600 transition-colors">
                  Siswa Binaan
                </p>
                <p className="text-xs text-muted">{data.assignedStudentsCount} siswa dalam bimbingan</p>
              </div>
            </div>
            <span className="mt-3 text-xs font-semibold text-brand-600 inline-flex items-center gap-1">
              Buka Pantauan Siswa &rarr;
            </span>
          </Link>

          <Link
            href="/mentor/materials"
            className="group flex flex-col justify-between rounded-card border border-line/80 bg-white/70 p-4 shadow-glass transition-all hover:bg-white hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-brand-50 text-brand-600 border border-brand-100 group-hover:scale-105 transition-transform">
                <Icon name="book" className="size-5" />
              </span>
              <div>
                <p className="font-semibold text-ink group-hover:text-brand-600 transition-colors">
                  Materi Pembelajaran
                </p>
                <p className="text-xs text-muted">{data.ownMaterialsCount} modul disusun</p>
              </div>
            </div>
            <span className="mt-3 text-xs font-semibold text-brand-600 inline-flex items-center gap-1">
              Susun & Ajukan Materi &rarr;
            </span>
          </Link>

          <Link
            href="/mentor/question-bank"
            className="group flex flex-col justify-between rounded-card border border-line/80 bg-white/70 p-4 shadow-glass transition-all hover:bg-white hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-brand-50 text-brand-600 border border-brand-100 group-hover:scale-105 transition-transform">
                <Icon name="file" className="size-5" />
              </span>
              <div>
                <p className="font-semibold text-ink group-hover:text-brand-600 transition-colors">
                  Bank Soal Saya
                </p>
                <p className="text-xs text-muted">{data.ownQuestionsCount} butir soal dibuat</p>
              </div>
            </div>
            <span className="mt-3 text-xs font-semibold text-brand-600 inline-flex items-center gap-1">
              Kelola Naskah Soal &rarr;
            </span>
          </Link>

          <Link
            href="/mentor/tryout-packages"
            className="group flex flex-col justify-between rounded-card border border-line/80 bg-white/70 p-4 shadow-glass transition-all hover:bg-white hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-brand-50 text-brand-600 border border-brand-100 group-hover:scale-105 transition-transform">
                <Icon name="clipboard" className="size-5" />
              </span>
              <div>
                <p className="font-semibold text-ink group-hover:text-brand-600 transition-colors">
                  Paket TryOut
                </p>
                <p className="text-xs text-muted">{data.ownTryoutsCount} paket simulasi</p>
              </div>
            </div>
            <span className="mt-3 text-xs font-semibold text-brand-600 inline-flex items-center gap-1">
              Susun Paket TryOut &rarr;
            </span>
          </Link>
        </div>
      </section>

      {/* Grid Alur & Sesi Mentoring */}
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-5">
          <ContentFlowPanel
            id="judul-alur-mentor"
            title="Alur Pengajuan & Kurasi Konten"
            description="Naskah modul materi dan paket soal yang Anda ajukan akan diverifikasi oleh administrator sebelum diterbitkan secara publik."
          />

          {/* Agenda Bimbingan Mendatang */}
          <div className="rounded-card border border-line/80 bg-white/70 p-5 shadow-glass backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-line/60 pb-3">
              <div>
                <h3 className="font-bold text-ink">Jadwal Sesi Mendatang Saya</h3>
                <p className="text-xs text-muted">Jadwal tatap muka daring dan bimbingan intensif yang ditetapkan Admin.</p>
              </div>
              <Link
                href="/mentor/schedules"
                className="text-xs font-semibold text-brand-600 hover:underline"
              >
                Lihat Semua Jadwal &rarr;
              </Link>
            </div>

            <div className="mt-3 divide-y divide-line/60">
              {data.upcomingSchedules.length === 0 ? (
                <p className="py-4 text-center text-xs text-muted">Belum ada agenda bimbingan terdekat.</p>
              ) : (
                data.upcomingSchedules.map((sch) => (
                  <div key={sch.id} className="flex items-center justify-between py-2.5 text-xs">
                    <div>
                      <p className="font-semibold text-ink">{sch.title}</p>
                      <p className="text-muted">
                        {sch.date} &bull; {sch.startTime} - {sch.endTime} WIB &bull; {sch.platform}
                      </p>
                    </div>
                    {sch.meetUrl ? (
                      <a
                        href={sch.meetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg bg-brand-500 hover:bg-brand-600 px-3 py-1 font-semibold text-white transition-colors"
                      >
                        Buka Sesi
                      </a>
                    ) : (
                      <span className="rounded-lg bg-slate-100 px-2 py-1 text-slate-600 font-medium">
                        {sch.status}
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Notifikasi Perlu Revisi */}
        <div className="rounded-card border border-line/80 bg-white/70 p-5 shadow-glass backdrop-blur-md flex flex-col">
          <div className="border-b border-line/60 pb-3">
            <h3 className="font-bold text-ink">Catatan Revisi dari Administrator</h3>
            <p className="text-xs text-muted">Naskah yang dikembalikan untuk disempurnakan.</p>
          </div>

          <div className="mt-3 flex-1 overflow-y-auto">
            {data.needsRevisionCount === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center text-muted">
                <span className="grid size-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600 mb-2 border border-emerald-100">
                  <Icon name="check" className="size-5" />
                </span>
                <p className="font-semibold text-ink text-xs">Tidak Ada Naskah Ditolak</p>
                <p className="text-[11px] text-muted mt-1 max-w-[200px]">
                  Semua naskah yang Anda ajukan telah disetujui atau masih dalam proses kurasi.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-3 text-xs text-rose-900 leading-relaxed">
                  <p className="font-bold flex items-center gap-1.5">
                    <Icon name="alert" className="size-4 text-rose-600" />
                    <span>Terdapat {data.needsRevisionCount} Konten Memerlukan Perbaikan</span>
                  </p>
                  <p className="mt-1 text-[11px] text-rose-800">
                    Buka menu Materi Pembelajaran atau Bank Soal untuk melihat catatan revisi dan memperbarui naskah.
                  </p>
                  <div className="mt-2.5 flex items-center gap-2">
                    <Link
                      href="/mentor/materials"
                      className="rounded-lg bg-rose-600 hover:bg-rose-700 px-2.5 py-1 text-[11px] font-semibold text-white transition-colors"
                    >
                      Buka Materi Ditolak
                    </Link>
                    <Link
                      href="/mentor/question-bank"
                      className="rounded-lg bg-white px-2.5 py-1 text-[11px] font-semibold text-rose-700 border border-rose-300 hover:bg-rose-50 transition-colors"
                    >
                      Buka Soal Ditolak
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
