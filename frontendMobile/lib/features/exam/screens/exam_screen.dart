import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

import '../../../core/network/api_client.dart';
import '../../../core/widgets/app_action_button.dart';
import '../../../core/widgets/app_bottom_action_bar.dart';
import '../../../core/widgets/app_header_scaffold.dart';
import '../models/exam_models.dart';
import '../providers/exam_provider.dart';
import '../widgets/question_card.dart';
import '../widgets/question_header_row.dart';
import '../widgets/question_palette_sheet.dart';
import '../widgets/subtest_status_card.dart';
import 'exam_result_screen.dart';

/// Layar mengerjakan soal. Dipakai untuk Tryout dan Latihan Soal
/// (dibedakan oleh [ExamSession.mode]).
class ExamScreen extends StatefulWidget {
  const ExamScreen({super.key, required this.session});

  final ExamSession session;

  @override
  State<ExamScreen> createState() => _ExamScreenState();
}

class _ExamScreenState extends State<ExamScreen> {
  late final ExamProvider _exam = ExamProvider(widget.session);
  bool _navigated = false;
  bool _savingResult = false;

  @override
  void initState() {
    super.initState();
    _exam.addListener(_onChange);
  }

  @override
  void dispose() {
    _exam.removeListener(_onChange);
    _exam.dispose();
    super.dispose();
  }

  void _onChange() {
    if (!_exam.finished || _navigated) return;
    _navigated = true;
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted) return;
      _submitAndShowResult();
    });
  }

  Future<void> _submitAndShowResult() async {
    setState(() => _savingResult = true);
    Map<String, dynamic>? serverResult;
    String? warning;
    try {
      if (widget.session.backendTryoutId != null) {
        serverResult = _map(
          await ApiClient.postData(
            '/tryouts/${widget.session.backendTryoutId}/submit',
            body: {'answers': _exam.answerPayload},
          ),
        );
      } else if (widget.session.backendPractice) {
        serverResult = _map(
          await ApiClient.postData(
            '/practice/submit',
            body: {'answers': _exam.answerPayload},
          ),
        );
      }
    } catch (error) {
      warning = 'Hasil belum tersimpan ke server: $error';
    }
    final result = _exam.buildResult(
      serverResult: serverResult,
      syncWarning: warning,
    );
    if (!mounted) return;
    setState(() => _savingResult = false);
    Navigator.of(context).pushReplacement(
      MaterialPageRoute(builder: (_) => ExamResultScreen(result: result)),
    );
  }

  Map<String, dynamic> _map(dynamic value) {
    if (value is Map<String, dynamic>) return value;
    if (value is Map) return value.map((key, value) => MapEntry('$key', value));
    return <String, dynamic>{};
  }

  Future<void> _confirmExit() async {
    final ok = await showDialog<bool>(
      context: context,
      builder: (dialog) => AlertDialog(
        title: const Text('Keluar dari ujian?'),
        content: const Text('Jawabanmu belum dikirim dan akan hilang.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(dialog).pop(false),
            child: const Text('Lanjut mengerjakan'),
          ),
          TextButton(
            onPressed: () => Navigator.of(dialog).pop(true),
            child: const Text('Keluar'),
          ),
        ],
      ),
    );
    if (ok == true && mounted) Navigator.of(context).pop();
  }

  Future<void> _finishSubtest() async {
    final unanswered = _exam.unansweredCount;
    final last = _exam.isLastSubtest;

    final ok = await showDialog<bool>(
      context: context,
      builder: (dialog) => AlertDialog(
        title: Text(
          last ? 'Selesaikan ujian?' : 'Lanjut ke subtes berikutnya?',
        ),
        content: Text(
          [
            if (unanswered > 0)
              'Masih ada $unanswered soal yang belum dijawab.',
            if (!last) 'Kamu tidak bisa kembali ke subtes ini.',
            if (unanswered == 0 && last) 'Semua soal sudah dijawab.',
          ].join(' '),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(dialog).pop(false),
            child: const Text('Periksa lagi'),
          ),
          TextButton(
            onPressed: () => Navigator.of(dialog).pop(true),
            child: Text(last ? 'Selesai' : 'Lanjut'),
          ),
        ],
      ),
    );
    if (ok == true) _exam.finishSubtest();
  }

  @override
  Widget build(BuildContext context) {
    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, result) {
        if (!didPop) _confirmExit();
      },
      child: ListenableBuilder(
        listenable: _exam,
        builder: (context, _) {
          final last = _exam.isLastQuestion;
          final subtest = _exam.subtest;

          if (_savingResult) {
            return const Scaffold(
              body: Center(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    CircularProgressIndicator(),
                    SizedBox(height: 12),
                    Text('Menyimpan hasil...'),
                  ],
                ),
              ),
            );
          }

          return AppHeaderScaffold(
            title: widget.session.screenTitle,
            subtitle: widget.session.title,
            onBack: _confirmExit,
            bottomBar: AppBottomActionBar(
              children: [
                Row(
                  spacing: 12,
                  children: [
                    Expanded(
                      child: AppActionButton(
                        label: 'Sebelumnya',
                        variant: AppActionVariant.outlined,
                        height: 48,
                        leading: const Icon(LucideIcons.chevronLeft, size: 16),
                        onPressed: _exam.previous,
                      ),
                    ),
                    Expanded(
                      child: AppActionButton(
                        label: last
                            ? (_exam.isLastSubtest
                                  ? 'Selesai'
                                  : 'Subtes Berikutnya')
                            : 'Selanjutnya',
                        height: 48,
                        trailing: last
                            ? null
                            : const Icon(LucideIcons.chevronRight, size: 16),
                        onPressed: last ? _finishSubtest : _exam.next,
                      ),
                    ),
                  ],
                ),
              ],
            ),
            children: [
              SubtestStatusCard(
                subtestIndex: _exam.subtestIndex,
                subtestCount: widget.session.subtests.length,
                subtest: subtest,
                remainingSeconds: _exam.remainingSeconds,
                answered: _exam.answeredCount,
              ),
              QuestionHeaderRow(
                current: _exam.questionIndex + 1,
                total: subtest.questions.length,
                onOpenPalette: () => showQuestionPalette(context, _exam),
              ),
              QuestionCard(
                question: _exam.question,
                selected: _exam.selectedOption,
                flagged: _exam.isFlagged,
                onSelect: _exam.select,
                onToggleFlag: _exam.toggleFlag,
              ),
            ],
          );
        },
      ),
    );
  }
}
