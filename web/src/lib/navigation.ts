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
 * Satu-satunya sumber menu. Untuk mengaktifkan sebuah menu setelah
 * halamannya dibuat, cukup tambahkan `href` di sini.
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
        { label: "Siswa", icon: "users" },
        { label: "Daftar Mentor", icon: "mentor" },
      ],
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
      title: "Konten",
      items: [{ label: "Peninjauan Konten", icon: "review" }],
    },
    {
      title: "Pengaturan",
      items: [{ label: "Pengaturan", icon: "settings" }],
    },
  ],
  mentor: [
    {
      title: "Utama",
      items: [{ label: "Dashboard", icon: "dashboard", href: "/mentor/dashboard" }],
    },
    {
      title: "Pengguna",
      items: [{ label: "Siswa Binaan", icon: "users" }],
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
      title: "Akun",
      items: [{ label: "Profil", icon: "profile" }],
    },
  ],
};
