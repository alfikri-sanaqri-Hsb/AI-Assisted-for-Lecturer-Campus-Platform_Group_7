import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { SimulationBanner } from "@/components/dashboard/simulation-badge";
import { AdminMaterialManagement } from "@/components/admin/material-management";

export const metadata: Metadata = {
  title: "Materi Pembelajaran | Sahabat Alfary",
  description: "Manajemen kurikulum materi pembelajaran UTBK-SNBT Sahabat Alfary.",
};

export default function AdminMaterialsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Materi Pembelajaran"
        description="Periksa materi yang diajukan mentor, setujui, tolak dengan catatan, publikasikan, atau nonaktifkan materi tanpa mengubah isi aslinya."
      />
      <SimulationBanner />
      <AdminMaterialManagement />
    </div>
  );
}
