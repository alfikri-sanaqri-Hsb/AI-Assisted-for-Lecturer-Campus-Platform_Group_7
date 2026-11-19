import 'package:flutter/foundation.dart';

abstract final class ApiConfig {
  static const _override = String.fromEnvironment('API_BASE_URL');

  static String get baseUrl {
    if (_override.isNotEmpty) return _override.replaceFirst(RegExp(r'/+$'), '');
    if (kIsWeb) return 'http://localhost:5000/api';
    return switch (defaultTargetPlatform) {
      TargetPlatform.android => 'http://10.0.2.2:5000/api',
      _ => 'http://localhost:5000/api',
    };
  }
}
