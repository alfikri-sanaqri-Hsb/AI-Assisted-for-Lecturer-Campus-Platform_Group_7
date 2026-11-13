import type { ReactNode } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { NavLink } from "@/components/layout/nav-link";
import { NAV_BY_ROLE, type NavItem } from "@/lib/navigation";
import { ROLE_META, type Role } from "@/lib/roles";

const navBase =
  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150";

function NavEntry({ item }: { item: NavItem }) {
  if (item.href) {
    return (
      <NavLink href={item.href}>
        <Icon name={item.icon} />
        {item.label}
      </NavLink>
    );
  }

  // Halaman belum tersedia: tampil nonaktif agar tidak tampak berfungsi.
  return (
    <span
      aria-disabled="true"
      title="Segera tersedia"
      className={`${navBase} cursor-not-allowed text-muted/60`}
    >
      <Icon name={item.icon} />
      {item.label}
    </span>
  );
}

export function AppShell({
  role,
  children,
}: {
  role: Role;
  children: ReactNode;
}) {
  const meta = ROLE_META[role];
  const groups = NAV_BY_ROLE[role];
  const otherRole: Role = role === "admin" ? "mentor" : "admin";
  const other = ROLE_META[otherRole];

  return (
    <div className="min-h-dvh bg-surface text-ink font-sans selection:bg-brand-100 selection:text-brand-800">
      <a
        href="#konten-utama"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-brand-600 focus:shadow-glass"
      >
        Lewati ke konten utama
      </a>

      {/* Pengendali menu seluler */}
      <input
        id="nav-toggle"
        type="checkbox"
        aria-label="Menu navigasi"
        className="peer sr-only"
      />

      <label
        htmlFor="nav-toggle"
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-30 bg-[#383B3F]/30 backdrop-blur-xs opacity-0 transition-opacity peer-checked:pointer-events-auto peer-checked:opacity-100 lg:hidden"
      />

      <aside className="fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-line/80 bg-white/85 backdrop-blur-xl transition-[transform,visibility] duration-200 max-lg:invisible max-lg:-translate-x-full peer-checked:max-lg:visible peer-checked:max-lg:translate-x-0">
        <div className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-line/80 px-5">
          <div className="flex items-center gap-3">
            {/* Logo Brand Sahabat Alfary */}
            <span
              aria-hidden="true"
              className="grid size-9 place-items-center rounded-xl bg-brand-500 text-sm font-bold text-white shadow-sm shadow-brand-500/30"
            >
              SA
            </span>
            <div className="leading-tight">
              <p className="text-sm font-bold text-ink">Sahabat Alfary</p>
              <p className="text-xs font-medium text-brand-600">Persiapan UTBK-SNBT</p>
            </div>
          </div>
          <label
            htmlFor="nav-toggle"
            className="grid size-9 cursor-pointer place-items-center rounded-lg text-muted hover:bg-surface/80 lg:hidden"
          >
            <Icon name="close" />
            <span className="sr-only">Tutup menu navigasi</span>
          </label>
        </div>

        <nav
          aria-label="Navigasi utama"
          className="flex-1 space-y-6 overflow-y-auto px-3 py-5"
        >
          {groups.map((group) => (
            <div key={group.title}>
              <p className="px-3 text-xs font-semibold uppercase tracking-wider text-muted">
                {group.title}
              </p>
              <ul className="mt-2 space-y-1">
                {group.items.map((item) => (
                  <li key={item.label}>
                    <NavEntry item={item} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="m-3 rounded-2xl bg-brand-50/70 border border-brand-100/70 p-4 text-xs leading-relaxed text-brand-900 backdrop-blur-xs">
          <div className="flex items-center gap-1.5 font-semibold text-brand-700">
            <span className="size-2 rounded-full bg-brand-500 animate-pulse" />
            Mode Peran Dashboard
          </div>
          <p className="mt-1 text-ink/80">
            Sedang aktif sebagai <strong className="text-brand-700">{meta.label}</strong>. Jelajahi antarmuka peran lainnya:
          </p>
          <Link
            href={other.dashboardHref}
            className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-white/90 px-3 py-1.5 text-xs font-semibold text-brand-600 shadow-xs hover:bg-white hover:text-brand-700 hover:shadow transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
          >
            Buka tampilan {other.label} &rarr;
          </Link>
        </div>
      </aside>

      <div className="app-main lg:pl-72">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-line/80 bg-white/80 backdrop-blur-md px-4 sm:px-6 lg:px-8">
          <label
            htmlFor="nav-toggle"
            className="menu-button -ml-1 grid size-10 cursor-pointer place-items-center rounded-xl text-ink hover:bg-surface/80 lg:hidden"
          >
            <Icon name="menu" />
            <span className="sr-only">Buka menu navigasi</span>
          </label>

          <div className="mr-auto">
            <p className="text-sm font-semibold sm:text-base text-ink">
              {meta.panelTitle}
            </p>
          </div>

          {/* Pencarian visual header */}
          <div className="hidden w-72 md:block lg:w-80">
            <label className="relative block">
              <span className="sr-only">Pencarian global</span>
              <span className="pointer-events-none absolute inset-y-0 left-3 grid place-items-center text-muted">
                <Icon name="search" className="size-4" />
              </span>
              <input
                type="search"
                disabled
                placeholder="Cari siswa, materi, soal..."
                className="h-10 w-full cursor-not-allowed rounded-xl border border-line bg-white/60 pl-9 pr-3 text-sm placeholder:text-muted/70 backdrop-blur-xs"
              />
            </label>
          </div>

          <button
            type="button"
            disabled
            aria-label="Notifikasi (segera aktif)"
            title="Notifikasi segera tersedia"
            className="grid size-10 cursor-not-allowed place-items-center rounded-xl border border-line/80 bg-white/60 text-muted backdrop-blur-xs hover:text-ink transition-colors"
          >
            <Icon name="bell" />
          </button>

          {/* Profil */}
          <div className="flex items-center gap-3 border-l border-line/80 pl-3 sm:pl-4">
            <span
              aria-hidden="true"
              className="grid size-10 place-items-center rounded-full bg-brand-100 text-sm font-bold text-brand-700 ring-2 ring-brand-500/20"
            >
              {meta.sampleUser.initials}
            </span>
            <div className="hidden leading-tight sm:block">
              <p className="text-sm font-semibold text-ink">{meta.sampleUser.name}</p>
              <p className="text-xs text-muted">{meta.sampleUser.roleNote}</p>
            </div>
          </div>
        </header>

        <main
          id="konten-utama"
          className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
