// app/page.tsx
export default function Home() {
  return (
    <div className="space-y-6">
      {/* Header Area */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        <button className="px-6 py-2 bg-white border border-gray-300 rounded-lg shadow-sm font-semibold text-gray-700 hover:bg-gray-50 transition">
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card (Kiri, warna putih) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-gray-100 flex items-center gap-6">
          <div className="w-24 h-24 rounded-full border-2 border-gray-300 flex items-center justify-center shrink-0">
             {/* Ikon User Sederhana */}
             <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
             </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#579CEC]">Ryan Fikri Ramadhan</h2>
            <div className="text-gray-600 mt-1 space-y-1 text-sm">
              <p>Kelas Geometri</p>
              <p>StudentID: B000</p>
              <p>Bergabung sejak Oktober 2026</p>
            </div>
          </div>
        </div>

        {/* Info Card (Kanan, Biru) */}
        <div className="bg-[#6FA4E9] p-6 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.15)] text-white flex flex-col justify-center">
          <p className="font-medium">Overall Score: 680</p>
          <p className="font-medium mt-1">PTN Impian: Universitas Brawijaya</p>
          <div className="mt-3 flex items-center gap-2">
            <span className="font-medium">Status:</span>
            <span className="text-[#32CD32] font-black text-xl tracking-wider">AKTIF</span>
          </div>
        </div>
      </div>

      {/* Statistik Utama (Tengah, Ungu) */}
      <div className="bg-[#A78BFA] p-6 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.15)] text-white mt-6">
        <div className="grid grid-cols-4 divide-x divide-white/30 text-center">
          <div className="px-4">
            <p className="text-sm font-semibold mb-1 opacity-90">Total TO</p>
            <p className="text-4xl font-bold">5</p>
          </div>
          <div className="px-4">
            <p className="text-sm font-semibold mb-1 opacity-90">Rata-rata nilai</p>
            <p className="text-4xl font-bold">505,4</p>
          </div>
          <div className="px-4">
            <p className="text-sm font-semibold mb-1 opacity-90">Kehadiran</p>
            <p className="text-4xl font-bold">96%</p>
          </div>
          <div className="px-4">
            <p className="text-sm font-semibold mb-1 opacity-90">Progress</p>
            <p className="text-4xl font-bold">70%</p>
          </div>
        </div>
      </div>

      {/* Evaluasi Card (Bawah) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Kekuatan (Hijau Tosca) */}
        <div className="bg-[#56C596] p-6 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.15)] text-white">
          <p className="text-sm font-semibold opacity-90">Kekuatan:</p>
          <h3 className="text-4xl font-bold mt-2">PK<br/>PU</h3>
        </div>

        {/* Perlu Ditingkatkan (Oranye) */}
        <div className="bg-[#F0AD4E] p-6 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.15)] text-white">
          <p className="text-sm font-semibold opacity-90">Perlu ditingkatkan:</p>
          <h3 className="text-4xl font-bold mt-2">LBI<br/>PBM</h3>
        </div>
      </div>
    </div>
  );
}