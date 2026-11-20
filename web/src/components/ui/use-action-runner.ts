import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Menjalankan aksi asinkron (setujui, tolak, terbitkan, ajukan, dan sejenisnya)
 * dengan tiga jaminan:
 *
 * 1. Tidak diproses ganda: aksi dengan `key` yang sama ditolak selama masih
 *    berjalan. Penjagaan memakai ref (sinkron), sehingga klik ganda dalam satu
 *    detik tetap hanya diproses sekali, sebelum React sempat merender ulang.
 * 2. Galat tidak hilang: `run` tidak pernah melempar. Galat ditangkap dan
 *    ditampilkan sebagai pemberitahuan halaman, atau dikembalikan ke pemanggil
 *    (opsi `report: "none"`, mis. agar modal menampilkannya sendiri).
 * 3. Status proses terlihat: `isPending(key)` dipakai untuk mengunci tombol.
 *
 * Gunakan id baris sebagai `key`, sehingga semua aksi pada baris yang sama
 * saling meniadakan (Setujui dan Tolak tidak bisa jalan bersamaan).
 */

export type ActionNotice = { tone: "error" | "success"; message: string };

export type ActionOutcome = { ok: true } | { ok: false; error: string };

export type RunOptions = {
  /** Pesan sukses yang tampil sebagai pemberitahuan halaman. */
  successMessage?: string;
  /**
   * "page" (bawaan): galat tampil sebagai pemberitahuan halaman.
   * "none": galat hanya dikembalikan ke pemanggil.
   */
  report?: "page" | "none";
};

function toMessage(error: unknown): string {
  return error instanceof Error && error.message
    ? error.message
    : "Terjadi kesalahan. Silakan coba lagi.";
}

export function useActionRunner(successDurationMs = 3500) {
  const [pendingKeys, setPendingKeys] = useState<ReadonlySet<string>>(
    () => new Set()
  );
  const [notice, setNotice] = useState<ActionNotice | null>(null);

  const inFlight = useRef<Set<string>>(new Set());
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const dismiss = useCallback(() => setNotice(null), []);

  const run = useCallback(
    async (
      key: string,
      action: () => Promise<unknown>,
      options: RunOptions = {}
    ): Promise<ActionOutcome> => {
      const report = options.report ?? "page";

      // Klik ganda: abaikan secara diam-diam, aksi pertama masih berjalan.
      if (inFlight.current.has(key)) {
        return { ok: false, error: "Aksi sebelumnya masih diproses." };
      }

      inFlight.current.add(key);
      setPendingKeys((previous) => new Set(previous).add(key));
      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = null;
      }
      if (report === "page") setNotice(null);

      try {
        await action();
        if (mounted.current && options.successMessage) {
          setNotice({ tone: "success", message: options.successMessage });
          timer.current = setTimeout(() => setNotice(null), successDurationMs);
        }
        return { ok: true };
      } catch (error) {
        const message = toMessage(error);
        if (mounted.current && report === "page") {
          setNotice({ tone: "error", message });
        }
        return { ok: false, error: message };
      } finally {
        inFlight.current.delete(key);
        if (mounted.current) {
          setPendingKeys((previous) => {
            const next = new Set(previous);
            next.delete(key);
            return next;
          });
        }
      }
    },
    [successDurationMs]
  );

  const isPending = useCallback(
    (key: string) => pendingKeys.has(key),
    [pendingKeys]
  );

  return {
    run,
    isPending,
    isAnyPending: pendingKeys.size > 0,
    notice,
    dismiss,
  };
}
