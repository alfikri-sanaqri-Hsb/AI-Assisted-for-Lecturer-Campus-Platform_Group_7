import React from 'react';

export default function WebLayout({ children, activePage, setActivePage }) {
  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar Navigasi Web (Dibuat flex-col dan justify-between agar Log Out terdorong ke bawah) */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col justify-between p-6">
        
        {/* Bagian Atas: Logo dan Menu Utama */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
              SA
            </div>
            <div>
              <h1 className="font-bold text-slate-800 text-base">Sahabat Alfary</h1>
              <p className="text-xs text-slate-400">Platform Belajar</p>
            </div>
          </div>

        <nav className="space-y-2">
            <button 
              onClick={() => setActivePage('home')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                activePage === 'home' 
                  ? 'bg-indigo-50 text-indigo-600 font-bold' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
           Home
            </button>

            <button 
              onClick={() => setActivePage('study')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                activePage === 'study' 
                  ? 'bg-indigo-50 text-indigo-600 font-bold' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
           Study
            </button>

            <button 
              onClick={() => setActivePage('progress')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                activePage === 'progress' 
                  ? 'bg-indigo-50 text-indigo-600 font-bold' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
           Progress
            </button>

            <button 
              onClick={() => setActivePage('ranking')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                activePage === 'ranking' 
                  ? 'bg-indigo-50 text-indigo-600 font-bold' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
           Ranking
            </button>

            <button 
              onClick={() => setActivePage('mentor')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                activePage === 'mentor' 
                  ? 'bg-indigo-50 text-indigo-600 font-bold' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
           Mentor
            </button>

          </nav>
        </div>

        {/* Bagian Bawah: Tombol Log Out dan Info Tim */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          {/* Tombol Log Out Berwarna Merah */}
          <button 
            onClick={() => alert('Log out diklik!')}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl font-medium text-sm transition"
          >
            Log Out
          </button>

          <div className="bg-slate-50 p-3 rounded-xl text-xs text-slate-500">
            <span className="font-semibold text-slate-700 block mb-1">Tim Frontend</span>
            Ryan.co
          </div>
        </div>

      </aside>

      {/* Area Konten Utama Web */}
      <main className="flex-1 flex flex-col min-w-0 bg-[url('/bg-dashboard.png')] bg-cover bg-top bg-no-repeat bg-fixed">
        {/* Konten Halaman */}
        <div id="main-scroll-container" className="flex-1 overflow-y-auto h-screen">
          {children}
        </div>
      </main>
    </div>
  );
}