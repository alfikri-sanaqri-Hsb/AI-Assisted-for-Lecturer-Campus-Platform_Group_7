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
      className="relative mt-6 overflow-hidden rounded-card bg-gradient-to-r from-brand-600 via-brand-500 to-brand-700 p-6 text-white shadow-lg shadow-brand-500/15 sm:p-8"
    >
      {/* Glassmorphic decorative orbs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-12 -top-16 size-56 rounded-full bg-white/10 blur-xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 right-20 size-48 rounded-full bg-brand-400/25 blur-2xl"
      />
      <div className="relative max-w-2xl">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-50 backdrop-blur-xs border border-white/20">
          {eyebrow}
        </span>
        <h2 id={id} className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl text-white">
          {heading}
        </h2>
        <p className="mt-2.5 text-sm leading-relaxed text-brand-50/95 sm:text-base">
          {text}
        </p>
      </div>
    </section>
  );
}
