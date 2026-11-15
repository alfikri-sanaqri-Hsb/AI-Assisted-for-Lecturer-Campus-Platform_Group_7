import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { SimulationBanner } from "@/components/dashboard/simulation-badge";
import { AdminScheduleManagement } from "@/components/admin/schedule-management";

export const metadata: Metadata = {
  title: "Jadwal | Sahabat Alfary",
  description: "Pengelolaan jadwal akademik dan sesi mentoring Sahabat Alfary.",
};

export default function AdminSchedulesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Jadwal Akademik & Mentoring"
        description="Kelola jadwal ketersediaan mentor, kelas online tatap muka, sesi bimbingan intensif, dan deteksi potensi konflik waktu."
      />
      <SimulationBanner />
      <AdminScheduleManagement />
    </div>
  );
}
