import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sahabat Alfary | Platform Persiapan UTBK-SNBT",
  description:
    "Platform terpadu bimbingan belajar, bank soal, dan paket tryout UTBK-SNBT Sahabat Alfary.",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans bg-surface text-ink">
        {children}
      </body>
    </html>
  );
}
