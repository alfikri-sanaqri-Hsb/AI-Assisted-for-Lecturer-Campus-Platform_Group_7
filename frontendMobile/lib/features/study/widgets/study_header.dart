import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../../app/app_nav.dart';
import '../../../core/widgets/app_greeting_header.dart';
import '../../profile/providers/current_user_provider.dart';
import '../../profile/services/profile_content_service.dart';
import '../../profile/widgets/profile_popup.dart';

class StudyHeader extends StatelessWidget {
  const StudyHeader({super.key});

  @override
  Widget build(BuildContext context) {
    final user = context.watch<CurrentUserProvider>();
    return AppGreetingHeader(
      name: user.displayName,
      subtitle: user.displayUniversity,
      points: '9.230',
      streak: 12,
      avatar: user.avatarBytes != null
          ? MemoryImage(user.avatarBytes!)
          : AssetImage(ProfileContentService.user.avatarAsset!),
      onAvatarTap: () => showProfilePopup(context),
      onUpgradeTap: () => AppNav.membership(context),
    );
  }
}
