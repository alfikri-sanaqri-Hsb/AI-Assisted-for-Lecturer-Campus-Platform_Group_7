import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dashboard | Sahabat Alfary",
  description:
    "Kerangka awal dashboard Admin dan Mentor Sahabat Alfary untuk persiapan UTBK-SNBT.",
};

/* ------------------------------------------------------------------ */
/* Ikon SVG inline (tanpa dependensi)                                  */
/* ------------------------------------------------------------------ */

type IconName =
  | "dashboard"
  | "book"
  | "file"
  | "clipboard"
  | "calendar"
  | "users"
  | "mentor"
  | "review"
  | "settings"
  | "search"
  | "bell"
  | "menu"
  | "close"
  | "inbox";

const iconPaths: Record<IconName, ReactNode> = {
  dashboard: (
    <>
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </>
  ),
  book: (
    <>
      <path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3V4Z" />
      <path d="M5 17a3 3 0 0 1 3-3h11" />
    </>
  ),
  file: (
    <>
      <path d="M7 3h7l5 5v13H7V3Z" />
      <path d="M14 3v5h5" />
      <path d="M10 13h6M10 17h6" />
    </>
  ),
  clipboard: (
    <>
      <rect x="5" y="4" width="14" height="17" rx="2" />
      <path d="M9 2.5h6V6H9V2.5Z" />
      <path d="m9 13 2 2 4-4" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
      <path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.3A6.5 6.5 0 0 1 21.5 20" />
    </>
  ),
  mentor: (
    <>
      <path d="m2 9 10-5 10 5-10 5L2 9Z" />
      <path d="M6 11.5V16c0 1.5 3 3 6 3s6-1.5 6-3v-4.5" />
    </>
  ),
  review: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12 3 3 5-6" />
    </>
  ),
  settings: (
    <>
      <path d="M4 7h10M18 7h2M4 17h2M10 17h10" />
      <circle cx="16" cy="7" r="2" />
      <circle cx="8" cy="17" r="2" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </>
  ),
  bell: (
    <>
      <path d="M6 9a6 6 0 0 1 12 0c0 6 2 7.5 2 7.5H4S6 15 6 9Z" />
      <path d="M10 20a2 2 0 0 0 4 0" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  inbox: (
    <>
      <path d="m3 13 2.5-7.5A2 2 0 0 1 7.4 4h9.2a2 2 0 0 1 1.9 1.5L21 13" />
      <path d="M3 13v5a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5h-5l-1 2h-6l-1-2H3Z" />
    </>
  ),
};

