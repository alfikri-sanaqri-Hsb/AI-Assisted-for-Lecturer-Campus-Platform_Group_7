import 'package:flutter/material.dart';

import '../../../core/constants/design_tokens.dart';
import '../../../core/widgets/app_pill.dart';
import '../../../core/widgets/app_surface_card.dart';
import '../models/membership_models.dart';

/// Kartu ringkasan paket: nama, harga, durasi, dan fitur utama.
class MembershipSummaryCard extends StatelessWidget {
  const MembershipSummaryCard({
    super.key,
    required this.name,
    required this.description,
    required this.plan,
    required this.chips,
  });

  final String name;
  final String description;
  final MembershipPlan plan;
  final List<MembershipChip> chips;

  @override
  Widget build(BuildContext context) {
    return AppSurfaceCard(
      children: [
        Row(
          spacing: 12,
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                spacing: 4,
                children: [
                  Text(name, style: DS.sectionTitle),
                  Text(description, style: DS.body.copyWith(fontSize: 13)),
                ],
              ),
            ),
            const AppPill(
              label: 'Paket terpilih',
              padding: EdgeInsets.symmetric(horizontal: 10, vertical: 6),
            ),
          ],
        ),
        Row(
          spacing: 12,
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                spacing: 2,
                children: [
                  Text(
                    plan.priceLabel,
                    style: const TextStyle(
                      fontFamily: DS.fontFamily,
                      fontSize: 28,
                      fontWeight: FontWeight.w700,
                      color: DS.primary,
                    ),
                  ),
                  Text('Total untuk ${plan.durationLabel}', style: DS.caption),
                ],
              ),
            ),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: DS.background,
                borderRadius: BorderRadius.circular(10),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                spacing: 4,
                children: [
                  Text('Durasi',
                      style: DS.caption.copyWith(fontWeight: FontWeight.w500)),
                  Text(plan.durationLabel,
                      style: DS.itemTitle.copyWith(fontSize: 14)),
                ],
              ),
            ),
          ],
        ),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: [for (final c in chips) _FeatureChip(chip: c)],
        ),
      ],
    );
  }
}

class _FeatureChip extends StatelessWidget {
  const _FeatureChip({required this.chip});

  final MembershipChip chip;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
      decoration: BoxDecoration(
        color: DS.background,
        borderRadius: BorderRadius.circular(100),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        spacing: 8,
        children: [
          Icon(chip.icon, size: 16, color: DS.primary),
          Text(
            chip.label,
            style: DS.caption.copyWith(
              fontWeight: FontWeight.w500,
              color: DS.textPrimary,
              height: 1.2,
            ),
          ),
        ],
      ),
    );
  }
}
