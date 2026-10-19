/**
 * Status konten. DRAF SEMENTARA: status, transisi, dan peran yang berwenang
 * belum disetujui pemilik produk. Konten yang ditolak dikembalikan ke mentor.
 */
export const CONTENT_STATUSES = [
  { id: "draft", label: "Draft", note: "Mentor menyusun konten" },
  { id: "pending_review", label: "Menunggu peninjauan", note: "Administrator memeriksa" },
  { id: "approved", label: "Disetujui", note: "Lolos peninjauan" },
  { id: "published", label: "Diterbitkan", note: "Tersedia bagi siswa" },
] as const;

export type ContentStatusId = (typeof CONTENT_STATUSES)[number]["id"];
