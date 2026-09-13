// app/study/page.tsx
export default function StudyPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Materi & Modul Ujian</h1>
      <p className="text-gray-600">Pilih materi yang ingin kamu kuasai hari ini.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm hover:border-blue-400 hover:shadow-md transition-all cursor-pointer">
          <div className="text-3xl mb-3">🧮</div>
          <h3 className="font-bold text-lg text-gray-900">Penalaran Matematika</h3>
          <p className="text-gray-500 mt-2 text-sm leading-relaxed">
            Fokus pada pemahaman Operasi Bilangan, Logika Dasar, dan penyelesaian soal tingkat MOTS (Medium Order Thinking Skills).
          </p>
        </div>

        <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm hover:border-blue-400 hover:shadow-md transition-all cursor-pointer">
          <div className="text-3xl mb-3">📖</div>
          <h3 className="font-bold text-lg text-gray-900">Literasi Bahasa Indonesia</h3>
          <p className="text-gray-500 mt-2 text-sm leading-relaxed">
            Latihan memahami bacaan kompleks, gagasan utama, dan penarikan kesimpulan teks panjang.
          </p>
        </div>
      </div>
    </div>
  );
}