import 'package:flutter/material.dart';
import '../constants/design_tokens.dart';

/// Kartu putih berborder dengan judul + badge di kanan.
/// Dipakai ulang di Study, Progress, Mentor, dsb.
class AppSectionCard extends StatelessWidget {
  const AppSectionCard({
    super.key,
    required this.title,
    required this.children,
    this.badge,
  });

  final String title;
  final Widget? badge;
  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(DS.cardPadding),
      decoration: BoxDecoration(
        color: DS.surface,
        border: Border.all(color: DS.border),
        borderRadius: BorderRadius.circular(DS.cardRadius),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        spacing: 12,
        children: [
          Row(
            spacing: 8,
            children: [
              Expanded(child: Text(title, style: DS.sectionTitle)),
              if (badge != null) badge!,
            ],
          ),
          ...children,
        ],
      ),
    );
  }
}