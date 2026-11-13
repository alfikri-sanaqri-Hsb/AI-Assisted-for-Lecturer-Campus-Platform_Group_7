import { Icon, type IconName } from "@/components/ui/icon";

export type StatItem = {
  id: string;
  label: string;
  value: number;
  hint: string;
  icon: IconName;
};

const numberFormat = new Intl.NumberFormat("id-ID");

function StatCard({ stat }: { stat: StatItem }) {
  return (
    <li className="group rounded-card border border-white/80 bg-white/75 p-5 shadow-glass backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/90 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-muted">{stat.label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-ink tabular-nums">
            {numberFormat.format(stat.value)}
          </p>
        </div>
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-500 border border-brand-100/60 shadow-xs transition-colors group-hover:bg-brand-500 group-hover:text-white">
          <Icon name={stat.icon} className="size-6" />
        </span>
      </div>
      <p className="mt-3 text-xs font-medium text-muted">{stat.hint}</p>
    </li>
  );
}

export function StatSection({
  id,
  title,
  stats,
}: {
  id: string;
  title: string;
  stats: StatItem[];
}) {
  return (
    <section aria-labelledby={id} className="mt-8">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 id={id} className="text-lg font-bold text-ink">
          {title}
        </h2>
        <span className="rounded-full border border-amber-200/80 bg-amber-50/90 px-3 py-1 text-xs font-semibold text-amber-800 backdrop-blur-xs">
          Data ilustrasi
        </span>
      </div>
      <p className="mt-1 text-sm text-muted">
        Ringkasan indikator performa utama platform persiapan UTBK-SNBT Sahabat Alfary.
      </p>
      <ul className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.id} stat={stat} />
        ))}
      </ul>
    </section>
  );
}
