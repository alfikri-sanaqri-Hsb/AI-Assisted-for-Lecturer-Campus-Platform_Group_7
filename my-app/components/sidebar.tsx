import Link from 'next/link';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen p-4 flex flex-col">
      <h2 className="text-xl font-bold mb-8 text-blue-400">Portal Dosen AC-01</h2>
      <nav className="flex flex-col gap-4">
        <Link href="/dashboard" className="hover:bg-slate-800 p-2 rounded transition">
          Beranda & AI Insight
        </Link>
        <Link href="/dashboard/kelas" className="hover:bg-slate-800 p-2 rounded transition">
          Manajemen Kelas & Nilai
        </Link>
      </nav>
    </aside>
  );
}