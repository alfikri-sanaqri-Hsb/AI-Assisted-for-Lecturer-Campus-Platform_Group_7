import 'dart:convert';

import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../../../core/network/api_client.dart';

class CurrentUserProvider extends ChangeNotifier {
  String fullName = '';
  String university = '';
  String email = '';
  String phoneNumber = '';
  String dateOfBirth = '';
  String major = '';
  String nickname = '';
  Uint8List? avatarBytes;
  bool isPremium = false;
  bool loading = false;
  int totalPoints = 0;
  int streakDays = 0;

  String get displayName => fullName.trim().isEmpty ? 'Pengguna' : fullName;
  String get displayUniversity => university.trim().isEmpty
      ? 'Tambahkan universitas di Profil'
      : university;

  Future<void> load() async {
    loading = true;
    notifyListeners();
    try {
      final result = await ApiClient.getData('/users/dashboard');
      if (result is Map) {
        fullName = '${result['full_name'] ?? ''}'.trim();
        university = '${result['university'] ?? ''}'.trim();
        email = '${result['email'] ?? ''}'.trim();
        phoneNumber = '${result['phone_number'] ?? ''}'.trim();
        dateOfBirth = '${result['date_of_birth'] ?? ''}'.trim();
        major = '${result['major'] ?? ''}'.trim();
        nickname = '${result['nickname'] ?? ''}'.trim();
        isPremium = result['is_premium'] == true || result['is_premium'] == 1;
        final preferences = await SharedPreferences.getInstance();
        final savedAvatar = preferences.getString(_avatarKey(email));
        avatarBytes = savedAvatar == null ? null : base64Decode(savedAvatar);
      }
      try {
        final summary = await ApiClient.getData('/progress/summary');
        if (summary is Map) {
          totalPoints =
              (summary['total_points'] as num?)?.toInt() ?? totalPoints;
          streakDays = (summary['streak_days'] as num?)?.toInt() ?? streakDays;
        }
      } catch (_) {
        // Profile data can still render if the progress summary is unavailable.
      }
    } finally {
      loading = false;
      notifyListeners();
    }
  }

  Future<void> saveAvatar(Uint8List bytes) async {
    final preferences = await SharedPreferences.getInstance();
    await preferences.setString(_avatarKey(email), base64Encode(bytes));
    avatarBytes = bytes;
    notifyListeners();
  }

  String _avatarKey(String accountEmail) =>
      'profile_avatar_${accountEmail.trim().toLowerCase()}';

  Future<void> update({
    required String fullName,
    required String university,
    required String nickname,
    required String phoneNumber,
    required String dateOfBirth,
    required String major,
  }) async {
    await ApiClient.putData(
      '/users/profile',
      body: {
        'full_name': fullName.trim(),
        'university': university.trim(),
        'nickname': nickname.trim(),
        'phone_number': phoneNumber.trim(),
        'date_of_birth': dateOfBirth.trim().isEmpty ? null : dateOfBirth.trim(),
        'major': major.trim(),
      },
    );
    await load();
  }
}
