import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { SimulationBanner } from "@/components/dashboard/simulation-badge";
import { AdminTryoutManagement } from "@/components/admin/tryout-package-management";

export const metadata: Metadata = {
  title: "Paket TryOut | Sahabat Alfary",
  description: "Manajemen dan verifikasi publikasi paket TryOut UTBK-SNBT Sahabat Alfary.",
};

export default function AdminTryoutPackagesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Paket TryOut"
        description="Periksa paket TryOut yang diajukan mentor, evaluasi komposisi subtes, setujui, tolak, terbitkan, atau tangani permohonan penarikan paket."
      />
      <SimulationBanner />
      <AdminTryoutManagement />
    </div>
  );
}
