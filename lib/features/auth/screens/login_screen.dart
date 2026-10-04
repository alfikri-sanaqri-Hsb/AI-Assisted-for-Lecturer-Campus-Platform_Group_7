import 'package:flutter/material.dart';

import '../widgets/auth_logo_card.dart';
import '../widgets/social_login_button.dart';
import '../widgets/auth_footer.dart';
import 'register_screen.dart';

class LoginScreen extends StatelessWidget {
  const LoginScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        width: double.infinity,
        height: double.infinity,
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [Color(0xFF48B5FF), Color(0xFFEAEFF4)],
            stops: [0.0, 0.6],
          ),
        ),
        child: SafeArea(
          child: SingleChildScrollView(
            physics: const BouncingScrollPhysics(),
            child: Padding(
              padding: const EdgeInsets.symmetric(vertical: 20.0),
              child: Column(
                children: [
                  const SizedBox(height: 20),
                  
                  // Komponen Logo
                  const AuthLogoCard(),
                  
                  const SizedBox(height: 32),

                  // Kartu Tengah (Login)
                  Container(
                    margin: const EdgeInsets.symmetric(horizontal: 24),
                    padding: const EdgeInsets.all(24),
                    decoration: BoxDecoration(
                      color: const Color(0xFFEEF2F6),
                      borderRadius: BorderRadius.circular(24),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.05),
                          blurRadius: 10,
                          offset: const Offset(0, 5),
                        ),
                      ],
                    ),
                    child: Column(
                      children: [
                        // Toggle Header dengan fungsi Navigasi
                        _buildToggleHeader(context),
                        const SizedBox(height: 24),

                        // Tombol Masuk Google
                        SocialLoginButton(
                          icon: Image.network(
                            'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1200px-Google_%22G%22_logo.svg.png',
                            height: 20,
                            errorBuilder: (context, error, stackTrace) =>
                                const Icon(Icons.g_mobiledata, size: 28),
                          ),
                          text: 'Masuk Dengan Google',
                          onPressed: () {},
                        ),
                        const SizedBox(height: 16),

                        // Tombol Masuk Email
                        SocialLoginButton(
                          icon: const Icon(Icons.mail_outline, color: Colors.black87),
                          text: 'Masuk Dengan Email',
                          onPressed: () {},
                        ),
                        const SizedBox(height: 24),

                        // Teks Bawah + Navigasi ke Register
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Text(
                              'Belum Punya Akun ? ',
                              style: TextStyle(
                                color: Colors.black87,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            GestureDetector(
                              onTap: () {
                                Navigator.pushReplacement(
                                  context,
                                  MaterialPageRoute(
                                    builder: (context) => const RegisterScreen(),
                                  ),
                                );
                              },
                              child: const Text(
                                'Daftar',
                                style: TextStyle(
                                  color: Color(0xFF48B5FF),
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 32),
                  
                  // Komponen Footer
                  const AuthFooter(),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  // Toggle Header dengan Navigasi ke Register
  Widget _buildToggleHeader(BuildContext context) {
    return Container(
      height: 50,
      decoration: BoxDecoration(
        border: Border.all(color: Colors.grey.shade400),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        children: [
          // Tab Masuk (Aktif)
          Expanded(
            child: Container(
              decoration: BoxDecoration(
                color: const Color(0xFFDFEEFD),
                borderRadius: BorderRadius.circular(15),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: const [
                  Icon(Icons.login, color: Color(0xFF48B5FF), size: 18),
                  SizedBox(width: 8),
                  Text(
                    'Masuk',
                    style: TextStyle(
                      color: Color(0xFF48B5FF),
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Tab Daftar Baru (Navigasi ke RegisterScreen)
          Expanded(
            child: InkWell(
              onTap: () {
                Navigator.pushReplacement(
                  context,
                  MaterialPageRoute(
                    builder: (context) => const RegisterScreen(),
                  ),
                );
              },
              borderRadius: BorderRadius.circular(15),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: const [
                  Icon(Icons.person_add_alt_1, color: Colors.black87, size: 18),
                  SizedBox(width: 8),
                  Text(
                    'Daftar Baru',
                    style: TextStyle(
                      color: Colors.black87,
                      fontWeight: FontWeight.bold,
                    ),
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