function Icon({
  name,
  className = "size-5",
}: {
  name: IconName;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {iconPaths[name]}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Konten contoh statis                                                */
/* ------------------------------------------------------------------ */

type NavItem = { label: string; icon: IconName; active?: boolean };
type NavGroup = { title: string; items: NavItem[] };

const navGroups: NavGroup[] = [
  {
    title: "Utama",
    items: [{ label: "Dashboard", icon: "dashboard", active: true }],
  },
  {
    title: "Akademik",
    items: [
      { label: "Materi Pembelajaran", icon: "book" },
      { label: "Bank Soal", icon: "file" },
      { label: "Paket Tryout", icon: "clipboard" },
      { label: "Jadwal", icon: "calendar" },
    ],
  },
  {
    title: "Pengguna",
    items: [{ label: "Siswa", icon: "users" }],
  },
  {
    title: "Mentor",
    items: [
      { label: "Daftar Mentor", icon: "mentor" },
      { label: "Peninjauan Konten", icon: "review" },
    ],
  },
  {
    title: "Pengaturan",
    items: [{ label: "Pengaturan", icon: "settings" }],
  },
];

type Stat = { label: string; value: string; hint: string; icon: IconName };

// Angka di bawah ini ILUSTRASI untuk kerangka tampilan, bukan data nyata.
const stats: Stat[] = [
  { label: "Total siswa", value: "1.248", hint: "Contoh angka siswa terdaftar", icon: "users" },
  { label: "Mentor aktif", value: "36", hint: "Contoh angka mentor aktif", icon: "mentor" },
  { label: "Menunggu peninjauan", value: "14", hint: "Contoh antrean konten dari mentor", icon: "review" },
  { label: "Paket tryout", value: "9", hint: "Contoh jumlah paket tryout", icon: "clipboard" },
];

// Alur status konten bersifat usulan sementara (belum disetujui product owner).
const contentSteps = [
  { label: "Draft", note: "Mentor menyusun konten" },
  { label: "Menunggu peninjauan", note: "Administrator memeriksa" },
  { label: "Disetujui", note: "Lolos peninjauan" },
  { label: "Diterbitkan", note: "Tersedia bagi siswa" },
];

/* ------------------------------------------------------------------ */
/* Komponen kecil (semuanya Server Component)                          */
/* ------------------------------------------------------------------ */

const navBase =
  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium";

function NavEntry({ item }: { item: NavItem }) {
  if (item.active) {
    return (
      <Link
        href="/"
        aria-current="page"
        className={`${navBase} bg-brand-50 text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600`}
      >
        <Icon name={item.icon} />
        {item.label}
      </Link>
    );
  }

  // Menu lain belum punya halaman: ditampilkan nonaktif agar tidak tampak
  // berfungsi padahal belum.
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

function StatCard({ stat }: { stat: Stat }) {
  return (
    <li className="rounded-card border border-line bg-white p-5 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-muted">{stat.label}</p>
          <p className="mt-2 text-3xl font-semibold tabular-nums">{stat.value}</p>
        </div>
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700">
          <Icon name={stat.icon} />
        </span>
      </div>
      <p className="mt-3 text-xs text-muted">{stat.hint}</p>
    </li>
  );
}

/* ------------------------------------------------------------------ */
/* Halaman                                                             */
/* ------------------------------------------------------------------ */

export default function DashboardPage() {
  return (
    <div className="min-h-dvh bg-surface text-ink">
      <a
        href="#konten-utama"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-brand-700 focus:shadow-card"
      >
        Lewati ke konten utama
      </a>

      {/* Pengendali menu seluler tanpa JavaScript klien (checkbox + peer) */}
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
              <p className="text-xs text-muted">Admin &amp; Mentor</p>
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
          {navGroups.map((group) => (
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
            Autentikasi dan data nyata belum tersedia. Menu lain akan aktif
            secara bertahap.
          </p>
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

          <h1 className="mr-auto text-lg font-semibold sm:text-xl">Dashboard</h1>

          {/* Kolom pencarian visual: sengaja nonaktif sampai fitur tersedia */}
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
              PC
            </span>
            <div className="hidden leading-tight sm:block">
              <p className="text-sm font-semibold">Pengguna Contoh</p>
              <p className="text-xs text-muted">Administrator (contoh)</p>
            </div>
          </div>
        </header>

        <main
          id="konten-utama"
          className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8"
        >
          <section
            aria-labelledby="judul-sambutan"
            className="relative overflow-hidden rounded-card bg-brand-700 p-6 text-white shadow-card sm:p-8"
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
              <p className="text-sm font-medium text-brand-100">
                Selamat datang di Sahabat Alfary
              </p>
              <h2
                id="judul-sambutan"
                className="mt-2 text-2xl font-semibold sm:text-3xl"
              >
                Halo, Pengguna Contoh
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-brand-50 sm:text-base">
                Kelola siswa, mentor, materi, dan paket tryout persiapan
                UTBK-SNBT dari satu tempat. Tampilan ini masih berupa kerangka
                awal dengan konten contoh.
              </p>
            </div>
          </section>

          <section aria-labelledby="judul-ringkasan" className="mt-8">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 id="judul-ringkasan" className="text-base font-semibold">
                Ringkasan platform
              </h2>
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-900">
                Data ilustrasi
              </span>
            </div>
            <p className="mt-1 text-sm text-muted">
              Angka pada kartu berikut hanyalah contoh untuk kerangka tampilan,
              bukan data nyata.
            </p>
            <ul className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => (
                <StatCard key={stat.label} stat={stat} />
              ))}
            </ul>
          </section>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            <section
              aria-labelledby="judul-alur"
              className="rounded-card border border-line bg-white p-5 shadow-card sm:p-6 lg:col-span-2"
            >
              <h2 id="judul-alur" className="text-base font-semibold">
                Alur status konten
              </h2>
              <p className="mt-1 text-sm text-muted">
                Usulan sementara. Status dan transisi final menunggu keputusan
                produk.
              </p>
              <ol className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {contentSteps.map((step, index) => (
                  <li
                    key={step.label}
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

            <section
              aria-labelledby="judul-aktivitas"
              className="rounded-card border border-line bg-white p-5 shadow-card sm:p-6"
            >
              <h2 id="judul-aktivitas" className="text-base font-semibold">
                Aktivitas terbaru
              </h2>
              <div className="mt-5 flex flex-col items-center rounded-xl border border-dashed border-line px-4 py-8 text-center">
                <span className="grid size-12 place-items-center rounded-full bg-brand-50 text-brand-700">
                  <Icon name="inbox" className="size-6" />
                </span>
                <p className="mt-3 text-sm font-semibold">Belum ada aktivitas</p>
                <p className="mt-1 text-xs text-muted">
                  Aktivitas mentor dan siswa akan tampil di sini setelah backend
                  terhubung.
                </p>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}