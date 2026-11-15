import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { SimulationBanner } from "@/components/dashboard/simulation-badge";
import { MentorScheduleView } from "@/components/mentor/schedule-view";

export const metadata: Metadata = {
  title: "Jadwal | Sahabat Alfary",
  description: "Jadwal bimbingan, kelas online, dan agenda akademik mentor Sahabat Alfary.",
};

export default function MentorSchedulesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Jadwal Bimbingan & Mentoring"
        description="Pantau sesi tatap muka daring, jadwal bimbingan intensif, dan agenda briefing akademik yang ditugaskan kepada Anda."
      />
      <SimulationBanner />
      <MentorScheduleView />
    </div>
  );
}
