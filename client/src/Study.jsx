import React, { useState } from 'react';

export default function Study() {
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = (e) => {
    setIsScrolled(e.target.scrollTop > 20);
  };

  return (
    <div 
      className="w-full h-screen overflow-y-auto pb-16 bg-slate-50 relative"
      onScroll={handleScroll}
    >
      {/* 
        LATAR BELAKANG BIRU STATIS 
        (Posisi absolute agar tidak mengganggu sticky, dan akan ikut ter-scroll ke atas secara natural) 
      */}
      <div className="absolute top-0 left-0 right-0 h-72 bg-[#00A5FF] overflow-hidden z-0">
        <div className="absolute inset-0 opacity-10 pointer-events-none flex justify-around items-center">
          <span className="text-6xl text-white">📐</span>
          <span className="text-8xl text-white">🤖</span>
        </div>
      </div>

      {/* WRAPPER KONTEN (Agar berada di atas latar biru) */}
      <div className="relative z-10">
        
        {/* HEADER STICKY GLASSMORPHISM */}
        <div className={`sticky top-0 z-50 flex justify-between items-center px-8 py-4 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/20 backdrop-blur-md shadow-sm border-b border-white/20' 
            : 'bg-transparent'
        }`}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/25 backdrop-blur-md rounded-full flex items-center justify-center border-2 border-white/50 text-white text-xl shadow-sm">
              👤
            </div>
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                Fauzan <span className="text-lg">👋</span>
              </h1>
              <p className="text-sky-100 text-xs font-medium">Universitas Gadjah Mada</p>
            </div>
          </div>
          <div className="flex gap-3 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white border border-white/30 shadow-sm">
            <div className="flex items-center gap-1.5 font-bold text-xs"><span>⚡</span> 9.230</div>
            <div className="flex items-center gap-1.5 font-bold text-xs"><span>🔄</span> 12</div>
          </div>
        </div>

        {/* KONTEN UTAMA DENGAN GRID DESKTOP */}
        <div className="px-8 mt-4 space-y-6">
          
          {/* Grid Layout: Kiri (Konten Utama), Kanan (Sidebar Pendukung) */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* Kolom Kiri (Porsi Lebih Besar) */}
            <div className="xl:col-span-2 space-y-6">
              
              {/* 1. Card: Lanjutkan Belajar */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition">
                <h2 className="font-extrabold text-slate-900 text-lg mb-4">Lanjutkan Belajar</h2>
                <div className="flex items-center gap-5">
                  <div className="w-24 h-16 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 shadow-inner">
                    <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs"></div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-800 mb-3">Materi Eksponen: Sifat Dasar</p>
                    <div className="flex items-center gap-4">
                      <div className="flex-1 bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-blue-500 w-[60%] h-full rounded-full"></div>
                      </div>
                      <span className="text-xs text-slate-400 font-bold">60%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Card: Misi Harian */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h2 className="font-extrabold text-slate-900 text-lg mb-4">Misi harian</h2>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <input type="checkbox" className="mt-1 w-5 h-5 rounded border-slate-300 text-blue-500 accent-blue-500 cursor-pointer" />
                    <p className="text-sm text-slate-700 font-medium">Selesaikan 10 Soal Pengetahuan Kuantitatif</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <input type="checkbox" className="mt-1 w-5 h-5 rounded border-slate-300 text-blue-500 cursor-pointer" />
                    <p className="text-sm text-slate-700 font-medium">Selesaikan 5 Flashcard</p>
                  </div>
                </div>
                <div className="mt-5 flex items-center gap-3">
                   <div className="w-5 h-5 rounded bg-emerald-500 flex items-center justify-center text-white text-xs font-bold">✓</div>
                   <div className="flex-1 bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-blue-500 w-[50%] h-full rounded-full"></div>
                   </div>
                </div>
              </div>

              {/* 3. Section: Rekomendasi Topik */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-extrabold text-slate-800 text-lg">Rekomendasi Topik</h2>
                  <div className="flex gap-2 text-slate-600 font-bold">
                    <button className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50">{"<"}</button>
                    <button className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50">{">"}</button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between h-32 hover:shadow-md transition">
                    <h3 className="text-xs font-bold text-slate-900 leading-snug">Perkuat kelemahan:<br/>Penalaran Matematika</h3>
                    <div className="text-blue-500 self-end text-xl">🧮</div>
                  </div>
                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between h-32 hover:shadow-md transition">
                    <h3 className="text-xs font-bold text-slate-900 leading-snug">Target Ulang:<br/>Penalaran Umum</h3>
                    <div className="text-blue-500 self-end text-xl">💡</div>
                  </div>
                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between h-32 hover:shadow-md transition">
                    <h3 className="text-xs font-bold text-slate-900 leading-snug">Tinjau Logika Dasar</h3>
                    <div className="text-blue-500 self-end text-xl">📖</div>
                  </div>
                </div>
              </div>

            </div>

            {/* Kolom Kanan (Sidebar Informasi) */}
            <div className="space-y-6">
              
              {/* Jadwal Terdekat */}
              <div className="bg-sky-400 rounded-2xl p-6 shadow-sm text-white">
                <div className="bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-md inline-block mb-4 shadow-sm">
                  Jadwal Terdekat
                </div>
                <div className="text-white text-sm font-bold space-y-2 mb-6">
                  <p>24 Jan: TryOut Akbar UTBK</p>
                  <p>26 Jan: Join Live Class (PM)</p>
                </div>
                <button className="w-full bg-white/90 text-sky-700 font-bold text-xs py-3 rounded-xl hover:bg-white transition-all shadow-sm">
                  Daftar / Reminder
                </button>
              </div>

              {/* Tips Belajar Hari Ini */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center gap-4">
                <div className="w-12 h-12 bg-sky-50 rounded-xl flex items-center justify-center text-blue-500 text-2xl shrink-0">
                  💡
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm mb-1">Tips Belajar Hari Ini</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">Gunakan Teknik Pomodoro: Belajar 25 Menit, Istirahat 5 Menit</p>
                </div>
              </div>

            </div>

          </div>

          {/* Menu List Bawah (Full Width Grid) */}
          <div className="pt-2">
            <h2 className="font-extrabold text-slate-800 text-lg mb-4">Fitur Belajar Lainnya</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Latihan Soal UTBK', icon: '📘' },
                { label: 'TryOut Online', icon: '🏆' },
                { label: 'Flashcard', icon: '⭐' },
                { label: 'Bank Soal Lengkap', icon: '📊' }
              ].map((item, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex justify-between items-center cursor-pointer hover:shadow-md hover:border-sky-200 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-sky-50 rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <span className="font-extrabold text-slate-900 text-sm">{item.label}</span>
                  </div>
                  <span className="text-slate-400 font-bold text-xl group-hover:translate-x-1 transition-transform">›</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}