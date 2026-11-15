import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";

export const metadata: Metadata = {
  title: "Sahabat Alfary — Web Dashboard Platform",
  description: "Portal Akses Dashboard Admin & Mentor Sahabat Alfary untuk persiapan UTBK-SNBT.",
};

export default function RootHomePage() {
  return (
    <div className="min-h-dvh bg-surface text-ink font-sans flex flex-col justify-between">
      <header className="border-b border-line/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-xl bg-brand-500 text-sm font-bold text-white shadow-sm shadow-brand-500/30">
              SA
            </span>
            <div className="leading-tight">
              <p className="text-sm font-bold text-ink">Sahabat Alfary</p>
              <p className="text-xs font-medium text-brand-600">Ekosistem Belajar UTBK-SNBT</p>
            </div>
          </div>
          <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 border border-brand-100">
            Web Dashboard V1
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 text-center my-auto">
        <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3.5 py-1.5 text-xs font-semibold text-brand-700 border border-brand-100 mb-6">
          <span className="size-2 rounded-full bg-brand-500 animate-pulse" />
          Platform Manajemen Akademik & Bimbingan Belajar
        </span>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-ink tracking-tight">
          Sahabat Alfary Dashboard
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base text-muted leading-relaxed">
          Pilih portal kerja yang ingin Anda tuju. Setiap dashboard dirancang khusus sesuai dengan pembagian kewenangan operasional platform persiapan UTBK-SNBT.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 text-left">
          {/* Card Admin */}
          <Link
            href="/admin/dashboard"
            className="group relative flex flex-col justify-between rounded-card border border-line/80 bg-white/80 p-6 sm:p-8 shadow-glass transition-all hover:-translate-y-1 hover:bg-white hover:shadow-xl"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="grid size-12 place-items-center rounded-2xl bg-brand-500 text-white shadow-md shadow-brand-500/30 group-hover:scale-105 transition-transform">
                  <Icon name="dashboard" className="size-6" />
                </span>
                <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                  Operasional
                </span>
              </div>
              <h2 className="mt-5 text-xl font-bold text-ink group-hover:text-brand-600 transition-colors">
                Portal Administrator
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-muted leading-relaxed">
                Kelola data siswa, verifikasi dan kewenangan mentor, kurasi materi & bank soal, publikasi tryout, jadwal akademik, dan pantau log audit sistem.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-brand-600 group-hover:underline">
              <span>Masuk sebagai Administrator</span>
              <Icon name="chevron-right" className="size-4" />
            </div>
          </Link>

          {/* Card Mentor */}
          <Link
            href="/mentor/dashboard"
            className="group relative flex flex-col justify-between rounded-card border border-line/80 bg-white/80 p-6 sm:p-8 shadow-glass transition-all hover:-translate-y-1 hover:bg-white hover:shadow-xl"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="grid size-12 place-items-center rounded-2xl bg-sky-500 text-white shadow-md shadow-sky-500/30 group-hover:scale-105 transition-transform">
                  <Icon name="mentor" className="size-6" />
                </span>
                <span className="rounded-lg bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-700 border border-sky-100">
                  Tim Akademik
                </span>
              </div>
              <h2 className="mt-5 text-xl font-bold text-ink group-hover:text-sky-600 transition-colors">
                Portal Mentor Akademik
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-muted leading-relaxed">
                Pantau perkembangan siswa binaan aktif, susun materi modul teori, buat butir bank soal, kelola paket simulasi tryout, dan pantau jadwal bimbingan.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-sky-600 group-hover:underline">
              <span>Masuk sebagai Mentor</span>
              <Icon name="chevron-right" className="size-4" />
            </div>
          </Link>
        </div>
      </main>

      <footer className="border-t border-line/60 bg-white/60 py-6 text-center text-xs text-muted">
        <p>&copy; 2026 Sahabat Alfary &bull; Dashboard Persiapan UTBK-SNBT Nasional</p>
      </footer>
    </div>
  );
}
