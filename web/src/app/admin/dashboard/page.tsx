import type { Metadata } from "next";
import { ContentFlowPanel } from "@/components/dashboard/content-flow-panel";
import { EmptyPanel } from "@/components/dashboard/empty-panel";
import { StatSection } from "@/components/dashboard/stat-section";
import { WelcomeBanner } from "@/components/dashboard/welcome-banner";
import { PageHeader } from "@/components/layout/page-header";
import type { IconName } from "@/components/ui/icon";
import { getAdminSummary, type AdminStatId } from "@/data/mock/dashboard-summary";

export const metadata: Metadata = {
  title: "Dashboard Admin | Sahabat Alfary",
};

const statIcons: Record<AdminStatId, IconName> = {
  students: "users",
  mentors: "mentor",
  "pending-review": "review",
  tryouts: "clipboard",
};

export default async function AdminDashboardPage() {
  const summary = await getAdminSummary();

  return (
    <>
      <PageHeader
        title="Dashboard Admin"
        description="Ringkasan operasional platform persiapan UTBK-SNBT."
      />

      <WelcomeBanner
        id="judul-sambutan-admin"
        eyebrow="Selamat datang di Sahabat Alfary"
        heading="Halo, Pengguna Contoh"
        text="Kelola siswa, mentor, materi, dan paket tryout dari satu tempat. Tampilan ini masih berupa kerangka awal dengan konten contoh."
      />

      <StatSection
        id="judul-ringkasan-admin"
        title="Ringkasan platform"
        stats={summary.map((stat) => ({ ...stat, icon: statIcons[stat.id] }))}
      />

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        <ContentFlowPanel
          id="judul-alur-admin"
          title="Alur status konten"
          description="Usulan sementara. Status dan transisi final menunggu keputusan produk."
          className="lg:col-span-2"
        />
        <EmptyPanel
          id="judul-aktivitas-admin"
          title="Aktivitas terbaru"
          message="Belum ada aktivitas"
          description="Aktivitas mentor dan siswa akan tampil di sini setelah backend terhubung."
        />
      </div>
    </>
  );
}
