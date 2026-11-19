import 'package:flutter/material.dart';
import '../constants/design_tokens.dart';

enum AppActionVariant { filled, outlined, soft }

void _noop() {}

/// Tombol aksi: filled (biru), soft (biru muda), outlined (putih + border).
class AppActionButton extends StatelessWidget {
  const AppActionButton({
    super.key,
    required this.label,
    this.onPressed,
    this.variant = AppActionVariant.filled,
    this.height = 40,
    this.foreground,
    this.leading,
    this.trailing,
  });

  final String label;
  final VoidCallback? onPressed;
  final AppActionVariant variant;
  final double height;
  final Color? foreground; // warna teks varian outlined (default biru)
  final Widget? leading; // ikon di kiri teks
  final Widget? trailing; // ikon di kanan teks

  @override
  Widget build(BuildContext context) {
    final shape = RoundedRectangleBorder(borderRadius: BorderRadius.circular(8));
    final callback = onPressed ?? _noop;
    final Widget content = (leading == null && trailing == null)
        ? Text(label)
        : Row(
            mainAxisSize: MainAxisSize.min,
            spacing: 6,
            children: [?leading, Text(label), ?trailing],
          );

    final Widget button = switch (variant) {
      AppActionVariant.filled => ElevatedButton(
          onPressed: callback,
          style: ElevatedButton.styleFrom(
            elevation: 0,
            backgroundColor: DS.primary,
            foregroundColor: Colors.white,
            padding: EdgeInsets.zero,
            shape: shape,
            textStyle: DS.button,
          ),
          child: content,
        ),
      AppActionVariant.soft => ElevatedButton(
          onPressed: callback,
          style: ElevatedButton.styleFrom(
            elevation: 0,
            backgroundColor: DS.primarySoft,
            foregroundColor: DS.primary,
            padding: EdgeInsets.zero,
            shape: shape,
            textStyle: DS.button,
          ),
          child: content,
        ),
      AppActionVariant.outlined => OutlinedButton(
          onPressed: callback,
          style: OutlinedButton.styleFrom(
            backgroundColor: Colors.white,
            foregroundColor: foreground ?? DS.primary,
            side: const BorderSide(color: DS.border),
            padding: EdgeInsets.zero,
            shape: shape,
            textStyle: DS.button,
          ),
          child: content,
        ),
    };

    return SizedBox(height: height, child: button);
  }
}
