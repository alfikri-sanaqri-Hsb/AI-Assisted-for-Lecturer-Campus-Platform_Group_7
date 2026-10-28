import 'package:flutter/material.dart';
import '../constants/design_tokens.dart';
import 'app_icon_tile.dart';

/// Baris: [ikon] [judul + deskripsi] [trailing].
class AppListItem extends StatelessWidget {
  const AppListItem({
    super.key,
    required this.icon,
    required this.title,
    required this.subtitle,
    this.trailing,
    this.tileSize = 40,
    this.tileRadius = 10,
  });

  final IconData icon;
  final String title;
  final String subtitle;
  final Widget? trailing;
  final double tileSize;
  final double tileRadius;

  @override
  Widget build(BuildContext context) {
    return Row(
      spacing: 12,
      children: [
        AppIconTile(icon: icon, size: tileSize, radius: tileRadius),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            spacing: 4,
            children: [
              Text(title, style: DS.itemTitle),
              Text(subtitle, style: DS.caption),
            ],
          ),
        ),
        if (trailing != null) trailing!,
      ],
    );
  }
}