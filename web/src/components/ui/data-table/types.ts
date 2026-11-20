import type { ReactNode } from "react";

export type ColumnDef<T> = {
  key: string;
  header: string;
  sortable?: boolean;
  className?: string;
  /**
   * Nilai yang dipakai untuk pengurutan (misalnya tanggal ISO). Bila tidak
   * diisi, pengurutan memakai nilai row[key].
   */
  sortValue?: (row: T) => string | number | null | undefined;
  /**
   * Nilai teks untuk ekspor CSV. Bila tidak diisi, nilai mentah row[key] dipakai.
   * Gunakan untuk kolom yang tampilannya berbeda dari datanya (mis. status).
   */
  exportValue?: (row: T) => string | number | null | undefined;
  render?: (row: T) => ReactNode;
};

export type FilterOption = {
  label: string;
  value: string;
};

export type FormField = {
  name: string;
  label: string;
  type: "text" | "number" | "select" | "textarea" | "email" | "tel" | "date" | "time";
  options?: { label: string; value: string }[];
  placeholder?: string;
  required?: boolean;
  defaultValue?: string | number;
  /** Batas nilai untuk kolom bertipe number. */
  min?: number;
  max?: number;
  /**
   * Batas untuk kolom date (YYYY-MM-DD) dan time (HH:MM). Boleh berupa fungsi,
   * mis. untuk "hari ini". HANYA memengaruhi pemilih (kalender/jam). Aturan
   * yang wajib ditegakkan harus ditulis lewat `validate`.
   */
  minValue?: string | (() => string);
  maxValue?: string | (() => string);
  /** Langkah kolom time dalam detik (mis. 300 = 5 menit). */
  step?: number;
  /** Teks bantuan singkat di bawah kolom. */
  helpText?: string;
  /**
   * Merapikan nilai sebelum divalidasi dan disimpan (mis. membuang spasi dan
   * tanda hubung di nomor telepon). Hanya dipanggil bila isian tidak kosong.
   */
  normalize?: (value: string) => string;
  /**
   * Validator khusus. Mengembalikan pesan galat, atau null bila valid.
   * Menggantikan pengecekan bawaan untuk tipe email/tel. Hanya dipanggil bila
   * isian tidak kosong; `values` berisi semua isian formulir (teks mentah).
   */
  validate?: (
    value: string,
    values: Record<string, string>,
    /** Nilai sebelum diubah saat Ubah; undefined saat Tambah. */
    initialValue?: string
  ) => string | null;
};

/**
 * Hasil sebuah aksi (tambah, ubah, hapus). Handler yang mengembalikan
 * `{ ok: false }` membuat modal tetap terbuka dan menampilkan galatnya.
 */
export type ActionResult =
  | { ok: true; message?: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

/** Hasil handler: boleh sinkron, asinkron, atau tanpa nilai (perilaku lama). */
export type MaybeAsyncResult =
  | ActionResult
  | void
  | Promise<ActionResult | void>;

/** Kemampuan tabel. Bila tidak diisi, semua aktif kecuali bulkDelete. */
export type TableCapabilities = {
  create?: boolean;
  edit?: boolean;
  delete?: boolean;
  bulkDelete?: boolean;
  export?: boolean;
};
