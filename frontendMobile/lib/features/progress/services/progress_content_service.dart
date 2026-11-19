import '../models/progress_models.dart';

/// Sumber data halaman Progress.
/// Sekarang masih data tiruan (sesuai Figma). Nanti ganti dengan API /
/// Drift tanpa mengubah UI.
abstract final class ProgressContentService {
  static const data = ProgressData(
    userName: 'Fauzan',
    university: 'Universitas Gadjah Mada',
    score: '9.230', // format sama dengan header Home
    streak: 12,
    latest: TryoutResult(
      label: 'TO-5',
      score: 645,
      status: 'Selesai',
      dateLabel: '17 September 2027 • 09.00–23.59 WIB',
      summary: '7 subtes • 160 soal • 195 menit',
    ),
    history: [
      TryoutResult(label: 'TO-4', score: 634, status: 'Selesai'),
      TryoutResult(label: 'TO-3', score: 380, status: 'Selesai'),
    ],
    statsLabel: 'TO-5',
    stats: [
      SubjectStat(
        code: 'PK',
        topic: 'Operasi Bilangan',
        value: 1.0,
        isStrong: true,
      ),
      SubjectStat(
        code: 'PU',
        topic: 'Penalaran Induktif',
        value: 1.0,
        isStrong: true,
      ),
      SubjectStat(
        code: 'LBI',
        topic: 'Kalimat Baku dan Nonbaku',
        value: 0.82,
        isStrong: false,
      ),
      SubjectStat(
        code: 'PBM',
        topic: 'PUEBI / EYD V',
        value: 0.71,
        isStrong: false,
      ),
    ],
    subtests: [
      SubtestAccess(
        name: 'Pengetahuan Kuantitatif',
        summary: '20 soal • 20 menit',
      ),
      SubtestAccess(
        name: 'Penalaran Matematika',
        summary: '20 soal • 42,5 menit',
      ),
      SubtestAccess(name: 'Penalaran Umum', summary: '30 soal • 30 menit'),
    ],
  );
}
