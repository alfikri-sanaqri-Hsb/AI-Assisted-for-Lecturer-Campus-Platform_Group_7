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
      className={`rounded-card border border-line bg-white p-5 shadow-card sm:p-6 ${className}`}
    >
      <h2 id={id} className="text-base font-semibold">
        {title}
      </h2>
      <p className="mt-1 text-sm text-muted">{description}</p>
      <ol className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {CONTENT_STATUSES.map((step, index) => (
          <li
            key={step.id}
            className="flex items-start gap-3 rounded-xl bg-surface p-4"
          >
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-brand-700 text-xs font-semibold text-white">
              {index + 1}
            </span>
            <div>
              <p className="text-sm font-semibold">{step.label}</p>
              <p className="mt-1 text-xs text-muted">{step.note}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-4 text-xs text-muted">
        Konten yang ditolak dikembalikan ke mentor untuk direvisi.
      </p>
    </section>
  );
}
