import type { Metadata } from "next";
import { ContentFlowPanel } from "@/components/dashboard/content-flow-panel";
import { EmptyPanel } from "@/components/dashboard/empty-panel";
import { StatSection } from "@/components/dashboard/stat-section";
import { WelcomeBanner } from "@/components/dashboard/welcome-banner";
import { PageHeader } from "@/components/layout/page-header";
import { AdminManagementSection } from "@/components/dashboard/admin-management-section";
import type { IconName } from "@/components/ui/icon";
import { getAdminSummary, type AdminStatId } from "@/data/mock/dashboard-summary";

export const metadata: Metadata = {
  title: "Dashboard Admin | Sahabat Alfary",
  description: "Pusat kendali dan manajemen operasional platform persiapan UTBK-SNBT Sahabat Alfary.",
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
        title="Dashboard Administrator"
        description="Pusat pemantauan metrik, tata kelola pengguna, dan kurasi akademik UTBK-SNBT Sahabat Alfary."
      />

      <WelcomeBanner
        id="judul-sambutan-admin"
        eyebrow="Portal Administrator Sahabat Alfary"
        heading="Selamat Datang di Pusat Kendali Platform"
        text="Kelola pendaftaran siswa, verifikasi data mentor, pantau hasil tryout berkala, serta kurasi dan setujui materi pembelajaran dalam satu ekosistem terpadu."
      />

      <StatSection
        id="judul-ringkasan-admin"
        title="Ringkasan Kinerja Platform"
        stats={summary.map((stat) => ({ ...stat, icon: statIcons[stat.id] }))}
      />

      {/* Modul Tabel Data Interaktif Terintegrasi */}
      <AdminManagementSection />

      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        <ContentFlowPanel
          id="judul-alur-admin"
          title="Alur Standar Kurasi Konten"
          description="Panduan tahapan peninjauan naskah modul, bank soal, dan paket tryout sebelum terbit secara publik."
          className="lg:col-span-2"
        />
        <EmptyPanel
          id="judul-aktivitas-admin"
          title="Aktivitas Terakhir"
          message="Belum ada aktivitas baru"
          description="Riwayat log sistem, audit login, dan aktivitas publikasi akan otomatis muncul saat backend terhubung."
        />
      </div>
    </>
  );
}
