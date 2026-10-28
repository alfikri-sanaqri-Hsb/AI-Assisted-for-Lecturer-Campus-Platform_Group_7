import 'package:flutter/material.dart';

class AuthLogoCard extends StatelessWidget {
  const AuthLogoCard({super.key});

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(20),
      child: Image.asset(
        'assets/images/logoAuth.png',
        width: 260,
        fit: BoxFit.contain,
        errorBuilder: (context, error, stackTrace) => const Icon(
          Icons.interests,
          size: 80,
          color: Colors.white,
        ),
      ),
    );
  }
}