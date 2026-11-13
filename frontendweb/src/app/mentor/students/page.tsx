import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { MentorManagementSection } from "@/components/dashboard/mentor-management-section";

export const metadata: Metadata = {
  title: "Siswa Binaan | Sahabat Alfary",
  description: "Pantau perkembangan belajar dan konsultasi siswa binaan mentor Sahabat Alfary.",
};

export default function MentorStudentsPage() {
  return (
    <>
      <PageHeader
        title="Siswa Binaan"
        description="Pantau konsistensi belajar, skor simulasi tryout, dan berikan arahan intensif bagi siswa binaan Anda."
      />
      <div className="mt-6">
        <MentorManagementSection initialTab="students" showTabs={false} />
      </div>
    </>
  );
}
