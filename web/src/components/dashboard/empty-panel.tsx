import { Icon } from "@/components/ui/icon";

export function EmptyPanel({
  id,
  title,
  message,
  description,
}: {
  id: string;
  title: string;
  message: string;
  description: string;
}) {
  return (
    <section
      aria-labelledby={id}
      className="glass-container rounded-card p-5 sm:p-6 shadow-glass flex flex-col justify-between"
    >
      <h2 id={id} className="text-base font-bold text-ink">
        {title}
      </h2>
      <div className="mt-4 flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-brand-200/70 bg-white/40 px-4 py-8 text-center backdrop-blur-xs">
        <span className="grid size-12 place-items-center rounded-2xl bg-brand-50 text-brand-500 border border-brand-100/70 shadow-xs">
          <Icon name="inbox" className="size-6" />
        </span>
        <p className="mt-3 text-sm font-semibold text-ink">{message}</p>
        <p className="mt-1 text-xs text-muted max-w-xs">{description}</p>
      </div>
    </section>
  );
}
