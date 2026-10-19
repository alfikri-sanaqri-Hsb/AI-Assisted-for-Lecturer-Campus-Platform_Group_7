import type { Metadata } from "next";
import { ContentFlowPanel } from "@/components/dashboard/content-flow-panel";
import { EmptyPanel } from "@/components/dashboard/empty-panel";
import { StatSection } from "@/components/dashboard/stat-section";
import { WelcomeBanner } from "@/components/dashboard/welcome-banner";
import { PageHeader } from "@/components/layout/page-header";
import type { IconName } from "@/components/ui/icon";
import { getMentorSummary, type MentorStatId } from "@/data/mock/dashboard-summary";

export const metadata: Metadata = {
  title: "Dashboard Mentor | Sahabat Alfary",
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
        title="Dashboard Mentor"
        description="Pantau siswa binaan dan konten yang Anda susun."
      />

      <WelcomeBanner
        id="judul-sambutan-mentor"
        eyebrow="Selamat datang di Sahabat Alfary"
        heading="Halo, Mentor Contoh"
        text="Pantau siswa binaan, susun materi dan soal, lalu kirim untuk ditinjau administrator. Tampilan ini masih berupa kerangka awal dengan konten contoh."
      />

      <StatSection
        id="judul-ringkasan-mentor"
        title="Ringkasan kerja saya"
        stats={summary.map((stat) => ({ ...stat, icon: statIcons[stat.id] }))}
      />

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        <ContentFlowPanel
          id="judul-alur-mentor"
          title="Alur pengiriman konten"
          description="Usulan sementara. Setelah dikirim, konten ditinjau administrator sebelum diterbitkan."
          className="lg:col-span-2"
        />
        <EmptyPanel
          id="judul-revisi-mentor"
          title="Perlu direvisi"
          message="Belum ada konten yang dikembalikan"
          description="Konten yang dikembalikan administrator beserta catatan revisinya akan tampil di sini setelah backend terhubung."
        />
      </div>
    </>
  );
}
