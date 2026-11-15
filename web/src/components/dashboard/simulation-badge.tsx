import { Icon } from "@/components/ui/icon";

export function SimulationBanner({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      role="note"
      aria-label="Informasi data simulasi"
      className={`flex items-start gap-3 rounded-2xl border border-sky-200/80 bg-sky-50/70 p-4 text-xs text-sky-900 backdrop-blur-xs ${className}`}
    >
      <span className="grid size-6 shrink-0 place-items-center rounded-xl bg-sky-500 text-white shadow-xs">
        <Icon name="alert" className="size-3.5" />
      </span>
      <div className="leading-relaxed">
        <div className="flex items-center gap-2 font-bold text-sky-950">
          <span>Mode Data Terisolasi & Terstruktur (Simulasi Frontend)</span>
          <span className="rounded-full bg-sky-200/80 px-2 py-0.5 text-[10px] font-semibold text-sky-800">
            Mock Repository Aktif
          </span>
        </div>
        <p className="mt-0.5 text-sky-800/90">
          Metrik operasional dan data pada halaman ini diolah melalui Application Service Layer dan Mock Repository.
          Seluruh interaksi (tambah, edit, verifikasi status, dan deteksi jadwal/duplikasi) berfungsi dinamis di sesi Anda
          dan siap dihubungkan ke Backend REST API ketika tim Backend menyelesaikan integrasi.
        </p>
      </div>
    </div>
  );
}
