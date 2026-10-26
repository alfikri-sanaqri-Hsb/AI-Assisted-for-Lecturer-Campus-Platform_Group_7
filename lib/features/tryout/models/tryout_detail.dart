/// Satu subtes pada halaman Detail Tryout.
class TryoutSubtest {
  const TryoutSubtest({
    required this.name,
    required this.questions,
    required this.durationMinutes,
  });

  final String name;
  final int questions;
  final double durationMinutes;

  /// Contoh: "30 soal • 30 menit" atau "30 soal • 42,5 menit"
  String get summary {
    final d = durationMinutes;
    final duration = d == d.roundToDouble()
        ? d.toInt().toString()
        : d.toString().replaceAll('.', ',');
    return '$questions soal • $duration menit';
  }
}

/// Seluruh data yang ditampilkan di halaman Detail Tryout.
class TryoutDetail {
  const TryoutDetail({
    required this.title,
    required this.trackLabel,
    required this.statusLabel,
    required this.isPremium,
    required this.scheduleLabel,
    required this.summary,
    required this.description,
    required this.subtests,
    required this.guidelines,
    required this.priceLabel,
    required this.ctaLabel,
    required this.ctaNote,
  });

  final String title;
  final String trackLabel; // "SNBT/UTBK"
  final String statusLabel; // "Gratis • Dibuka"
  final bool isPremium;
  final String scheduleLabel;
  final String summary; // "7 subtes • 160 soal • 195 menit"
  final String description;
  final List<TryoutSubtest> subtests;
  final List<String> guidelines;
  final String priceLabel; // "Gratis"
  final String ctaLabel; // "Daftar Tryout Sekarang"
  final String ctaNote;
}
