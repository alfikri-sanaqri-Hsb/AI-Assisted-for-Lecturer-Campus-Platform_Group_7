import 'package:flutter/material.dart';
import '../constants/design_tokens.dart';

enum AppPillTone { info, warning, success, successDark, premium, outline }

/// Label kecil berbentuk kapsul (badge / tombol kecil).
class AppPill extends StatelessWidget {
  const AppPill({
    super.key,
    required this.label,
    this.tone = AppPillTone.info,
    this.fontWeight = FontWeight.w600,
    this.onTap,
  });

  final String label;
  final AppPillTone tone;
  final FontWeight fontWeight;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final (Color bg, Color fg, Color? stroke) = switch (tone) {
      AppPillTone.info => (DS.primarySoft, DS.primary, null),
      AppPillTone.warning => (DS.warningSoft, DS.textSecondary, null),
      AppPillTone.success => (DS.successSoft, DS.success, null),
      AppPillTone.successDark => (DS.successSoft, DS.successDark, null),
      AppPillTone.premium => (DS.premiumSoft, DS.premiumText, null),
      AppPillTone.outline => (Colors.white, DS.primary, DS.border),
    };

    return Material(
      color: bg,
      clipBehavior: Clip.antiAlias,
      shape: StadiumBorder(
        side: stroke == null ? BorderSide.none : BorderSide(color: stroke),
      ),
      child: InkWell(
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
          child: Text(
            label,
            style: DS.label.copyWith(color: fg, fontWeight: fontWeight),
          ),
        ),
      ),
    );
  }
}
