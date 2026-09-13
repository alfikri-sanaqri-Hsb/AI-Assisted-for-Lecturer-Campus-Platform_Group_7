// app/predict/page.tsx
'use client';
import { useState } from 'react';

export default function PredictPage() {
  const [skor, setSkor] = useState('');
  const [target, setTarget] = useState('Universitas Brawijaya - Teknologi Informasi');

  const handlePredict = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Mensimulasikan skor ${skor} untuk target: ${target}`);
    // Logika perhitungan peluang bisa ditambahkan di sini nanti
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-900">Rasionalisasi Kelulusan 🎯</h1>
      <p className="text-gray-600">Simulasikan peluangmu menembus PTN impian berdasarkan skor Tryout terakhir.</p>

      <form onSubmit={handlePredict} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Rata-rata Skor Tryout (UTBK)</label>
          <input
            type="number"
            value={skor}
            onChange={(e) => setSkor(e.target.value)}
            placeholder="Contoh: 680"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">PTN & Jurusan Target</label>
          <select 
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>Universitas Brawijaya - Teknologi Informasi</option>
            <option>Universitas Indonesia - Ilmu Komputer</option>
            <option>Institut Teknologi Bandung - STEI</option>
          </select>
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition mt-4">
          Analisis Peluang
        </button>
      </form>
    </div>
  );
}