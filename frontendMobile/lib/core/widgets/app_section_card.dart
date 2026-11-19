import 'package:flutter/material.dart';
import '../constants/design_tokens.dart';

/// Kartu putih berborder dengan judul + badge di kanan.
/// Dipakai ulang di Study, Progress, Mentor, dsb.
/// [elevated] menambahkan bayangan tipis (dipakai halaman Progress).
class AppSectionCard extends StatelessWidget {
  const AppSectionCard({
    super.key,
    required this.title,
    required this.children,
    this.badge,
    this.elevated = false,
  });

  final String title;
  final Widget? badge;
  final List<Widget> children;
  final bool elevated;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(DS.cardPadding),
      decoration: BoxDecoration(
        color: DS.surface,
        border: Border.all(color: DS.border),
        borderRadius: BorderRadius.circular(DS.cardRadius),
        boxShadow: elevated ? DS.softShadow : null,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        spacing: 12,
        children: [
          Row(
            spacing: 8,
            children: [
              Expanded(child: Text(title, style: DS.sectionTitle)),
              ?badge,
            ],
          ),
          ...children,
        ],
      ),
    );
  }
}
