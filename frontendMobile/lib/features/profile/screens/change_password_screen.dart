import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:provider/provider.dart';

import '../../../core/network/api_client.dart';
import '../../../core/constants/design_tokens.dart';
import '../../../core/widgets/app_action_button.dart';
import '../../../core/widgets/app_form_field.dart';
import '../../../core/widgets/app_header_scaffold.dart';
import '../../../core/widgets/app_section_card.dart';
import '../providers/current_user_provider.dart';

class ChangePasswordScreen extends StatefulWidget {
  const ChangePasswordScreen({super.key});

  @override
  State<ChangePasswordScreen> createState() => _ChangePasswordScreenState();
}

class _ChangePasswordScreenState extends State<ChangePasswordScreen> {
  final _newPassword = TextEditingController();
  final _confirm = TextEditingController();
  final _email = TextEditingController();
  final _code = TextEditingController();
  bool _hidden = true;
  bool _codeSent = false;
  bool _loading = false;

  @override
  void initState() {
    super.initState();
    _email.text = context.read<CurrentUserProvider>().email;
  }

  @override
  void dispose() {
    _newPassword.dispose();
    _confirm.dispose();
    _email.dispose();
    _code.dispose();
    super.dispose();
  }

  Future<void> _requestCode() async {
    if (!_email.text.contains('@')) {
      _message('Email akun belum tersedia. Silakan login ulang.');
      return;
    }
    setState(() => _loading = true);
    try {
      await ApiClient.postData(
        '/auth/password-reset/request',
        authenticated: false,
        body: {'email': _email.text.trim()},
      );
      if (!mounted) return;
      setState(() => _codeSent = true);
      _message(
        'Kode verifikasi dikirim jika email terdaftar. Periksa kotak masuk.',
      );
    } catch (error) {
      _message(error.toString());
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  Future<void> _save() async {
    if (_code.text.trim().length != 6) {
      _message('Masukkan kode verifikasi 6 digit.');
      return;
    }
    if (_newPassword.text.length < 8) {
      _message('Kata sandi minimal 8 karakter.');
      return;
    }
    if (_newPassword.text != _confirm.text) {
      _message('Konfirmasi kata sandi tidak sama.');
      return;
    }

    setState(() => _loading = true);
    try {
      await ApiClient.postData(
        '/auth/password-reset/confirm',
        authenticated: false,
        body: {
          'email': _email.text.trim(),
          'code': _code.text.trim(),
          'new_password': _newPassword.text,
        },
      );
      if (!mounted) return;
      _message('Kata sandi berhasil diperbarui. Silakan login kembali.');
      if (mounted) Navigator.of(context).pop();
    } catch (error) {
      _message(error.toString());
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  void _message(String text) {
    if (!mounted) return;
    ScaffoldMessenger.of(context)
      ..hideCurrentSnackBar()
      ..showSnackBar(SnackBar(content: Text(text)));
  }

  @override
  Widget build(BuildContext context) {
    final toggle = IconButton(
      onPressed: () => setState(() => _hidden = !_hidden),
      icon: Icon(
        _hidden ? LucideIcons.eyeOff : LucideIcons.eye,
        size: 18,
        color: DS.textSecondary,
      ),
    );

    return AppHeaderScaffold(
      title: 'Ubah Kata Sandi',
      subtitle: 'Gunakan kata sandi baru yang kuat dan mudah kamu ingat.',
      children: [
        AppSectionCard(
          title: 'Kata Sandi Baru',
          children: [
            Column(
              spacing: 16,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                AppFormField(
                  label: 'Email akun',
                  controller: _email,
                  keyboardType: TextInputType.emailAddress,
                  readOnly: true,
                ),
                if (!_codeSent)
                  const Text(
                    'Kami akan mengirim kode verifikasi yang berlaku 10 menit ke email akunmu.',
                    style: DS.caption,
                  ),
                if (_codeSent) ...[
                  AppFormField(
                    label: 'Kode verifikasi',
                    controller: _code,
                    keyboardType: TextInputType.number,
                    hint: '6 digit',
                  ),
                  AppFormField(
                    label: 'Kata Sandi Baru',
                    controller: _newPassword,
                    obscureText: _hidden,
                    suffix: toggle,
                  ),
                  AppFormField(
                    label: 'Konfirmasi Kata Sandi Baru',
                    controller: _confirm,
                    obscureText: _hidden,
                  ),
                ],
              ],
            ),
          ],
        ),
        AppActionButton(
          label: _loading
              ? 'Memproses...'
              : _codeSent
              ? 'Verifikasi & Ubah Kata Sandi'
              : 'Kirim Kode Verifikasi',
          height: 48,
          onPressed: _loading ? null : (_codeSent ? _save : _requestCode),
        ),
        if (_codeSent)
          TextButton(
            onPressed: _loading ? null : _requestCode,
            child: const Text('Kirim ulang kode'),
          ),
      ],
    );
  }
}
