// app/mentor/page.tsx
export default function MentorPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Mentor & Diskusi 👨‍🏫</h1>
      <p className="text-gray-600">Tanyakan materi atau soal yang bikin kamu bingung ke mentor kami.</p>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 text-center mt-6">
        <div className="text-5xl mb-4">💬</div>
        <h3 className="text-xl font-bold text-gray-800">Ruang Diskusi Segera Hadir</h3>
        <p className="text-gray-500 mt-2 max-w-md mx-auto">
          Fitur ini nantinya akan membantumu terhubung langsung dengan tutor dan teman-teman seperjuangan untuk membahas soal-soal sulit.
        </p>
      </div>
    </div>
  );
}