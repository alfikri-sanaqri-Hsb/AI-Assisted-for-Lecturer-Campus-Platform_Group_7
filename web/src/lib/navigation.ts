import type { IconName } from "@/components/ui/icon";
import type { Role } from "@/lib/roles";

export type NavItem = {
  label: string;
  icon: IconName;
  /** Tanpa href = halaman belum tersedia, tampil nonaktif. */
  href?: string;
};

export type NavGroup = { title: string; items: NavItem[] };

/**
 * STRUKTUR SIDEBAR RESMI SAHABAT ALFARY (BAGIAN 4 DIRECTIVE)
 *
 * Seluruh menu utama terhubung ke rute fungsional masing-masing.
 */
export const NAV_BY_ROLE: Record<Role, NavGroup[]> = {
  admin: [
    {
      title: "Utama",
      items: [{ label: "Dashboard", icon: "dashboard", href: "/admin/dashboard" }],
    },
    {
      title: "Pengguna",
      items: [
        { label: "Siswa", icon: "users", href: "/admin/students" },
        { label: "Daftar Mentor", icon: "mentor", href: "/admin/mentors" },
      ],
    },
    {
      title: "Akademik",
      items: [
        { label: "Materi Pembelajaran", icon: "book", href: "/admin/materials" },
        { label: "Bank Soal", icon: "file", href: "/admin/question-bank" },
        { label: "Paket TryOut", icon: "clipboard", href: "/admin/tryout-packages" },
        { label: "Jadwal", icon: "calendar", href: "/admin/schedules" },
      ],
    },
    {
      title: "Konten",
      items: [{ label: "Peninjauan Konten", icon: "review", href: "/admin/content-review" }],
    },
    {
      title: "Pengaturan",
      items: [{ label: "Pengaturan", icon: "settings", href: "/admin/settings" }],
    },
  ],
  mentor: [
    {
      title: "Utama",
      items: [{ label: "Dashboard", icon: "dashboard", href: "/mentor/dashboard" }],
    },
    {
      title: "Pengguna",
      items: [{ label: "Siswa Binaan", icon: "users", href: "/mentor/students" }],
    },
    {
      title: "Akademik",
      items: [
        { label: "Materi Pembelajaran", icon: "book", href: "/mentor/materials" },
        { label: "Bank Soal", icon: "file", href: "/mentor/question-bank" },
        { label: "Paket TryOut", icon: "clipboard", href: "/mentor/tryout-packages" },
        { label: "Jadwal", icon: "calendar", href: "/mentor/schedules" },
      ],
    },
    {
      title: "Akun",
      items: [{ label: "Profil", icon: "profile", href: "/mentor/profile" }],
    },
  ],
};
