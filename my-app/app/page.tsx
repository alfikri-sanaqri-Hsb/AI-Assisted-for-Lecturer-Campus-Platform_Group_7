export default function Home() {
  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Selamat Datang di Sahabat Belajar! 👋</h1>
        <p className="text-gray-600 mt-2">Mari maksimalkan persiapan PTN kamu hari ini.</p>
      </header>

      {/* Quick Stats / Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-semibold">Target Kampus</h3>
          <p className="text-xl font-bold text-gray-900 mt-2">Belum Diatur</p>
          <button className="text-blue-600 text-sm font-medium mt-3 hover:underline">Atur Target →</button>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-semibold">Modul Selesai</h3>
          <p className="text-xl font-bold text-gray-900 mt-2">12 / 45</p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '25%' }}></div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-semibold">Skor Tryout Terakhir</h3>
          <p className="text-xl font-bold text-gray-900 mt-2">680.5</p>
          <p className="text-green-500 text-sm font-medium mt-3">+25 poin dari TO sebelumnya</p>
        </div>
      </div>

      {/* Lanjutkan Belajar Section */}
      <section className="mt-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Lanjutkan Belajar</h2>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <h4 className="font-bold text-lg">Penalaran Matematika</h4>
            <p className="text-gray-600 text-sm mt-1">Bab 3: Operasi Bilangan dan Logika Dasar</p>
          </div>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
            Lanjut
          </button>
        </div>
      </section>
    </div>
  );
}