import 'package:flutter/material.dart';
import '../constants/design_tokens.dart';

/// Baris abu muda di dalam kartu: judul + subjudul di kiri, aksi di kanan.
class AppInsetTile extends StatelessWidget {
  const AppInsetTile({
    super.key,
    required this.title,
    required this.subtitle,
    this.trailing,
    this.padding = const EdgeInsets.all(12),
  });

  final String title;
  final String subtitle;
  final Widget? trailing;
  final EdgeInsetsGeometry padding;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: padding,
      decoration: BoxDecoration(
        color: DS.background,
        borderRadius: BorderRadius.circular(10),
      ),
      child: Row(
        spacing: 8,
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              spacing: 2,
              children: [
                Text(title, style: DS.itemTitle.copyWith(fontSize: 14)),
                Text(subtitle, style: DS.caption),
              ],
            ),
          ),
          ?trailing,
        ],
      ),
    );
  }
}
