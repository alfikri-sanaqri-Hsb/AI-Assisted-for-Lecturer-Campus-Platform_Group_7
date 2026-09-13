// app/progress/page.tsx
export default function ProgressPage() {
  const topikMastery = [
    { id: 1, topik: 'Operasi Bilangan & Pecahan (MOTS)', penguasaan: 85, status: 'Aman' },
    { id: 2, topik: 'Sifat-sifat Eksponen', penguasaan: 70, status: 'Cukup' },
    { id: 3, topik: 'Logika Matematika', penguasaan: 60, status: 'Perlu Latihan' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Progress Belajar 📈</h1>
      <p className="text-gray-600">Pantau terus perkembangan nilaimu di setiap topik.</p>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mt-6">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 text-slate-600 border-b border-gray-200">
            <tr>
              <th className="p-4 font-semibold">Topik Materi</th>
              <th className="p-4 font-semibold w-1/3">Tingkat Penguasaan</th>
              <th className="p-4 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {topikMastery.map((item) => (
              <tr key={item.id} className="border-b border-gray-100 hover:bg-slate-50 transition">
                <td className="p-4 font-medium text-gray-800">{item.topik}</td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${item.penguasaan >= 80 ? 'bg-green-500' : item.penguasaan >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                        style={{ width: `${item.penguasaan}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-600">{item.penguasaan}%</span>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${item.penguasaan >= 80 ? 'bg-green-100 text-green-700' : item.penguasaan >= 70 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}