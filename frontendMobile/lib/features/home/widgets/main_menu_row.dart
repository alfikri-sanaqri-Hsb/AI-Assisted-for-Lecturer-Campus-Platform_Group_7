import 'package:flutter/material.dart';

import '../../../app/app_nav.dart';
import '../../../core/constants/design_tokens.dart';
import '../../learning/models/learning_models.dart';

class MainMenuRow extends StatelessWidget {
  const MainMenuRow({super.key});

  @override
  Widget build(BuildContext context) {
    final entries = <(IconData, String, VoidCallback)>[
      (Icons.menu_book_rounded, 'Materi', () => AppNav.materials(context)),
      (
        Icons.edit_note_rounded,
        'Latihan',
        () => AppNav.searchMaterials(context, type: LearningType.latihan),
      ),
      (Icons.assignment_outlined, 'TryOut', () => AppNav.tryouts(context)),
      (
        Icons.auto_awesome_outlined,
        'Prediksi',
        () => AppNav.prediction(context),
      ),
      (
        Icons.play_circle_outline_rounded,
        'Video',
        () => AppNav.videos(context),
      ),
    ];

    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        for (final entry in entries)
          _buildMenuItem(context, entry.$1, entry.$2, entry.$3),
      ],
    );
  }

  Widget _buildMenuItem(
    BuildContext context,
    IconData icon,
    String label,
    VoidCallback onTap,
  ) {
    return Semantics(
      button: true,
      label: label,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: SizedBox(
          width: 62,
          child: Column(
            children: [
              Container(
                width: 54,
                height: 54,
                decoration: BoxDecoration(
                  color: const Color(0xFFF5FBFF),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: const Color(0xFFB8DDF3)),
                  boxShadow: const [
                    BoxShadow(
                      color: Color(0x180A6FAF),
                      blurRadius: 10,
                      offset: Offset(0, 3),
                    ),
                  ],
                ),
                child: Icon(icon, color: DS.primary, size: 26),
              ),
              const SizedBox(height: 7),
              Text(
                label,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: DS.caption.copyWith(
                  color: DS.textPrimary,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
