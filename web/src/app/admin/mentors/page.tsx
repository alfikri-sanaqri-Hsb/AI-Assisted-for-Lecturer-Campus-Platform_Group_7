import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { SimulationBanner } from "@/components/dashboard/simulation-badge";
import { AdminMentorManagement } from "@/components/admin/mentor-management";

export const metadata: Metadata = {
  title: "Daftar Mentor | Sahabat Alfary",
  description: "Daftar dan manajemen mentor pengajar UTBK-SNBT Sahabat Alfary.",
};

export default function AdminMentorsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Daftar Mentor"
        description="Kelola data mentor akademik, spesialisasi subtes, kuota bimbingan, verifikasi status, dan kelola kewenangan konten."
      />
      <SimulationBanner />
      <AdminMentorManagement />
    </div>
  );
}
