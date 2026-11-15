import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { SimulationBanner } from "@/components/dashboard/simulation-badge";
import { MentorStudentBinaanManagement } from "@/components/mentor/student-binaan-management";

export const metadata: Metadata = {
  title: "Siswa Binaan | Sahabat Alfary",
  description: "Pantau perkembangan belajar dan konsultasi siswa binaan mentor Sahabat Alfary.",
};

export default function MentorStudentsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Siswa Binaan Saya"
        description="Pantau konsistensi belajar, skor simulasi tryout, target kelulusan PTN, dan berikan arahan intensif bagi siswa binaan Anda."
      />
      <SimulationBanner />
      <MentorStudentBinaanManagement />
    </div>
  );
}
