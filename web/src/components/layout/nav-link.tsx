"use client";

// Satu-satunya Client Component di milestone ini: dibutuhkan karena
// penanda halaman aktif memerlukan usePathname().

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const base =
  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600";

export function NavLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  const pathname = usePathname() ?? "";
  const active = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`${base} ${
        active ? "bg-brand-50 text-brand-700" : "text-ink hover:bg-surface"
      }`}
    >
      {children}
    </Link>
  );
}
