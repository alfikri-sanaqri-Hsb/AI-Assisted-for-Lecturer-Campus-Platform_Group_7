import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { SimulationBanner } from "@/components/dashboard/simulation-badge";
import { MentorQuestionAuthoring } from "@/components/mentor/question-authoring";

export const metadata: Metadata = {
  title: "Bank Soal | Sahabat Alfary",
  description: "Penyusunan naskah butir soal dan kunci jawaban persiapan UTBK-SNBT oleh mentor Sahabat Alfary.",
};

export default function MentorQuestionBankPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Bank Soal Saya"
        description="Susun draf soal pilihan ganda, simpan naskah, periksa indikator deteksi kemiripan, ajukan verifikasi ke administrator, dan perbaiki soal yang ditolak."
      />
      <SimulationBanner />
      <MentorQuestionAuthoring />
    </div>
  );
}
