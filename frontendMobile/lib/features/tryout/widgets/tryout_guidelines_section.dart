import 'package:flutter/material.dart';

import '../../../core/constants/design_tokens.dart';
import '../../../core/widgets/app_surface_card.dart';

/// "Sebelum mulai" - langkah-langkah bernomor.
class TryoutGuidelinesSection extends StatelessWidget {
  const TryoutGuidelinesSection({super.key, required this.steps});

  final List<String> steps;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      spacing: 12,
      children: [
        Text('Sebelum mulai', style: DS.sectionTitle.copyWith(height: 1.45)),
        AppSurfaceCard(
          children: [
            for (final (i, step) in steps.indexed)
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                spacing: 12,
                children: [
                  _StepBadge(number: i + 1),
                  Expanded(child: Text(step, style: DS.body)),
                ],
              ),
          ],
        ),
      ],
    );
  }
}

class _StepBadge extends StatelessWidget {
  const _StepBadge({required this.number});

  final int number;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 24,
      height: 24,
      alignment: Alignment.center,
      decoration: BoxDecoration(
        color: DS.primarySoft,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Text('$number', style: DS.label),
    );
  }
}
