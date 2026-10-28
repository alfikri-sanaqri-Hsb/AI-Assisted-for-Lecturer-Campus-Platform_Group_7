import '../models/tryout_detail.dart';
import '../models/tryout_models.dart';

/// Sumber data halaman Tryout.
/// Sekarang masih data tiruan. Nanti ganti dengan API / repository
/// tanpa mengubah UI.
abstract final class TryoutContentService {
  static const myTryout = MyTryout(
    title: 'Latihan Awal UTBK 2027',
    subtitle: 'Mandiri • bisa dikerjakan kapan saja',
    registeredCount: 1,
  );

  static final items = <TryoutItem>[
    TryoutItem(
      id: 'utbk-2027-02',
      title: 'Tryout UTBK 2027 #02 – SNBT',
      trackLabel: 'SNBT 2027',
      track: TryoutTrack.snbt,
      isPremium: false,
      startsAt: DateTime(2027, 9, 17, 9),
      endsAt: DateTime(2027, 9, 17, 23, 59),
      summary: '7 subtes • 160 soal • 195 menit',
      statusNote: 'Pendaftaran dibuka',
    ),
    TryoutItem(
      id: 'akbar-snbt-5',
      title: 'Tryout Akbar SNBT Vol. 5',
      trackLabel: 'SNBT 2027',
      track: TryoutTrack.snbt,
      isPremium: true,
      startsAt: DateTime(2027, 9, 20, 9),
      summary: '7 subtes • Pembahasan lengkap',
      statusNote: 'Termasuk dalam membership',
    ),
  ];

  // --- Detail tryout ---------------------------------------------------

  static const _utbkSubtests = <TryoutSubtest>[
    TryoutSubtest(name: 'Penalaran Umum', questions: 30, durationMinutes: 30),
    TryoutSubtest(
        name: 'Pengetahuan & Pemahaman Umum',
        questions: 20,
        durationMinutes: 15),
    TryoutSubtest(
        name: 'Pemahaman Bacaan & Menulis',
        questions: 20,
        durationMinutes: 25),
    TryoutSubtest(
        name: 'Pengetahuan Kuantitatif', questions: 20, durationMinutes: 20),
    TryoutSubtest(
        name: 'Literasi Bahasa Indonesia',
        questions: 30,
        durationMinutes: 42.5),
    TryoutSubtest(
        name: 'Literasi Bahasa Inggris', questions: 20, durationMinutes: 20),
    TryoutSubtest(
        name: 'Penalaran Matematika', questions: 20, durationMinutes: 42.5),
  ];

  static const _guidelines = <String>[
    'Siapkan koneksi stabil, kertas, dan alat tulis.',
    'Kerjakan satu kali; timer tetap berjalan saat keluar.',
    'Hasil dan pembahasan tersedia setelah selesai.',
  ];

  static const _description =
      'Simulasi UTBK dengan penilaian, analisis hasil, dan pembahasan untuk evaluasi belajarmu.';

  /// Membentuk data halaman detail dari item pada daftar.
  /// Versi premium belum ada di Figma, jadi teks/CTA-nya masih sementara.
  static TryoutDetail detailFor(TryoutItem item) {
    return TryoutDetail(
      title: item.title,
      trackLabel: item.track.label,
      statusLabel: item.isPremium ? 'Premium • Dibuka' : 'Gratis • Dibuka',
      isPremium: item.isPremium,
      scheduleLabel: item.scheduleRangeLabel,
      summary: item.summary,
      description: _description,
      subtests: _utbkSubtests, // TODO: ambil per tryout dari API
      guidelines: _guidelines,
      priceLabel: item.isPremium ? 'Membership' : 'Gratis',
      ctaLabel:
          item.isPremium ? 'Lihat Paket Membership' : 'Daftar Tryout Sekarang',
      ctaNote: item.isPremium
          ? 'Tryout ini termasuk dalam membership.'
          : 'Setelah terdaftar, tryout muncul di Tryout saya.',
    );
  }
}
