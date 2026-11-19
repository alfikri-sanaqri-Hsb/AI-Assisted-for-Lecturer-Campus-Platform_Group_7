import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

import '../../../core/constants/design_tokens.dart';
import '../../../core/widgets/app_greeting_header.dart';
import '../../../core/widgets/app_hero_button.dart';
import '../../../core/widgets/app_hero_header.dart';
import '../../../app/app_nav.dart';
import '../../profile/providers/current_user_provider.dart';
import '../../profile/services/profile_content_service.dart';
import '../models/progress_models.dart';

/// Hero halaman Progress: header bergaya Home, judul, dan 2 aksi.
/// Latar memakai header_bg.jpeg (lewat AppHeroHeader).
class ProgressHero extends StatelessWidget {
  const ProgressHero({
    super.key,
    required this.data,
    this.onCreateNote,
    this.onOpenStats,
    this.onAvatarTap,
  });

  final ProgressData data;
  final VoidCallback? onCreateNote;
  final VoidCallback? onOpenStats;
  final VoidCallback? onAvatarTap;

  @override
  Widget build(BuildContext context) {
    final user = context.watch<CurrentUserProvider>();
    return AppHeroHeader(
      includeStatusBarPadding: true,
      contentSpacing: 10,
      children: [
        AppGreetingHeader(
          name: user.displayName,
          subtitle: user.displayUniversity,
          points: data.score,
          streak: data.streak,
          avatar: user.avatarBytes != null
              ? MemoryImage(user.avatarBytes!)
              : AssetImage(ProfileContentService.user.avatarAsset!),
          onAvatarTap: onAvatarTap,
          onUpgradeTap: () => AppNav.membership(context),
        ),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Lacak tryout, evaluasi kekuatan, dan catat langkah belajar berikutnya.',
              style: DS.body.copyWith(color: DS.onHeroMuted),
            ),
          ],
        ),
        Row(
          spacing: 8,
          children: [
            Expanded(
              child: AppHeroButton(
                label: 'Buat Catatan',
                icon: LucideIcons.penLine,
                onTap: onCreateNote,
              ),
            ),
            Expanded(
              child: AppHeroButton(
                label: 'Statistik',
                icon: LucideIcons.chartColumn,
                filled: true,
                onTap: onOpenStats,
              ),
            ),
          ],
        ),
      ],
    );
  }
}
