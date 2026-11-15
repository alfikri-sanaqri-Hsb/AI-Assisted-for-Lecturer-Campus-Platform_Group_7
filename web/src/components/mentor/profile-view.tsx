"use client";

import { useState, useEffect } from "react";
import { Icon } from "@/components/ui/icon";
import { settingsService } from "@/services";
import type { MentorProfile } from "@/types";

const ACTIVE_MENTOR_ID = "mnt-01";

export function MentorProfileView() {
  const [profile, setProfile] = useState<MentorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form ubah password simulasi
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await settingsService.getMentorProfile(ACTIVE_MENTOR_ID);
        setProfile(data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    try {
      const updated = await settingsService.updateMentorProfile(
        ACTIVE_MENTOR_ID,
        profile,
        "mentor"
      );
      setProfile(updated);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Konfirmasi kata sandi baru tidak cocok.");
      return;
    }
    setPasswordSuccess(true);
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setPasswordSuccess(false), 3500);
  };

  if (loading || !profile) {
    return <div className="p-8 text-center text-sm text-muted">Memuat profil mentor...</div>;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Kartu Profil Utama & Metrik Pengajaran */}
      <div className="lg:col-span-1 space-y-5">
        <div className="glass-container rounded-card p-6 shadow-glass text-center">
          <div className="relative mx-auto size-24">
            <span className="grid size-24 place-items-center rounded-3xl bg-brand-500 text-2xl font-bold text-white shadow-xl shadow-brand-500/25">
              {profile.name.slice(0, 2).toUpperCase()}
            </span>
            <span className="absolute bottom-0 right-0 grid size-7 place-items-center rounded-full bg-emerald-500 text-white ring-4 ring-white">
              <Icon name="check" className="size-4" />
            </span>
          </div>

          <h2 className="mt-4 text-base font-bold text-ink">{profile.name}</h2>
          <p className="text-xs text-brand-600 font-semibold">{profile.title}</p>
          <p className="text-xs text-muted mt-0.5">{profile.email}</p>

          <div className="mt-5 grid grid-cols-2 gap-3 border-t border-line/60 pt-4">
            <div className="rounded-xl bg-white/70 p-3 border border-line/60">
              <p className="text-lg font-bold text-brand-600">{profile.rating.toFixed(1)} ⭐</p>
              <p className="text-[11px] text-muted">Rating Siswa</p>
            </div>
            <div className="rounded-xl bg-white/70 p-3 border border-line/60">
              <p className="text-lg font-bold text-ink">{profile.totalStudentsAssisted}</p>
              <p className="text-[11px] text-muted">Siswa Didampingi</p>
            </div>
          </div>

          <div className="mt-5 text-left rounded-xl bg-brand-50/60 border border-brand-100 p-3 text-xs leading-relaxed text-brand-900">
            <p className="font-semibold text-brand-800">Spesialisasi Subtes UTBK:</p>
            <p className="mt-0.5">{profile.subject}</p>
          </div>
        </div>

        {/* Form Ubah Password Simulasi */}
        <div className="glass-container rounded-card p-5 shadow-glass space-y-4">
          <div className="border-b border-line/60 pb-3">
            <h3 className="font-bold text-ink text-sm">Keamanan Akun & Sandi</h3>
            <p className="text-xs text-muted">Perbarui kata sandi akun mentor Anda.</p>
          </div>

          {passwordSuccess && (
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 flex items-center gap-2">
              <Icon name="check" className="size-4 text-emerald-600" />
              <span>Kata sandi berhasil diperbarui (simulasi lokal).</span>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-3">
            <div>
              <label htmlFor="old-pass" className="block text-xs font-semibold text-ink mb-1">
                Kata Sandi Lama
              </label>
              <input
                id="old-pass"
                type="password"
                required
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-line bg-white/80 px-3 py-2 text-xs text-ink focus:border-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="new-pass" className="block text-xs font-semibold text-ink mb-1">
                Kata Sandi Baru
              </label>
              <input
                id="new-pass"
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimal 8 karakter..."
                className="w-full rounded-xl border border-line bg-white/80 px-3 py-2 text-xs text-ink focus:border-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="confirm-pass" className="block text-xs font-semibold text-ink mb-1">
                Konfirmasi Kata Sandi Baru
              </label>
              <input
                id="confirm-pass"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi kata sandi baru..."
                className="w-full rounded-xl border border-line bg-white/80 px-3 py-2 text-xs text-ink focus:border-brand-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-slate-900 hover:bg-black px-4 py-2 text-xs font-semibold text-white shadow-xs transition-colors"
            >
              Perbarui Kata Sandi
            </button>
          </form>
        </div>
      </div>

      {/* Formulir Edit Profil yang Diizinkan */}
      <div className="lg:col-span-2 space-y-5">
        <form onSubmit={handleSaveProfile} className="glass-container rounded-card p-5 sm:p-6 shadow-glass space-y-5">
          <div className="border-b border-line/60 pb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-ink">Informasi Profil Pengajar</h2>
              <p className="text-xs text-muted">Perbarui data kontak publik, biografi mengajar, dan jam ketersediaan bimbingan.</p>
            </div>
            {savedSuccess && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                <Icon name="check" className="size-3.5" />
                <span>Tersimpan</span>
              </span>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="mentor-name-input" className="block text-xs font-semibold text-ink mb-1">
                Nama Lengkap & Gelar Akademik
              </label>
              <input
                id="mentor-name-input"
                type="text"
                required
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full rounded-xl border border-line bg-white/80 px-3.5 py-2.5 text-xs text-ink focus:border-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="mentor-title-input" className="block text-xs font-semibold text-ink mb-1">
                Jabatan Pengajar / Kredensial
              </label>
              <input
                id="mentor-title-input"
                type="text"
                required
                value={profile.title}
                onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                className="w-full rounded-xl border border-line bg-white/80 px-3.5 py-2.5 text-xs text-ink focus:border-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="mentor-email-input" className="block text-xs font-semibold text-ink mb-1">
                Email Resmi Sahabat Alfary
              </label>
              <input
                id="mentor-email-input"
                type="email"
                disabled
                value={profile.email}
                className="w-full rounded-xl border border-line bg-slate-100 px-3.5 py-2.5 text-xs text-muted cursor-not-allowed"
              />
              <span className="text-[10px] text-muted">Email resmi dikelola oleh Admin.</span>
            </div>

            <div>
              <label htmlFor="mentor-phone-input" className="block text-xs font-semibold text-ink mb-1">
                Nomor Telepon / WhatsApp Konsultasi
              </label>
              <input
                id="mentor-phone-input"
                type="text"
                required
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full rounded-xl border border-line bg-white/80 px-3.5 py-2.5 text-xs text-ink focus:border-brand-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label htmlFor="mentor-bio-input" className="block text-xs font-semibold text-ink mb-1">
              Biografi Singkat & Pengalaman Mengajar
            </label>
            <textarea
              id="mentor-bio-input"
              rows={4}
              required
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              className="w-full rounded-xl border border-line bg-white/80 px-3.5 py-2.5 text-xs text-ink focus:border-brand-500 focus:outline-none leading-relaxed"
            />
          </div>

          <div>
            <label htmlFor="mentor-availability-input" className="block text-xs font-semibold text-ink mb-1">
              Catatan Ketersediaan Jadwal Bimbingan
            </label>
            <textarea
              id="mentor-availability-input"
              rows={3}
              value={profile.availabilityNotes}
              onChange={(e) => setProfile({ ...profile, availabilityNotes: e.target.value })}
              placeholder="Contoh: Tersedia hari Senin & Rabu pukul 15:00 - 18:00 WIB..."
              className="w-full rounded-xl border border-line bg-white/80 px-3.5 py-2.5 text-xs text-ink focus:border-brand-500 focus:outline-none leading-relaxed"
            />
            <span className="text-[10px] text-muted">
              Catatan ketersediaan ini menjadi referensi bagi Administrator saat menetapkan jadwal sesi bimbingan siswa.
            </span>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-line/60 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-brand-500 hover:bg-brand-600 px-5 py-2 text-xs font-semibold text-white shadow-xs transition-colors disabled:opacity-50"
            >
              {saving ? "Menyimpan Profil..." : "Simpan Perubahan Profil"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
