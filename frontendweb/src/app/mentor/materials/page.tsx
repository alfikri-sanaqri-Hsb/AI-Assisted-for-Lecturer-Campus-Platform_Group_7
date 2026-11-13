import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { MentorManagementSection } from "@/components/dashboard/mentor-management-section";

export const metadata: Metadata = {
  title: "Materi Pembelajaran | Sahabat Alfary",
  description: "Kelola modul materi dan bank soal yang Anda susun sebagai mentor Sahabat Alfary.",
};

export default function MentorMaterialsPage() {
  return (
    <>
      <PageHeader
        title="Materi Pembelajaran"
        description="Susun materi ringkasan, modul teori, dan latihan soal bertingkat untuk diajukan ke administrator."
      />
      <div className="mt-6">
        <MentorManagementSection initialTab="materials" showTabs={false} />
      </div>
    </>
  );
}
