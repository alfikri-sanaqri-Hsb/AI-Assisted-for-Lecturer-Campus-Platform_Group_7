import 'package:flutter/material.dart';

import '../features/main_navigation.dart';
import '../features/auth/screens/login_screen.dart';

class SahabatBelajarApp extends StatelessWidget {
  const SahabatBelajarApp({super.key});

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Sahabat Belajar',
      home: LoginScreen(), 
    );
  }
}