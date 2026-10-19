/**
 * Definisi peran. SIMULASI TAMPILAN SAJA: peran ditentukan oleh alamat halaman
 * (/admin atau /mentor), bukan oleh akun. Ini BUKAN otorisasi dan tidak
 * memberi keamanan apa pun. Otorisasi sungguhan harus dilakukan backend.
 */
export type Role = "admin" | "mentor";

export type RoleMeta = {
  /** Nama peran untuk ditampilkan. */
  label: string;
  /** Judul konteks di header. */
  panelTitle: string;
  /** Halaman awal peran ini. */
  dashboardHref: string;
  /** Profil contoh, bukan pengguna sungguhan. */
  sampleUser: { name: string; roleNote: string; initials: string };
};

export const ROLE_META: Record<Role, RoleMeta> = {
  admin: {
    label: "Administrator",
    panelTitle: "Panel Administrator",
    dashboardHref: "/admin/dashboard",
    sampleUser: {
      name: "Pengguna Contoh",
      roleNote: "Administrator (contoh)",
      initials: "PC",
    },
  },
  mentor: {
    label: "Mentor",
    panelTitle: "Panel Mentor",
    dashboardHref: "/mentor/dashboard",
    sampleUser: {
      name: "Mentor Contoh",
      roleNote: "Mentor (contoh)",
      initials: "MC",
    },
  },
};
