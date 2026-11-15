import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { SimulationBanner } from "@/components/dashboard/simulation-badge";
import { MentorMaterialAuthoring } from "@/components/mentor/material-authoring";

export const metadata: Metadata = {
  title: "Materi Pembelajaran | Sahabat Alfary",
  description: "Kelola modul materi dan bank soal yang Anda susun sebagai mentor Sahabat Alfary.",
};

export default function MentorMaterialsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Materi Pembelajaran Saya"
        description="Susun modul materi ringkasan, latihan soal, simpan draf, ajukan verifikasi ke administrator, dan perbaiki naskah yang ditolak."
      />
      <SimulationBanner />
      <MentorMaterialAuthoring />
    </div>
  );
}
