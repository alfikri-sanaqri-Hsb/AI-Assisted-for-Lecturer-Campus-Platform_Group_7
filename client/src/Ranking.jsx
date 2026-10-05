import React, { useState } from 'react';

export default function Ranking() {
  const [isScrolled, setIsScrolled] = useState(false);
  
  // State untuk melacak kategori ranking mana yang aktif
  const [activeCategory, setActiveCategory] = useState('latihan');

  const handleScroll = (e) => {
    setIsScrolled(e.target.scrollTop > 20);
  };

  // Data pemeringkatan terpisah untuk TryOut dan Latihan Soal
  const rankingData = {
    tryout: {
      top3: {
        rank1: { name: 'Ojan', score: 1308, mood: '😎', avatar: '👦🏻' },
        rank2: { name: 'Singh', score: 1217, mood: '😡', avatar: '👦🏽' },
        rank3: { name: 'Apiki', score: 1198, mood: '🥺', avatar: '👦' }
      },
      leaderboard: [
        { rank: 4, name: 'Putra Owi', score: 1159, mood: '😡' },
        { rank: 5, name: 'Lil Proro', score: 1068, mood: '🥺' },
        { rank: 6, name: 'Bahlil Petranol', score: 1050, mood: '😎' },
        { rank: 7, name: 'Hamba Taat', score: 1067, mood: '🥺' },
        { rank: 8, name: 'Ambajan', score: 1004, mood: '😎' },
        { rank: 9, name: 'Top Global', score: 998, mood: '😡' },
        { rank: 10, name: 'Yantzy', score: 980, mood: '😡' }
      ]
    },
    latihan: {
      top3: {
        rank1: { name: 'Fauzan', score: 2450, mood: '🤩', avatar: '👦🏻' },
        rank2: { name: 'Singh', score: 2120, mood: '🤓', avatar: '👧🏽' },
        rank3: { name: 'Apiki', score: 1985, mood: '😎', avatar: '👦' }
      },
      leaderboard: [
        { rank: 4, name: 'Andi M', score: 1850, mood: '😊' },
        { rank: 5, name: 'Rina W', score: 1720, mood: '🤩' },
        { rank: 6, name: 'Joko P', score: 1690, mood: '😎' },
        { rank: 7, name: 'Dewi K', score: 1655, mood: '🥺' },
        { rank: 8, name: 'Rudi H', score: 1540, mood: '😡' },
        { rank: 9, name: 'Siska A', score: 1490, mood: '😎' },
        { rank: 10, name: 'Tono B', score: 1420, mood: '🤓' }
      ]
    }
  };

  // Mengambil data yang sesuai dengan kategori yang sedang aktif
  const currentData = rankingData[activeCategory];

  return (
    <div 
      className="w-full h-screen overflow-y-auto pb-16 bg-slate-50 relative"
      onScroll={handleScroll}
    >
      {/* LATAR BELAKANG BIRU STATIS */}
      <div className="absolute top-0 left-0 right-0 h-[450px] bg-[#00A5FF] overflow-hidden z-0 rounded-b-[4rem]">
        <div className="absolute inset-0 opacity-10 pointer-events-none flex justify-around items-center">
          <span className="text-7xl text-white">🏆</span>
          <span className="text-9xl text-white">⭐</span>
        </div>
      </div>

      {/* WRAPPER KONTEN */}
      <div className="relative z-10">
        
        {/* HEADER STICKY GLASSMORPHISM */}
        <div className={`sticky top-0 z-50 flex justify-between items-center px-8 py-4 transition-all duration-300 ${
          isScrolled 
            ? 'bg-[#00A5FF]/90 backdrop-blur-md shadow-md border-b border-white/20' 
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
              <p className="text-sky-100 text-xs font-medium">Universitas Brawijaya</p>
            </div>
          </div>
          <div className="flex gap-3 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white border border-white/30 shadow-sm">
            <div className="flex items-center gap-1.5 font-bold text-xs"><span>⚡</span> 9.230</div>
            <div className="flex items-center gap-1.5 font-bold text-xs"><span>🔄</span> 12</div>
          </div>
        </div>

        {/* KONTEN UTAMA GRID DESKTOP */}
        <div className="px-8 mt-6 space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            
            {/* KOLOM KIRI (Profil Ranking & Podium Top 3) */}
            <div className="xl:col-span-5 space-y-6">
              
              {/* Card Current Rank */}
              <div className="bg-[#42B8FF] rounded-3xl p-6 text-white shadow-lg border border-white/20">
                <h2 className="text-sm font-medium mb-1 opacity-90">Current Rank</h2>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black drop-shadow-md">
                    {activeCategory === 'tryout' ? '500,677' : '12,045'}
                  </span>
                  <span className="text-lg font-medium opacity-80">/677,896</span>
                </div>
              </div>

              {/* Toggles & Filter */}
              <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 space-y-4">
                <div className="flex bg-slate-200/70 p-1 rounded-full relative">
                  <button 
                    onClick={() => setActiveCategory('latihan')}
                    className={`flex-1 py-2.5 font-bold text-sm rounded-full z-10 transition-all ${
                      activeCategory === 'latihan' 
                        ? 'bg-[#42B8FF] text-white shadow-sm' 
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    Latihan Soal
                  </button>
                  <button 
                    onClick={() => setActiveCategory('tryout')}
                    className={`flex-1 py-2.5 font-bold text-sm rounded-full z-10 transition-all ${
                      activeCategory === 'tryout' 
                        ? 'bg-[#42B8FF] text-white shadow-sm' 
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    TryOut
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button className="bg-[#42B8FF] text-white text-xs font-bold px-4 py-1.5 rounded-md flex items-center gap-1.5 shadow-sm">
                    <span>📊</span> Nasional
                  </button>
                </div>
              </div>

              {/* Podium Top 3 (Dinamis Berdasarkan Kategori) */}
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex items-end justify-center gap-3 md:gap-6 pt-16 transition-all duration-500">
                
                {/* Juara 2 */}
                <div className="flex flex-col items-center w-28 animate-fade-in-up">
                  <div className="relative mb-3">
                    <div className="w-16 h-16 bg-slate-200 rounded-full border-4 border-slate-300 shadow-inner flex items-center justify-center text-2xl">{currentData.top3.rank2.avatar}</div>
                    <div className="absolute -bottom-3 -right-2 text-xl drop-shadow-sm">{currentData.top3.rank2.mood}</div>
                  </div>
                  <div className="w-full h-32 bg-gradient-to-t from-slate-300 to-slate-200 rounded-t-xl flex flex-col items-center justify-end pb-4 shadow-inner border border-slate-300/50">
                    <h3 className="font-bold text-slate-700 text-lg mb-1">{currentData.top3.rank2.name}</h3>
                    <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 font-black text-sm mb-1 shadow-sm">2</div>
                    <p className="font-black text-white text-2xl drop-shadow-md">{currentData.top3.rank2.score}</p>
                  </div>
                </div>

                {/* Juara 1 */}
                <div className="flex flex-col items-center w-32 relative -top-4 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                  <div className="absolute -top-12 text-5xl drop-shadow-lg z-10">👑</div>
                  <div className="relative mb-3">
                    <div className="w-20 h-20 bg-amber-100 rounded-full border-4 border-amber-400 shadow-inner flex items-center justify-center text-3xl">{currentData.top3.rank1.avatar}</div>
                    <div className="absolute -bottom-2 -right-2 text-2xl drop-shadow-sm">{currentData.top3.rank1.mood}</div>
                  </div>
                  <div className="w-full h-44 bg-gradient-to-t from-amber-300 to-amber-200 rounded-t-xl flex flex-col items-center justify-end pb-4 shadow-inner border border-amber-400/50">
                    <h3 className="font-extrabold text-amber-900 text-xl mb-1">{currentData.top3.rank1.name}</h3>
                    <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-500 font-black text-lg mb-1 shadow-sm">1</div>
                    <p className="font-black text-white text-3xl drop-shadow-md">{currentData.top3.rank1.score}</p>
                  </div>
                </div>

                {/* Juara 3 */}
                <div className="flex flex-col items-center w-28 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                  <div className="relative mb-3">
                    <div className="w-16 h-16 bg-orange-100 rounded-full border-4 border-orange-300 shadow-inner flex items-center justify-center text-2xl">{currentData.top3.rank3.avatar}</div>
                    <div className="absolute -bottom-3 -right-2 text-xl drop-shadow-sm">{currentData.top3.rank3.mood}</div>
                  </div>
                  <div className="w-full h-28 bg-gradient-to-t from-orange-300 to-orange-200 rounded-t-xl flex flex-col items-center justify-end pb-4 shadow-inner border border-orange-300/50">
                    <h3 className="font-bold text-orange-900 text-lg mb-1">{currentData.top3.rank3.name}</h3>
                    <div className="w-8 h-8 bg-orange-50 rounded-full flex items-center justify-center text-orange-400 font-black text-sm mb-1 shadow-sm">3</div>
                    <p className="font-black text-white text-2xl drop-shadow-md">{currentData.top3.rank3.score}</p>
                  </div>
                </div>

              </div>

            </div>

            {/* KOLOM KANAN (Daftar Leaderboard Peringkat 4+) */}
            <div className="xl:col-span-7">
              <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-sm border border-slate-100 h-full min-h-[600px]">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-extrabold text-slate-800 text-xl">Peringkat Lainnya</h2>
                  <span className="text-sm font-bold text-slate-400">Total 677,896 Siswa</span>
                </div>
                
                <div className="space-y-3 transition-all duration-300">
                  {currentData.leaderboard.map((user, index) => (
                    <div key={`${activeCategory}-${user.rank}`} className="bg-white hover:bg-slate-50 transition-colors p-4 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between group animate-fade-in-right" style={{ animationDelay: `${index * 50}ms` }}>
                      
                      <div className="flex items-center gap-4 md:gap-6">
                        {/* Angka Ranking */}
                        <div className="w-8 text-center font-black text-xl text-slate-800 group-hover:scale-110 transition-transform">
                          {user.rank}
                        </div>
                        
                        {/* Avatar & Nama */}
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center text-xl shadow-inner border border-slate-300">
                              👤
                            </div>
                            <div className="absolute -bottom-1 -right-1 text-sm bg-white rounded-full p-px shadow-sm">
                              {user.mood}
                            </div>
                          </div>
                          <h3 className="font-extrabold text-slate-800 text-base md:text-lg">{user.name}</h3>
                        </div>
                      </div>

                      {/* Skor */}
                      <div className="bg-slate-300/80 text-white font-black text-xl px-5 py-2 rounded-xl shadow-inner border border-slate-300">
                        {user.score}
                      </div>

                    </div>
                  ))}
                </div>
                
                {/* Indikator scroll */}
                <div className="mt-8 text-center text-slate-400 font-bold text-sm animate-pulse">
                  Scroll untuk melihat lebih banyak ↓
                </div>

              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}