"use client";

import { useEffect, type ReactNode } from "react";
import { Icon } from "@/components/ui/icon";
import type { FormField } from "./types";

export function GlassModal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = "max-w-lg",
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  maxWidth?: string;
}) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop dengan blur dan transparansi glassmorphic */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className="fixed inset-0 bg-[#383B3F]/40 backdrop-blur-sm transition-opacity"
      />

      {/* Kontainer Modal Glassmorphism */}
      <div
        className={`relative z-10 w-full ${maxWidth} glass-modal rounded-2xl p-6 sm:p-7 shadow-2xl border border-white/80 transition-all transform scale-100 max-h-[90vh] flex flex-col`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-line/60 pb-4">
          <div>
            <h3 className="text-lg font-bold text-ink">{title}</h3>
            {subtitle && (
              <p className="mt-1 text-xs text-muted leading-relaxed">{subtitle}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid size-8 place-items-center rounded-lg text-muted transition-colors hover:bg-brand-50 hover:text-ink focus-visible:outline-2 focus-visible:outline-brand-500"
            aria-label="Tutup jendela modal"
          >
            <Icon name="close" className="size-4" />
          </button>
        </div>

        <div className="mt-4 flex-1 overflow-y-auto pr-1">{children}</div>
      </div>
    </div>
  );
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Hapus",
  confirmVariant = "danger",
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  confirmVariant?: "danger" | "brand";
}) {
  if (!isOpen) return null;

  return (
    <GlassModal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
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
      </div>

      <div className="mt-6 flex items-center justify-end gap-3 border-t border-line/60 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl border border-line bg-white/80 px-4 py-2 text-sm font-semibold text-ink hover:bg-white transition-colors"
        >
          Batal
        </button>
        <button
          type="button"
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className={`rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-xs transition-colors ${
            confirmVariant === "danger"
              ? "bg-rose-600 hover:bg-rose-700 shadow-rose-600/20"
              : "bg-brand-500 hover:bg-brand-600 shadow-brand-500/20"
          }`}
        >
          {confirmLabel}
        </button>
      </div>
    </GlassModal>
  );
}

export function FormModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  subtitle,
  fields,
  initialData,
  submitLabel = "Simpan",
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: Record<string, string | number>) => void;
  title: string;
  subtitle?: string;
  fields: FormField[];
  initialData?: Record<string, unknown>;
  submitLabel?: string;
}) {
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const result: Record<string, string | number> = {};
    fields.forEach((field) => {
      const val = fd.get(field.name);
      if (val !== null) {
        result[field.name] = field.type === "number" ? Number(val) : String(val);
      }
    });
    onSubmit(result);
    onClose();
  };

  return (
    <GlassModal isOpen={isOpen} onClose={onClose} title={title} subtitle={subtitle}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map((field) => {
          const rawVal = initialData ? initialData[field.name] : field.defaultValue ?? "";
          const defaultValue = rawVal !== undefined && rawVal !== null ? String(rawVal) : "";

          return (
            <div key={field.name}>
              <label
                htmlFor={`form-${field.name}`}
                className="block text-xs font-semibold text-ink mb-1.5"
              >
                {field.label} {field.required && <span className="text-rose-500">*</span>}
              </label>

              {field.type === "select" ? (
                <div className="relative">
                  <select
                    id={`form-${field.name}`}
                    name={field.name}
                    defaultValue={defaultValue}
                    required={field.required}
                    className="w-full appearance-none rounded-xl border border-line bg-white/80 px-3.5 py-2.5 text-sm text-ink backdrop-blur-xs transition-colors focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  >
                    {field.options?.map((opt) => (
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
                  id={`form-${field.name}`}
                  name={field.name}
                  defaultValue={defaultValue}
                  rows={3}
                  required={field.required}
                  placeholder={field.placeholder}
                  className="w-full rounded-xl border border-line bg-white/80 px-3.5 py-2.5 text-sm text-ink backdrop-blur-xs transition-colors focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              ) : (
                <input
                  id={`form-${field.name}`}
                  name={field.name}
                  type={field.type}
                  defaultValue={defaultValue}
                  required={field.required}
                  placeholder={field.placeholder}
                  className="w-full rounded-xl border border-line bg-white/80 px-3.5 py-2.5 text-sm text-ink backdrop-blur-xs transition-colors focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              )}
            </div>
          );
        })}

        <div className="mt-6 flex items-center justify-end gap-3 border-t border-line/60 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-line bg-white/80 px-4 py-2 text-sm font-semibold text-ink hover:bg-white transition-colors"
          >
            Batal
          </button>
          <button
            type="submit"
            className="rounded-xl bg-brand-500 hover:bg-brand-600 px-5 py-2 text-sm font-semibold text-white shadow-xs shadow-brand-500/25 transition-colors focus-visible:outline-2 focus-visible:outline-brand-600"
          >
            {submitLabel}
          </button>
        </div>
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
    <GlassModal isOpen={isOpen} onClose={onClose} title={title} subtitle={subtitle} maxWidth="max-w-lg">
      <div className="space-y-4">
        {renderCustom ? (
          renderCustom(data)
        ) : (
          <div className="divide-y divide-line/60 rounded-xl border border-white/80 bg-white/60 p-4 backdrop-blur-xs">
            {Object.entries(data as Record<string, unknown>).map(([key, val]) => {
              if (key === "id") return null;
              const label = labels?.[key] || key;
              return (
                <div key={key} className="flex flex-col sm:flex-row sm:items-center justify-between py-2.5 first:pt-0 last:pb-0 gap-1 sm:gap-4">
                  <span className="text-xs font-semibold text-muted uppercase tracking-wider">{label}</span>
                  <span className="text-sm font-medium text-ink break-words text-left sm:text-right">
                    {typeof val === "object" ? JSON.stringify(val) : String(val)}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-6 flex justify-end border-t border-line/60 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-brand-500 hover:bg-brand-600 px-5 py-2 text-sm font-semibold text-white shadow-xs shadow-brand-500/25 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </GlassModal>
  );
}
