"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
} from "react";
import { Icon } from "@/components/ui/icon";
import { ConfirmModal, FormModal, DetailModal } from "./table-modal";
import type {
  ActionResult,
  ColumnDef,
  FilterOption,
  FormField,
  MaybeAsyncResult,
  TableCapabilities,
} from "./types";

type RowId = string | number;
type FormValues = Record<string, string | number>;

/**
 * DataTable punya dua mode:
 *
 * - "local" (bawaan, perilaku lama): tabel menyimpan salinan data sendiri dan
 *   memperbarui tampilan secara langsung. Callback `onItemCreate/Update/Delete`
 *   bersifat opsional. Bila callback gagal, perubahan lokal dibatalkan dan
 *   galatnya ditampilkan (tidak lagi gagal diam-diam).
 *
 * - "controlled": data SEPENUHNYA berasal dari prop `data`. Tabel tidak
 *   membuat baris atau id sendiri. Perubahan dilakukan lewat `onCreate`,
 *   `onUpdate`, `onDelete` yang mengembalikan `ActionResult`; setelah berhasil,
 *   komponen induk memuat ulang `data`. Gunakan mode ini untuk data dari
 *   service/repository atau API.
 */
export interface DataTableProps<T extends { id: RowId }> {
  title: string;
  description?: string;
  columns: ColumnDef<T>[];
  data: T[];
  searchPlaceholder?: string;
  searchKeys?: (keyof T)[];
  filters?: {
    key: keyof T;
    label: string;
    options: FilterOption[];
  }[];
  formFields?: FormField[];
  fieldLabels?: Record<string, string>;

  mode?: "local" | "controlled";

  /** Mode "controlled". */
  onCreate?: (values: FormValues) => MaybeAsyncResult;
  onUpdate?: (id: RowId, values: FormValues) => MaybeAsyncResult;
  onDelete?: (id: RowId) => MaybeAsyncResult;

  /**
   * Mode "local" (lama). Boleh sinkron maupun asinkron, dan boleh mengembalikan
   * apa saja (tipe `unknown` menjaga kompatibilitas dengan pemanggil lama).
   * Mengembalikan `{ ok: false, error }` atau melempar galat membatalkan
   * perubahan lokal.
   */
  onItemCreate?: (item: FormValues) => unknown;
  onItemUpdate?: (id: RowId, updated: FormValues) => unknown;
  onItemDelete?: (id: RowId) => unknown;

  /**
   * Kemampuan tabel. Bawaan: tambah dan ubah aktif, hapus MATI, dan ekspor aktif.
   * Hapus harus diaktifkan eksplisit pada tabel yang benar-benar menyediakan
   * operasi penghapusan. Di mode "controlled", tombol tambah/ubah/hapus hanya tampil
   * bila handler terkait diberikan.
   */
  capabilities?: TableCapabilities;

  isLoading?: boolean;
  errorMessage?: string | null;
  onRetry?: () => void;
  /** Bila diisi, tombol segarkan memanggil fungsi ini (memuat ulang data). */
  onRefresh?: () => void;

  renderCustomDetail?: (item: T) => ReactNode;
  customRowActions?: (item: T) => ReactNode;
  exportFileName?: string;
  initialPageSize?: number;
}

type Toast = { message: string; tone: "success" | "error" };

function toResult(value: unknown): ActionResult {
  if (typeof value === "object" && value !== null && "ok" in value) {
    return value as ActionResult;
  }
  return { ok: true };
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error && error.message
    ? error.message
    : "Terjadi kesalahan. Silakan coba lagi.";
}

/** Mencegah formula injection saat CSV dibuka di Excel/Sheets. */
function escapeCsvCell(raw: unknown): string {
  let text = raw === null || raw === undefined ? "" : String(raw);
  if (typeof raw === "string" && /^[=+\-@\t\r]/.test(text)) {
    text = `'${text}`;
  }
  return `"${text.replace(/"/g, '""')}"`;
}

