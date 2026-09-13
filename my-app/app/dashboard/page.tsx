import studentsData from '@/data/dummy_students.json';

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Beranda & AI Insight Dosen</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {studentsData.map((student) => (
          <div key={student.id} className="bg-white p-5 rounded-lg shadow border border-gray-200">
            <h3 className="font-semibold text-lg text-gray-900">{student.nama}</h3>
            <p className="text-sm text-gray-600 mt-1">Kehadiran: {student.kehadiran}% | Nilai: {student.nilai}</p>
            <div className="mt-3 p-3 bg-blue-50 border-l-4 border-blue-500 rounded text-sm text-blue-900">
              <strong>🤖 AI Insight:</strong> {student.evaluasi_ai}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}