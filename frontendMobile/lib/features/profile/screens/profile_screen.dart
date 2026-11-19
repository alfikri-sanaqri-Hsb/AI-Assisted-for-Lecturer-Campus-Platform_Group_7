import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:provider/provider.dart';

import '../../../core/constants/design_tokens.dart';
import '../profile_actions.dart';
import '../models/profile_models.dart';
import '../providers/current_user_provider.dart';
import '../services/profile_content_service.dart';
import '../widgets/profile_hero.dart';
import '../widgets/profile_menu_card.dart';
import '../widgets/streak_card.dart';
import 'about_screen.dart';
import 'change_password_screen.dart';
import 'edit_profile_screen.dart';
import 'help_feedback_screen.dart';
import 'notification_settings_screen.dart';
import 'study_program_screen.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  void _open(BuildContext context, Widget page) {
    Navigator.of(context).push(MaterialPageRoute(builder: (_) => page));
  }

  @override
  Widget build(BuildContext context) {
    final account = context.watch<CurrentUserProvider>();
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

    return Scaffold(
      backgroundColor: DS.background,
      body: CustomScrollView(
        physics: const BouncingScrollPhysics(),
        slivers: [
          SliverAppBar(
            pinned: true,
            stretch: true,
            toolbarHeight: 0,
            collapsedHeight: 0,
            expandedHeight: 220,
            elevation: 0,
            backgroundColor: Colors.transparent,
            surfaceTintColor: Colors.transparent,
            automaticallyImplyLeading: false,
            systemOverlayStyle: SystemUiOverlayStyle.light.copyWith(
              statusBarColor: Colors.transparent,
            ),
            flexibleSpace: LayoutBuilder(
              builder: (context, constraints) {
                final top = MediaQuery.paddingOf(context).top;
                return Stack(
                  fit: StackFit.expand,
                  children: [
                    const DecoratedBox(
                      decoration: BoxDecoration(
                        image: DecorationImage(
                          image: AssetImage('assets/images/header_bg.jpeg'),
                          fit: BoxFit.cover,
                          alignment: Alignment.topCenter,
                        ),
                      ),
                    ),
                    Positioned(
                      top: top + 10,
                      left: 16,
                      right: 16,
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          IconButton(
                            tooltip: 'Kembali',
                            onPressed: () => Navigator.of(context).maybePop(),
                            icon: const Icon(
                              Icons.arrow_back,
                              color: Colors.white,
                              size: 30,
                            ),
                          ),
                          TextButton.icon(
                            onPressed: () => _open(
                              context,
                              const NotificationSettingsScreen(),
                            ),
                            icon: const Icon(
                              Icons.settings,
                              color: Colors.white,
                            ),
                            label: const Text(
                              'Pengaturan',
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 18,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    Positioned(
                      left: 0,
                      right: 0,
                      bottom: 0,
                      child: ProfileHero(
                        user: user,
                        onEditAvatar: () =>
                            _open(context, const EditProfileScreen()),
                      ),
                    ),
                  ],
                );
              },
            ),
          ),
          SliverToBoxAdapter(
            child: Padding(
              padding: EdgeInsets.fromLTRB(
                DS.screenPadding,
                16,
                DS.screenPadding,
                24 + MediaQuery.paddingOf(context).bottom,
              ),
              child: Column(
                spacing: 16,
                children: [
                  StreakCard(
                    streak: user.streak,
                    week: ProfileContentService.week,
                  ),
                  ProfileMenuCard(
                    title: 'Akun Saya',
                    entries: [
                      ProfileMenuEntry(
                        icon: LucideIcons.pencil,
                        label: 'Edit Profile Lengkap',
                        onTap: () => _open(context, const EditProfileScreen()),
                      ),
                      ProfileMenuEntry(
                        icon: LucideIcons.bookOpen,
                        label: 'Program Belajar',
                        onTap: () => _open(context, const StudyProgramScreen()),
                      ),
                    ],
                  ),
                  ProfileMenuCard(
                    title: 'Pengaturan & Keamanan',
                    entries: [
                      ProfileMenuEntry(
                        icon: LucideIcons.lock,
                        label: 'Ubah Password',
                        onTap: () =>
                            _open(context, const ChangePasswordScreen()),
                      ),
                      ProfileMenuEntry(
                        icon: LucideIcons.info,
                        label: 'Tentang Kami',
                        onTap: () => _open(context, const AboutScreen()),
                      ),
                      ProfileMenuEntry(
                        icon: LucideIcons.bell,
                        label: 'Notifikasi',
                        onTap: () =>
                            _open(context, const NotificationSettingsScreen()),
                      ),
                      ProfileMenuEntry(
                        icon: Icons.help_outline_rounded,
                        label: 'Bantuan dan Saran',
                        onTap: () => _open(context, const HelpFeedbackScreen()),
                      ),
                      ProfileMenuEntry(
                        icon: LucideIcons.logOut,
                        label: 'Log out',
                        destructive: true,
                        onTap: () => confirmLogout(context),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
