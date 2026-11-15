"use client";

import { useState, useMemo, type ReactNode } from "react";
import { Icon } from "@/components/ui/icon";
import { ConfirmModal, FormModal, DetailModal } from "./table-modal";
import type { ColumnDef, FilterOption, FormField } from "./types";

export interface DataTableProps<T extends { id: string | number }> {
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
  onItemCreate?: (item: Record<string, string | number>) => void;
  onItemUpdate?: (id: string | number, updated: Record<string, string | number>) => void;
  onItemDelete?: (id: string | number) => void;
  renderCustomDetail?: (item: T) => ReactNode;
  customRowActions?: (item: T) => ReactNode;
  exportFileName?: string;
  initialPageSize?: number;
}

export function DataTable<T extends { id: string | number }>({
  title,
  description,
  columns,
  data: initialData,
  searchPlaceholder = "Cari data...",
  searchKeys = [],
  filters = [],
  formFields = [],
  fieldLabels = {},
  onItemCreate,
  onItemUpdate,
  onItemDelete,
  renderCustomDetail,
  customRowActions,
  exportFileName = "data-sahabat-alfary",
  initialPageSize = 5,
}: DataTableProps<T>) {
  // State data lokal agar interaksi Create, Edit, Delete dapat langsung dirasakan
  const [items, setItems] = useState<T[]>(initialData);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  // Row selection
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());

  // Modal states
  const [detailItem, setDetailItem] = useState<T | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [editItem, setEditItem] = useState<T | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const [deleteId, setDeleteId] = useState<string | number | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

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
    return [...filteredItems].sort((a, b) => {
      const aVal = a[sortConfig.key as keyof T];
      const bVal = b[sortConfig.key as keyof T];

      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
      }

      return sortConfig.direction === "asc"
        ? String(aVal).localeCompare(String(bVal), "id")
        : String(bVal).localeCompare(String(aVal), "id");
    });
  }, [filteredItems, sortConfig]);

  // Paginated items
  const totalPages = Math.ceil(sortedItems.length / pageSize) || 1;
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedItems.slice(start, start + pageSize);
  }, [sortedItems, currentPage, pageSize]);

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

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allCurrent = new Set(paginatedItems.map((i) => i.id));
      setSelectedIds(allCurrent);
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectRow = (id: string | number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleCreate = (newFields: Record<string, string | number>) => {
    const newItem = {
      id: Date.now().toString(),
      ...newFields,
    } as unknown as T;

    setItems((prev) => [newItem, ...prev]);
    onItemCreate?.(newFields);
    showToast("Data ditambahkan (sesi ini saja — belum tersimpan ke server).");
  };

  const handleUpdate = (updatedFields: Record<string, string | number>) => {
    if (!editItem) return;
    setItems((prev) =>
      prev.map((item) =>
        item.id === editItem.id ? ({ ...item, ...updatedFields } as T) : item
      )
    );
    onItemUpdate?.(editItem.id, updatedFields);
    showToast("Perubahan diterapkan (sesi ini saja — belum tersimpan ke server).");
  };

  const handleDelete = () => {
    if (!deleteId) return;
    setItems((prev) => prev.filter((item) => item.id !== deleteId));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(deleteId);
      return next;
    });
    onItemDelete?.(deleteId);
    setDeleteId(null);
    showToast("Data dihapus dari tampilan (sesi ini saja — belum dihapus dari server).");
  };

  const handleBulkDelete = () => {
    if (selectedIds.size === 0) return;
    setItems((prev) => prev.filter((item) => !selectedIds.has(item.id)));
    setSelectedIds(new Set());
    showToast(`${selectedIds.size} data dihapus dari tampilan (sesi ini saja — belum dihapus dari server).`);
  };

  const handleExportCSV = () => {
    if (sortedItems.length === 0) return;
    const headerKeys = columns.map((col) => col.key);
    const headerLabels = columns.map((col) => `"${col.header}"`).join(",");

    const rows = sortedItems.map((item) =>
      headerKeys
        .map((k) => `"${String(item[k as keyof T] ?? "").replace(/"/g, '""')}"`)
        .join(",")
    );

    const csvContent =
      "data:text/csv;charset=utf-8," + [headerLabels, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${exportFileName}-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Data berhasil diekspor ke format CSV!");
  };

  const resetAllFilters = () => {
    setSearchQuery("");
    setActiveFilters({});
    setSortConfig(null);
    setCurrentPage(1);
  };

  const isAllSelected =
    paginatedItems.length > 0 &&
    paginatedItems.every((item) => selectedIds.has(item.id));

  return (
    <div className="glass-container rounded-card p-5 sm:p-6 shadow-glass relative">
      {/* Toast Feedback Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl bg-ink text-white px-4 py-3 shadow-2xl animate-in slide-in-from-bottom-5 duration-200">
          <span className="grid size-6 place-items-center rounded-full bg-emerald-500 text-white">
            <Icon name="check" className="size-3.5" />
          </span>
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header Tabel */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-line/60 pb-5">
        <div>
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
        <div className="flex flex-wrap items-center gap-2">
          {formFields.length > 0 && (
            <button
              type="button"
              onClick={() => setIsCreateOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs shadow-brand-500/25 transition-all hover:shadow"
            >
              <Icon name="plus" className="size-4" />
              <span>Tambah Data</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleExportCSV}
            title="Ekspor ke CSV"
            className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-white/80 hover:bg-white px-3 py-2 text-xs font-semibold text-ink shadow-xs transition-colors backdrop-blur-xs"
          >
            <Icon name="download" className="size-4 text-muted" />
            <span className="hidden sm:inline">Ekspor</span>
          </button>

          <button
            type="button"
            onClick={resetAllFilters}
            title="Muat Ulang / Reset Filter"
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
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={searchPlaceholder}
            className="w-full rounded-xl border border-line bg-white/80 pl-9 pr-8 py-2 text-xs sm:text-sm text-ink placeholder:text-muted/70 backdrop-blur-xs transition-all focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
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
                onChange={(e) => {
                  setActiveFilters((prev) => ({
                    ...prev,
                    [String(filter.key)]: e.target.value,
                  }));
                  setCurrentPage(1);
                }}
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

          {(searchQuery || Object.values(activeFilters).some((v) => v !== "ALL")) && (
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
      {selectedIds.size > 0 && (
        <div className="mt-3 flex items-center justify-between rounded-xl bg-brand-50/90 border border-brand-200/80 px-4 py-2.5 text-xs text-brand-900 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="flex items-center gap-2 font-semibold">
            <span className="grid size-5 place-items-center rounded-full bg-brand-500 text-white text-[10px]">
              {selectedIds.size}
            </span>
            <span>baris terpilih dari halaman ini</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleBulkDelete}
              className="inline-flex items-center gap-1 rounded-lg bg-rose-600 hover:bg-rose-700 px-2.5 py-1 font-semibold text-white transition-colors"
            >
              <Icon name="trash" className="size-3" />
              <span>Hapus Terpilih</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedIds(new Set())}
              className="rounded-lg bg-white/80 px-2.5 py-1 font-medium text-ink hover:bg-white transition-colors"
            >
              Batal
            </button>
          </div>
        </div>
      )}

      {/* Tabel Data Responsif */}
      <div className="mt-4 overflow-x-auto rounded-xl border border-line/70 bg-white/50 backdrop-blur-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-line/70 bg-surface/70 text-xs font-semibold uppercase tracking-wider text-muted">
              <th className="w-10 px-4 py-3 text-center">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                  aria-label="Pilih semua baris"
                  className="size-4 rounded border-line text-brand-500 focus:ring-brand-500/20"
                />
              </th>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key)}
                  className={`px-4 py-3 select-none ${col.className || ""} ${
                    col.sortable ? "cursor-pointer hover:text-brand-600 transition-colors" : ""
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span>{col.header}</span>
                    {col.sortable && (
                      <span className="text-muted/60">
                        {sortConfig?.key === col.key ? (
                          sortConfig.direction === "asc" ? (
                            <Icon name="chevron-up" className="size-3.5 text-brand-600" />
                          ) : (
                            <Icon name="chevron-down" className="size-3.5 text-brand-600" />
                          )
                        ) : (
                          <Icon name="chevron-down" className="size-3 opacity-40" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line/60 text-xs sm:text-sm">
            {paginatedItems.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + 2}
                  className="px-4 py-12 text-center text-muted"
                >
                  <div className="flex flex-col items-center justify-center">
                    <span className="grid size-12 place-items-center rounded-2xl bg-brand-50 text-brand-500 mb-2 border border-brand-100">
                      <Icon name="inbox" className="size-6" />
                    </span>
                    <p className="font-semibold text-ink">Tidak ada data ditemukan</p>
                    <p className="text-xs text-muted mt-1 max-w-xs">
                      Coba ubah kata kunci pencarian atau reset filter untuk menampilkan kembali data.
                    </p>
                    {(searchQuery || Object.keys(activeFilters).length > 0) && (
                      <button
                        type="button"
                        onClick={resetAllFilters}
                        className="mt-3 rounded-xl bg-brand-500 hover:bg-brand-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs"
                      >
                        Reset Filter
                      </button>
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
                    <td className="w-10 px-4 py-3.5 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectRow(item.id)}
                        aria-label={`Pilih baris ${item.id}`}
                        className="size-4 rounded border-line text-brand-500 focus:ring-brand-500/20"
                      />
                    </td>
                    {columns.map((col) => (
                      <td key={col.key} className={`px-4 py-3.5 ${col.className || ""}`}>
                        {col.render
                          ? col.render(item)
                          : String(item[col.key as keyof T] ?? "-")}
                      </td>
                    ))}
                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {customRowActions && customRowActions(item)}

                        <button
                          type="button"
                          onClick={() => {
                            setDetailItem(item);
                            setIsDetailOpen(true);
                          }}
                          title="Lihat Detail"
                          className="grid size-8 place-items-center rounded-lg text-muted hover:bg-brand-50 hover:text-brand-600 transition-colors"
                        >
                          <Icon name="eye" className="size-4" />
                        </button>

                        {formFields.length > 0 && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditItem(item);
                              setIsEditOpen(true);
                            }}
                            title="Ubah Data"
                            className="grid size-8 place-items-center rounded-lg text-muted hover:bg-brand-50 hover:text-brand-600 transition-colors"
                          >
                            <Icon name="edit" className="size-4" />
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            setDeleteId(item.id);
                            setIsDeleteOpen(true);
                          }}
                          title="Hapus Data"
                          className="grid size-8 place-items-center rounded-lg text-muted hover:bg-rose-50 hover:text-rose-600 transition-colors"
                        >
                          <Icon name="trash" className="size-4" />
                        </button>
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
        <div className="flex items-center gap-2">
          <span>Menampilkan</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="rounded-lg border border-line bg-white/80 px-2 py-1 text-xs text-ink focus:border-brand-500 focus:outline-none"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <span>
            dari <strong className="text-ink">{sortedItems.length}</strong> total data
          </span>
        </div>

        <div className="flex items-center gap-1.5 self-center sm:self-auto">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="grid size-8 place-items-center rounded-lg border border-line bg-white/80 text-ink disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white transition-colors"
            aria-label="Halaman sebelumnya"
          >
            <Icon name="chevron-left" className="size-3.5" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => {
            // Tampilkan navigasi ringkas jika halaman > 5
            if (
              totalPages > 6 &&
              Math.abs(pg - currentPage) > 2 &&
              pg !== 1 &&
              pg !== totalPages
            ) {
              if (Math.abs(pg - currentPage) === 3) {
                return (
                  <span key={pg} className="px-1 text-muted">
                    ...
                  </span>
                );
              }
              return null;
            }

            const isActive = pg === currentPage;
            return (
              <button
                key={pg}
                type="button"
                onClick={() => setCurrentPage(pg)}
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
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="grid size-8 place-items-center rounded-lg border border-line bg-white/80 text-ink disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white transition-colors"
            aria-label="Halaman selanjutnya"
          >
            <Icon name="chevron-right" className="size-3.5" />
          </button>
        </div>
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
        data={detailItem}
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
        initialData={editItem as Record<string, unknown> | undefined}
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
    </div>
  );
}
