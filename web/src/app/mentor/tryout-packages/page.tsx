import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { SimulationBanner } from "@/components/dashboard/simulation-badge";
import { MentorTryoutAuthoring } from "@/components/mentor/tryout-authoring";

export const metadata: Metadata = {
  title: "Paket TryOut | Sahabat Alfary",
  description: "Penyusunan dan pengajuan paket TryOut UTBK-SNBT oleh mentor Sahabat Alfary.",
};

export default function MentorTryoutPackagesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Paket TryOut Saya"
        description="Buat draf paket tryout, atur alokasi subtes, ajukan kurasi ke administrator, perbaiki paket yang ditolak, atau ajukan penarikan untuk paket terbit."
      />
      <SimulationBanner />
      <MentorTryoutAuthoring />
    </div>
  );
}
