import 'package:flutter/material.dart';

import 'package:provider/provider.dart';

import 'login_screen.dart';
import '../widgets/auth_logo_card.dart';
import '../widgets/auth_footer.dart';
import '../../main_navigation.dart';
import '../services/auth_service.dart';
import '../../profile/providers/current_user_provider.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _loading = false;
  String? _error;

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _register() async {
    final currentUser = context.read<CurrentUserProvider>();
    if (_nameController.text.trim().isEmpty ||
        _emailController.text.trim().isEmpty ||
        _passwordController.text.isEmpty) {
      setState(() => _error = 'Nama, email, dan password wajib diisi.');
      return;
    }
    if (_passwordController.text.length < 6) {
      setState(() => _error = 'Password minimal 6 karakter.');
      return;
    }
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      await AuthService.register(
        fullName: _nameController.text,
        email: _emailController.text,
        password: _passwordController.text,
      );
      await currentUser.load();
      if (!mounted) return;
      Navigator.pushAndRemoveUntil(
        context,
        MaterialPageRoute(builder: (_) => const MainNavigation()),
        (_) => false,
      );
    } catch (error) {
      if (mounted) setState(() => _error = error.toString());
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

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
                  const SizedBox(height: 10),

                  // 1. Logo Card
                  const AuthLogoCard(),

                  const SizedBox(height: 24),

                  // 2. Kartu Form Register
                  Container(
                    margin: const EdgeInsets.symmetric(horizontal: 24),
                    padding: const EdgeInsets.all(24),
                    decoration: BoxDecoration(
                      color: const Color(0xFFEEF2F6),
                      borderRadius: BorderRadius.circular(24),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.05),
                          blurRadius: 10,
                          offset: const Offset(0, 5),
                        ),
                      ],
                    ),
                    child: Column(
                      children: [
                        // Toggle Button Header
                        _buildToggleHeader(context),

                        const SizedBox(height: 16),

                        // Subtitle
                        const Text(
                          'Mulai Langkah Persiapan Ujianmu!',
                          style: TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.bold,
                            color: Colors.black87,
                          ),
                          textAlign: TextAlign.center,
                        ),

                        const SizedBox(height: 16),

                        // Input Fields
                        _buildInputField(
                          hintText: 'Nama Lengkap (Contoh: Fauzan)',
                          icon: Icons.person_outline,
                          controller: _nameController,
                        ),
                        const SizedBox(height: 12),

                        _buildInputField(
                          hintText: 'Alamat Email Aktif',
                          icon: Icons.mail_outline,
                          controller: _emailController,
                          keyboardType: TextInputType.emailAddress,
                        ),
                        const SizedBox(height: 12),

                        _buildInputField(
                          hintText: 'Buat Kata sandi',
                          icon: Icons.lock_outline,
                          controller: _passwordController,
                          isObscure: true,
                        ),

                        if (_error != null) ...[
                          const SizedBox(height: 10),
                          Align(
                            alignment: Alignment.centerLeft,
                            child: Text(
                              _error!,
                              style: const TextStyle(color: Color(0xFFB42318)),
                            ),
                          ),
                        ],

                        const SizedBox(height: 20),

                        // Tombol Buat Akun Sahabat
                        SizedBox(
                          width: double.infinity,
                          height: 50,
                          child: ElevatedButton(
                            onPressed: _loading ? null : _register,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFF1E78E6),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(16),
                              ),
                              elevation: 0,
                            ),
                            child: Text(
                              _loading
                                  ? 'Membuat akun...'
                                  : 'Buat Akun Sahabat',
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 15,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        ),

                        const SizedBox(height: 20),

                        // Link ke Halaman Masuk
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Text(
                              'Sudah Punya Akun ? ',
                              style: TextStyle(
                                color: Colors.black87,
                                fontWeight: FontWeight.bold,
                                fontSize: 13,
                              ),
                            ),
                            GestureDetector(
                              onTap: () {
                                Navigator.pushReplacement(
                                  context,
                                  MaterialPageRoute(
                                    builder: (context) => const LoginScreen(),
                                  ),
                                );
                              },
                              child: const Text(
                                'Masuk',
                                style: TextStyle(
                                  color: Color(0xFF1E78E6),
                                  fontWeight: FontWeight.bold,
                                  fontSize: 13,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 24),

                  // 3. Footer
                  const AuthFooter(),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  // Header Toggle Tab
  Widget _buildToggleHeader(BuildContext context) {
    return Container(
      height: 52,
      padding: const EdgeInsets.all(3),
      decoration: BoxDecoration(
        border: Border.all(color: Colors.grey.shade400),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        children: [
          // Tab Masuk
          Expanded(
            child: InkWell(
              onTap: () {
                Navigator.pushReplacement(
                  context,
                  MaterialPageRoute(builder: (context) => const LoginScreen()),
                );
              },
              borderRadius: BorderRadius.circular(13),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: const [
                  Icon(Icons.login, color: Colors.black87, size: 18),
                  SizedBox(width: 8),
                  Text(
                    'Masuk',
                    style: TextStyle(
                      color: Colors.black87,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Tab Daftar Baru
          Expanded(
            child: Container(
              height: double.infinity,
              decoration: BoxDecoration(
                color: const Color(0xFFDFEEFD),
                borderRadius: BorderRadius.circular(13),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: const [
                  Icon(
                    Icons.person_add_alt_1,
                    color: Color(0xFF1E78E6),
                    size: 18,
                  ),
                  SizedBox(width: 8),
                  Text(
                    'Daftar Baru',
                    style: TextStyle(
                      color: Color(0xFF1E78E6),
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

  // Reusable TextField
  Widget _buildInputField({
    required String hintText,
    required IconData icon,
    required TextEditingController controller,
    bool isObscure = false,
    TextInputType keyboardType = TextInputType.text,
  }) {
    return SizedBox(
      height: 48,
      child: TextField(
        controller: controller,
        obscureText: isObscure,
        keyboardType: keyboardType,
        style: const TextStyle(fontSize: 13, color: Colors.black87),
        decoration: InputDecoration(
          hintText: hintText,
          hintStyle: TextStyle(color: Colors.grey.shade500, fontSize: 13),
          prefixIcon: Icon(icon, color: Colors.grey.shade600, size: 20),
          contentPadding: const EdgeInsets.symmetric(vertical: 12),
          filled: true,
          fillColor: const Color(0xFFE5EBF2),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(14),
            borderSide: BorderSide(color: Colors.grey.shade400),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(14),
            borderSide: const BorderSide(color: Color(0xFF1E78E6), width: 1.5),
          ),
        ),
      ),
    );
  }
}
