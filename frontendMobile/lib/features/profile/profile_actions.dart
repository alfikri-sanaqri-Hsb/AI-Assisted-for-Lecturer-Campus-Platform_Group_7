import 'package:flutter/material.dart';

import '../auth/screens/login_screen.dart';
import '../auth/services/auth_service.dart';
import '../membership/screens/membership_screen.dart';
import 'screens/profile_screen.dart';

/// Aksi navigasi/keluar yang dipakai bersama (popup profil, halaman Profil).
void openProfile(NavigatorState navigator) {
  navigator.push(MaterialPageRoute(builder: (_) => const ProfileScreen()));
}

void openMembership(NavigatorState navigator) {
  navigator.push(MaterialPageRoute(builder: (_) => const MembershipScreen()));
}

Future<void> confirmLogout(BuildContext context) async {
  final ok = await showDialog<bool>(
    context: context,
    builder: (dialog) => AlertDialog(
      title: const Text('Keluar dari akun?'),
      content: const Text('Kamu perlu masuk lagi untuk melanjutkan belajar.'),
      actions: [
        TextButton(
          onPressed: () => Navigator.of(dialog).pop(false),
          child: const Text('Batal'),
        ),
        TextButton(
          onPressed: () => Navigator.of(dialog).pop(true),
          child: const Text('Keluar'),
        ),
      ],
    ),
  );
  if (ok != true || !context.mounted) return;

  await AuthService.logout();
  if (!context.mounted) return;
  Navigator.of(context).pushAndRemoveUntil(
    MaterialPageRoute<void>(builder: (_) => const LoginScreen()),
    (_) => false,
  );
}
