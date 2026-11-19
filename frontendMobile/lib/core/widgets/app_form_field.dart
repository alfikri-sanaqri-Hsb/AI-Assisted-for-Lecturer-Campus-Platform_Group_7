import 'package:flutter/material.dart';
import '../constants/design_tokens.dart';

/// Kolom isian: label di atas + kotak berborder (radius 8).
class AppFormField extends StatelessWidget {
  const AppFormField({
    super.key,
    required this.label,
    this.controller,
    this.hint,
    this.obscureText = false,
    this.keyboardType,
    this.readOnly = false,
    this.onTap,
    this.suffix,
  });

  final String label;
  final TextEditingController? controller;
  final String? hint;
  final bool obscureText;
  final TextInputType? keyboardType;
  final bool readOnly;
  final VoidCallback? onTap;
  final Widget? suffix;

  static OutlineInputBorder _border(Color color) => OutlineInputBorder(
        borderRadius: BorderRadius.circular(8),
        borderSide: BorderSide(color: color),
      );

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      spacing: 8,
      children: [
        Text(
          label,
          style: DS.body.copyWith(
            fontWeight: FontWeight.w500,
            color: DS.textPrimary,
          ),
        ),
        TextField(
          controller: controller,
          obscureText: obscureText,
          keyboardType: keyboardType,
          readOnly: readOnly,
          onTap: onTap,
          style: DS.body.copyWith(color: DS.textPrimary),
          decoration: InputDecoration(
            hintText: hint,
            hintStyle: DS.body,
            isDense: true,
            filled: true,
            fillColor: DS.background,
            suffixIcon: suffix,
            contentPadding:
                const EdgeInsets.symmetric(horizontal: 12, vertical: 14),
            border: _border(DS.border),
            enabledBorder: _border(DS.border),
            focusedBorder: _border(DS.primary),
          ),
        ),
      ],
    );
  }
}
