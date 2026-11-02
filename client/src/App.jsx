import React, { useState } from 'react';
import MobileFrame from './WebLayout';
import Dashboard from './dashboard';
import Study from './Study';
import Progress from './Progress';
import Ranking from './Ranking';
import Mentor from './Mentor';

export default function App() {
  // State untuk menyimpan halaman aktif ('home' atau 'study')
  const [currentPage, setCurrentPage] = useState('home');

  return (
    <MobileFrame activePage={currentPage} setActivePage={setCurrentPage}>
      {/* Merender komponen secara dinamis berdasarkan state */}
      {currentPage === 'home' && <Dashboard />}
      {currentPage === 'study' && <Study />}
      {currentPage === 'progress' && <Progress />}
      {currentPage === 'ranking' && <Ranking />}
      {currentPage === 'mentor' && <Mentor />}
    </MobileFrame>
  );
}