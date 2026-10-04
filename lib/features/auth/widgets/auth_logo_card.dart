import 'package:flutter/material.dart';

class AuthLogoCard extends StatelessWidget {
  const AuthLogoCard({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 220,
      padding: const EdgeInsets.symmetric(vertical: 24, horizontal: 16),
      decoration: BoxDecoration(
        // Disamakan dengan warna background bawaan gambar logoAuth.png
        color: const Color.fromRGBO(28, 145, 195, 1), 
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.08),
            blurRadius: 20,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      child: Column(
        children: [
          // Gambar Logo
          Image.asset(
            'assets/images/logoAuth.png',
            height: 70,
            fit: BoxFit.contain,
            errorBuilder: (context, error, stackTrace) => const Icon(
              Icons.interests,
              size: 65,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 12),
          // Teks Judul
          const Text(
            'Sahabat AlFaRy',
            style: TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
        ],
      ),
    );
  }
}