enum TryoutTrack {
  snbt,
  mandiriPtn,
  kedinasan;

  String get label => switch (this) {
        TryoutTrack.snbt => 'SNBT/UTBK',
        TryoutTrack.mandiriPtn => 'Mandiri PTN',
        TryoutTrack.kedinasan => 'Kedinasan',
      };
}

enum TryoutAccessFilter {
  all,
  free,
  premium;

  String get label => switch (this) {
        TryoutAccessFilter.all => 'Semua',
        TryoutAccessFilter.free => 'Gratis',
        TryoutAccessFilter.premium => 'Premium',
      };

  bool matches({required bool isPremium}) => switch (this) {
        TryoutAccessFilter.all => true,
        TryoutAccessFilter.free => !isPremium,
        TryoutAccessFilter.premium => isPremium,
      };
}

/// Tryout yang sudah didaftarkan pengguna.
class MyTryout {
  const MyTryout({
    required this.title,
    required this.subtitle,
    required this.registeredCount,
  });

  final String title;
  final String subtitle;
  final int registeredCount;
}

/// Satu tryout pada daftar "Tryout tersedia".
class TryoutItem {
  const TryoutItem({
    required this.id,
    required this.title,
    required this.trackLabel,
    required this.track,
    required this.isPremium,
    required this.startsAt,
    required this.summary,
    required this.statusNote,
    this.endsAt,
  });

  final String id;
  final String title;
  final String trackLabel; // contoh: "SNBT 2027"
  final TryoutTrack track;
  final bool isPremium;
  final DateTime startsAt;
  final DateTime? endsAt;
  final String summary; // contoh: "7 subtes • 160 soal • 195 menit"
  final String statusNote; // contoh: "Pendaftaran dibuka"

  static const _months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
  ];

  static String _two(int n) => n.toString().padLeft(2, '0');
  static String _time(DateTime d) => '${_two(d.hour)}.${_two(d.minute)}';

  String get _date =>
      '${startsAt.day} ${_months[startsAt.month - 1]} ${startsAt.year}';

  /// Contoh: "17 September 2027 • 09.00 WIB"
  String get scheduleLabel => '$_date • ${_time(startsAt)} WIB';

  /// Contoh: "17 September 2027 • 09.00–23.59 WIB"
  /// (jika [endsAt] kosong, sama dengan [scheduleLabel]).
  String get scheduleRangeLabel {
    final end = endsAt;
    if (end == null) return scheduleLabel;
    return '$_date • ${_time(startsAt)}–${_time(end)} WIB';
  }
}
