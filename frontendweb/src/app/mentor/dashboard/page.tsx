import type { Metadata } from "next";
import { ContentFlowPanel } from "@/components/dashboard/content-flow-panel";
import { EmptyPanel } from "@/components/dashboard/empty-panel";
import { StatSection } from "@/components/dashboard/stat-section";
import { WelcomeBanner } from "@/components/dashboard/welcome-banner";
import { PageHeader } from "@/components/layout/page-header";
import { MentorManagementSection } from "@/components/dashboard/mentor-management-section";
import type { IconName } from "@/components/ui/icon";
import { getMentorSummary, type MentorStatId } from "@/data/mock/dashboard-summary";

export const metadata: Metadata = {
  title: "Dashboard Mentor | Sahabat Alfary",
  description: "Portal kerja dan pembinaan intensif persiapan UTBK-SNBT untuk mentor Sahabat Alfary.",
};

const statIcons: Record<MentorStatId, IconName> = {
  "assigned-students": "users",
  "own-materials": "book",
  "own-questions": "file",
  "needs-revision": "revise",
};

export default async function MentorDashboardPage() {
  const summary = await getMentorSummary();

  return (
    <>
      <PageHeader
        title="Dashboard Mentor Akademik"
        description="Pantau pencapaian belajar siswa binaan dan kelola modul materi persiapan UTBK-SNBT."
      />

      <WelcomeBanner
        id="judul-sambutan-mentor"
        eyebrow="Portal Mentor Akademik Sahabat Alfary"
        heading="Selamat Mengajar, Mentor Sahabat Alfary"
        text="Bimbing siswa binaan Anda mencapai skor target PTN impian, periksa hasil latihan tryout secara real-time, dan susun naskah soal berstandar nasional."
      />

      <StatSection
        id="judul-ringkasan-mentor"
        title="Ringkasan Beban Bimbingan & Konten"
        stats={summary.map((stat) => ({ ...stat, icon: statIcons[stat.id] }))}
      />

      {/* Modul Tabel Data Interaktif Bimbingan & Konten Mentor */}
      <MentorManagementSection />

      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        <ContentFlowPanel
          id="judul-alur-mentor"
          title="Alur Pengajuan & Kurasi Konten"
          description="Naskah modul materi dan paket soal yang Anda ajukan akan diverifikasi oleh tim kurikulum admin sebelum diterbitkan."
          className="lg:col-span-2"
        />
        <EmptyPanel
          id="judul-revisi-mentor"
          title="Catatan Revisi dari Administrator"
          message="Tidak ada naskah yang dikembalikan"
          description="Semua konten yang Anda ajukan berada pada jalur yang tepat atau telah disetujui untuk dipelajari oleh siswa."
        />
      </div>
    </>
  );
}
