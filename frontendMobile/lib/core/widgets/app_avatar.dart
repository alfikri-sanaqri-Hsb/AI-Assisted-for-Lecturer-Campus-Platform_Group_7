import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../constants/design_tokens.dart';

/// Avatar bulat dengan cincin berwarna dan lencana opsional di kanan bawah.
/// Jika [image] kosong atau gagal dimuat, tampil ikon orang.
class AppAvatar extends StatelessWidget {
  const AppAvatar({
    super.key,
    this.image,
    this.size = 66,
    this.ringWidth = 4,
    this.ringColor = Colors.white,
    this.badge,
    this.onTap,
  });

  final ImageProvider? image;
  final double size;
  final double ringWidth;
  final Color ringColor;
  final Widget? badge;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    Widget placeholder() => const ColoredBox(
          color: DS.primarySoft,
          child: Center(
            child: Icon(LucideIcons.user, size: 24, color: DS.primary),
          ),
        );

    return GestureDetector(
      onTap: onTap,
      child: SizedBox(
        width: size,
        height: size,
        child: Stack(
          clipBehavior: Clip.none,
          children: [
            Positioned.fill(
              child: Container(
                padding: EdgeInsets.all(ringWidth),
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: ringColor,
                ),
                child: ClipOval(
                  child: image == null
                      ? placeholder()
                      : Image(
                          image: image!,
                          fit: BoxFit.cover,
                          errorBuilder: (context, error, stack) => placeholder(),
                        ),
                ),
              ),
            ),
            if (badge != null) Positioned(right: 0, bottom: 0, child: badge!),
          ],
        ),
      ),
    );
  }
}
