import React, { useState, useRef } from 'react';

export default function Mentor() {
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollContainerRef = useRef(null);
  
  // STATE BARU: Untuk melacak bola (dot) mana yang sedang aktif
  const [activeDot, setActiveDot] = useState(0);

  const handleScroll = (e) => {
    setIsScrolled(e.target.scrollTop > 20);
  };

  // FUNGSI BARU: Mendeteksi posisi geser carousel untuk menyinkronkan bola
  const handleCarouselScroll = () => {
    if (scrollContainerRef.current) {
      const scrollLeft = scrollContainerRef.current.scrollLeft;
      // Perkiraan lebar 1 card (260px) + gap (24px) = 284px
      const activeIndex = Math.round(scrollLeft / 284);
      setActiveDot(activeIndex);
    }
  };

  const scrollLeftBtn = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -284, behavior: 'smooth' });
    }
  };

  const scrollRightBtn = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 284, behavior: 'smooth' });
    }
  };

  // DATA DITAMBAHKAN: Menjadi 6 mentor agar scroll lebih panjang dan proporsional
  const featuredMentors = [
    { name: 'Mister Ryan,\nalumni UNDIP', role: 'Penalaran Penge-\ntahuan Kuantitatif', rating: 5, avatar: '👦🏽' },
    { name: 'Ir. Alfi\nalumni ITB', role: 'Penalaran\nMatematika\ndan Sains', rating: 5, avatar: '👦🏻' },
    { name: 'Prof. Ojan\nalumni UGM', role: 'Biologi dan Fisika\nPeminatan', rating: 5, avatar: '👦' },
    { name: 'Kak Siska,\nalumni UI', role: 'Literasi Bahasa\nIndonesia', rating: 5, avatar: '👧' },
    { name: 'Bang Dika,\nalumni ITS', role: 'Fisika dan\nKimia', rating: 5, avatar: '👦🏽' },
    { name: 'Mbak Rina,\nalumni UNPAD', role: 'Sosiologi dan\nSejarah', rating: 5, avatar: '👧🏻' },
  ];

  const allMentors = [
    { name: 'Ir. Alfikri Sanaqri Hsb', role: 'Ahli Penalaran Matematika dan Sains', rating: 5, avatar: '👦🏻' },
    { name: 'Prof. Ojan', role: 'Biologi dan Fisika Peminatan', rating: 5, avatar: '👦' },
    { name: 'Mister Rayen', role: 'Penalaran Pengetahuan Kuantitatif', rating: 5, avatar: '👦🏽' },
  ];

  return (
    <div 
      className="w-full h-screen overflow-y-auto pb-16 bg-[#D8F1FF] relative"
      onScroll={handleScroll}
    >
      {/* LATAR BELAKANG BIRU STATIS (Tinggi sudah disesuaikan agar tidak memotong card) */}
      <div className="absolute top-0 left-0 right-0 h-[620px] bg-[#3CB8FF] overflow-hidden z-0 rounded-b-[4rem]">
        <div className="absolute inset-0 opacity-10 pointer-events-none flex justify-around items-center">
          <span className="text-7xl text-white">👨‍🏫</span>
          <span className="text-9xl text-white">📚</span>
        </div>
      </div>

      {/* WRAPPER KONTEN */}
      <div className="relative z-10">
        
        {/* HEADER STICKY GLASSMORPHISM */}
        <div className={`sticky top-0 z-50 flex justify-between items-center px-8 py-4 transition-all duration-300 ${
          isScrolled 
            ? 'bg-[#3CB8FF]/90 backdrop-blur-md shadow-md border-b border-white/20' 
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

        {/* HERO SECTION: SEARCH & FEATURED MENTORS */}
        <div className="px-8 mt-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-black text-black mb-4 drop-shadow-sm flex items-center gap-2">
              Daftar Mentor Kami ➔
            </h2>
            
            {/* Search Bar */}
            <div className="relative mb-8">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </div>
              <input 
                type="text" 
                placeholder="Cari Mentor (Nama, PTN, atau Subjek)..." 
                className="w-full py-4 pl-12 pr-4 rounded-xl shadow-sm border-none focus:ring-2 focus:ring-white/50 text-sm font-medium text-slate-700 bg-white placeholder-slate-300 outline-none transition-all"
              />
            </div>

            {/* Slider/Carousel Container */}
            <div className="relative flex items-center justify-center">
              
              <button 
                onClick={scrollLeftBtn} 
                className="absolute left-[-2rem] z-20 text-blue-900/40 hover:text-blue-900/70 transition-colors"
              >
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path></svg>
              </button>

              {/* Area Scroll Utama (Ditambahkan onScroll handler) */}
              <div 
                ref={scrollContainerRef}
                onScroll={handleCarouselScroll}
                className="flex gap-6 overflow-x-auto pb-8 pt-4 px-2 snap-x scroll-smooth w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
              >
                {featuredMentors.map((mentor, idx) => (
                  <div key={idx} className="snap-center min-w-[240px] md:min-w-[260px] bg-white rounded-[1.25rem] shadow-xl flex flex-col items-center text-center relative shrink-0 overflow-hidden">
                    <div className="w-full h-[5.5rem] bg-[#5389C6]"></div>
                    <div className="w-[4.5rem] h-[4.5rem] bg-slate-200 rounded-full flex items-center justify-center text-3xl border-[3px] border-white absolute top-10 left-1/2 -translate-x-1/2 overflow-hidden shadow-sm">
                      {mentor.avatar}
                    </div>
                    <div className="pt-10 px-5 pb-6 flex flex-col items-center flex-1 w-full">
                      <h3 className="font-extrabold text-black text-[15px] leading-snug mb-2 whitespace-pre-line">
                        {mentor.name}
                      </h3>
                      <div className="flex gap-1 text-[#FFAC33] text-sm mb-3">
                        {'★'.repeat(mentor.rating)}
                      </div>
                      <p className="text-[13px] text-slate-400 font-medium leading-relaxed mb-6 flex-1 px-2 whitespace-pre-line">
                        {mentor.role}
                      </p>
                      <button className="w-full bg-[#00A5FF] hover:bg-blue-500 text-white font-bold text-sm py-2.5 rounded-lg shadow-[0_4px_14px_0_rgba(0,165,255,0.39)] transition-all">
                        Lihat Profil
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button 
                onClick={scrollRightBtn} 
                className="absolute right-[-2rem] z-20 text-blue-900/40 hover:text-blue-900/70 transition-colors"
              >
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path></svg>
              </button>
            </div>
            
            {/* Pagination Dots (Dibatasi 4 bola agar sesuai referensi desain) */}
            <div className="flex justify-center gap-2.5 mt-2">
              {Array.from({ length: 4 }).map((_, idx) => {
                // Mencegah error indeks: jika scroll mentok sampai ujung, bola ke-4 (indeks 3) yang akan tetap menyala
                const currentDot = activeDot >= 3 ? 3 : activeDot;
                
                return (
                  <button 
                    key={idx}
                    onClick={() => {
                      if (scrollContainerRef.current) {
                        scrollContainerRef.current.scrollTo({ left: idx * 284, behavior: 'smooth' });
                      }
                    }}
                    className={`h-2.5 rounded-full shadow-sm transition-all duration-300 ${
                      currentDot === idx ? 'bg-[#00A5FF] w-6' : 'bg-slate-300 w-2.5 hover:bg-slate-400'
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* KONTEN UTAMA BAGIAN BAWAH */}
        <div className="px-8 mt-12 space-y-6 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 space-y-4">
              <h2 className="font-extrabold text-black text-xl mb-4">Daftar Lengkap Mentor ➔</h2>
              <div className="space-y-4">
                {allMentors.map((mentor, idx) => (
                  <div key={idx} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center text-3xl shadow-inner shrink-0 border border-slate-200">
                        {mentor.avatar}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-black text-base">{mentor.name}</h3>
                        <div className="flex items-center gap-1.5 mt-1 mb-1.5">
                          <span className="text-[#FFAC33] text-sm">★</span>
                          <span className="text-xs text-slate-500 font-medium">{mentor.rating} Bintang</span>
                        </div>
                        <p className="text-xs text-slate-400 font-medium">{mentor.role}</p>
                      </div>
                    </div>
                    <button className="w-full md:w-auto bg-[#00A5FF] hover:bg-blue-500 text-white font-bold text-xs px-6 py-2.5 rounded-lg shadow-sm transition-colors shrink-0">
                      Pesan Sesi
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="font-extrabold text-black text-xl mb-4">Sesi Saya Berikutnya ➔</h2>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center text-3xl shadow-inner shrink-0 border border-slate-200">
                    👦🏻
                  </div>
                  <div>
                    <p className="font-extrabold text-black text-sm mb-1 leading-snug">
                      Sesi Besok, 10:00 WIB
                    </p>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                      Penalaran Matematika - Alfikri Sanaqri Hsb
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}