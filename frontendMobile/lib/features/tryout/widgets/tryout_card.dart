import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

import '../../../core/constants/design_tokens.dart';
import '../../../core/widgets/app_action_button.dart';
import '../../../core/widgets/app_info_row.dart';
import '../../../core/widgets/app_pill.dart';
import '../../../core/widgets/app_surface_card.dart';
import '../models/tryout_models.dart';

/// Kartu satu tryout pada daftar "Tryout tersedia".
class TryoutCard extends StatelessWidget {
  const TryoutCard({super.key, required this.item, this.onAction});

  final TryoutItem item;
  final VoidCallback? onAction;

  /// Letakkan hasil export "Logo SNBT" dari Figma di sini.
  static const _logoAsset = 'assets/images/logo_snbt.png';

  @override
  Widget build(BuildContext context) {
    final premium = item.isPremium;

    return AppSurfaceCard(
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            AppPill(label: item.trackLabel, fontWeight: FontWeight.w500),
            AppPill(
              label: premium ? 'Premium' : 'Gratis',
              tone: premium ? AppPillTone.premium : AppPillTone.successDark,
              fontWeight: FontWeight.w500,
            ),
          ],
        ),
        Row(
          spacing: 12,
          children: [
            const _TryoutLogo(asset: _logoAsset),
            Expanded(
              child: Text(item.title, style: DS.itemTitle.copyWith(height: 1.45)),
            ),
          ],
        ),
        AppInfoRow.icon(icon: LucideIcons.calendarDays, text: item.scheduleLabel),
        AppInfoRow.icon(icon: LucideIcons.clipboardList, text: item.summary),
        const Divider(height: 1, thickness: 1, color: DS.borderSoft),
        Text(item.statusNote, style: DS.caption),
        AppActionButton(
          label: premium ? 'Lihat detail' : 'Daftar tryout',
          variant: premium ? AppActionVariant.soft : AppActionVariant.filled,
          height: 48,
          onPressed: onAction,
        ),
      ],
    );
  }
}

class _TryoutLogo extends StatelessWidget {
  const _TryoutLogo({required this.asset});

  final String asset;

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(8),
      child: Image.asset(
        asset,
        width: 44,
        height: 44,
        fit: BoxFit.cover,
        // Cadangan jika file logo belum ditambahkan ke assets.
        errorBuilder: (context, error, stackTrace) => Container(
          width: 44,
          height: 44,
          color: DS.primarySoft,
          alignment: Alignment.center,
          child: const Icon(LucideIcons.bookOpen, size: 22, color: DS.primary),
        ),
      ),
    );
  }
}