export function DataTable<T extends { id: RowId }>({
  title,
  description,
  columns,
  data,
  searchPlaceholder = "Cari data...",
  searchKeys = [],
  filters = [],
  formFields = [],
  fieldLabels = {},
  mode = "local",
  onCreate,
  onUpdate,
  onDelete,
  onItemCreate,
  onItemUpdate,
  onItemDelete,
  capabilities,
  isLoading = false,
  errorMessage = null,
  onRetry,
  onRefresh,
  renderCustomDetail,
  customRowActions,
  exportFileName = "data-sahabat-alfary",
  initialPageSize = 5,
}: DataTableProps<T>) {
  const isControlled = mode === "controlled";

  // Salinan lokal hanya dipakai di mode "local". State dipasangkan dengan
  // referensi prop terakhir agar sinkronisasi dapat dilakukan tanpa efek
  // samping yang memicu cascading render.
  const [localState, setLocalState] = useState({
    source: data,
    items: data,
  });
  if (!isControlled && localState.source !== data) {
    setLocalState({ source: data, items: [...data] });
  }
  const localItems = localState.items;
  const setLocalItems = (next: T[] | ((previous: T[]) => T[])) =>
    setLocalState((previous) => ({
      source: previous.source,
      items: typeof next === "function" ? next(previous.items) : next,
    }));
  const items = isControlled ? data : localItems;

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  // Row selection (hanya dipakai bila hapus massal aktif)
  const [selectedIds, setSelectedIds] = useState<Set<RowId>>(new Set());

  // Modal states
  const [detailItem, setDetailItem] = useState<T | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [editItem, setEditItem] = useState<T | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const [deleteId, setDeleteId] = useState<RowId | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);

  // Toast feedback
  const [toast, setToast] = useState<Toast | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  const showToast = (message: string, tone: Toast["tone"] = "success") => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ message, tone });
    toastTimer.current = setTimeout(() => setToast(null), 3500);
  };

  // Kemampuan tabel
  const hasForm = formFields.length > 0;
  const canCreate =
    (capabilities?.create ?? true) && hasForm && (!isControlled || !!onCreate);
  const canEdit =
    (capabilities?.edit ?? true) && hasForm && (!isControlled || !!onUpdate);
  const canDelete = (capabilities?.delete ?? false) && (!isControlled || !!onDelete);
  const canBulkDelete = (capabilities?.bulkDelete ?? false) && canDelete;
  const canExport = capabilities?.export ?? true;

  // Filtered & Sorted items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Search filter
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const matches =
          searchKeys.length > 0
            ? searchKeys.some((k) =>
                String(item[k] ?? "").toLowerCase().includes(query)
              )
            : Object.values(item).some((v) =>
                String(v ?? "").toLowerCase().includes(query)
              );
        if (!matches) return false;
      }

      // Dropdown filters
      for (const [key, filterValue] of Object.entries(activeFilters)) {
        if (filterValue && filterValue !== "ALL") {
          if (String(item[key as keyof T]) !== filterValue) {
            return false;
          }
        }
      }

      return true;
    });
  }, [items, searchQuery, searchKeys, activeFilters]);

  const sortedItems = useMemo(() => {
    if (!sortConfig) return filteredItems;

    const column = columns.find((c) => c.key === sortConfig.key);
    const getValue = (row: T): unknown =>
      column?.sortValue ? column.sortValue(row) : row[sortConfig.key as keyof T];
    const dir = sortConfig.direction === "asc" ? 1 : -1;

    return [...filteredItems].sort((a, b) => {
      const aVal = getValue(a);
      const bVal = getValue(b);
      const aEmpty = aVal === null || aVal === undefined || aVal === "";
      const bEmpty = bVal === null || bVal === undefined || bVal === "";

      // Nilai kosong selalu di bawah, apa pun arah pengurutan.
      if (aEmpty && bEmpty) return 0;
      if (aEmpty) return 1;
      if (bEmpty) return -1;

      if (typeof aVal === "number" && typeof bVal === "number") {
        return (aVal - bVal) * dir;
      }
      return (
        String(aVal).localeCompare(String(bVal), "id", { numeric: true }) * dir
      );
    });
  }, [filteredItems, sortConfig, columns]);

  // Pagination: halaman dikunci ke rentang valid saat data menyusut
  // (mis. setelah menghapus baris terakhir di halaman terakhir).
  const totalPages = Math.max(1, Math.ceil(sortedItems.length / pageSize));
  const page = Math.min(currentPage, totalPages);

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedItems.slice(start, start + pageSize);
  }, [sortedItems, page, pageSize]);

  // Hanya baris yang terlihat di halaman ini yang dihitung terpilih, sehingga
  // tidak ada penghapusan terhadap baris yang tidak tampil.
  const selectedItems = useMemo(
    () => paginatedItems.filter((item) => selectedIds.has(item.id)),
    [paginatedItems, selectedIds]
  );

  const rangeStart = sortedItems.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, sortedItems.length);

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    Object.values(activeFilters).some((v) => v && v !== "ALL");

  const clearSelection = () => setSelectedIds(new Set());

  const rowLabel = (item: T): string => {
    const firstKey = searchKeys[0];
    const label = firstKey !== undefined ? item[firstKey] : undefined;
    return String(label ?? item.id);
  };

  // Handlers
  const handleSort = (key: string) => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        if (prev.direction === "asc") return { key, direction: "desc" };
        return null;
      }
      return { key, direction: "asc" };
    });
  };

  const goToPage = (next: number) => {
    setCurrentPage(Math.min(Math.max(1, next), totalPages));
    clearSelection();
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
    clearSelection();
  };

  const handleFilterChange = (key: string, value: string) => {
    setActiveFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
    clearSelection();
  };

  const resetAllFilters = () => {
    setSearchQuery("");
    setActiveFilters({});
    setSortConfig(null);
    setCurrentPage(1);
    clearSelection();
  };

  const handleSelectAll = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(new Set(paginatedItems.map((i) => i.id)));
    } else {
      clearSelection();
    }
  };

  const handleSelectRow = (id: RowId) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // ---- Aksi data ----------------------------------------------------------
  // Handler mengembalikan ActionResult. Galat yang dilempar callback diteruskan
  // ke modal (FormModal/ConfirmModal menangkap dan menampilkannya).

  const handleCreate = async (values: FormValues): Promise<ActionResult> => {
    if (isControlled) {
      if (!onCreate) {
        return { ok: false, error: "Penambahan data belum tersedia." };
      }
      const result = toResult(await onCreate(values));
      if (result.ok) showToast(result.message ?? "Data berhasil ditambahkan.");
      return result;
    }

    // Mode lama: tampilkan dulu, batalkan bila callback gagal.
    // Salinan dibuat SEKARANG (sebelum callback dipanggil), karena repository
    // mock bisa mengubah array asli di tempat sebelum React memproses antrean
    // state, yang membuat baris muncul dua kali.
    const snapshot = [...localItems];
    const optimistic = { id: Date.now().toString(), ...values } as unknown as T;
    setLocalItems([optimistic, ...snapshot]);
    try {
      const result = toResult(await onItemCreate?.(values));
      if (!result.ok) {
        setLocalItems(snapshot);
        return result;
      }
      showToast(
        result.message ?? "Data ditambahkan (sesi ini saja — belum tersimpan ke server)."
      );
      return result;
    } catch (err) {
      setLocalItems(snapshot);
      throw err;
    }
  };

  const handleUpdate = async (values: FormValues): Promise<ActionResult> => {
    if (!editItem) return { ok: false, error: "Tidak ada data yang dipilih." };
    const target = editItem;

    if (isControlled) {
      if (!onUpdate) {
        return { ok: false, error: "Perubahan data belum tersedia." };
      }
      const result = toResult(await onUpdate(target.id, values));
      if (result.ok) showToast(result.message ?? "Perubahan berhasil disimpan.");
      return result;
    }

    const snapshot = [...localItems];
    setLocalItems(
      snapshot.map((item) =>
        item.id === target.id ? ({ ...item, ...values } as T) : item
      )
    );
    try {
      const result = toResult(await onItemUpdate?.(target.id, values));
      if (!result.ok) {
        setLocalItems(snapshot);
        return result;
      }
      showToast(
        result.message ??
          "Perubahan diterapkan (sesi ini saja — belum tersimpan ke server)."
      );
      return result;
    } catch (err) {
      setLocalItems(snapshot);
      throw err;
    }
  };

  /** Menghapus satu baris lewat handler yang sesuai mode. Tidak melempar. */
  const deleteOne = async (id: RowId): Promise<ActionResult> => {
    try {
      if (isControlled) {
        if (!onDelete) {
          return { ok: false, error: "Penghapusan data belum tersedia." };
        }
        return toResult(await onDelete(id));
      }
      return toResult(await onItemDelete?.(id));
    } catch (err) {
      return { ok: false, error: getErrorMessage(err) };
    }
  };

  const handleDelete = async (): Promise<ActionResult> => {
    if (deleteId === null) {
      return { ok: false, error: "Tidak ada data yang dipilih." };
    }
    const id = deleteId;
    const snapshot = [...localItems];
    if (!isControlled) {
      setLocalItems(snapshot.filter((item) => item.id !== id));
    }

    const result = await deleteOne(id);
    if (!result.ok) {
      if (!isControlled) setLocalItems(snapshot);
      return result;
    }

    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    showToast(
      result.message ??
        (isControlled
          ? "Data berhasil dihapus."
          : "Data dihapus dari tampilan (sesi ini saja — belum dihapus dari server).")
    );
    return result;
  };

  const handleBulkDelete = async (): Promise<ActionResult> => {
    const targets = selectedItems;
    if (targets.length === 0) {
      return { ok: false, error: "Tidak ada data yang dipilih." };
    }

    const snapshot = [...localItems];
    if (!isControlled) {
      const targetIds = new Set(targets.map((t) => t.id));
      setLocalItems(snapshot.filter((item) => !targetIds.has(item.id)));
    }

    const succeeded = new Set<RowId>();
    const failures: string[] = [];
    for (const target of targets) {
      const result = await deleteOne(target.id);
      if (result.ok) succeeded.add(target.id);
      else failures.push(result.error);
    }

    if (!isControlled && failures.length > 0) {
      setLocalItems(snapshot.filter((item) => !succeeded.has(item.id)));
    }
    setSelectedIds((prev) => {
      const next = new Set(prev);
      succeeded.forEach((id) => next.delete(id));
      return next;
    });

    if (failures.length > 0) {
      return {
        ok: false,
        error: `${failures.length} dari ${targets.length} data gagal dihapus. ${failures[0]}`,
      };
    }
    showToast(`${targets.length} data berhasil dihapus.`);
    return { ok: true };
  };

  const handleExportCSV = () => {
    if (sortedItems.length === 0) return;
    try {
      const header = columns.map((col) => escapeCsvCell(col.header)).join(",");
      const rows = sortedItems.map((item) =>
        columns
          .map((col) =>
            escapeCsvCell(
              col.exportValue ? col.exportValue(item) : item[col.key as keyof T]
            )
          )
          .join(",")
      );
      // BOM agar Excel membaca UTF-8 dengan benar; CRLF sesuai standar CSV.
      const csv = "\uFEFF" + ["sep=,", header, ...rows].join("\r\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${exportFileName}-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast(`${sortedItems.length} baris diekspor ke CSV.`);
    } catch {
      showToast("Gagal membuat file CSV.", "error");
    }
  };

  const isAllSelected =
    paginatedItems.length > 0 &&
    paginatedItems.every((item) => selectedIds.has(item.id));

  const columnCount = columns.length + 1 + (canBulkDelete ? 1 : 0);
  // Ambil versi terbaru baris (mis. setelah sinkronisasi dari induk) berdasarkan
  // id, supaya modal detail/ubah tidak menampilkan salinan yang sudah usang.
  const currentEdit = editItem
    ? (items.find((row) => row.id === editItem.id) ?? editItem)
    : null;
  const currentDetail = detailItem
    ? (items.find((row) => row.id === detailItem.id) ?? detailItem)
    : null;
  const editInitialData = currentEdit
    ? (currentEdit as unknown as Record<string, unknown>)
    : null;

  return (
    <div className="glass-container rounded-card p-5 sm:p-6 shadow-glass relative">
      {/* Toast Feedback Notification */}
      {toast && (
        <div
          role={toast.tone === "error" ? "alert" : "status"}
          aria-live={toast.tone === "error" ? "assertive" : "polite"}
          className="fixed bottom-4 left-4 right-4 z-50 flex items-center gap-2.5 rounded-xl bg-ink px-4 py-3 text-white shadow-2xl sm:left-auto sm:right-6 sm:max-w-sm animate-in slide-in-from-bottom-5 duration-200"
        >
          <span
            className={`grid size-6 place-items-center rounded-full text-white ${
              toast.tone === "error" ? "bg-rose-500" : "bg-emerald-500"
            }`}
          >
            <Icon
              name={toast.tone === "error" ? "alert" : "check"}
              className="size-3.5"
            />
          </span>
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      {/* Header Tabel */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between border-b border-line/60 pb-5">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg font-bold text-ink">{title}</h2>
            <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-600 border border-brand-100">
              {filteredItems.length} data
            </span>
          </div>
          {description && (
            <p className="mt-1 text-xs text-muted leading-relaxed sm:text-sm">
              {description}
            </p>
          )}
        </div>

        {/* Action Buttons Top Bar */}
        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          {canCreate && (
            <button
              type="button"
              onClick={() => setIsCreateOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs shadow-brand-500/25 transition-all hover:shadow"
            >
              <Icon name="plus" className="size-4" />
              <span>Tambah Data</span>
            </button>
          )}

          {canExport && (
            <button
              type="button"
              onClick={handleExportCSV}
              title="Ekspor ke CSV"
              aria-label="Ekspor ke CSV"
              className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-white/80 hover:bg-white px-3 py-2 text-xs font-semibold text-ink shadow-xs transition-colors backdrop-blur-xs"
            >
              <Icon name="download" className="size-4 text-muted" />
              <span className="hidden sm:inline">Ekspor</span>
            </button>
          )}

          <button
            type="button"
            onClick={onRefresh ?? resetAllFilters}
            title={onRefresh ? "Muat ulang data" : "Reset filter"}
            aria-label={onRefresh ? "Muat ulang data" : "Reset filter"}
            className="grid size-8 place-items-center rounded-xl border border-line bg-white/80 hover:bg-white text-muted hover:text-ink shadow-xs transition-colors backdrop-blur-xs"
          >
            <Icon name="refresh" className="size-4" />
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted">
            <Icon name="search" className="size-4" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
            className="w-full rounded-xl border border-line bg-white/80 pl-9 pr-8 py-2 text-xs sm:text-sm text-ink placeholder:text-muted/70 backdrop-blur-xs transition-all focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => handleSearchChange("")}
              aria-label="Hapus pencarian"
              className="absolute inset-y-0 right-2.5 flex items-center text-muted hover:text-ink"
            >
              <Icon name="close" className="size-3.5" />
            </button>
          )}
        </div>

        {/* Dynamic Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {filters.map((filter) => (
            <div key={String(filter.key)} className="relative">
              <select
                value={activeFilters[String(filter.key)] || "ALL"}
                onChange={(e) =>
                  handleFilterChange(String(filter.key), e.target.value)
                }
                aria-label={`Filter ${filter.label}`}
                className="appearance-none rounded-xl border border-line bg-white/80 pl-3 pr-8 py-2 text-xs font-medium text-ink backdrop-blur-xs transition-colors focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              >
                <option value="ALL">Semua {filter.label}</option>
                {filter.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center text-muted">
                <Icon name="chevron-down" className="size-3.5" />
              </span>
            </div>
          ))}

          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetAllFilters}
              className="rounded-xl bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 text-xs font-semibold text-muted hover:text-ink transition-colors"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Bulk Action Bar saat baris dipilih */}
      {canBulkDelete && selectedItems.length > 0 && (
        <div className="mt-3 flex items-center justify-between rounded-xl bg-brand-50/90 border border-brand-200/80 px-4 py-2.5 text-xs text-brand-900 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="flex items-center gap-2 font-semibold">
            <span className="grid size-5 place-items-center rounded-full bg-brand-500 text-white text-[10px]">
              {selectedItems.length}
            </span>
            <span>baris terpilih di halaman ini</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsBulkDeleteOpen(true)}
              className="inline-flex items-center gap-1 rounded-lg bg-rose-600 hover:bg-rose-700 px-2.5 py-1 font-semibold text-white transition-colors"
            >
              <Icon name="trash" className="size-3" />
              <span>Hapus Terpilih</span>
            </button>
            <button
              type="button"
              onClick={clearSelection}
              className="rounded-lg bg-white/80 px-2.5 py-1 font-medium text-ink hover:bg-white transition-colors"
            >
              Batal
            </button>
          </div>
        </div>
      )}

      {/* Tabel Data Responsif */}
      <div className="-mx-2 mt-4 overflow-x-auto rounded-xl border border-line/70 bg-white/70 backdrop-blur-xs scrollbar-thin sm:mx-0">
        <table className="w-full min-w-[720px] table-auto border-collapse text-left" aria-busy={isLoading || undefined}>
          <caption className="sr-only">Tabel {title}</caption>
          <thead>
            <tr className="border-b border-line/70 bg-surface/70 text-[11px] font-semibold uppercase tracking-wider text-muted">
              {canBulkDelete && (
                <th scope="col" className="w-10 px-3 py-3 text-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    aria-label="Pilih semua baris di halaman ini"
                    className="size-4 rounded border-line text-brand-500 focus:ring-brand-500/20"
                  />
                </th>
              )}
              {columns.map((col) => {
                const direction =
                  sortConfig?.key === col.key ? sortConfig.direction : null;
                const ariaSort = col.sortable
                  ? direction === "asc"
                    ? "ascending"
                    : direction === "desc"
                      ? "descending"
                      : "none"
                  : undefined;

                return (
                  <th
                    key={col.key}
                    scope="col"
                    aria-sort={ariaSort}
                    className={`px-3 py-3 select-none whitespace-normal leading-4 ${col.className || ""}`}
                  >
                    {col.sortable ? (
                      <button
                        type="button"
                        onClick={() => handleSort(col.key)}
                        title="Klik untuk mengurutkan: 1x naik (A–Z / kecil–besar), 2x turun, 3x kembali ke urutan awal"
                        className="inline-flex items-center gap-1 font-semibold uppercase tracking-wider hover:text-brand-600 transition-colors focus-visible:outline-2 focus-visible:outline-brand-500"
                      >
                        <span>{col.header}</span>
                        <span className="inline-flex flex-col -space-y-1.5" aria-hidden="true">
                          <Icon
                            name="chevron-up"
                            className={`size-3 ${direction === "asc" ? "text-brand-600" : "text-muted/40"}`}
                          />
                          <Icon
                            name="chevron-down"
                            className={`size-3 ${direction === "desc" ? "text-brand-600" : "text-muted/40"}`}
                          />
                        </span>
                      </button>
                    ) : (
                      <span>{col.header}</span>
                    )}
                  </th>
                );
              })}
              <th scope="col" className="sticky right-0 min-w-[112px] bg-surface/95 px-3 py-3 text-right shadow-[-8px_0_12px_-10px_rgba(15,23,42,0.35)] backdrop-blur-xs">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line/60 text-xs sm:text-sm">
            {isLoading ? (
              <tr>
                <td colSpan={columnCount} className="px-4 py-14 text-center text-muted">
                  <div role="status" className="flex flex-col items-center justify-center gap-2">
                    <span className="inline-block size-5 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" aria-hidden="true" />
                    <p className="text-sm font-medium">Memuat data...</p>
                  </div>
                </td>
              </tr>
            ) : errorMessage ? (
              <tr>
                <td colSpan={columnCount} className="px-4 py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <span className="grid size-12 place-items-center rounded-2xl bg-rose-50 text-rose-600 mb-2 border border-rose-200/60">
                      <Icon name="alert" className="size-6" />
                    </span>
                    <p role="alert" className="font-semibold text-rose-700">
                      {errorMessage}
                    </p>
                    {onRetry && (
                      <button
                        type="button"
                        onClick={onRetry}
                        className="mt-3 rounded-xl bg-brand-500 hover:bg-brand-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs"
                      >
                        Coba Lagi
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : paginatedItems.length === 0 ? (
              <tr>
                <td colSpan={columnCount} className="px-4 py-12 text-center text-muted">
                  <div className="flex flex-col items-center justify-center">
                    <span className="grid size-12 place-items-center rounded-2xl bg-brand-50 text-brand-500 mb-2 border border-brand-100">
                      <Icon name="inbox" className="size-6" />
                    </span>
                    {items.length === 0 ? (
                      <>
                        <p className="font-semibold text-ink">Belum ada data</p>
                        <p className="text-xs text-muted mt-1 max-w-xs">
                          Data akan tampil di sini setelah ditambahkan.
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="font-semibold text-ink">Tidak ada data ditemukan</p>
                        <p className="text-xs text-muted mt-1 max-w-xs">
                          Coba ubah kata kunci pencarian atau reset filter untuk menampilkan kembali data.
                        </p>
                        {hasActiveFilters && (
                          <button
                            type="button"
                            onClick={resetAllFilters}
                            className="mt-3 rounded-xl bg-brand-500 hover:bg-brand-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs"
                          >
                            Reset Filter
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              paginatedItems.map((item) => {
                const isSelected = selectedIds.has(item.id);
                return (
                  <tr
                    key={item.id}
                    className={`transition-colors duration-150 ${
                      isSelected
                        ? "bg-brand-50/60"
                        : "hover:bg-white/80 odd:bg-transparent even:bg-white/30"
                    }`}
                  >
                    {canBulkDelete && (
                      <td className="w-10 px-3 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectRow(item.id)}
                          aria-label={`Pilih baris ${rowLabel(item)}`}
                          className="size-4 rounded border-line text-brand-500 focus:ring-brand-500/20"
                        />
                      </td>
                    )}
                    {columns.map((col) => (
                      <td key={col.key} className={`px-3 py-3 align-middle ${col.className || ""}`}>
                        <div className="max-w-[280px] whitespace-normal break-words leading-relaxed">
                          {col.render
                            ? col.render(item)
                            : String(item[col.key as keyof T] ?? "-")}
                        </div>
                      </td>
                    ))}
                    <td className="sticky right-0 min-w-[112px] bg-white/95 px-3 py-3 text-right whitespace-nowrap shadow-[-8px_0_12px_-10px_rgba(15,23,42,0.35)] backdrop-blur-xs">
                      <div className="inline-flex items-center gap-1">
                        {customRowActions && customRowActions(item)}

                        <button
                          type="button"
                          onClick={() => {
                            setDetailItem(item);
                            setIsDetailOpen(true);
                          }}
                          title="Lihat Detail"
                          aria-label={`Lihat detail ${rowLabel(item)}`}
                          className="grid size-8 place-items-center rounded-lg text-muted hover:bg-brand-50 hover:text-brand-600 transition-colors"
                        >
                          <Icon name="eye" className="size-4" />
                        </button>

                        {canEdit && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditItem(item);
                              setIsEditOpen(true);
                            }}
                            title="Ubah Data"
                            aria-label={`Ubah ${rowLabel(item)}`}
                            className="grid size-8 place-items-center rounded-lg text-muted hover:bg-brand-50 hover:text-brand-600 transition-colors"
                          >
                            <Icon name="edit" className="size-4" />
                          </button>
                        )}

                        {canDelete && (
                          <button
                            type="button"
                            onClick={() => {
                              setDeleteId(item.id);
                              setIsDeleteOpen(true);
                            }}
                            title="Hapus Data"
                            aria-label={`Hapus ${rowLabel(item)}`}
                            className="grid size-8 place-items-center rounded-lg text-muted hover:bg-rose-50 hover:text-rose-600 transition-colors"
                          >
                            <Icon name="trash" className="size-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-xs text-muted">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span>Baris per halaman</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
              clearSelection();
            }}
            aria-label="Jumlah baris per halaman"
            className="rounded-lg border border-line bg-white/80 px-2 py-1 text-xs text-ink focus:border-brand-500 focus:outline-none"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <span className="text-muted">
            Menampilkan{" "}
            <strong className="text-ink tabular-nums">
              {rangeStart}–{rangeEnd}
            </strong>{" "}
            dari <strong className="text-ink tabular-nums">{sortedItems.length}</strong> data
          </span>
        </div>

        <nav aria-label="Navigasi halaman" className="flex items-center gap-1 self-center sm:self-auto flex-wrap justify-center">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => goToPage(page - 1)}
            className="grid size-8 place-items-center rounded-lg border border-line bg-white/80 text-ink disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white transition-colors"
            aria-label="Halaman sebelumnya"
          >
            <Icon name="chevron-left" className="size-3.5" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => {
            // Tampilkan navigasi ringkas jika halaman > 6
            if (
              totalPages > 6 &&
              Math.abs(pg - page) > 2 &&
              pg !== 1 &&
              pg !== totalPages
            ) {
              if (Math.abs(pg - page) === 3) {
                return (
                  <span key={pg} className="px-1 text-muted" aria-hidden="true">
                    ...
                  </span>
                );
              }
              return null;
            }

            const isActive = pg === page;
            return (
              <button
                key={pg}
                type="button"
                onClick={() => goToPage(pg)}
                aria-label={`Halaman ${pg}`}
                aria-current={isActive ? "page" : undefined}
                className={`grid size-8 place-items-center rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-brand-500 text-white shadow-xs shadow-brand-500/30"
                    : "border border-line bg-white/80 text-ink hover:bg-white"
                }`}
              >
                {pg}
              </button>
            );
          })}

          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => goToPage(page + 1)}
            className="grid size-8 place-items-center rounded-lg border border-line bg-white/80 text-ink disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white transition-colors"
            aria-label="Halaman selanjutnya"
          >
            <Icon name="chevron-right" className="size-3.5" />
          </button>
        </nav>
      </div>

      {/* Interactive Glassmorphism Modals */}
      {/* 1. Modal Detail */}
      <DetailModal<T>
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setDetailItem(null);
        }}
        title={`Detail ${title}`}
        subtitle="Informasi lengkap data terpilih pada sistem Sahabat Alfary"
        data={currentDetail}
        labels={fieldLabels}
        renderCustom={renderCustomDetail}
      />

      {/* 2. Modal Tambah (Create) */}
      <FormModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreate}
        title={`Tambah ${title}`}
        subtitle="Lengkapi formulir di bawah ini untuk menambahkan data baru ke dalam modul"
        fields={formFields}
        submitLabel="Tambahkan"
      />

      {/* 3. Modal Ubah (Edit) */}
      <FormModal
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setEditItem(null);
        }}
        onSubmit={handleUpdate}
        title={`Ubah ${title}`}
        subtitle="Perbarui rincian formulir data yang dipilih"
        fields={formFields}
        initialData={editInitialData}
        submitLabel="Perbarui Data"
      />

      {/* 4. Modal Konfirmasi Hapus */}
      <ConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setDeleteId(null);
        }}
        onConfirm={handleDelete}
        title="Hapus Data Ini?"
        message="Data yang dihapus tidak dapat dipulihkan kembali. Pastikan Anda telah meninjau sebelum melanjutkan tindakan ini."
        confirmLabel="Ya, Hapus Data"
        confirmVariant="danger"
      />

      {/* 5. Modal Konfirmasi Hapus Massal */}
      <ConfirmModal
        isOpen={isBulkDeleteOpen}
        onClose={() => setIsBulkDeleteOpen(false)}
        onConfirm={handleBulkDelete}
        title="Hapus Data Terpilih?"
        message={`${selectedItems.length} data terpilih akan dihapus dan tidak dapat dipulihkan kembali. Pastikan Anda telah meninjaunya.`}
        confirmLabel={`Ya, Hapus ${selectedItems.length} Data`}
        confirmVariant="danger"
      />
    </div>
  );
}
