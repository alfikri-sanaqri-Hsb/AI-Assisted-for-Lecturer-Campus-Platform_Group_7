import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

import '../../../core/constants/design_tokens.dart';
import '../../../core/widgets/app_avatar.dart';
import '../models/profile_models.dart';

/// Hero halaman Profil: avatar, nama, kampus, dan bar XP.
class ProfileHero extends StatelessWidget {
  const ProfileHero({
    super.key,
    required this.user,
    this.onBack,
    this.onEditAvatar,
  });

  final ProfileUser user;
  final VoidCallback? onBack;
  final VoidCallback? onEditAvatar;

  static TextStyle _text(double size, FontWeight weight) => TextStyle(
    fontFamily: DS.fontFamily,
    fontSize: size,
    fontWeight: weight,
    color: Colors.white,
    height: 1.2,
  );

  @override
  Widget build(BuildContext context) {
    // Bar tetap terlihat saat XP masih 0 (sama seperti Figma).
    final fraction = math.max(0.13, user.xp / user.xpTarget).clamp(0.0, 1.0);

    return Padding(
      padding: const EdgeInsets.fromLTRB(24, 0, 24, 24),
      child: Row(
        spacing: 14,
        children: [
          AppAvatar(
            size: 68,
            ringWidth: 4,
            ringColor: const Color(0xFFE3E3E3),
            image: user.avatarBytes != null
                ? MemoryImage(user.avatarBytes!)
                : user.avatarAsset == null
                ? null
                : AssetImage(user.avatarAsset!),
            badge: GestureDetector(
              onTap: onEditAvatar,
              child: Container(
                width: 22,
                height: 22,
                alignment: Alignment.center,
                decoration: BoxDecoration(
                  color: DS.accent,
                  shape: BoxShape.circle,
                  border: Border.all(color: Colors.white, width: 2),
                ),
                child: const Icon(
                  LucideIcons.pencil,
                  size: 10,
                  color: Colors.white,
                ),
              ),
            ),
          ),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  user.name,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: _text(20, FontWeight.w500),
                ),
                Text(
                  user.university,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: _text(14, FontWeight.w400),
                ),
                const SizedBox(height: 6),
                Container(
                  height: 3,
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.4),
                    borderRadius: BorderRadius.circular(5),
                  ),
                  child: FractionallySizedBox(
                    alignment: Alignment.centerLeft,
                    widthFactor: fraction,
                    child: DecoratedBox(
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(5),
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 4),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('Lv ${user.level}', style: _text(10, FontWeight.w400)),
                    Text(
                      '${user.xp} / ${user.xpTarget} xp',
                      style: _text(10, FontWeight.w400),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
