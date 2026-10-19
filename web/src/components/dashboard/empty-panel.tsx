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
      className="rounded-card border border-line bg-white p-5 shadow-card sm:p-6"
    >
      <h2 id={id} className="text-base font-semibold">
        {title}
      </h2>
      <div className="mt-5 flex flex-col items-center rounded-xl border border-dashed border-line px-4 py-8 text-center">
        <span className="grid size-12 place-items-center rounded-full bg-brand-50 text-brand-700">
          <Icon name="inbox" className="size-6" />
        </span>
        <p className="mt-3 text-sm font-semibold">{message}</p>
        <p className="mt-1 text-xs text-muted">{description}</p>
      </div>
    </section>
  );
}
