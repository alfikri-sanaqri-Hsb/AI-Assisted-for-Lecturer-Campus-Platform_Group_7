import 'package:flutter/material.dart';

import '../../../core/constants/design_tokens.dart';
import '../../../core/network/api_client.dart';
import '../../../core/widgets/app_action_button.dart';
import '../../../core/widgets/app_header_scaffold.dart';

class MaterialDetailScreen extends StatefulWidget {
  const MaterialDetailScreen({
    super.key,
    required this.materialId,
    required this.title,
  });
  final int materialId;
  final String title;

  @override
  State<MaterialDetailScreen> createState() => _MaterialDetailScreenState();
}

class _MaterialDetailScreenState extends State<MaterialDetailScreen> {
  Map<String, dynamic>? _material;
  bool _loading = true;
  bool _saving = false;

  Map<String, dynamic> _map(dynamic value) => value is Map
      ? value.map((key, value) => MapEntry(key.toString(), value))
      : <String, dynamic>{};

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    try {
      final data = _map(
        await ApiClient.getData('/materials/${widget.materialId}'),
      );
      if (mounted) setState(() => _material = data);
    } catch (error) {
      if (mounted) setState(() => _material = {'error': error.toString()});
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  Future<void> _complete() async {
    setState(() => _saving = true);
    try {
      await ApiClient.postData('/materials/${widget.materialId}/complete');
      if (!mounted) return;
      setState(() => _material = {...?_material, 'is_completed': true});
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text('Materi ditandai selesai.')));
    } catch (error) {
      if (mounted)
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Tidak dapat menyimpan progres: $error')),
        );
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  @override
  Widget build(BuildContext context) => AppHeaderScaffold(
    title: widget.title,
    subtitle: 'Materi belajar',
    children: [
      if (_loading) const LinearProgressIndicator(),
      if (_material?['error'] is String)
        Text(
          'Materi belum dapat dimuat: ${_material!['error']}',
          style: DS.body,
        ),
      if (_material != null && _material!['error'] == null) ...[
        Text(
          _material!['subject']?.toString() ?? '',
          style: DS.label.copyWith(color: DS.primary),
        ),
        Text(
          _material!['title']?.toString() ?? widget.title,
          style: DS.heading,
        ),
        Text(
          _material!['description']?.toString().trim().isNotEmpty == true
              ? _material!['description'].toString()
              : 'Belum ada deskripsi untuk materi ini.',
          style: DS.body,
        ),
        Text(
          'Estimasi ${(_material!['estimated_minutes'] as num?)?.toInt() ?? 0} menit',
          style: DS.caption,
        ),
        if (_material!['content_url'] is String &&
            '${_material!['content_url']}'.isNotEmpty)
          SelectableText(
            'Tautan materi: ${_material!['content_url']}',
            style: DS.body,
          ),
        AppActionButton(
          label: _saving
              ? 'Menyimpan...'
              : _material!['is_completed'] == true
              ? 'Materi selesai'
              : 'Tandai selesai',
          onPressed: _saving || _material!['is_completed'] == true
              ? null
              : _complete,
        ),
      ],
    ],
  );
}
