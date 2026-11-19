import 'package:flutter/material.dart';

import '../../../core/constants/design_tokens.dart';
import '../providers/exam_provider.dart';

/// Lembar bawah "Daftar Soal": nomor soal dengan status, ketuk untuk loncat.
Future<void> showQuestionPalette(BuildContext context, ExamProvider exam) {
  return showModalBottomSheet<void>(
    context: context,
    isScrollControlled: true,
    backgroundColor: Colors.white,
    shape: const RoundedRectangleBorder(
      borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
    ),
    builder: (sheet) => SafeArea(
      child: Padding(
        padding: const EdgeInsets.fromLTRB(16, 16, 16, 16),
        child: ListenableBuilder(
          listenable: exam,
          builder: (context, _) => Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            spacing: 16,
            children: [
              Text('Daftar Soal', style: DS.sectionTitle),
              const Wrap(
                spacing: 16,
                runSpacing: 8,
                children: [
                  _Legend(color: DS.primary, label: 'Terjawab'),
                  _Legend(color: DS.premiumText, label: 'Ragu-ragu'),
                  _Legend(color: DS.border, label: 'Belum dijawab'),
                ],
              ),
              Flexible(
                child: SingleChildScrollView(
                  child: Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: [
                      for (var i = 0; i < exam.subtest.questions.length; i++)
                        _NumberBox(
                          number: i + 1,
                          answered: exam.isAnsweredAt(i),
                          flagged: exam.isFlaggedAt(i),
                          current: i == exam.questionIndex,
                          onTap: () {
                            exam.goTo(i);
                            Navigator.of(sheet).pop();
                          },
                        ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    ),
  );
}

class _Legend extends StatelessWidget {
  const _Legend({required this.color, required this.label});

  final Color color;
  final String label;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      spacing: 6,
      children: [
        Container(
          width: 12,
          height: 12,
          decoration: BoxDecoration(color: color, shape: BoxShape.circle),
        ),
        Text(label, style: DS.caption),
      ],
    );
  }
}

class _NumberBox extends StatelessWidget {
  const _NumberBox({
    required this.number,
    required this.answered,
    required this.flagged,
    required this.current,
    required this.onTap,
  });

  final int number;
  final bool answered;
  final bool flagged;
  final bool current;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final Color bg = flagged
        ? DS.premiumText
        : answered
            ? DS.primary
            : DS.background;
    final fg = (flagged || answered) ? Colors.white : DS.textSecondary;

    return Material(
      color: bg,
      clipBehavior: Clip.antiAlias,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(8),
        side: BorderSide(
          color: current ? DS.primary : DS.border,
          width: current ? 2 : 1,
        ),
      ),
      child: InkWell(
        onTap: onTap,
        child: SizedBox(
          width: 44,
          height: 44,
          child: Center(
            child: Text(
              '$number',
              style: TextStyle(
                fontFamily: DS.fontFamily,
                fontSize: 13,
                fontWeight: FontWeight.w600,
                color: fg,
              ),
            ),
          ),
        ),
      ),
    );
  }
}
