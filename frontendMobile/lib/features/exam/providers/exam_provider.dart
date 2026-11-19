import 'dart:async';

import 'package:flutter/foundation.dart';

import '../models/exam_models.dart';

/// State satu sesi ujian: soal aktif, jawaban, tanda ragu-ragu, dan timer.
class ExamProvider extends ChangeNotifier {
  ExamProvider(this.session) {
    _enterSubtest(0);
  }

  final ExamSession session;

  final Map<String, int> _answers = {};
  final Set<String> _flagged = {};

  int _subtestIndex = 0;
  int _questionIndex = 0;
  int _remaining = 0;
  Timer? _timer;
  bool _finished = false;

  ExamSubtest get subtest => session.subtests[_subtestIndex];
  ExamQuestion get question => subtest.questions[_questionIndex];

  int get subtestIndex => _subtestIndex;
  int get questionIndex => _questionIndex;
  int get remainingSeconds => _remaining;
  bool get finished => _finished;

  bool get isLastQuestion => _questionIndex == subtest.questions.length - 1;
  bool get isLastSubtest => _subtestIndex == session.subtests.length - 1;

  int? get selectedOption => _answers[question.id];
  bool get isFlagged => _flagged.contains(question.id);

  bool isAnsweredAt(int i) => _answers.containsKey(subtest.questions[i].id);
  bool isFlaggedAt(int i) => _flagged.contains(subtest.questions[i].id);

  int get answeredCount =>
      subtest.questions.where((q) => _answers.containsKey(q.id)).length;
  int get unansweredCount => subtest.questions.length - answeredCount;

  List<Map<String, dynamic>> get answerPayload {
    const letters = ['A', 'B', 'C', 'D', 'E'];
    return [
      for (final question in session.subtests.expand((item) => item.questions))
        {
          'question_id': int.tryParse(question.id),
          'selected_option': _answers[question.id] == null
              ? null
              : letters[_answers[question.id]!],
        },
    ];
  }

  void _enterSubtest(int index) {
    _subtestIndex = index;
    _questionIndex = 0;
    _remaining = subtest.durationSeconds;
    _timer?.cancel();
    _timer = Timer.periodic(const Duration(seconds: 1), _tick);
  }

  void _tick(Timer timer) {
    if (_remaining <= 1) {
      _remaining = 0;
      finishSubtest(); // waktu habis
    } else {
      _remaining--;
      notifyListeners();
    }
  }

  void select(int option) {
    _answers[question.id] = option;
    notifyListeners();
  }

  void toggleFlag() {
    final id = question.id;
    _flagged.contains(id) ? _flagged.remove(id) : _flagged.add(id);
    notifyListeners();
  }

  void next() {
    if (isLastQuestion) return;
    _questionIndex++;
    notifyListeners();
  }

  void previous() {
    if (_questionIndex == 0) return;
    _questionIndex--;
    notifyListeners();
  }

  void goTo(int index) {
    if (index < 0 || index >= subtest.questions.length) return;
    _questionIndex = index;
    notifyListeners();
  }

  /// Selesai subtes ini: lanjut ke subtes berikutnya atau akhiri ujian.
  void finishSubtest() {
    if (isLastSubtest) {
      _timer?.cancel();
      _finished = true;
    } else {
      _enterSubtest(_subtestIndex + 1);
    }
    notifyListeners();
  }

  ExamResult buildResult({
    Map<String, dynamic>? serverResult,
    String? syncWarning,
  }) {
    final serverTotal = int.tryParse(
      '${serverResult?['total_questions'] ?? serverResult?['total'] ?? ''}',
    );
    final serverCorrect = int.tryParse(
      '${serverResult?['correct_count'] ?? serverResult?['correct'] ?? ''}',
    );
    final serverScore = num.tryParse('${serverResult?['score'] ?? ''}')
        ?.round();
    final review = serverResult?['review'];
    final remoteAnswers = review is List
        ? review
              .whereType<Map>()
              .map((row) => Map<String, dynamic>.from(row))
              .toList()
        : <Map<String, dynamic>>[];
    return ExamResult(
      session: session,
      serverScore: serverScore,
      serverCorrect: serverCorrect,
      serverTotal: serverTotal,
      syncWarning: syncWarning,
      subtests: [
        for (final s in session.subtests)
          SubtestResult(
            name: s.name,
            total: s.questions.length,
            answered: remoteAnswers.isNotEmpty
                ? remoteAnswers
                      .where(
                        (row) =>
                            row['subject'] == s.name &&
                            row['selected_option'] != null,
                      )
                      .length
                : s.questions.where((q) => _answers.containsKey(q.id)).length,
            correct: remoteAnswers.isNotEmpty
                ? remoteAnswers
                      .where(
                        (row) =>
                            row['subject'] == s.name &&
                            row['is_correct'] == true,
                      )
                      .length
                : (session.backendPractice &&
                          s == session.subtests.first &&
                          serverCorrect != null
                      ? serverCorrect
                      : s.questions
                            .where((q) => _answers[q.id] == q.correctIndex)
                            .length),
          ),
      ],
    );
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }
}
