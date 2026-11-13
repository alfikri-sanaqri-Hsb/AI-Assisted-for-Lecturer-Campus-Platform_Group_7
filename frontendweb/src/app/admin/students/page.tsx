import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { AdminManagementSection } from "@/components/dashboard/admin-management-section";

export const metadata: Metadata = {
  title: "Siswa | Sahabat Alfary",
  description: "Daftar dan manajemen data siswa persiapan UTBK-SNBT Sahabat Alfary.",
};

export default function AdminStudentsPage() {
  return (
    <>
      <PageHeader
        title="Siswa"
        description="Kelola akun siswa terdaftar, pantau target jurusan PTN, dan riwayat partisipasi tryout."
      />
      <div className="mt-6">
        <AdminManagementSection initialTab="students" showTabs={false} />
      </div>
    </>
  );
}
