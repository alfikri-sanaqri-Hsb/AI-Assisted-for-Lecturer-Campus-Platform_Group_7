import React, { useState } from 'react';

export default function Progress() {
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = (e) => {
    setIsScrolled(e.target.scrollTop > 20);
  };

  return (
    <div 
      className="w-full h-screen overflow-y-auto pb-16 bg-slate-50 relative"
      onScroll={handleScroll}
    >
      {/* LATAR BELAKANG BIRU STATIS */}
      <div className="absolute top-0 left-0 right-0 h-[400px] bg-[#00A5FF] overflow-hidden z-0 rounded-b-[3rem]">
        <div className="absolute inset-0 opacity-10 pointer-events-none flex justify-around items-center">
          <span className="text-7xl text-white">📈</span>
          <span className="text-9xl text-white">🎯</span>
        </div>
      </div>

      {/* WRAPPER KONTEN */}
      <div className="relative z-10">
        
        {/* HEADER STICKY GLASSMORPHISM SEPERTI KACA BIASA */}
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
                Fauzan <span className="text-lg">👋 💎</span>
              </h1>
              <p className="text-sky-100 text-xs font-medium">Universitas Gadjah Mada</p>
            </div>
          </div>
          <div className="flex gap-3 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white border border-white/30 shadow-sm">
            <div className="flex items-center gap-1.5 font-bold text-xs"><span>⚡</span> 9.230</div>
            <div className="flex items-center gap-1.5 font-bold text-xs"><span>🔄</span> 12</div>
          </div>
        </div>

        {/* HERO SECTION PROGRESS */}
        <div className="px-8 mt-6 mb-10">
          <div className="bg-white/20 backdrop-blur-md border border-white/40 rounded-3xl p-8 max-w-3xl mx-auto text-center shadow-lg">
            <h2 className="text-4xl font-extrabold text-white mb-2 drop-shadow-md">Progress</h2>
            <p className="text-white/90 font-medium text-sm mb-6">Temukan Solusi dari Memantau Progress</p>
            <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/50 text-white px-6 py-2.5 rounded-full font-semibold text-sm transition-all shadow-sm flex items-center gap-2 mx-auto">
              Buat Catatan ✎
            </button>
          </div>
        </div>

        {/* KONTEN UTAMA GRID DESKTOP */}
        <div className="px-8 space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* KOLOM KIRI (Grafik & Analisis) */}
            <div className="xl:col-span-2 space-y-6">
              
              {/* Statistik TryOut */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h3 className="font-extrabold text-slate-900 text-lg mb-6">Statistik TryOut</h3>
                
                {/* Visualisasi Grafik Sederhana (SVG murni agar tidak butuh library tambahan) */}
                {/* Visualisasi Grafik yang Lebih Presisi */}
                <div className="relative h-[280px] w-full flex items-end font-sans">
                  
                  {/* Grid Lines Y-Axis */}
                  <div className="absolute inset-0 flex flex-col justify-between pt-4 pb-10">
                    {[700, 600, 500, 400, 300, 200, 100, 0].map((val, i) => (
                      <div key={i} className="flex items-center gap-4 w-full">
                        <span className="text-[11px] font-bold text-slate-400 w-8 text-right">{val}</span>
                        <div className="flex-1 border-b border-slate-100"></div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Grafik Garis (Bezier Curve Akurat Sesuai Data Asli) */}
                  <div className="absolute inset-0 left-16 right-8 bottom-10 top-4">
                    <svg viewBox="0 0 400 200" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                      <path 
                        d="M 0,85.7 C 50,85.7 50,66.3 100,66.3 C 150,66.3 150,91.4 200,91.4 C 250,91.4 250,18.9 300,18.9 C 350,18.9 350,15.7 400,15.7" 
                        fill="none" 
                        stroke="#00A5FF" 
                        strokeWidth="3.5"
                        vectorEffect="non-scaling-stroke"
                        strokeLinecap="round"
                      />
                      
                      {/* Titik Point Data Tepat pada Koordinat Kalkulasi */}
                      <circle cx="0" cy="85.7" r="5" fill="#00A5FF" stroke="white" strokeWidth="2.5" vectorEffect="non-scaling-stroke"/>
                      <circle cx="100" cy="66.3" r="5" fill="#00A5FF" stroke="white" strokeWidth="2.5" vectorEffect="non-scaling-stroke"/>
                      <circle cx="200" cy="91.4" r="5" fill="#00A5FF" stroke="white" strokeWidth="2.5" vectorEffect="non-scaling-stroke"/>
                      <circle cx="300" cy="18.9" r="5" fill="#00A5FF" stroke="white" strokeWidth="2.5" vectorEffect="non-scaling-stroke"/>
                      <circle cx="400" cy="15.7" r="5" fill="#00A5FF" stroke="white" strokeWidth="2.5" vectorEffect="non-scaling-stroke"/>
                    </svg>
                  </div>

                  {/* Label X-Axis */}
                  <div className="absolute bottom-2 left-16 right-8 flex justify-between text-[11px] font-bold text-slate-400">
                    <span className="-ml-3">TO-1</span>
                    <span className="-ml-3">TO-2</span>
                    <span className="-ml-3">TO-3</span>
                    <span className="-ml-3">TO-4</span>
                    <span className="-ml-3">TO-5</span>
                  </div>
                </div>
              </div>

              {/* Card Split Kekuatan & Kelemahan */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row overflow-hidden">
                {/* Kekuatan */}
                <div className="flex-1 p-6 border-b md:border-b-0 md:border-r border-slate-100 bg-slate-50/50">
                  <h3 className="font-extrabold text-slate-900 text-xl mb-4">Kekuatan:</h3>
                  <ul className="space-y-4">
                    <li className="flex justify-between items-center border-b border-slate-200 pb-3">
                      <span className="font-bold text-sm text-slate-800">PK: Operasi Bilangan</span>
                      <span className="text-green-500 bg-green-100 p-1 rounded flex items-center justify-center text-xs">☑</span>
                    </li>
                    <li className="flex justify-between items-center border-b border-slate-200 pb-3">
                      <span className="font-bold text-sm text-slate-800">PU: Penalaran induktif</span>
                      <span className="text-green-500 bg-green-100 p-1 rounded flex items-center justify-center text-xs">☑</span>
                    </li>
                  </ul>
                </div>
                {/* Perlu Ditingkatkan */}
                <div className="flex-1 p-6">
                  <h3 className="font-extrabold text-slate-900 text-xl mb-4">Perlu ditingkatkan:</h3>
                  <ul className="space-y-4">
                    <li className="flex justify-between items-center border-b border-slate-200 pb-3 cursor-pointer hover:text-blue-500 group transition-colors">
                      <span className="font-bold text-sm text-slate-800 group-hover:text-blue-600">LBI: Kalimat Baku dan Nonbaku</span>
                      <span className="text-slate-400 text-lg group-hover:translate-x-1 transition-transform">→</span>
                    </li>
                    <li className="flex justify-between items-center border-b border-slate-200 pb-3 cursor-pointer hover:text-blue-500 group transition-colors">
                      <span className="font-bold text-sm text-slate-800 group-hover:text-blue-600">PBM: PUEBI / EYD V</span>
                      <span className="text-slate-400 text-lg group-hover:translate-x-1 transition-transform">→</span>
                    </li>
                  </ul>
                </div>
              </div>

            </div>

            {/* KOLOM KANAN (Riwayat & Subjek) */}
            <div className="space-y-6">
              
              {/* Riwayat TO */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 relative">
                <div className="absolute left-6 top-8 bottom-8 w-1 bg-slate-100 rounded-full"></div>
                <div className="space-y-5 relative z-10 pl-4">
                  {['TO-5', 'TO-4', 'TO-3'].map((to, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-white">
                      <div className="font-extrabold text-slate-800 text-base relative">
                        <div className="absolute -left-[21px] top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-slate-300 rounded-full"></div>
                        {to}
                      </div>
                      <button className="bg-[#00A5FF] hover:bg-blue-600 text-white font-bold text-xs px-4 py-1.5 rounded-lg shadow-sm transition-colors">
                        View
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Subjek Check */}
              <div className="space-y-4 mt-8">
                {['Pengetahuan Kuantitatif', 'Penalaran Matematika', 'Penalaran Umum'].map((subject, idx) => (
                  <div key={idx} className="bg-slate-100/70 hover:bg-slate-100 rounded-2xl p-4 flex justify-between items-center transition-colors">
                    <span className="font-extrabold text-slate-800 text-sm">{subject}</span>
                    <button className="bg-white text-[#00A5FF] font-extrabold text-xs px-4 py-1.5 rounded-full border border-[#00A5FF]/20 shadow-sm hover:shadow-md transition-all">
                      Check
                    </button>
                  </div>
                ))}
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
}