import { CONTENT_STATUSES } from "@/lib/content-status";

export function ContentFlowPanel({
  id,
  title,
  description,
  className = "",
}: {
  id: string;
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <section
      aria-labelledby={id}
      className={`glass-container rounded-card p-5 sm:p-6 shadow-glass ${className}`}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 id={id} className="text-base font-bold text-ink">
            {title}
          </h2>
          <p className="mt-1 text-sm text-muted">{description}</p>
        </div>
        <span className="hidden sm:inline-flex rounded-lg bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-600 border border-brand-100">
          Standar Operasional
        </span>
      </div>

      <ol className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {CONTENT_STATUSES.map((step, index) => (
          <li
            key={step.id}
            className="flex items-start gap-3 rounded-xl border border-white/70 bg-white/60 p-4 backdrop-blur-xs transition-colors hover:bg-white/85"
          >
            <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-brand-500 text-xs font-bold text-white shadow-xs">
              {index + 1}
            </span>
            <div>
              <p className="text-sm font-semibold text-ink">{step.label}</p>
              <p className="mt-1 text-xs text-muted leading-relaxed">{step.note}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-4 text-xs font-medium text-muted">
        Catatan: Konten yang memerlukan revisi akan dikembalikan ke mentor penyusun dengan catatan perbaikan.
      </p>
    </section>
  );
}
