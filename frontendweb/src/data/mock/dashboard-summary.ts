/**
 * DATA ILUSTRASI untuk kerangka tampilan. Bukan data nyata dan bukan
 * respons API. Fungsi dibuat async agar bentuknya sama dengan API sungguhan
 * kelak; halaman cukup memanggil fungsi ini dan tidak mengenal sumber datanya.
 */

export type SummaryStat<Id extends string> = {
  id: Id;
  label: string;
  value: number;
  hint: string;
};

export type AdminStatId = "students" | "mentors" | "pending-review" | "tryouts";
export type MentorStatId =
  | "assigned-students"
  | "own-materials"
  | "own-questions"
  | "needs-revision";

export async function getAdminSummary(): Promise<SummaryStat<AdminStatId>[]> {
  return [
    { id: "students", label: "Total siswa", value: 1248, hint: "Contoh angka siswa terdaftar" },
    { id: "mentors", label: "Mentor aktif", value: 36, hint: "Contoh angka mentor aktif" },
    { id: "pending-review", label: "Menunggu peninjauan", value: 14, hint: "Contoh antrean konten dari mentor" },
    { id: "tryouts", label: "Paket tryout", value: 9, hint: "Contoh jumlah paket tryout" },
  ];
}

export async function getMentorSummary(): Promise<SummaryStat<MentorStatId>[]> {
  return [
    { id: "assigned-students", label: "Siswa binaan", value: 24, hint: "Contoh jumlah siswa yang ditugaskan" },
    { id: "own-materials", label: "Materi saya", value: 18, hint: "Contoh jumlah materi milik sendiri" },
    { id: "own-questions", label: "Soal yang saya buat", value: 142, hint: "Contoh jumlah soal milik sendiri" },
    { id: "needs-revision", label: "Perlu direvisi", value: 3, hint: "Contoh konten yang dikembalikan admin" },
  ];
}
