import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { SimulationBanner } from "@/components/dashboard/simulation-badge";
import { AdminSettingsHub } from "@/components/admin/settings-hub";

export const metadata: Metadata = {
  title: "Pengaturan | Sahabat Alfary",
  description: "Pengaturan operasional dan preferensi platform Sahabat Alfary.",
};

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Pengaturan Platform"
        description="Kelola konfigurasi dasar operasional sistem, preferensi notifikasi, dan pantau log audit tindakan sensitif."
      />
      <SimulationBanner />
      <AdminSettingsHub />
    </div>
  );
}
