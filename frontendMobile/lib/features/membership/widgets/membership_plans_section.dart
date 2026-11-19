import 'package:flutter/material.dart';

import '../../../core/constants/design_tokens.dart';
import '../models/membership_models.dart';

/// "Pilih durasi": kartu paket yang bisa dipilih (2 per baris).
class MembershipPlansSection extends StatelessWidget {
  const MembershipPlansSection({
    super.key,
    required this.plans,
    required this.selectedIndex,
    required this.onSelected,
  });

  final List<MembershipPlan> plans;
  final int selectedIndex;
  final ValueChanged<int> onSelected;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      spacing: 12,
      children: [
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          spacing: 4,
          children: [
            const Text('Pilih durasi', style: DS.sectionTitle),
            Text(
              'Pilih paket yang sesuai dengan kebutuhan belajarmu.',
              style: DS.body.copyWith(fontSize: 13),
            ),
          ],
        ),
        for (var i = 0; i < plans.length; i += 2)
          IntrinsicHeight(
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              spacing: 12,
              children: [
                Expanded(
                  child: _PlanCard(
                    plan: plans[i],
                    selected: i == selectedIndex,
                    onTap: () => onSelected(i),
                  ),
                ),
                if (i + 1 < plans.length)
                  Expanded(
                    child: _PlanCard(
                      plan: plans[i + 1],
                      selected: i + 1 == selectedIndex,
                      onTap: () => onSelected(i + 1),
                    ),
                  ),
              ],
            ),
          ),
      ],
    );
  }
}

class _PlanCard extends StatelessWidget {
  const _PlanCard({
    required this.plan,
    required this.selected,
    required this.onTap,
  });

  final MembershipPlan plan;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: selected ? DS.primarySoft : DS.surface,
      elevation: 0,
      clipBehavior: Clip.antiAlias,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(DS.cardRadius),
        side: BorderSide(
          color: selected ? DS.primary : DS.borderSoft,
          width: selected ? 2 : 1,
        ),
      ),
      child: InkWell(
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            spacing: 8,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(plan.durationLabel,
                      style: DS.itemTitle.copyWith(fontSize: 14, height: 1.2)),
                  Text(
                    plan.priceLabel,
                    style: DS.caption.copyWith(
                      height: 1.2,
                      fontWeight: selected ? FontWeight.w600 : FontWeight.w400,
                      color: selected ? DS.primary : DS.textSecondary,
                    ),
                  ),
                ],
              ),
              Text(plan.description, style: DS.caption),
              if (selected)
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                  decoration: BoxDecoration(
                    color: DS.primary,
                    borderRadius: BorderRadius.circular(100),
                  ),
                  child: Text(
                    'Terpilih',
                    style: DS.label.copyWith(color: Colors.white),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}
