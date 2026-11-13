import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { AdminManagementSection } from "@/components/dashboard/admin-management-section";

export const metadata: Metadata = {
  title: "Peninjauan Konten | Sahabat Alfary",
  description: "Antrean verifikasi dan kurasi naskah soal dan materi mentor Sahabat Alfary.",
};

export default function AdminContentReviewPage() {
  return (
    <>
      <PageHeader
        title="Peninjauan Konten"
        description="Evaluasi kualitas soal, validasi kunci jawaban dan pembahasan, serta terbitkan konten ke aplikasi siswa."
      />
      <div className="mt-6">
        <AdminManagementSection initialTab="reviews" showTabs={false} />
      </div>
    </>
  );
}
