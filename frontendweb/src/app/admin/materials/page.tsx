import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { AdminManagementSection } from "@/components/dashboard/admin-management-section";

export const metadata: Metadata = {
  title: "Materi Pembelajaran | Sahabat Alfary",
  description: "Manajemen kurikulum materi pembelajaran UTBK-SNBT Sahabat Alfary.",
};

export default function AdminMaterialsPage() {
  return (
    <>
      <PageHeader
        title="Materi Pembelajaran"
        description="Kelola kurikulum materi pembelajaran, modul ringkasan teori, dan paket latihan soal persiapan UTBK-SNBT."
      />
      <div className="mt-6">
        <AdminManagementSection initialTab="materials" showTabs={false} />
      </div>
    </>
  );
}
