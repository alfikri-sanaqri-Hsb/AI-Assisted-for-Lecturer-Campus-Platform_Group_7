/// Hasil satu tryout pada riwayat.
class TryoutResult {
  const TryoutResult({
    required this.label,
    required this.score,
    required this.status,
    this.dateLabel,
    this.summary,
    this.attemptId,
  });

  final String label; // "TO-5"
  final int score;
  final String status; // "Selesai"
  final String? dateLabel; // "17 September 2027 • 09.00–23.59 WIB"
  final String? summary; // "7 subtes • 160 soal • 195 menit"
  final int? attemptId;
}

/// Statistik satu subtes pada tryout terpilih.
class SubjectStat {
  const SubjectStat({
    required this.code,
    required this.topic,
    required this.value,
    required this.isStrong,
  });

  final String code; // "PK"
  final String topic; // "Operasi Bilangan"
  final double value; // 0.0 - 1.0
  final bool isStrong; // true = kekuatan, false = perlu ditingkatkan
}

/// Subtes yang bisa dibuka dari kartu "Akses Subtes".
class SubtestAccess {
  const SubtestAccess({required this.name, required this.summary});

  final String name;
  final String summary; // "20 soal • 20 menit"
}

/// Seluruh data yang dibutuhkan halaman Progress.
class ProgressData {
  const ProgressData({
    required this.userName,
    required this.university,
    required this.score,
    required this.streak,
    required this.latest,
    required this.history,
    required this.statsLabel,
    required this.stats,
    required this.subtests,
    this.notes = const [],
  });

  final String userName;
  final String university;
  final String score; // skor total yang sudah diformat, mis. "9,230"
  final int streak; // runtutan hari belajar

  final TryoutResult latest;
  final List<TryoutResult> history; // tryout sebelumnya

  final String statsLabel; // tryout yang statistiknya ditampilkan, "TO-5"
  final List<SubjectStat> stats;

  final List<SubtestAccess> subtests;
  final List<String> notes;

  int get tryoutCount => 1 + history.length;
}
