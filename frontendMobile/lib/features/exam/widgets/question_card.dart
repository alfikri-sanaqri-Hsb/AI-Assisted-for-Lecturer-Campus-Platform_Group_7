import 'package:flutter/material.dart';

import '../../../core/constants/design_tokens.dart';
import '../../../core/widgets/app_surface_card.dart';
import '../models/exam_models.dart';

/// Kartu soal: teks soal, lima pilihan jawaban, dan tanda ragu-ragu.
class QuestionCard extends StatelessWidget {
  const QuestionCard({
    super.key,
    required this.question,
    required this.selected,
    required this.flagged,
    required this.onSelect,
    required this.onToggleFlag,
  });

  static const _letters = ['A', 'B', 'C', 'D', 'E'];

  final ExamQuestion question;
  final int? selected;
  final bool flagged;
  final ValueChanged<int> onSelect;
  final VoidCallback onToggleFlag;

  @override
  Widget build(BuildContext context) {
    return AppSurfaceCard(
      spacing: 16,
      children: [
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          spacing: 12,
          children: [
            Text(question.topic,
                style: DS.caption.copyWith(fontSize: 11, height: 1.2)),
            if (question.stimulus != null)
              Text(
                question.stimulus!,
                style: DS.body.copyWith(height: 1.6, color: DS.textPrimary),
              ),
            Text(
              question.prompt,
              style: DS.body.copyWith(
                fontWeight: FontWeight.w500,
                height: 1.5,
                color: DS.textPrimary,
              ),
            ),
          ],
        ),
        Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          spacing: 8,
          children: [
            for (var i = 0; i < question.options.length; i++)
              _OptionTile(
                letter: _letters[i],
                text: question.options[i],
                selected: selected == i,
                onTap: () => onSelect(i),
              ),
          ],
        ),
        InkWell(
          onTap: onToggleFlag,
          borderRadius: BorderRadius.circular(8),
          child: ConstrainedBox(
            constraints: const BoxConstraints(minHeight: 44),
            child: Row(
              spacing: 10,
              children: [
                Container(
                  width: 22,
                  height: 22,
                  decoration: BoxDecoration(
                    color: flagged ? DS.premiumText : Colors.transparent,
                    borderRadius: BorderRadius.circular(4),
                    border: Border.all(
                      color: flagged ? DS.premiumText : DS.borderSoft,
                      width: 1.5,
                    ),
                  ),
                  child: flagged
                      ? const Icon(Icons.check, size: 16, color: Colors.white)
                      : null,
                ),
                Text(
                  'Ragu-ragu',
                  style: DS.body.copyWith(
                    fontSize: 13,
                    fontWeight: FontWeight.w500,
                    height: 1.2,
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}

class _OptionTile extends StatelessWidget {
  const _OptionTile({
    required this.letter,
    required this.text,
    required this.selected,
    required this.onTap,
  });

  final String letter;
  final String text;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: selected ? DS.primarySoft : Colors.white,
      clipBehavior: Clip.antiAlias,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(8),
        side: BorderSide(
          color: selected ? DS.primary : DS.borderSoft,
          width: selected ? 1.5 : 1,
        ),
      ),
      child: InkWell(
        onTap: onTap,
        child: ConstrainedBox(
          constraints: const BoxConstraints(minHeight: 56),
          child: Padding(
            padding: const EdgeInsets.all(12),
            child: Row(
              spacing: 12,
              children: [
                Container(
                  width: 28,
                  height: 28,
                  alignment: Alignment.center,
                  decoration: BoxDecoration(
                    color: selected ? DS.primary : Colors.white,
                    shape: BoxShape.circle,
                    border: Border.all(
                      color: selected ? DS.primary : DS.borderSoft,
                    ),
                  ),
                  child: Text(
                    letter,
                    style: TextStyle(
                      fontFamily: DS.fontFamily,
                      fontSize: 13,
                      fontWeight: selected ? FontWeight.w600 : FontWeight.w500,
                      color: selected ? Colors.white : DS.textSecondary,
                    ),
                  ),
                ),
                Expanded(
                  child: Text(
                    text,
                    style: TextStyle(
                      fontFamily: DS.fontFamily,
                      fontSize: 13,
                      height: 1.5,
                      fontWeight: selected ? FontWeight.w500 : FontWeight.w400,
                      color: selected ? DS.primary : DS.textPrimary,
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
}
