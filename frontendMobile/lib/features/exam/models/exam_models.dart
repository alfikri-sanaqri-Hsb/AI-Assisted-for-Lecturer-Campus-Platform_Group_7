enum ExamMode { tryout, practice }

class ExamQuestion {
  const ExamQuestion({
    required this.id,
    required this.topic,
    required this.prompt,
    required this.options,
    required this.correctIndex,
    this.stimulus,
  });

  final String id;
  final String topic; // contoh: "Penalaran deduktif • Soal ilustrasi"
  final String? stimulus; // teks/bacaan pendukung (opsional)
  final String prompt; // kalimat pertanyaan
  final List<String> options; // A, B, C, D, E
  final int correctIndex;
}

class ExamSubtest {
  const ExamSubtest({
    required this.name,
    required this.durationMinutes,
    required this.questions,
  });

  final String name;
  final double durationMinutes;
  final List<ExamQuestion> questions;

  int get durationSeconds => (durationMinutes * 60).round();

  /// Contoh: "30 soal • 30 menit" atau "30 soal • 42,5 menit"
  String get summary {
    final d = durationMinutes;
    final label = d == d.roundToDouble()
        ? d.toInt().toString()
        : d.toString().replaceAll('.', ',');
    return '${questions.length} soal • $label menit';
  }
}

class ExamSession {
  const ExamSession({
    required this.mode,
    required this.title,
    required this.subtests,
    this.backendTryoutId,
    this.backendPractice = false,
  });

  final ExamMode mode;
  final String title; // contoh: "Tryout UTBK 2027 #02 – SNBT"
  final List<ExamSubtest> subtests;
  final int? backendTryoutId;
  final bool backendPractice;

  String get screenTitle =>
      mode == ExamMode.tryout ? 'Kerjakan Tryout' : 'Latihan Soal';
  String get resultTitle =>
      mode == ExamMode.tryout ? 'Hasil Tryout' : 'Hasil Latihan';
}

class SubtestResult {
  const SubtestResult({
    required this.name,
    required this.total,
    required this.answered,
    required this.correct,
  });

  final String name;
  final int total;
  final int answered;
  final int correct;
}

class ExamResult {
  const ExamResult({
    required this.session,
    required this.subtests,
    this.serverScore,
    this.serverCorrect,
    this.serverTotal,
    this.syncWarning,
  });

  final ExamSession session;
  final List<SubtestResult> subtests;
  final int? serverScore;
  final int? serverCorrect;
  final int? serverTotal;
  final String? syncWarning;

  int get total => serverTotal ?? subtests.fold(0, (a, s) => a + s.total);
  int get answered => subtests.fold(0, (a, s) => a + s.answered);
  int get correct => serverCorrect ?? subtests.fold(0, (a, s) => a + s.correct);
  int get score =>
      serverScore ?? (total == 0 ? 0 : (correct / total * 100).round());
}
