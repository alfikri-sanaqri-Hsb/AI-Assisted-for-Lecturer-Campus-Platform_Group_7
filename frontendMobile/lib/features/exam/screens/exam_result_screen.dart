import 'package:flutter/material.dart';

import '../../../core/constants/design_tokens.dart';
import '../../../core/widgets/app_action_button.dart';
import '../../../core/widgets/app_header_scaffold.dart';
import '../../../core/widgets/app_inset_tile.dart';
import '../../../core/widgets/app_pill.dart';
import '../../../core/widgets/app_section_card.dart';
import '../../../core/widgets/app_surface_card.dart';
import '../models/exam_models.dart';

/// Ringkasan hasil setelah ujian selesai.
class ExamResultScreen extends StatelessWidget {
  const ExamResultScreen({super.key, required this.result});

  final ExamResult result;

  @override
  Widget build(BuildContext context) {
    return AppHeaderScaffold(
      title: result.session.resultTitle,
      subtitle: result.session.title,
      children: [
        AppSurfaceCard(
          children: [
            if (result.syncWarning != null)
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: DS.dangerSoft,
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Text(
                  result.syncWarning!,
                  style: DS.caption.copyWith(color: DS.danger),
                ),
              ),
            Row(
              spacing: 12,
              children: [
                _Stat(label: 'Skor', value: '${result.score}'),
                _Stat(
                  label: 'Terjawab',
                  value: '${result.answered}/${result.total}',
                ),
                _Stat(label: 'Benar', value: '${result.correct}'),
              ],
            ),
            Text(
              result.serverCorrect != null || result.serverScore != null
                  ? 'Nilai akhir dihitung oleh server berdasarkan jawaban yang dikirim.'
                  : 'Skor berasal dari data contoh dan belum tersimpan ke ranking.',
              style: DS.caption,
            ),
          ],
        ),
        AppSectionCard(
          title: 'Per Subtes',
          badge: AppPill(label: '${result.subtests.length} subtes'),
          children: [
            Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              spacing: 8,
              children: [
                for (final s in result.subtests)
                  AppInsetTile(
                    title: s.name,
                    subtitle:
                        'Terjawab ${s.answered}/${s.total} • Benar ${s.correct}',
                    trailing: AppPill(
                      label: s.total == 0
                          ? '0%'
                          : '${(s.correct / s.total * 100).round()}%',
                    ),
                  ),
              ],
            ),
          ],
        ),
        AppActionButton(
          label: 'Selesai',
          height: 48,
          onPressed: () => Navigator.of(context).popUntil((r) => r.isFirst),
        ),
      ],
    );
  }
}

class _Stat extends StatelessWidget {
  const _Stat({required this.label, required this.value});

  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: DS.background,
          borderRadius: BorderRadius.circular(10),
        ),
        child: Column(
          spacing: 4,
          children: [
            Text(
              value,
              style: const TextStyle(
                fontFamily: DS.fontFamily,
                fontSize: 22,
                fontWeight: FontWeight.w700,
                color: DS.primary,
              ),
            ),
            Text(label, style: DS.caption),
          ],
        ),
      ),
    );
  }
}
