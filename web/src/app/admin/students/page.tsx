import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { SimulationBanner } from "@/components/dashboard/simulation-badge";
import { AdminStudentManagement } from "@/components/admin/student-management";

export const metadata: Metadata = {
  title: "Siswa | Sahabat Alfary",
  description: "Daftar dan manajemen data siswa persiapan UTBK-SNBT Sahabat Alfary.",
};

export default function AdminStudentsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Manajemen Siswa"
        description="Kelola akun siswa terdaftar, ubah status, pantau target jurusan PTN, dan kelola data master siswa."
      />
      <SimulationBanner />
      <AdminStudentManagement />
    </div>
  );
}
