import 'package:flutter/material.dart';

import '../../../core/constants/design_tokens.dart';
import '../../../core/widgets/app_clock_badge.dart';
import '../../../core/widgets/app_progress_bar.dart';
import '../../../core/widgets/app_surface_card.dart';
import '../models/exam_models.dart';

/// Kartu status subtes: nama, sisa waktu, dan progres jawaban.
class SubtestStatusCard extends StatelessWidget {
  const SubtestStatusCard({
    super.key,
    required this.subtestIndex,
    required this.subtestCount,
    required this.subtest,
    required this.remainingSeconds,
    required this.answered,
  });

  final int subtestIndex;
  final int subtestCount;
  final ExamSubtest subtest;
  final int remainingSeconds;
  final int answered;

  String get _clock {
    final m = (remainingSeconds ~/ 60).toString().padLeft(2, '0');
    final s = (remainingSeconds % 60).toString().padLeft(2, '0');
    return '$m:$s';
  }

  @override
  Widget build(BuildContext context) {
    final total = subtest.questions.length;
    final urgent = remainingSeconds < 60;

    return AppSurfaceCard(
      children: [
        Row(
          spacing: 12,
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                spacing: 3,
                children: [
                  Text(
                    'Subtes ${subtestIndex + 1} dari $subtestCount',
                    style: DS.caption.copyWith(fontSize: 11, height: 1.2),
                  ),
                  Text(subtest.name,
                      style: DS.itemTitle.copyWith(height: 1.2)),
                  Text(subtest.summary,
                      style: DS.caption.copyWith(height: 1.2)),
                ],
              ),
            ),
            Column(
              spacing: 4,
              children: [
                Text('Sisa waktu subtes',
                    style: DS.caption.copyWith(fontSize: 10, height: 1.2)),
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                  decoration: BoxDecoration(
                    color: urgent ? DS.dangerSoft : DS.primarySoft,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    spacing: 6,
                    children: [
                      const AppClockBadge(),
                      Text(
                        _clock,
                        style: TextStyle(
                          fontFamily: DS.fontFamily,
                          fontSize: 18,
                          fontWeight: FontWeight.w600,
                          color: urgent ? DS.danger : DS.primary,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ],
        ),
        Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          spacing: 8,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  '$answered dari $total soal terjawab',
                  style: DS.label.copyWith(fontWeight: FontWeight.w500),
                ),
                Text('${total - answered} tersisa',
                    style: DS.caption.copyWith(fontSize: 11, height: 1.2)),
              ],
            ),
            AppProgressBar(
              value: total == 0 ? 0 : answered / total,
              showLabel: false,
              height: 6,
            ),
          ],
        ),
      ],
    );
  }
}
