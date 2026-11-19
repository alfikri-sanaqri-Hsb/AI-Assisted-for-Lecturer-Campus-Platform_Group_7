import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:provider/provider.dart';

import '../../../core/constants/design_tokens.dart';
import '../../../core/widgets/app_avatar.dart';
import '../../../core/widgets/app_pill.dart';
import '../models/profile_models.dart';
import '../profile_actions.dart';
import '../providers/current_user_provider.dart';
import '../services/profile_content_service.dart';

/// Menampilkan popup profil di bawah header. Panggil dari avatar di header
/// halaman utama mana pun:
///
///   onAvatarTap: () => showProfilePopup(context)
Future<void> showProfilePopup(BuildContext context) {
  final navigator = Navigator.of(context);
  final account = context.read<CurrentUserProvider>();
  final baseUser = ProfileContentService.user;
  final user = ProfileUser(
    name: account.displayName,
    university: account.displayUniversity,
    points: baseUser.points,
    streak: baseUser.streak,
    level: baseUser.level,
    xp: baseUser.xp,
    xpTarget: baseUser.xpTarget,
    avatarAsset: baseUser.avatarAsset,
    avatarBytes: account.avatarBytes,
    isPremium: account.isPremium,
  );

  return showGeneralDialog<void>(
    context: context,
    barrierDismissible: true,
    barrierLabel: 'Tutup',
    barrierColor: Colors.black54,
    transitionDuration: const Duration(milliseconds: 180),
    pageBuilder: (dialogContext, animation, secondaryAnimation) {
      return SafeArea(
        child: Align(
          alignment: Alignment.topCenter,
          child: Padding(
            padding: const EdgeInsets.fromLTRB(20, 64, 20, 0),
            child: ProfilePopup(
              user: user,
              onViewProfile: () {
                navigator.pop();
                openProfile(navigator);
              },
              onUpgrade: () {
                navigator.pop();
                openMembership(navigator);
              },
              onLogout: () {
                navigator.pop();
                confirmLogout(context);
              },
            ),
          ),
        ),
      );
    },
    transitionBuilder: (context, animation, secondaryAnimation, child) {
      final curved = CurvedAnimation(parent: animation, curve: Curves.easeOut);
      return FadeTransition(
        opacity: curved,
        child: ScaleTransition(
          alignment: Alignment.topCenter,
          scale: Tween<double>(begin: 0.96, end: 1).animate(curved),
          child: child,
        ),
      );
    },
  );
}

/// Isi popup: pengguna, tombol profil, kartu premium, dan keluar akun.
class ProfilePopup extends StatelessWidget {
  const ProfilePopup({
    super.key,
    required this.user,
    this.onViewProfile,
    this.onUpgrade,
    this.onLogout,
  });

  final ProfileUser user;
  final VoidCallback? onViewProfile;
  final VoidCallback? onUpgrade;
  final VoidCallback? onLogout;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.white,
      elevation: 8,
      borderRadius: BorderRadius.circular(20),
      clipBehavior: Clip.antiAlias,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          spacing: 16,
          children: [
            _UserRow(user: user),
            _OutlineAction(
              icon: Icons.manage_accounts_outlined,
              label: 'Lihat & Edit Profile',
              onTap: onViewProfile,
            ),
            if (!user.isPremium) _PremiumCard(onTap: onUpgrade),
            const Divider(height: 1, thickness: 1, color: DS.border),
            InkWell(
              onTap: onLogout,
              borderRadius: BorderRadius.circular(8),
              child: Padding(
                padding: const EdgeInsets.symmetric(vertical: 4),
                child: Row(
                  spacing: 8,
                  children: [
                    const Icon(LucideIcons.logOut, size: 20, color: DS.danger),
                    Text(
                      'Keluar Akun',
                      style: DS.itemTitle.copyWith(
                        fontSize: 15,
                        fontWeight: FontWeight.w500,
                        height: 1.45,
                        color: DS.danger,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _UserRow extends StatelessWidget {
  const _UserRow({required this.user});

  final ProfileUser user;

  @override
  Widget build(BuildContext context) {
    return Row(
      spacing: 12,
      children: [
        AppAvatar(
          size: 52,
          ringWidth: 3,
          ringColor: DS.border,
          image: user.avatarBytes != null
              ? MemoryImage(user.avatarBytes!)
              : user.avatarAsset == null
              ? null
              : AssetImage(user.avatarAsset!),
        ),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            spacing: 4,
            children: [
              Text(user.name, style: DS.itemTitle.copyWith(fontSize: 18)),
              Row(
                spacing: 8,
                children: [
                  AppPill(
                    label: user.isPremium ? 'Premium' : 'Free',
                    tone: user.isPremium
                        ? AppPillTone.premium
                        : AppPillTone.warning,
                    padding: const EdgeInsets.symmetric(
                      horizontal: 8,
                      vertical: 2,
                    ),
                  ),
                  Flexible(
                    child: Text(
                      user.university,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: DS.caption.copyWith(
                        fontWeight: FontWeight.w500,
                        color: DS.primary,
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class _OutlineAction extends StatelessWidget {
  const _OutlineAction({required this.icon, required this.label, this.onTap});

  final IconData icon;
  final String label;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.white,
      clipBehavior: Clip.antiAlias,
      shape: const StadiumBorder(
        side: BorderSide(color: DS.primary, width: 1.5),
      ),
      child: InkWell(
        onTap: onTap,
        child: SizedBox(
          height: 46,
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            spacing: 8,
            children: [
              Icon(icon, size: 20, color: DS.primary),
              Text(
                label,
                style: DS.button.copyWith(fontSize: 15, color: DS.primary),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _PremiumCard extends StatelessWidget {
  const _PremiumCard({this.onTap});

  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    const white = TextStyle(fontFamily: DS.fontFamily, color: Colors.white);

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(14),
        gradient: const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [DS.accent, DS.primary],
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        spacing: 4,
        children: [
          Row(
            spacing: 6,
            children: [
              Text(
                'Langganan Premium',
                style: white.copyWith(
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                ),
              ),
              const Icon(Icons.diamond_outlined, size: 16, color: Colors.white),
            ],
          ),
          Text(
            'Akses Penuh Tanpa Batas!',
            style: white.copyWith(
              fontSize: 18,
              fontWeight: FontWeight.w700,
              height: 1.3,
            ),
          ),
          Text(
            'Belum Berlangganan',
            style: white.copyWith(fontSize: 13, color: DS.onHeroMuted),
          ),
          const SizedBox(height: 8),
          Material(
            color: Colors.white,
            clipBehavior: Clip.antiAlias,
            shape: const StadiumBorder(),
            child: InkWell(
              onTap: onTap,
              child: SizedBox(
                height: 44,
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  spacing: 8,
                  children: [
                    const Icon(LucideIcons.crown, size: 18, color: DS.primary),
                    Text(
                      'Akses Penuh Tanpa Batas!',
                      style: DS.button.copyWith(
                        fontWeight: FontWeight.w700,
                        color: DS.textPrimary,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
