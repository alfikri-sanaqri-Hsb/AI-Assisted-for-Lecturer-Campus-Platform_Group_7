'use client';

import { useState } from 'react';
import initialStudents from '@/data/dummy_students.json';

export default function KelasPage() {
  const [students, setStudents] = useState(initialStudents);
  const [nama, setNama] = useState('');
  const [kehadiran, setKehadiran] = useState('');
  const [nilai, setNilai] = useState('');

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama || !kehadiran || !nilai) return;

    const newStudent = {
      id: `MHS00${students.length + 1}`,
      nama,
      kehadiran: Number(kehadiran),
      nilai: Number(nilai),
      evaluasi_ai: 'Data baru diinput. Menunggu proses analisis AI lebih lanjut.'
    };

    setStudents([...students, newStudent]);
    setNama('');
    setKehadiran('');
    setNilai('');
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Manajemen Kelas & Rekap Nilai</h1>

      {/* Form Input Data Mahasiswa */}
      <form onSubmit={handleAddStudent} className="bg-white p-6 rounded-lg shadow border mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Nama Mahasiswa"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="number"
          placeholder="Kehadiran (%)"
          value={kehadiran}
          onChange={(e) => setKehadiran(e.target.value)}
          className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="number"
          placeholder="Nilai (0-100)"
          value={nilai}
          onChange={(e) => setNilai(e.target.value)}
          className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button type="submit" className="bg-blue-600 text-white font-semibold rounded p-2 hover:bg-blue-700 transition">
          + Tambah Mahasiswa
        </button>
      </form>

      {/* Tabel Data Mahasiswa */}
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-4 border-b">ID</th>
              <th className="p-4 border-b">Nama</th>
              <th className="p-4 border-b">Kehadiran</th>
              <th className="p-4 border-b">Nilai</th>
              <th className="p-4 border-b">Status AI</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50 border-b">
                <td className="p-4 font-mono text-sm">{student.id}</td>
                <td className="p-4 font-medium text-gray-900">{student.nama}</td>
                <td className="p-4">{student.kehadiran}%</td>
                <td className="p-4 font-semibold text-blue-600">{student.nilai}</td>
                <td className="p-4 text-sm text-gray-600">{student.evaluasi_ai}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}