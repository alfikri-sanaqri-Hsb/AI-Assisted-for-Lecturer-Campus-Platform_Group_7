import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { SimulationBanner } from "@/components/dashboard/simulation-badge";
import { AdminContentReviewHub } from "@/components/admin/content-review-hub";

export const metadata: Metadata = {
  title: "Peninjauan Konten | Sahabat Alfary",
  description: "Antrean verifikasi dan kurasi naskah soal dan materi mentor Sahabat Alfary.",
};

export default function AdminContentReviewPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Peninjauan Konten"
        description="Pusat evaluasi naskah materi pembelajaran, bank soal, dan paket tryout yang diajukan oleh mentor sebelum diterbitkan."
      />
      <SimulationBanner />
      <AdminContentReviewHub />
    </div>
  );
}
