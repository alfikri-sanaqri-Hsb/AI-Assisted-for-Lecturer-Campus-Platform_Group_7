import 'package:flutter/material.dart';

import '../../../core/constants/design_tokens.dart';
import '../../../core/widgets/app_pill.dart';
import '../../../core/widgets/app_section_card.dart';
import '../models/study_models.dart';

class QuickAccessSection extends StatelessWidget {
  const QuickAccessSection({
    super.key,
    required this.items,
    this.onItemTap,
  });

  final List<QuickAccessItem> items;
  final ValueChanged<QuickAccessItem>? onItemTap;

  @override
  Widget build(BuildContext context) {
    return AppSectionCard(
      title: 'Akses Cepat',
      badge: AppPill(label: '${items.length} Fitur'),
      children: [
        for (var i = 0; i < items.length; i += 2)
          Row(
            spacing: 8,
            children: [
              Expanded(child: _tile(items[i])),
              Expanded(
                child: i + 1 < items.length
                    ? _tile(items[i + 1])
                    : const SizedBox.shrink(),
              ),
            ],
          ),
      ],
    );
  }

  Widget _tile(QuickAccessItem item) {
    return Material(
      color: DS.background,
      clipBehavior: Clip.antiAlias,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(DS.cardRadius),
        side: const BorderSide(color: DS.border),
      ),
      child: InkWell(
        onTap: onItemTap == null ? null : () => onItemTap!(item),
        child: SizedBox(
          height: 58,
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 12),
            child: Row(
              spacing: 8,
              children: [
                Icon(item.icon, size: 20, color: DS.primary),
                Expanded(
                  child: Text(
                    item.label,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: DS.button.copyWith(color: DS.textPrimary),
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
