export function WelcomeBanner({
  id,
  eyebrow,
  heading,
  text,
}: {
  id: string;
  eyebrow: string;
  heading: string;
  text: string;
}) {
  return (
    <section
      aria-labelledby={id}
      className="relative mt-6 overflow-hidden rounded-card bg-brand-700 p-6 text-white shadow-card sm:p-8"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-20 size-64 rounded-full bg-brand-600/40"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 right-24 size-48 rounded-full bg-brand-500/20"
      />
      <div className="relative max-w-2xl">
        <p className="text-sm font-medium text-brand-100">{eyebrow}</p>
        <h2 id={id} className="mt-2 text-2xl font-semibold sm:text-3xl">
          {heading}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-brand-50 sm:text-base">
          {text}
        </p>
      </div>
    </section>
  );
}
