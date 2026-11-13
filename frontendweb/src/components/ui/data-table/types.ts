import type { ReactNode } from "react";

export type ColumnDef<T> = {
  key: string;
  header: string;
  sortable?: boolean;
  className?: string;
  render?: (row: T) => ReactNode;
};

export type FilterOption = {
  label: string;
  value: string;
};

export type FormField = {
  name: string;
  label: string;
  type: "text" | "number" | "select" | "textarea";
  options?: { label: string; value: string }[];
  placeholder?: string;
  required?: boolean;
  defaultValue?: string | number;
};
