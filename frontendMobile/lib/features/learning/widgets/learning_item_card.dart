import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

import '../../../core/constants/design_tokens.dart';
import '../../../core/widgets/app_pill.dart';
import '../models/learning_models.dart';

/// Kartu satu materi: video (dengan thumbnail) atau modul/latihan (dengan ikon).
class LearningItemCard extends StatelessWidget {
  const LearningItemCard({super.key, required this.item, this.onTap});

  final LearningItem item;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final isVideo = item.type == LearningType.video;

    return Material(
      color: DS.background,
      clipBehavior: Clip.antiAlias,
      borderRadius: BorderRadius.circular(10),
      child: InkWell(
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            spacing: 12,
            children: [
              isVideo ? _Thumbnail(minutes: item.durationMinutes) : _FolderTile(premium: item.isPremium),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  spacing: 6,
                  children: [
                    Row(
                      children: [
                        AppPill(
                          label: item.isPremium ? 'Premium' : 'Gratis',
                          tone: item.isPremium ? AppPillTone.premium : AppPillTone.info,
                          fontWeight: FontWeight.w500,
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                        ),
                        const Spacer(),
                        Text(item.type.label,
                            style: DS.caption.copyWith(fontSize: 11, height: 1.2)),
                      ],
                    ),
                    Text(item.title,
                        style: DS.itemTitle.copyWith(fontSize: 14, height: 1.3)),
                    Text(item.description, style: DS.caption),
                    Wrap(
                      spacing: 12,
                      runSpacing: 4,
                      children: [..._meta()],
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  List<Widget> _meta() {
    return [
      if (item.chapters != null)
        _MetaChip(icon: LucideIcons.bookOpen, text: '${item.chapters} bab'),
      if (item.questions != null)
        _MetaChip(icon: LucideIcons.fileText, text: '${item.questions} soal'),
      _MetaChip(icon: LucideIcons.clock, text: '${item.durationMinutes} menit'),
      if (item.views != null)
        _MetaChip(icon: Icons.play_circle_outline_rounded, text: item.views!),
    ];
  }
}

class _MetaChip extends StatelessWidget {
  const _MetaChip({required this.icon, required this.text});

  final IconData icon;
  final String text;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      spacing: 4,
      children: [
        Icon(icon, size: 14, color: DS.primary),
        Text(text,
            style: DS.caption.copyWith(
              fontSize: 11,
              height: 1.2,
              color: DS.textSecondary,
            )),
      ],
    );
  }
}

class _Thumbnail extends StatelessWidget {
  const _Thumbnail({required this.minutes});

  final int minutes;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 84,
      height: 84,
      alignment: Alignment.bottomCenter,
      padding: const EdgeInsets.only(bottom: 6),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(8),
        gradient: const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [DS.accent, DS.primary],
        ),
      ),
      child: Stack(
        alignment: Alignment.bottomCenter,
        children: [
          const Align(
            alignment: Alignment.center,
            child: Icon(LucideIcons.play, size: 26, color: Colors.white70),
          ),
          Text(
            '$minutes min',
            style: DS.label.copyWith(color: Colors.white, fontSize: 11),
          ),
        ],
      ),
    );
  }
}

class _FolderTile extends StatelessWidget {
  const _FolderTile({required this.premium});

  final bool premium;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 48,
      height: 48,
      alignment: Alignment.center,
      decoration: BoxDecoration(
        color: premium ? DS.premiumSoft : DS.primarySoft,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Icon(
        LucideIcons.folder,
        size: 24,
        color: premium ? DS.premiumText : DS.primary,
      ),
    );
  }
}
