import Link from "next/link";
import { Icon } from "@/components/ui/icon";

export default function NotFound() {
  return (
    <div className="min-h-dvh flex items-center justify-center p-4 bg-surface text-ink font-sans">
      <div className="glass-container max-w-md w-full rounded-2xl p-8 text-center shadow-glass border border-white/80">
        <span className="inline-grid size-16 place-items-center rounded-2xl bg-brand-50 text-brand-600 border border-brand-100 shadow-xs mb-4">
          <Icon name="alert" className="size-8" />
        </span>
        <h1 className="text-2xl font-bold text-ink">404 - Halaman Tidak Ditemukan</h1>
        <p className="mt-2 text-sm text-muted leading-relaxed">
          Halaman yang Anda tuju belum tersedia atau telah dipindahkan dalam platform Sahabat Alfary.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/admin/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-brand-500 hover:bg-brand-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs shadow-brand-500/25 transition-all"
          >
            Dashboard Admin
          </Link>
          <Link
            href="/mentor/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-line bg-white/80 hover:bg-white px-4 py-2.5 text-xs font-semibold text-ink transition-colors"
          >
            Dashboard Mentor
          </Link>
        </div>
      </div>
    </div>
  );
}
