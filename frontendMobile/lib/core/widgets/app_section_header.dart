import 'package:flutter/material.dart';
import '../constants/design_tokens.dart';
import 'app_icon_tile.dart';

/// Judul bagian: kotak ikon bulat 32 + teks 18 SemiBold.
class AppSectionHeader extends StatelessWidget {
  const AppSectionHeader({super.key, required this.icon, required this.title});

  final IconData icon;
  final String title;

  @override
  Widget build(BuildContext context) {
    return Row(
      spacing: 8,
      children: [
        AppIconTile(icon: icon, size: 32, iconSize: 18, radius: 16),
        Text(title, style: DS.sectionTitle.copyWith(height: 1.45)),
      ],
    );
  }
}
