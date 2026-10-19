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
    <li className="rounded-card border border-line bg-white p-5 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-muted">{stat.label}</p>
          <p className="mt-2 text-3xl font-semibold tabular-nums">
            {numberFormat.format(stat.value)}
          </p>
        </div>
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700">
          <Icon name={stat.icon} />
        </span>
      </div>
      <p className="mt-3 text-xs text-muted">{stat.hint}</p>
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
        <h2 id={id} className="text-base font-semibold">
          {title}
        </h2>
        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-900">
          Data ilustrasi
        </span>
      </div>
      <p className="mt-1 text-sm text-muted">
        Angka pada kartu berikut hanyalah contoh untuk kerangka tampilan, bukan
        data nyata.
      </p>
      <ul className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.id} stat={stat} />
        ))}
      </ul>
    </section>
  );
}
