"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { Icon } from "@/components/ui/icon";
import type { ActionResult, FormField, MaybeAsyncResult } from "./types";

const FOCUSABLE_SELECTOR =
  'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

/** Mengecek bentuk tanggal/jam (bukan aturan bisnis). Mengembalikan pesan galat atau null. */
function validateDateTimeFormat(
  type: "date" | "time",
  label: string,
  value: string
): string | null {
  if (type === "time") {
    return TIME_PATTERN.test(value)
      ? null
      : `${label} tidak valid. Gunakan format 24 jam (contoh: 16:30).`;
  }
  if (DATE_PATTERN.test(value)) {
    const [y, m, d] = value.split("-").map(Number);
    const parsed = new Date(Date.UTC(y, m - 1, d));
    if (
      parsed.getUTCFullYear() === y &&
      parsed.getUTCMonth() === m - 1 &&
      parsed.getUTCDate() === d
    ) {
      return null;
    }
  }
  return `${label} tidak valid. Pilih tanggal dari kalender.`;
}

function resolveBound(
  bound: string | (() => string) | undefined
): string | undefined {
  return typeof bound === "function" ? bound() : bound;
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error && error.message
    ? error.message
    : "Terjadi kesalahan. Silakan coba lagi.";
}

export function GlassModal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  maxWidth = "max-w-lg",
  closeOnBackdrop = true,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: string;
  /** Matikan untuk formulir agar klik tidak sengaja tidak membuang isian. */
  closeOnBackdrop?: boolean;
}) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  // onClose disimpan di ref supaya efek di bawah tidak dipasang ulang setiap
  // induk render (induk biasanya mengirim fungsi inline baru).
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";

    const panel = panelRef.current;
    const getFocusable = () =>
      panel
        ? Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
        : [];

    // Fokus awal: kolom isian pertama bila ada, kalau tidak elemen fokus pertama.
    const firstControl = panel?.querySelector<HTMLElement>(
      "input:not([disabled]),select:not([disabled]),textarea:not([disabled])",
    );
    (firstControl ?? getFocusable()[0] ?? panel)?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onCloseRef.current();
        return;
      }
      if (e.key !== "Tab") return;

      const items = getFocusable();
      if (items.length === 0) {
        e.preventDefault();
        panel?.focus();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;

      if (e.shiftKey && (active === first || active === panel)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
    >
      {/* Backdrop dengan blur dan transparansi glassmorphic */}
      <div
        aria-hidden="true"
        onClick={closeOnBackdrop ? onClose : undefined}
        className="fixed inset-0 bg-[#383B3F]/40 backdrop-blur-sm transition-opacity"
      />

      {/* Kontainer Modal Glassmorphism */}
      <div
        ref={panelRef}
        tabIndex={-1}
        className={`relative z-10 w-[calc(100vw-1.5rem)] ${maxWidth} glass-modal rounded-2xl shadow-2xl border border-white/80 transition-all transform scale-100 max-h-[calc(100dvh-1.5rem)] sm:max-h-[min(90vh,720px)] flex flex-col overflow-hidden outline-none`}
      >
        {/* Header: selalu terlihat */}
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-line/60 px-4 pt-4 pb-3 sm:gap-4 sm:px-6 sm:pt-5">
          <div className="min-w-0">
            <h3 id={titleId} className="text-base font-bold leading-snug text-ink sm:text-lg break-words">
              {title}
            </h3>
            {subtitle && (
              <p className="mt-1 text-xs text-muted leading-relaxed sm:text-sm">{subtitle}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid size-8 shrink-0 place-items-center rounded-lg text-muted transition-colors hover:bg-brand-50 hover:text-ink focus-visible:outline-2 focus-visible:outline-brand-500"
            aria-label="Tutup jendela modal"
          >
            <Icon name="close" className="size-4" />
          </button>
        </div>

        {/* Konten: scroll internal; footer tetap dapat dijangkau */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6">
          {children}
        </div>
        {footer && (
          <div className="shrink-0 border-t border-line/60 bg-white/95 px-4 py-3 backdrop-blur-xs sm:px-6">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

type ConfirmModalProps = {
  isOpen: boolean;
  onClose: () => void;
  /**
   * Boleh asinkron. Bila mengembalikan `{ ok: false }` atau melempar galat,
   * modal tetap terbuka dan galatnya ditampilkan.
   */
  onConfirm: () => MaybeAsyncResult;
  title: string;
  message: string;
  confirmLabel?: string;
  confirmVariant?: "danger" | "brand";
};

export function ConfirmModal(props: ConfirmModalProps) {
  // Isi dipasang hanya saat terbuka, sehingga state (pending, galat) otomatis
  // kembali bersih setiap kali modal dibuka ulang.
  if (!props.isOpen) return null;
  return <ConfirmModalBody {...props} />;
}

function ConfirmModalBody({
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Hapus",
  confirmVariant = "danger",
}: ConfirmModalProps) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    if (!pending) onClose();
  };

  const handleConfirm = async () => {
    if (pending) return;
    setPending(true);
    setError(null);
    try {
      const result = (await onConfirm()) as ActionResult | undefined;
      if (result && result.ok === false) {
        setError(result.error);
        setPending(false);
        return;
      }
      onClose();
    } catch (err) {
      setError(getErrorMessage(err));
      setPending(false);
    }
  };

  return (
    <GlassModal
      isOpen
      onClose={handleClose}
      title={title}
      maxWidth="max-w-md"
      footer={
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleClose}
            disabled={pending}
            className="min-h-10 rounded-xl border border-line bg-white/80 px-4 py-2 text-sm font-semibold text-ink hover:bg-white transition-colors disabled:cursor-not-allowed disabled:opacity-60"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={pending}
            className={`min-h-10 rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-xs transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
              confirmVariant === "danger"
                ? "bg-rose-600 hover:bg-rose-700 shadow-rose-600/20"
                : "bg-brand-500 hover:bg-brand-600 shadow-brand-500/20"
            }`}
          >
            {pending ? "Memproses..." : confirmLabel}
          </button>
        </div>
      }
    >
      <div className="flex flex-col items-center text-center py-2">
        <span
          className={`grid size-14 place-items-center rounded-2xl ${
            confirmVariant === "danger"
              ? "bg-rose-50 text-rose-600 border border-rose-200/60"
              : "bg-brand-50 text-brand-600 border border-brand-200/60"
          }`}
        >
          <Icon name="alert" className="size-7" />
        </span>
        <p className="mt-4 text-sm text-ink/90 leading-relaxed">{message}</p>
        {error && (
          <p
            role="alert"
            className="mt-3 w-full rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700"
          >
            {error}
          </p>
        )}
      </div>
    </GlassModal>
  );
}

type FormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  /**
   * Boleh asinkron. Mengembalikan `{ ok: false, error, fieldErrors }` membuat
   * modal tetap terbuka dan menampilkan galat per kolom. Mengembalikan
   * `void` atau `{ ok: true }` menutup modal (perilaku lama tetap berlaku).
   */
  onSubmit: (formData: Record<string, string | number>) => MaybeAsyncResult;
  title: string;
  subtitle?: string;
  fields: FormField[];
  initialData?: Record<string, unknown> | null;
  submitLabel?: string;
};

const INPUT_BASE =
  "w-full rounded-xl border bg-white/80 px-3.5 py-2.5 text-sm text-ink backdrop-blur-xs transition-colors focus:bg-white focus:outline-none focus:ring-2";
const INPUT_OK = "border-line focus:border-brand-500 focus:ring-brand-500/20";
const INPUT_ERROR = "border-rose-400 focus:border-rose-500 focus:ring-rose-500/20";

export function FormModal(props: FormModalProps) {
  if (!props.isOpen) return null;
  return <FormModalBody {...props} />;
}

function FormModalBody({
  onClose,
  onSubmit,
  title,
  subtitle,
  fields,
  initialData,
  submitLabel = "Simpan",
}: FormModalProps) {
  const formId = useId();
  const [pending, setPending] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleClose = () => {
    if (!pending) onClose();
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (pending) return;

    const fd = new FormData(e.currentTarget);
    const result: Record<string, string | number> = {};
    const errors: Record<string, string> = {};
    // Semua isian mentah, agar validator satu kolom bisa membaca kolom lain.
    const allValues: Record<string, string> = {};
    fd.forEach((v, k) => {
      allValues[k] = String(v);
    });

    for (const field of fields) {
      const raw = fd.get(field.name);
      if (raw === null) continue;

      let value = field.type === "select" ? String(raw) : String(raw).trim();
      if (value !== "" && field.normalize) value = field.normalize(value);

      if (field.type === "number") {
        if (value === "") {
          // Angka kosong dilewati (tidak diubah menjadi 0).
          if (field.required) errors[field.name] = `${field.label} wajib diisi.`;
          continue;
        }
        const num = Number(value);
        if (!Number.isFinite(num)) {
          errors[field.name] = `${field.label} harus berupa angka.`;
        } else if (field.min !== undefined && num < field.min) {
          errors[field.name] = `${field.label} minimal ${field.min}.`;
        } else if (field.max !== undefined && num > field.max) {
          errors[field.name] = `${field.label} maksimal ${field.max}.`;
        } else {
          result[field.name] = num;
        }
        continue;
      }

      if (value === "") {
        if (field.required) {
          errors[field.name] = `${field.label} wajib diisi.`;
          continue;
        }
      } else if (
        field.type === "date" ||
        field.type === "time" ||
        field.validate
      ) {
        const initialRaw = initialData ? initialData[field.name] : undefined;
        const initial =
          initialRaw !== undefined && initialRaw !== null
            ? String(initialRaw)
            : undefined;
        const message =
          (field.type === "date" || field.type === "time"
            ? validateDateTimeFormat(field.type, field.label, value)
            : null) ??
          field.validate?.(value, allValues, initial) ??
          null;
        if (message) {
          errors[field.name] = message;
          continue;
        }
      } else if (field.type === "email" && !EMAIL_PATTERN.test(value)) {
        errors[field.name] = "Format email tidak valid.";
        continue;
      } else if (field.type === "tel") {
        const digits = value.replace(/\D/g, "");
        if (digits.length < 8 || digits.length > 15) {
          errors[field.name] = "Nomor telepon harus 8–15 digit.";
          continue;
        }
      }

      result[field.name] = value;
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setFormError("Periksa kembali isian yang ditandai.");
      return;
    }

    setFieldErrors({});
    setFormError(null);
    setPending(true);

    try {
      const outcome = (await onSubmit(result)) as ActionResult | undefined;
      if (outcome && outcome.ok === false) {
        setFieldErrors(outcome.fieldErrors ?? {});
        setFormError(outcome.error);
        setPending(false);
        return;
      }
      onClose();
    } catch (err) {
      setFormError(getErrorMessage(err));
      setPending(false);
    }
  };

  return (
    <GlassModal
      isOpen
      onClose={handleClose}
      title={title}
      subtitle={subtitle}
      closeOnBackdrop={false}
      footer={
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleClose}
            disabled={pending}
            className="min-h-10 rounded-xl border border-line bg-white/80 px-4 py-2 text-sm font-semibold text-ink hover:bg-white transition-colors disabled:cursor-not-allowed disabled:opacity-60"
          >
            Batal
          </button>
          <button
            type="submit"
            form={formId}
            disabled={pending}
            className="min-h-10 rounded-xl bg-brand-500 hover:bg-brand-600 px-5 py-2 text-sm font-semibold text-white shadow-xs shadow-brand-500/25 transition-colors focus-visible:outline-2 focus-visible:outline-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? "Menyimpan..." : submitLabel}
          </button>
        </div>
      }
    >
      <form
        id={formId}
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col gap-4"
      >
        {formError && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-medium text-rose-700"
          >
            <Icon name="alert" className="mt-0.5 size-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {fields.map((field) => {
          const stored =
            initialData && field.name in initialData
              ? initialData[field.name]
              : field.defaultValue;
          const defaultValue =
            stored !== undefined && stored !== null ? String(stored) : "";

          const inputId = `form-${field.name}`;
          const errorId = `${inputId}-error`;
          const helpId = `${inputId}-help`;
          const error = fieldErrors[field.name];
          const describedBy = error ? errorId : field.helpText ? helpId : undefined;
          const inputClass = `${INPUT_BASE} ${error ? INPUT_ERROR : INPUT_OK}`;

          // Nilai tersimpan yang tidak ada di daftar pilihan tetap ditampilkan,
          // supaya menyimpan tidak diam-diam mengganti ke pilihan pertama.
          const options = field.options ?? [];
          const hasStoredOption =
            defaultValue === "" || options.some((o) => o.value === defaultValue);
          const selectOptions = hasStoredOption
            ? options
            : [{ label: `${defaultValue} (nilai lama)`, value: defaultValue }, ...options];

          return (
            <div key={field.name}>
              <label htmlFor={inputId} className="block text-xs font-semibold text-ink mb-1.5">
                {field.label}{" "}
                {field.required && (
                  <span className="text-rose-500" aria-hidden="true">
                    *
                  </span>
                )}
              </label>

              {field.type === "select" ? (
                <div className="relative">
                  <select
                    id={inputId}
                    name={field.name}
                    defaultValue={defaultValue}
                    aria-required={field.required || undefined}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={describedBy}
                    className={`${inputClass} appearance-none`}
                  >
                    {selectOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-muted">
                    <Icon name="chevron-down" className="size-4" />
                  </span>
                </div>
              ) : field.type === "textarea" ? (
                <textarea
                  id={inputId}
                  name={field.name}
                  defaultValue={defaultValue}
                  rows={3}
                  placeholder={field.placeholder}
                  aria-required={field.required || undefined}
                  aria-invalid={error ? true : undefined}
                  aria-describedby={describedBy}
                  className={inputClass}
                />
              ) : (
                <input
                  id={inputId}
                  name={field.name}
                  type={field.type}
                  defaultValue={defaultValue}
                  placeholder={field.placeholder}
                  min={field.type === "number" ? field.min : resolveBound(field.minValue)}
                  max={field.type === "number" ? field.max : resolveBound(field.maxValue)}
                  step={field.step}
                  aria-required={field.required || undefined}
                  aria-invalid={error ? true : undefined}
                  aria-describedby={describedBy}
                  className={inputClass}
                />
              )}

              {error ? (
                <p id={errorId} className="mt-1 text-xs font-medium text-rose-600">
                  {error}
                </p>
              ) : field.helpText ? (
                <p id={helpId} className="mt-1 text-xs text-muted">
                  {field.helpText}
                </p>
              ) : null}
            </div>
          );
        })}

      </form>
    </GlassModal>
  );
}

export function DetailModal<T extends { id: string | number }>({
  isOpen,
  onClose,
  title,
  subtitle,
  data,
  labels,
  renderCustom,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  data: T | null;
  labels?: Record<string, string>;
  renderCustom?: (data: T) => ReactNode;
}) {
  if (!isOpen || !data) return null;

  return (
    <GlassModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
      maxWidth="max-w-lg"
      footer={
        <div className="flex justify-stretch sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="min-h-10 w-full rounded-xl bg-brand-500 px-5 py-2 text-sm font-semibold text-white shadow-xs shadow-brand-500/25 transition-colors hover:bg-brand-600 sm:w-auto"
          >
            Tutup
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        {renderCustom ? (
          renderCustom(data)
        ) : (
          <div className="divide-y divide-line/60 rounded-xl border border-white/80 bg-white/60 p-4 backdrop-blur-xs">
            {Object.entries(data as Record<string, unknown>).map(([key, val]) => {
              if (key === "id") return null;
              const label = labels?.[key] || key;
              const display =
                val === null || val === undefined || val === ""
                  ? "-"
                  : typeof val === "object"
                    ? JSON.stringify(val)
                    : String(val);
              return (
                <div key={key} className="flex flex-col gap-1 py-2.5 first:pt-0 last:pb-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                  <span className="text-[11px] font-semibold text-muted uppercase tracking-wider shrink-0">{label}</span>
                  <span className="text-sm font-medium text-ink break-words max-w-full text-left sm:text-right sm:max-w-[60%]">
                    {display}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </GlassModal>
  );
}
