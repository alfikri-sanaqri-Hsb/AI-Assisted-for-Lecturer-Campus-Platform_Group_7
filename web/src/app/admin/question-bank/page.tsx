import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { SimulationBanner } from "@/components/dashboard/simulation-badge";
import { AdminQuestionBankManagement } from "@/components/admin/question-bank-management";

export const metadata: Metadata = {
  title: "Bank Soal | Sahabat Alfary",
  description: "Pusat verifikasi dan kurasi naskah Bank Soal persiapan UTBK-SNBT Sahabat Alfary.",
};

export default function AdminQuestionBankPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Bank Soal"
        description="Periksa butir soal yang diajukan mentor, evaluasi kunci jawaban, periksa indikator deteksi duplikasi, setujui, tolak, atau terbitkan naskah soal."
      />
      <SimulationBanner />
      <AdminQuestionBankManagement />
    </div>
  );
}
