import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

import '../../../app/app_nav.dart';
import '../../../core/constants/design_tokens.dart';
import '../../../core/widgets/app_action_button.dart';
import '../../../core/widgets/app_header_scaffold.dart';
import '../../../core/widgets/app_pill.dart';
import '../../../core/widgets/app_progress_bar.dart';
import '../../../core/widgets/app_section_card.dart';
import '../models/profile_models.dart';
import '../services/profile_content_service.dart';

class StudyProgramScreen extends StatelessWidget {
  const StudyProgramScreen({super.key});

  @override
  Widget build(BuildContext context) {
    const progress = ProfileContentService.subtestProgress;
    const modules = ProfileContentService.modules;

    return AppHeaderScaffold(
      title: 'Program Belajar',
      subtitle: 'Pantau jalur belajar dan lanjutkan modulmu.',
      children: [
        AppSectionCard(
          title: 'Jalur Belajar Kamu',
          badge: AppPill(label: '${progress.length} subtes'),
          children: [
            Column(
              spacing: 16,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [for (final p in progress) _ProgressRow(item: p)],
            ),
          ],
        ),
        AppSectionCard(
          title: 'Modul Belajar',
          badge: AppPill(
            label: '${modules.length} modul',
            tone: AppPillTone.warning,
          ),
          children: [
            Column(
              spacing: 12,
              children: [
                for (var i = 0; i < modules.length; i += 2)
                  Row(
                    spacing: 12,
                    children: [
                      Expanded(
                        child: GestureDetector(
                          onTap: () => AppNav.searchMaterials(context, query: modules[i].title),
                          child: _ModuleCard(module: modules[i]),
                        ),
                      ),
                      Expanded(
                        child: i + 1 < modules.length
                            ? GestureDetector(
                                onTap: () => AppNav.searchMaterials(context, query: modules[i + 1].title),
                                child: _ModuleCard(module: modules[i + 1]),
                              )
                            : const SizedBox.shrink(),
                      ),
                    ],
                  ),
              ],
            ),
          ],
        ),
        AppActionButton(
          label: 'Mulai Misi Harian',
          height: 48,
          onPressed: () => AppNav.practice(context, topic: progress.first.name),
        ),
      ],
    );
  }
}

class _ProgressRow extends StatelessWidget {
  const _ProgressRow({required this.item});

  final SubtestProgress item;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      spacing: 8,
      children: [
        Row(
          spacing: 8,
          children: [
            Expanded(
              child: Text(
                'Subtes : ${item.name}',
                style: DS.body.copyWith(
                  fontWeight: FontWeight.w500,
                  color: DS.textPrimary,
                ),
              ),
            ),
            Text('${item.percent}%', style: DS.label),
          ],
        ),
        AppProgressBar(value: item.percent / 100, showLabel: false),
      ],
    );
  }
}

class _ModuleCard extends StatelessWidget {
  const _ModuleCard({required this.module});

  final StudyModule module;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(8),
      decoration: BoxDecoration(
        color: DS.background,
        border: Border.all(color: DS.border),
        borderRadius: BorderRadius.circular(10),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        spacing: 8,
        children: [
          AspectRatio(
            aspectRatio: 125 / 70,
            child: ClipRRect(
              borderRadius: BorderRadius.circular(8),
              child: Image.asset(
                module.imageAsset, // ekspor dari Figma
                fit: BoxFit.cover,
                errorBuilder: (context, error, stack) => const ColoredBox(
                  color: DS.primarySoft,
                  child: Center(
                    child: Icon(LucideIcons.play, size: 20, color: DS.primary),
                  ),
                ),
              ),
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            spacing: 2,
            children: [
              Text(
                module.title,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: DS.itemTitle.copyWith(fontSize: 13, height: 1.3),
              ),
              Text(module.episode, style: DS.caption),
            ],
          ),
        ],
      ),
    );
  }
}
