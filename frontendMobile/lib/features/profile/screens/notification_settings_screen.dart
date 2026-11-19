import 'package:flutter/material.dart';

import '../../../core/network/api_client.dart';
import '../../../core/constants/design_tokens.dart';
import '../../../core/widgets/app_header_scaffold.dart';
import '../../../core/widgets/app_inset_tile.dart';
import '../../../core/widgets/app_list_item.dart';
import '../../../core/widgets/app_pill.dart';
import '../../../core/widgets/app_section_card.dart';
import '../models/profile_models.dart';
import '../services/profile_content_service.dart';

class NotificationSettingsScreen extends StatefulWidget {
  const NotificationSettingsScreen({super.key});

  @override
  State<NotificationSettingsScreen> createState() =>
      _NotificationSettingsScreenState();
}

class _NotificationSettingsScreenState
    extends State<NotificationSettingsScreen> {
  final List<NotificationPref> _prefs = List.of(
    ProfileContentService.notificationPrefs,
  );
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  static const _keys = ['info', 'reminder', 'promo', 'online_class'];

  Future<void> _load() async {
    try {
      final response = await ApiClient.getData('/settings');
      final data = response is Map ? response : <dynamic, dynamic>{};
      final raw = data['notifications'];
      if (!mounted || raw is! Map) return;
      setState(() {
        for (var i = 0; i < _prefs.length; i++) {
          final value = raw[_keys[i]];
          if (value is bool) _prefs[i] = _prefs[i].copyWith(enabled: value);
        }
      });
    } catch (_) {
      // Keep local defaults and allow changes to retry against the API.
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  Future<void> _toggle(int index, bool value) async {
    final previous = _prefs[index];
    setState(() => _prefs[index] = _prefs[index].copyWith(enabled: value));
    try {
      await ApiClient.putData(
        '/settings/notifications',
        body: {_keys[index]: value},
      );
    } catch (error) {
      if (!mounted) return;
      setState(() => _prefs[index] = previous);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Pengaturan gagal disimpan: $error')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final activities = ProfileContentService.activities;

    return AppHeaderScaffold(
      title: 'Notifikasi',
      subtitle: 'Atur pemberitahuan yang ingin kamu terima.',
      children: [
        AppSectionCard(
          title: 'Pengaturan Notifikasi',
          children: [
            if (_loading) const LinearProgressIndicator(),
            for (final (i, p) in _prefs.indexed) ...[
              if (i > 0)
                const Divider(height: 1, thickness: 1, color: DS.border),
              _PrefRow(pref: p, onChanged: (v) => _toggle(i, v)),
            ],
          ],
        ),
        AppSectionCard(
          title: 'Aktivitas Saya',
          children: [
            if (activities.isEmpty)
              const Text('Belum ada aktivitas terbaru.', style: DS.caption)
            else
              Column(
                spacing: 8,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  for (final a in activities)
                    AppInsetTile(title: a, subtitle: ''),
                ],
              ),
          ],
        ),
        AppSectionCard(
          title: 'Notifikasi Penting',
          children: [
            AppListItem(
              icon: Icons.warning_amber_rounded,
              title: 'Pembaruan Aplikasi',
              subtitle: 'Perbarui untuk fitur dan perbaikan terbaru.',
              tileRadius: 12,
              trailing: AppPill(label: 'Update', tone: AppPillTone.outline),
            ),
          ],
        ),
      ],
    );
  }
}

class _PrefRow extends StatelessWidget {
  const _PrefRow({required this.pref, required this.onChanged});

  final NotificationPref pref;
  final ValueChanged<bool> onChanged;

  @override
  Widget build(BuildContext context) {
    return Row(
      spacing: 12,
      children: [
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            spacing: 2,
            children: [
              Text(pref.title, style: DS.itemTitle.copyWith(height: 1.45)),
              Text(pref.description, style: DS.caption),
            ],
          ),
        ),
        Switch(
          value: pref.enabled,
          onChanged: onChanged,
          thumbColor: const WidgetStatePropertyAll(Colors.white),
          trackColor: WidgetStateProperty.resolveWith(
            (states) =>
                states.contains(WidgetState.selected) ? DS.primary : DS.border,
          ),
          trackOutlineColor: const WidgetStatePropertyAll(Colors.transparent),
        ),
      ],
    );
  }
}
