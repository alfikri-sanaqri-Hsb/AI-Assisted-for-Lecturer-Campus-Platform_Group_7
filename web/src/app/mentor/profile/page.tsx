import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { SimulationBanner } from "@/components/dashboard/simulation-badge";
import { MentorProfileView } from "@/components/mentor/profile-view";

export const metadata: Metadata = {
  title: "Profil Mentor | Sahabat Alfary",
  description: "Pengelolaan informasi profil mentor dan kredensial pengajaran Sahabat Alfary.",
};

export default function MentorProfilePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Profil & Akun Mentor"
        description="Kelola informasi pengajar Anda, kontak konsultasi siswa, catatan ketersediaan waktu bimbingan, dan pengaturan sandi."
      />
      <SimulationBanner />
      <MentorProfileView />
    </div>
  );
}
