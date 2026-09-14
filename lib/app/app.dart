import 'package:flutter/material.dart';

import '../features/auth/screens/splash_screen.dart';

class SahabatBelajarApp extends StatelessWidget {
  const SahabatBelajarApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Sahabat Belajar',
      home: const SplashScreen(),
    );
  }
}