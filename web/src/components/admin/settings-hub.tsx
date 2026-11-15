"use client";

import { useState, useEffect } from "react";
import { Icon } from "@/components/ui/icon";
import { settingsService } from "@/services";
import type { AdminSettings, AuditLog } from "@/types";

export function AdminSettingsHub() {
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        const [sData, aData] = await Promise.all([
          settingsService.getAdminSettings(),
          settingsService.getAuditLogs(),
        ]);
        setSettings(sData);
        setAuditLogs(aData);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    try {
      const updated = await settingsService.updateAdminSettings(settings, "admin");
      setSettings(updated);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
      const freshLogs = await settingsService.getAuditLogs();
      setAuditLogs(freshLogs);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return <div className="p-8 text-center text-sm text-muted">Memuat pengaturan...</div>;
  }

  return (
    <div className="space-y-6">
      {savedSuccess && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800">
          <Icon name="check" className="size-4 text-emerald-600" />
          <span>Pengaturan platform berhasil disimpan ke repositori.</span>
        </div>
      )}

      {/* Formulir Konfigurasi Operasional */}
      <form onSubmit={handleSave} className="glass-container rounded-card p-5 sm:p-6 shadow-glass space-y-5">
        <div className="border-b border-line/60 pb-4">
          <h2 className="text-base font-bold text-ink">Preferensi Operasional Platform</h2>
          <p className="text-xs text-muted">Konfigurasi dasar sistem persiapan UTBK-SNBT Sahabat Alfary.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="setting-platform-name" className="block text-xs font-semibold text-ink mb-1">
              Nama Platform
            </label>
            <input
              id="setting-platform-name"
              type="text"
              value={settings.platformName}
              onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
              className="w-full rounded-xl border border-line bg-white/80 px-3 py-2 text-xs text-ink focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="setting-academic-year" className="block text-xs font-semibold text-ink mb-1">
              Tahun Ajaran / Target UTBK
            </label>
            <input
              id="setting-academic-year"
              type="text"
              value={settings.academicYear}
              onChange={(e) => setSettings({ ...settings, academicYear: e.target.value })}
              className="w-full rounded-xl border border-line bg-white/80 px-3 py-2 text-xs text-ink focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="setting-support-email" className="block text-xs font-semibold text-ink mb-1">
              Email Bantuan & Operasional
            </label>
            <input
              id="setting-support-email"
              type="email"
              value={settings.supportEmail}
              onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
              className="w-full rounded-xl border border-line bg-white/80 px-3 py-2 text-xs text-ink focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="setting-threshold" className="block text-xs font-semibold text-ink mb-1">
              Ambang Batas Deteksi Duplikasi Soal (%)
            </label>
            <input
              id="setting-threshold"
              type="number"
              min={30}
              max={100}
              value={settings.duplicateSimilarityThreshold}
              onChange={(e) => setSettings({ ...settings, duplicateSimilarityThreshold: Number(e.target.value) })}
              className="w-full rounded-xl border border-line bg-white/80 px-3 py-2 text-xs text-ink focus:border-brand-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="rounded-xl border border-line/60 bg-white/50 p-4 space-y-3">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-xs font-semibold text-ink">Buka Pendaftaran Akun Siswa Baru</p>
              <p className="text-[11px] text-muted">Izinkan calon peserta UTBK mendaftar mandiri melalui aplikasi mobile.</p>
            </div>
            <input
              type="checkbox"
              checked={settings.allowStudentRegistration}
              onChange={(e) => setSettings({ ...settings, allowStudentRegistration: e.target.checked })}
              className="size-4 rounded border-line text-brand-500 focus:ring-brand-500/20"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer border-t border-line/60 pt-3">
            <div>
              <p className="text-xs font-semibold text-ink">Notifikasi Otomatis Pengajuan Konten</p>
              <p className="text-[11px] text-muted">Kirim pemberitahuan ke panel Admin setiap kali mentor mengajukan materi baru.</p>
            </div>
            <input
              type="checkbox"
              checked={settings.notifyOnContentSubmission}
              onChange={(e) => setSettings({ ...settings, notifyOnContentSubmission: e.target.checked })}
              className="size-4 rounded border-line text-brand-500 focus:ring-brand-500/20"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer border-t border-line/60 pt-3">
            <div>
              <p className="text-xs font-semibold text-ink">Peringatan Otomatis Konflik Jadwal</p>
              <p className="text-[11px] text-muted">Aktifkan pencegahan bentrok jam tatap muka mentor secara real-time.</p>
            </div>
            <input
              type="checkbox"
              checked={settings.notifyOnScheduleConflict}
              onChange={(e) => setSettings({ ...settings, notifyOnScheduleConflict: e.target.checked })}
              className="size-4 rounded border-line text-brand-500 focus:ring-brand-500/20"
            />
          </label>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-line/60 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-brand-500 hover:bg-brand-600 px-5 py-2 text-xs font-semibold text-white shadow-xs transition-colors disabled:opacity-50"
          >
            {saving ? "Menyimpan..." : "Simpan Pengaturan"}
          </button>
        </div>
      </form>

      {/* Audit Log Sistem Terpadu */}
      <div className="glass-container rounded-card p-5 sm:p-6 shadow-glass space-y-4">
        <div className="border-b border-line/60 pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-ink">Audit Trail & Log Tindakan Sensitif</h2>
            <p className="text-xs text-muted">Pencatatan riwayat publikasi, penolakan, penonaktifan, dan perubahan kewenangan.</p>
          </div>
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-muted">
            {auditLogs.length} catatan
          </span>
        </div>

        <div className="divide-y divide-line/60 max-h-96 overflow-y-auto">
          {auditLogs.length === 0 ? (
            <p className="py-6 text-center text-xs text-muted">Belum ada riwayat tercatat.</p>
          ) : (
            auditLogs.map((log) => (
              <div key={log.id} className="py-3 text-xs leading-relaxed">
                <div className="flex items-center justify-between text-muted text-[11px]">
                  <span className="font-semibold text-brand-700">
                    {log.actorName} ({log.actorRole})
                  </span>
                  <span>{log.timestamp}</span>
                </div>
                <p className="font-bold text-ink mt-0.5">{log.action}: <span className="font-medium text-slate-700">{log.targetTitle}</span></p>
                <p className="text-muted mt-0.5">{log.details}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
