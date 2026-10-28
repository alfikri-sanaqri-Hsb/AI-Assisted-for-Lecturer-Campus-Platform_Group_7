import 'package:flutter/material.dart';
import '../constants/design_tokens.dart';

/// Bilah putih di bawah layar (garis atas tipis) untuk aksi utama.
/// Otomatis menghormati area aman (gesture bar) perangkat.
class AppBottomActionBar extends StatelessWidget {
  const AppBottomActionBar({super.key, required this.children});

  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: Colors.white,
        border: Border(top: BorderSide(color: DS.borderSoft)),
      ),
      child: SafeArea(
        top: false,
        child: Padding(
          padding: const EdgeInsets.fromLTRB(16, 16, 16, 12),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            spacing: 12,
            children: children,
          ),
        ),
      ),
    );
  }
}
