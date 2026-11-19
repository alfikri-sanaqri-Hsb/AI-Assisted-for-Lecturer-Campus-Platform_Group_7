import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

import '../../../core/constants/design_tokens.dart';
import '../../../core/network/api_client.dart';
import '../../../core/widgets/app_action_button.dart';
import '../../../core/widgets/app_header_scaffold.dart';
import '../../../core/widgets/app_icon_tile.dart';
import '../../../core/widgets/app_section_header.dart';
import '../services/profile_content_service.dart';

class HelpFeedbackScreen extends StatefulWidget {
  const HelpFeedbackScreen({super.key});

  @override
  State<HelpFeedbackScreen> createState() => _HelpFeedbackScreenState();
}

class _HelpFeedbackScreenState extends State<HelpFeedbackScreen> {
  final _message = TextEditingController();
  int? _openFaq = 0;
  String? _topic;

  @override
  void dispose() {
    _message.dispose();
    super.dispose();
  }

  Future<void> _send() async {
    final ok = _topic != null && _message.text.trim().isNotEmpty;
    if (!ok) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Pilih topik dan tulis saranmu dulu.')),
      );
      return;
    }
    try {
      final topic = switch (_topic) {
        'Materi' => 'materi',
        'Tryout' => 'tryout',
        'Progress' => 'progress',
        _ => 'lainnya',
      };
      await ApiClient.postData(
        '/feedback',
        body: {'topic': topic, 'message': _message.text.trim()},
      );
      if (!mounted) return;
      _message.clear();
      setState(() => _topic = null);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Terima kasih, saranmu terkirim.')),
      );
    } catch (error) {
      if (mounted)
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('Saran gagal dikirim: $error')));
    }
  }

  BoxDecoration get _card => BoxDecoration(
    color: DS.surface,
    border: Border.all(color: DS.border),
    borderRadius: BorderRadius.circular(DS.cardRadius),
  );

  @override
  Widget build(BuildContext context) {
    final faqs = ProfileContentService.faqs;
    final topics = ProfileContentService.feedbackTopics;

    return AppHeaderScaffold(
      title: 'Bantuan & Saran',
      subtitle: 'Cari jawaban cepat atau kirim saranmu.',
      children: [
        // Hero
        Container(
          padding: const EdgeInsets.all(16),
          decoration: _card,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            spacing: 12,
            children: [
              Row(
                spacing: 8,
                children: [
                  const AppIconTile(
                    icon: Icons.help_outline_rounded,
                    size: 32,
                    iconSize: 18,
                    radius: 16,
                  ),
                  Expanded(
                    child: Text(
                      'Butuh bantuan?',
                      style: DS.sectionTitle.copyWith(
                        fontSize: 22,
                        height: 1.45,
                      ),
                    ),
                  ),
                ],
              ),
              const Text(
                'Cari jawaban cepat dari FAQ atau kirim saran untuk membantu kami meningkatkan pengalaman belajarmu.',
                style: DS.body,
              ),
            ],
          ),
        ),

        // FAQ
        Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          spacing: 12,
          children: [
            const AppSectionHeader(icon: LucideIcons.bookOpen, title: 'FAQ'),
            Container(
              clipBehavior: Clip.antiAlias,
              decoration: _card,
              child: Column(
                children: [
                  for (final (i, f) in faqs.indexed)
                    Container(
                      decoration: BoxDecoration(
                        border: i == faqs.length - 1
                            ? null
                            : const Border(
                                bottom: BorderSide(color: DS.border),
                              ),
                      ),
                      child: InkWell(
                        onTap: () =>
                            setState(() => _openFaq = _openFaq == i ? null : i),
                        child: Padding(
                          padding: const EdgeInsets.all(16),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.stretch,
                            spacing: 8,
                            children: [
                              Row(
                                spacing: 12,
                                children: [
                                  Expanded(
                                    child: Text(
                                      f.question,
                                      style: DS.itemTitle.copyWith(
                                        fontWeight: FontWeight.w500,
                                        height: 1.45,
                                      ),
                                    ),
                                  ),
                                  const Icon(
                                    LucideIcons.chevronDown,
                                    size: 20,
                                    color: DS.primary,
                                  ),
                                ],
                              ),
                              if (_openFaq == i) Text(f.answer, style: DS.body),
                            ],
                          ),
                        ),
                      ),
                    ),
                ],
              ),
            ),
          ],
        ),

        // Kirim saran
        Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          spacing: 12,
          children: [
            const AppSectionHeader(
              icon: LucideIcons.messageSquare,
              title: 'Kirim Saran',
            ),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: _card,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                spacing: 16,
                children: [
                  const Text(
                    'Beritahu kami fitur apa yang ingin kamu lihat selanjutnya atau masalah apa yang perlu diperbaiki.',
                    style: DS.body,
                  ),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    spacing: 8,
                    children: [
                      Text(
                        'Topik saran',
                        style: DS.body.copyWith(
                          fontWeight: FontWeight.w500,
                          color: DS.textPrimary,
                        ),
                      ),
                      Wrap(
                        spacing: 8,
                        runSpacing: 8,
                        children: [
                          for (final t in topics)
                            _TopicChip(
                              label: t,
                              selected: _topic == t,
                              onTap: () => setState(() => _topic = t),
                            ),
                        ],
                      ),
                    ],
                  ),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    spacing: 8,
                    children: [
                      Text(
                        'Saranmu',
                        style: DS.body.copyWith(
                          fontWeight: FontWeight.w500,
                          color: DS.textPrimary,
                        ),
                      ),
                      SizedBox(
                        height: 112,
                        child: TextField(
                          controller: _message,
                          maxLines: null,
                          expands: true,
                          textAlignVertical: TextAlignVertical.top,
                          style: DS.body.copyWith(color: DS.textPrimary),
                          decoration: InputDecoration(
                            hintText:
                                'Tulis saran atau masalah yang kamu temui...',
                            hintStyle: DS.body,
                            filled: true,
                            fillColor: DS.background,
                            contentPadding: const EdgeInsets.all(12),
                            border: _outline(DS.border),
                            enabledBorder: _outline(DS.border),
                            focusedBorder: _outline(DS.primary),
                          ),
                        ),
                      ),
                    ],
                  ),
                  const Row(
                    spacing: 8,
                    children: [
                      Icon(LucideIcons.info, size: 16, color: DS.textSecondary),
                      Expanded(
                        child: Text(
                          'Saranmu akan membantu kami memperbarui fitur dan pengalaman belajar.',
                          style: DS.caption,
                        ),
                      ),
                    ],
                  ),
                  AppActionButton(
                    label: 'Kirim Saran',
                    height: 48,
                    onPressed: _send,
                  ),
                ],
              ),
            ),
          ],
        ),

        // Bantuan lain
        Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          spacing: 12,
          children: [
            const AppSectionHeader(
              icon: LucideIcons.search,
              title: 'Cari bantuan lain',
            ),
            const Row(
              spacing: 12,
              children: [
                Expanded(
                  child: AppActionButton(
                    label: 'Cari Jawaban',
                    variant: AppActionVariant.outlined,
                    height: 48,
                  ),
                ),
                Expanded(
                  child: AppActionButton(
                    label: 'Hubungi Mentor',
                    variant: AppActionVariant.outlined,
                    height: 48,
                  ),
                ),
              ],
            ),
          ],
        ),
      ],
    );
  }

  static OutlineInputBorder _outline(Color c) => OutlineInputBorder(
    borderRadius: BorderRadius.circular(8),
    borderSide: BorderSide(color: c),
  );
}

class _TopicChip extends StatelessWidget {
  const _TopicChip({
    required this.label,
    required this.selected,
    required this.onTap,
  });

  final String label;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: selected ? DS.primary : DS.primarySoft,
      clipBehavior: Clip.antiAlias,
      shape: const StadiumBorder(),
      child: InkWell(
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
          child: Text(
            label,
            style: DS.body.copyWith(
              fontWeight: FontWeight.w500,
              color: selected ? Colors.white : DS.primary,
              height: 1.2,
            ),
          ),
        ),
      ),
    );
  }
}
