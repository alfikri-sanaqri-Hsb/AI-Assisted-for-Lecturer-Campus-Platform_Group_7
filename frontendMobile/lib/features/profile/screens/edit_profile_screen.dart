import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:image_picker/image_picker.dart';
import 'package:provider/provider.dart';

import '../../../core/constants/design_tokens.dart';
import '../../../core/widgets/app_action_button.dart';
import '../../../core/widgets/app_avatar.dart';
import '../../../core/widgets/app_form_field.dart';
import '../../../core/widgets/app_header_scaffold.dart';
import '../../../core/widgets/app_section_card.dart';
import '../services/profile_content_service.dart';
import '../providers/current_user_provider.dart';

class EditProfileScreen extends StatefulWidget {
  const EditProfileScreen({super.key});

  @override
  State<EditProfileScreen> createState() => _EditProfileScreenState();
}

class _EditProfileScreenState extends State<EditProfileScreen> {
  final _name = TextEditingController();
  final _nickname = TextEditingController();
  final _email = TextEditingController();
  final _phone = TextEditingController();
  final _birth = TextEditingController();
  final _university = TextEditingController();
  final _major = TextEditingController();
  bool _saving = false;

  @override
  void initState() {
    super.initState();
    final user = context.read<CurrentUserProvider>();
    _name.text = user.fullName;
    _nickname.text = user.nickname;
    _email.text = user.email;
    _phone.text = user.phoneNumber;
    _birth.text = user.dateOfBirth;
    _university.text = user.university;
    _major.text = user.major;
  }

  @override
  void dispose() {
    for (final c in [
      _name,
      _nickname,
      _email,
      _phone,
      _birth,
      _university,
      _major,
    ]) {
      c.dispose();
    }
    super.dispose();
  }

  Future<void> _pickBirthDate() async {
    final now = DateTime.now();
    final picked = await showDatePicker(
      context: context,
      initialDate: DateTime.tryParse(_birth.text) ?? DateTime(now.year - 17),
      firstDate: DateTime(1980),
      lastDate: now,
    );
    if (picked == null) return;
    String two(int n) => n.toString().padLeft(2, '0');
    _birth.text = '${picked.year}-${two(picked.month)}-${two(picked.day)}';
  }

  Future<void> _pickAvatar() async {
    final account = context.read<CurrentUserProvider>();
    try {
      final picked = await ImagePicker().pickImage(
        source: ImageSource.gallery,
        maxWidth: 640,
        maxHeight: 640,
        imageQuality: 82,
      );
      if (picked == null) return;
      final bytes = await picked.readAsBytes();
      if (!mounted) return;
      await account.saveAvatar(bytes);
    } catch (error) {
      if (mounted) {
        ScaffoldMessenger.of(context)
          ..hideCurrentSnackBar()
          ..showSnackBar(SnackBar(content: Text('Foto gagal dipilih: $error')));
      }
    }
  }

  Future<void> _save() async {
    if (_name.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Nama lengkap wajib diisi.')),
      );
      return;
    }
    setState(() => _saving = true);
    try {
      await context.read<CurrentUserProvider>().update(
        fullName: _name.text,
        university: _university.text,
        nickname: _nickname.text,
        phoneNumber: _phone.text,
        dateOfBirth: _birth.text,
        major: _major.text,
      );
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Profil berhasil diperbarui.')),
      );
      Navigator.of(context).pop();
    } catch (error) {
      if (mounted) {
        ScaffoldMessenger.of(context)
            .showSnackBar(SnackBar(content: Text(error.toString())));
      }
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final account = context.watch<CurrentUserProvider>();
    final avatar = ProfileContentService.user.avatarAsset;

    return AppHeaderScaffold(
      title: 'Edit Profil',
      subtitle: 'Perbarui data dirimu agar belajar lebih personal.',
      children: [
        Center(
          child: AppAvatar(
            size: 104,
            ringWidth: 4,
            ringColor: Colors.white,
            image: account.avatarBytes != null
                ? MemoryImage(account.avatarBytes!)
                : avatar == null
                ? null
                : AssetImage(avatar),
            onTap: _pickAvatar,
            badge: Container(
              width: 32,
              height: 32,
              decoration: BoxDecoration(
                color: DS.primary,
                shape: BoxShape.circle,
                border: Border.all(color: Colors.white, width: 2),
              ),
              child: const Icon(
                LucideIcons.camera,
                size: 16,
                color: Colors.white,
              ),
            ),
          ),
        ),
        AppSectionCard(
          title: 'Data Diri',
          children: [
            Column(
              spacing: 16,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                AppFormField(label: 'Nama Lengkap', controller: _name),
                AppFormField(label: 'Nama Panggilan', controller: _nickname),
                AppFormField(label: 'Universitas', controller: _university),
                AppFormField(label: 'Program Studi', controller: _major),
                AppFormField(
                  label: 'Email',
                  controller: _email,
                  keyboardType: TextInputType.emailAddress,
                  readOnly: true,
                ),
                AppFormField(
                  label: 'Nomor Telpon',
                  controller: _phone,
                  keyboardType: TextInputType.phone,
                ),
                AppFormField(
                  label: 'Tanggal Lahir',
                  controller: _birth,
                  readOnly: true,
                  onTap: _pickBirthDate,
                  suffix: const Icon(
                    LucideIcons.calendarDays,
                    size: 18,
                    color: DS.textSecondary,
                  ),
                ),
              ],
            ),
          ],
        ),
        AppActionButton(
          label: _saving ? 'Menyimpan...' : 'Simpan Perubahan',
          height: 48,
          onPressed: _saving ? null : _save,
        ),
      ],
    );
  }
}
