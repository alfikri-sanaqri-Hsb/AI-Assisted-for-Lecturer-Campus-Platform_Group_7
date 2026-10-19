import type { ReactNode } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { NavLink } from "@/components/layout/nav-link";
import { NAV_BY_ROLE, type NavItem } from "@/lib/navigation";
import { ROLE_META, type Role } from "@/lib/roles";

const navBase =
  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium";

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
      className={`${navBase} cursor-not-allowed text-muted`}
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
    <div className="min-h-dvh bg-surface text-ink">
      <a
        href="#konten-utama"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-brand-700 focus:shadow-card"
      >
        Lewati ke konten utama
      </a>

      {/* Pengendali menu seluler tanpa JavaScript klien (checkbox + peer).
          Susunan elemen ini dipakai oleh aturan fokus di globals.css. */}
      <input
        id="nav-toggle"
        type="checkbox"
        aria-label="Menu navigasi"
        className="peer sr-only"
      />

      <label
        htmlFor="nav-toggle"
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-30 bg-slate-900/40 opacity-0 transition-opacity peer-checked:pointer-events-auto peer-checked:opacity-100 lg:hidden"
      />

      <aside className="fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-line bg-white transition-[transform,visibility] duration-200 max-lg:invisible max-lg:-translate-x-full peer-checked:max-lg:visible peer-checked:max-lg:translate-x-0">
        <div className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-line px-5">
          <div className="flex items-center gap-3">
            {/* Penanda sementara, bukan logo final */}
            <span
              aria-hidden="true"
              className="grid size-9 place-items-center rounded-xl bg-brand-700 text-sm font-bold text-white"
            >
              SA
            </span>
            <div className="leading-tight">
              <p className="text-sm font-semibold">Sahabat Alfary</p>
              <p className="text-xs text-muted">Persiapan UTBK-SNBT</p>
            </div>
          </div>
          <label
            htmlFor="nav-toggle"
            className="grid size-9 cursor-pointer place-items-center rounded-lg text-muted hover:bg-surface lg:hidden"
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

        <div className="m-3 rounded-2xl bg-brand-50 p-4 text-xs leading-relaxed text-brand-800">
          <p className="font-semibold">Mode pratinjau</p>
          <p className="mt-1">
            Autentikasi dan data nyata belum tersedia. Peran ditentukan oleh
            alamat halaman, bukan oleh akun.
          </p>
          <Link
            href={other.dashboardHref}
            className="mt-3 inline-flex rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-brand-700 shadow-card hover:bg-brand-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
          >
            Lihat tampilan {other.label}
          </Link>
        </div>
      </aside>

      <div className="app-main lg:pl-72">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-line bg-white px-4 sm:px-6 lg:px-8">
          <label
            htmlFor="nav-toggle"
            className="menu-button -ml-1 grid size-10 cursor-pointer place-items-center rounded-xl text-ink hover:bg-surface lg:hidden"
          >
            <Icon name="menu" />
            <span className="sr-only">Buka menu navigasi</span>
          </label>

          <p className="mr-auto text-sm font-semibold sm:text-base">
            {meta.panelTitle}
          </p>

          {/* Pencarian visual: sengaja nonaktif sampai fitur tersedia */}
          <div className="hidden w-72 md:block lg:w-80">
            <label className="relative block">
              <span className="sr-only">Pencarian (belum aktif)</span>
              <span className="pointer-events-none absolute inset-y-0 left-3 grid place-items-center text-muted">
                <Icon name="search" className="size-4" />
              </span>
              <input
                type="search"
                disabled
                placeholder="Pencarian segera tersedia"
                className="h-10 w-full cursor-not-allowed rounded-xl border border-line bg-surface pl-9 pr-3 text-sm placeholder:text-muted"
              />
            </label>
          </div>

          <button
            type="button"
            disabled
            aria-label="Notifikasi (belum aktif)"
            title="Notifikasi segera tersedia"
            className="grid size-10 cursor-not-allowed place-items-center rounded-xl border border-line text-muted"
          >
            <Icon name="bell" />
          </button>

          {/* Profil contoh, bukan pengguna sungguhan */}
          <div className="flex items-center gap-3 border-l border-line pl-3 sm:pl-4">
            <span
              aria-hidden="true"
              className="grid size-10 place-items-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700"
            >
              {meta.sampleUser.initials}
            </span>
            <div className="hidden leading-tight sm:block">
              <p className="text-sm font-semibold">{meta.sampleUser.name}</p>
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
