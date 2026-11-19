import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

import '../../../core/constants/design_tokens.dart';
import '../../../core/widgets/app_icon_tile.dart';
import '../../../core/widgets/app_section_card.dart';

class ProfileMenuEntry {
  const ProfileMenuEntry({
    required this.icon,
    required this.label,
    this.onTap,
    this.destructive = false,
  });

  final IconData icon;
  final String label;
  final VoidCallback? onTap;
  final bool destructive; // merah (mis. Log out)
}

/// Kartu menu: judul + daftar baris [ikon] [label] [panah].
class ProfileMenuCard extends StatelessWidget {
  const ProfileMenuCard({super.key, required this.title, required this.entries});

  final String title;
  final List<ProfileMenuEntry> entries;

  @override
  Widget build(BuildContext context) {
    return AppSectionCard(
      title: title,
      children: [
        for (final (i, e) in entries.indexed) ...[
          if (i > 0) const Divider(height: 1, thickness: 1, color: DS.border),
          _MenuRow(entry: e),
        ],
      ],
    );
  }
}

class _MenuRow extends StatelessWidget {
  const _MenuRow({required this.entry});

  final ProfileMenuEntry entry;

  @override
  Widget build(BuildContext context) {
    final danger = entry.destructive;

    return InkWell(
      onTap: entry.onTap,
      borderRadius: BorderRadius.circular(8),
      child: Row(
        spacing: 12,
        children: [
          danger
              ? Container(
                  width: 32,
                  height: 32,
                  alignment: Alignment.center,
                  decoration: BoxDecoration(
                    color: DS.dangerSoft,
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Icon(entry.icon, size: 18, color: DS.danger),
                )
              : AppIconTile(icon: entry.icon, size: 32, iconSize: 18),
          Expanded(
            child: Text(
              entry.label,
              style: DS.itemTitle.copyWith(
                fontSize: 15,
                fontWeight: FontWeight.w500,
                height: 1.45,
                color: danger ? DS.danger : DS.textPrimary,
              ),
            ),
          ),
          if (!danger)
            const Icon(LucideIcons.chevronRight, size: 18, color: DS.textSecondary),
        ],
      ),
    );
  }
}
