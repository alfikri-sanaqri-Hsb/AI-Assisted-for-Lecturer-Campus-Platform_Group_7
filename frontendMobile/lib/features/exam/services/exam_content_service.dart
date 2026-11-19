import '../models/exam_models.dart';

/// Sumber soal tryout dan latihan (data tiruan).
/// Soal pertama adalah contoh dari Figma; sisanya dibuat otomatis sebagai
/// pengisi. Ganti dengan data dari API soal nanti.
abstract final class ExamContentService {
  static const _letters = ['A', 'B', 'C', 'D', 'E'];

  static const _tryoutSpecs = <(String, int, double)>[
    ('Penalaran Umum', 30, 30),
    ('Pengetahuan & Pemahaman Umum', 20, 15),
    ('Pemahaman Bacaan & Menulis', 20, 25),
    ('Pengetahuan Kuantitatif', 20, 20),
    ('Literasi Bahasa Indonesia', 30, 42.5),
    ('Literasi Bahasa Inggris', 20, 20),
    ('Penalaran Matematika', 20, 42.5),
  ];

  static ExamQuestion _sample(String id) => ExamQuestion(
    id: id,
    topic: 'Penalaran deduktif • Soal ilustrasi',
    stimulus: 'Semua anggota klub riset mengikuti seminar. Sebagian siswa kelas XII adalah anggota klub riset.',
    prompt: 'Simpulan yang pasti benar adalah …',
    options: const [
      'Semua siswa kelas XII mengikuti seminar.',
      'Sebagian siswa kelas XII mengikuti seminar.',
      'Semua peserta seminar adalah siswa kelas XII.',
      'Tidak ada siswa kelas XII yang mengikuti seminar.',
      'Semua siswa kelas XII adalah anggota klub riset.',
    ],
    correctIndex: 1,
  );

  static List<ExamQuestion> _generate(
    String prefix,
    String subject,
    int count, {
    bool sampleFirst = false,
  }) {
    return [
      for (var i = 0; i < count; i++)
        if (i == 0 && sampleFirst)
          _sample('$prefix-$i')
        else
          ExamQuestion(
            id: '$prefix-$i',
            topic: subject,
            prompt: 'Contoh soal ${i + 1} untuk $subject (data tiruan).',
            options: [
              for (var k = 0; k < 5; k++)
                'Pilihan ${_letters[k]} untuk soal ${i + 1}',
            ],
            correctIndex: i % 5,
          ),
    ];
  }

  static ExamSession tryoutSession({required String title}) {
    return ExamSession(
      mode: ExamMode.tryout,
      title: title,
      subtests: [
        for (final (i, spec) in _tryoutSpecs.indexed)
          ExamSubtest(
            name: spec.$1,
            durationMinutes: spec.$3,
            questions: _generate('t$i', spec.$1, spec.$2, sampleFirst: i == 0),
          ),
      ],
    );
  }

  static ExamSession practiceSession({
    required String topic,
    int count = 10,
    double minutes = 15,
  }) {
    return ExamSession(
      mode: ExamMode.practice,
      title: 'Latihan: $topic',
      subtests: [
        ExamSubtest(
          name: topic,
          durationMinutes: minutes,
          questions: _generate('p', topic, count, sampleFirst: true),
        ),
      ],
    );
  }

  static ExamSession tryoutFromBackend({
    required String title,
    required int tryoutId,
    required int durationMinutes,
    required List<Map<String, dynamic>> rows,
  }) {
    final grouped = <String, List<ExamQuestion>>{};
    for (final row in rows) {
      final subject = '${row['subject'] ?? 'Tryout'}';
      grouped.putIfAbsent(subject, () => []).add(_backendQuestion(row));
    }
    final groups = grouped.entries.toList();
    final perGroupDuration = groups.isEmpty
        ? durationMinutes.toDouble()
        : durationMinutes / groups.length;
    return ExamSession(
      mode: ExamMode.tryout,
      title: title,
      backendTryoutId: tryoutId,
      subtests: [
        for (final entry in groups)
          ExamSubtest(
            name: entry.key,
            durationMinutes: perGroupDuration,
            questions: entry.value,
          ),
      ],
    );
  }

  static ExamSession practiceFromBackend({
    required String topic,
    required List<Map<String, dynamic>> rows,
  }) => ExamSession(
    mode: ExamMode.practice,
    title: 'Latihan: $topic',
    backendPractice: true,
    subtests: [
      ExamSubtest(
        name: topic,
        durationMinutes: 15,
        questions: rows.map(_backendQuestion).toList(),
      ),
    ],
  );

  static ExamQuestion _backendQuestion(Map<String, dynamic> row) {
    final options = [
      row['option_a'],
      row['option_b'],
      row['option_c'],
      row['option_d'],
    ].whereType<String>().toList();
    return ExamQuestion(
      id: '${row['id']}',
      topic: '${row['subject'] ?? ''}',
      prompt: '${row['question_text'] ?? 'Soal'}',
      stimulus: row['stimulus'] as String?,
      options: options,
      correctIndex: -1,
    );
  }
}
