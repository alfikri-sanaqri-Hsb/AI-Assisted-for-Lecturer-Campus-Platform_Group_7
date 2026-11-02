import React, { useState } from 'react';

export default function Dashboard() {
  const [isScrolled, setIsScrolled] = useState(false);

  // Fungsi mendeteksi scroll langsung dari div pembungkus
  const handleScroll = (e) => {
    // Jika posisi scroll dari atas lebih dari 20px, state menjadi true
    setIsScrolled(e.target.scrollTop > 20);
  };

  return (
    /* 
      KUNCI UTAMA: h-screen dan overflow-y-auto. 
      Ini memotong intervensi layout luar dan membuat sticky PASTI bekerja.
    */
    <div 
      className="w-full h-screen overflow-y-auto pb-20" 
      onScroll={handleScroll}
    >
      
      {/* HEADER */}
     <div className={`sticky top-0 z-50 flex justify-between items-center px-8 py-4 mb-6 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white-500/70 backdrop-blur-md shadow-md border-b border-white/20' 
          : 'bg-transparent'
      }`}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-xl border-2 border-white/50 text-white shadow-sm">
            👤
          </div>
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2 text-white">Fauzan <span className="text-lg">👋</span></h1>
            <p className="text-sky-100 text-xs font-medium">Universitas Gadjah Mada</p>
          </div>
        </div>
        <div className="flex gap-3 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white border border-white/30 shadow-sm">
            <div className="flex items-center gap-1.5 font-bold text-xs"><span>⚡</span> 9.230</div>
            <div className="flex items-center gap-1.5 font-bold text-xs"><span>🔄</span> 12</div>
          </div>
      </div>

      {/* KONTEN UTAMA */}
      <div className="px-8 space-y-6">
        
        {/* 1. Promo Card */}
        <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-slate-200 flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <span className="bg-indigo-600 text-white text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-md mb-3 inline-block font-bold">
              SNBT 2026 Terbaru
            </span>
            <h2 className="text-xl font-extrabold text-slate-800 mb-2 leading-tight">
              Kuasai Materi dengan Mentoring Live Interaktif
            </h2>
            <ul className="text-sm text-slate-600 space-y-1.5 font-medium">
              <li className="flex items-center gap-2">✔️ Sesi Mentoring Live 2x per Minggu</li>
              <li className="flex items-center gap-2">✔️ Pembahasan Soal & Review Materi</li>
              <li className="flex items-center gap-2">✔️ Diskusi Strategi PTN dengan Mentor</li>
            </ul>
          </div>
          <div className="bg-sky-50 p-5 rounded-xl text-center min-w-[220px] border border-sky-100">
            <p className="text-xs text-slate-500 font-semibold mb-1">Paket Mentoring Premium (3 Bulan)</p>
            <p className="text-2xl font-black text-slate-800">Rp 65.000<span className="text-xs font-medium text-slate-500">/bulan</span></p>
            <button className="mt-4 w-full bg-blue-500 text-white py-2.5 rounded-lg text-sm font-bold shadow-md hover:bg-blue-600 hover:-translate-y-0.5 transition-all">
              Berlangganan
            </button>
          </div>
        </div>

        {/* 2. Quick Actions Menu */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: 'Materi', icon: '📖' },
            { label: 'Latihan', icon: '📝' },
            { label: 'TryOut', icon: '📋' },
            { label: 'Prediksi', icon: '🔮' },
            { label: 'Video', icon: '▶️' }
          ].map((item) => (
            <div key={item.label} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center gap-3 hover:shadow-md hover:border-sky-200 transition-all cursor-pointer group">
              <div className="w-14 h-14 bg-sky-50 text-sky-500 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <span className="text-sm font-bold text-slate-700">{item.label}</span>
            </div>
          ))}
        </div>

        {/* 3. Main Content Grid (Split Layout) */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* Kolom Kiri */}
          <div className="xl:col-span-2 space-y-6">
            
            <section>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2 text-white">Lanjutkan Belajar →</h3>
              </div>
              <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-md transition">
                <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center text-3xl shadow-inner shadow-white/20">
                  📘
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-800 text-lg">Penalaran Umum</h4>
                  <div className="mt-3 flex items-center gap-4">
                    <div className="flex-1 bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-blue-500 w-[75%] h-full rounded-full"></div>
                    </div>
                    <span className="text-xs text-slate-500 font-bold whitespace-nowrap">Selesai 75%</span>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2 text-white">Jadwal Live Terdekat →</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#00A5FF]/45 backdrop-blur-md p-5 rounded-2xl flex items-center gap-4 shadow-sm text-white border border-white/20">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl">🎙️</div>
                  <div>
                    <p className="text-xs font-medium text-sky-50 mb-1">Hari ini, 19:00 WIB</p>
                    <h4 className="font-bold text-base leading-tight">Live Mentoring: Penalaran Umum</h4>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-orange-300 to-amber-400 p-5 rounded-2xl flex items-center gap-4 shadow-sm text-white">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl">⏳</div>
                  <div>
                    <p className="text-xs font-medium text-orange-50 mb-1">Sisa 3 Hari Lagi</p>
                    <h4 className="font-bold text-base leading-tight">Tryout Akbar SNBT Vol. 5</h4>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h3 className="font-bold text-slate-800 text-lg mb-4 text-white">Apa Kata Mereka?</h3>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
                 <div className="flex gap-4 items-start pb-4 border-b border-slate-50 last:border-0">
                   <div className="w-10 h-10 bg-slate-200 rounded-full flex-shrink-0"></div>
                   <div>
                     <p className="text-xs font-bold text-slate-800 mb-1">Alfikri Sanaqri Hsb <span className="text-slate-400 font-medium mx-1">•</span> STEI-K ITB</p>
                     <div className="bg-slate-100 p-3 rounded-xl rounded-tl-none text-xs text-slate-600 font-medium">
                       Rekom banget buat adik-adik yang pengen ngejar ptn impian, materinya asik dan mudah dipahami.
                     </div>
                   </div>
                 </div>
              </div>
            </section>

          </div>

          {/* Kolom Kanan */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 sticky top-6">
              <div className="flex justify-between items-center mb-5">
                <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">Misi Harian Fauzan →</h3>
              </div>
              
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <input type="checkbox" className="mt-1 w-5 h-5 rounded border-slate-300 text-blue-500 cursor-pointer" />
                  <div className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center text-xl shrink-0">📖</div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1.5">
                      <span className="text-sm font-bold text-slate-700">Kerjakan 10 Soal Latihan</span>
                      <span className="text-xs font-bold text-slate-400">3/10</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-blue-500 w-[30%] h-full rounded-full"></div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <input type="checkbox" className="mt-1 w-5 h-5 rounded border-slate-300 text-red-500 cursor-pointer" />
                  <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center text-xl shrink-0">▶️</div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1.5">
                      <span className="text-sm font-bold text-slate-700">Tonton 3 Video Materi</span>
                      <span className="text-xs font-bold text-slate-400">0/3</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-slate-300 w-0 h-full rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-3 bg-amber-50 rounded-xl text-xs text-amber-600 font-bold text-center flex items-center justify-center gap-1.5">
                🔥 Selesaikan Misi Untuk Tingkatkan Streak-mu!
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}