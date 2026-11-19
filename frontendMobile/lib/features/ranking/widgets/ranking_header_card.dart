import 'dart:ui';

import 'package:flutter/material.dart';

class RankingHeaderCard extends StatelessWidget {
  const RankingHeaderCard({
    super.key,
    required this.isPractice,
    required this.rank,
    required this.total,
    required this.onModeChanged,
  });

  final bool isPractice;
  final int? rank;
  final int total;
  final ValueChanged<bool> onModeChanged;

  @override
  Widget build(BuildContext context) => Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      ClipRRect(
        borderRadius: BorderRadius.circular(16),
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 8, sigmaY: 8),
          child: Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
            decoration: BoxDecoration(
              color: const Color(0xFF007ACC).withValues(alpha: .32),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: Colors.white.withValues(alpha: .35)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Peringkat saya',
                  style: TextStyle(
                    color: Colors.white.withValues(alpha: .85),
                    fontSize: 12,
                  ),
                ),
                Text(
                  rank == null
                      ? 'Belum masuk peringkat'
                      : '#$rank dari $total peserta',
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 19,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
      const SizedBox(height: 10),
      Container(
        height: 40,
        padding: const EdgeInsets.all(3),
        decoration: BoxDecoration(
          color: Colors.black.withValues(alpha: .14),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: Colors.white.withValues(alpha: .25)),
        ),
        child: Row(
          children: [
            _ModeButton(
              label: 'Latihan Soal',
              selected: isPractice,
              onTap: () => onModeChanged(true),
            ),
            _ModeButton(
              label: 'Tryout',
              selected: !isPractice,
              onTap: () => onModeChanged(false),
            ),
          ],
        ),
      ),
    ],
  );
}

class _ModeButton extends StatelessWidget {
  const _ModeButton({
    required this.label,
    required this.selected,
    required this.onTap,
  });

  final String label;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) => Expanded(
    child: GestureDetector(
      onTap: onTap,
      child: Container(
        alignment: Alignment.center,
        decoration: BoxDecoration(
          color: selected ? Colors.white : Colors.transparent,
          borderRadius: BorderRadius.circular(9),
        ),
        child: Text(
          label,
          style: TextStyle(
            color: selected ? const Color(0xFF0088FF) : Colors.white,
            fontSize: 13,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
    ),
  );
}
