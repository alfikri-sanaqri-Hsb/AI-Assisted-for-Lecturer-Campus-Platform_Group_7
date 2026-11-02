import 'package:flutter/material.dart';
import '../constants/design_tokens.dart';

/// Baris informasi kecil: [ikon 16] [teks 12].
class AppInfoRow extends StatelessWidget {
  const AppInfoRow({super.key, required this.leading, required this.text});

  AppInfoRow.icon({super.key, required IconData icon, required this.text})
      : leading = Icon(icon, size: 16, color: DS.primary);

  final Widget leading;
  final String text;

  @override
  Widget build(BuildContext context) {
    return Row(
      spacing: 8,
      children: [
        leading,
        Expanded(child: Text(text, style: DS.caption)),
      ],
    );
  }
}
