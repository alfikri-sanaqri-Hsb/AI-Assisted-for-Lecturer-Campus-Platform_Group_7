import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { AdminManagementSection } from "@/components/dashboard/admin-management-section";

export const metadata: Metadata = {
  title: "Daftar Mentor | Sahabat Alfary",
  description: "Daftar dan manajemen mentor pengajar UTBK-SNBT Sahabat Alfary.",
};

export default function AdminMentorsPage() {
  return (
    <>
      <PageHeader
        title="Daftar Mentor"
        description="Kelola data mentor akademik, spesialisasi subtes, kuota bimbingan, dan verifikasi status aktif."
      />
      <div className="mt-6">
        <AdminManagementSection initialTab="mentors" showTabs={false} />
      </div>
    </>
  );
}
