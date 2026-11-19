import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../constants/design_tokens.dart';

/// Baris atas hero: nama pengguna (dua warna), lonceng notifikasi, dan skor.
class AppProfileTopBar extends StatelessWidget {
  const AppProfileTopBar({
    super.key,
    required this.name,
    required this.score,
    this.notificationCount = 0,
    this.onNotificationTap,
    this.onScoreTap,
  });

  final String name;
  final String score; // contoh: "9.230"
  final int notificationCount;
  final VoidCallback? onNotificationTap;
  final VoidCallback? onScoreTap;

  @override
  Widget build(BuildContext context) {
    // "Fauzan" -> "Fau" (putih) + "zan" (putih 80%)
    final split = (name.length / 2).ceil();
    const nameStyle = TextStyle(
      fontFamily: DS.fontFamily,
      fontSize: 24,
      fontWeight: FontWeight.w700,
    );

    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Row(
          spacing: 10,
          children: [
            const _GlassCircle(
              child: Icon(Icons.waving_hand_outlined,
                  size: 18, color: Colors.white),
            ),
            Row(
              spacing: 2,
              children: [
                Text(
                  name.substring(0, split),
                  style: nameStyle.copyWith(color: Colors.white),
                ),
                Text(
                  name.substring(split),
                  style: nameStyle.copyWith(color: DS.onHeroMuted),
                ),
              ],
            ),
          ],
        ),
        Row(
          spacing: 8,
          children: [
            _GlassCircle(
              onTap: onNotificationTap,
              child: Stack(
                clipBehavior: Clip.none,
                alignment: Alignment.center,
                children: [
                  const Icon(LucideIcons.bell, size: 18, color: Colors.white),
                  if (notificationCount > 0)
                    Positioned(
                      right: -4,
                      top: -4,
                      child: _CountBadge(count: notificationCount),
                    ),
                ],
              ),
            ),
            _ScoreChip(score: score, onTap: onScoreTap),
          ],
        ),
      ],
    );
  }
}

class _GlassCircle extends StatelessWidget {
  const _GlassCircle({required this.child, this.onTap});

  final Widget child;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: DS.glass,
      clipBehavior: Clip.antiAlias,
      shape: const CircleBorder(side: BorderSide(color: DS.glassBorder)),
      child: InkWell(
        onTap: onTap,
        child: SizedBox(width: 36, height: 36, child: Center(child: child)),
      ),
    );
  }
}

class _CountBadge extends StatelessWidget {
  const _CountBadge({required this.count});

  final int count;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 14,
      height: 14,
      alignment: Alignment.center,
      decoration: BoxDecoration(
        color: DS.amber,
        shape: BoxShape.circle,
        border: Border.all(color: Colors.white, width: 2),
      ),
      child: Text(
        count > 99 ? '99+' : '$count',
        maxLines: 1,
        overflow: TextOverflow.visible,
        softWrap: false,
        style: const TextStyle(
          fontFamily: DS.fontFamily,
          fontSize: 8,
          fontWeight: FontWeight.w700,
          color: DS.textPrimary,
        ),
      ),
    );
  }
}

class _ScoreChip extends StatelessWidget {
  const _ScoreChip({required this.score, this.onTap});

  final String score;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: DS.glass,
      clipBehavior: Clip.antiAlias,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(18),
        side: const BorderSide(color: DS.glassBorder),
      ),
      child: InkWell(
        onTap: onTap,
        child: SizedBox(
          height: 36,
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 12),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              spacing: 6,
              children: [
                const Icon(LucideIcons.award, size: 16, color: Colors.white),
                Text(
                  score,
                  style: const TextStyle(
                    fontFamily: DS.fontFamily,
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                    color: Colors.white,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
