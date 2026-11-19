import 'package:flutter/material.dart';

import '../../../core/network/api_client.dart';

import '../../../core/constants/design_tokens.dart';
import '../../../core/widgets/app_header_scaffold.dart';
import '../../../core/widgets/app_section_card.dart';
import '../../../core/widgets/app_surface_card.dart';
import '../services/profile_content_service.dart';

class AboutScreen extends StatefulWidget {
  const AboutScreen({super.key});

  @override
  State<AboutScreen> createState() => _AboutScreenState();
}

class _AboutScreenState extends State<AboutScreen> {
  String? _aboutText;

  @override
  void initState() {
    super.initState();
    _loadAbout();
  }

  Future<void> _loadAbout() async {
    try {
      final result = await ApiClient.getData('/settings/about');
      if (mounted && result is Map && result['about_text'] is String) {
        setState(() => _aboutText = result['about_text'] as String);
      }
    } catch (_) {}
  }

  @override
  Widget build(BuildContext context) {
    return AppHeaderScaffold(
      title: 'Tentang Kami',
      subtitle: 'Teman belajar untuk perjalanan menuju kampus impian.',
      children: [
        AppSurfaceCard(
          children: [
            Container(
              width: 64,
              height: 64,
              decoration: BoxDecoration(
                color: DS.primarySoft,
                borderRadius: BorderRadius.circular(20),
              ),
              child: const Icon(
                Icons.school_outlined,
                color: DS.primary,
                size: 34,
              ),
            ),
            Text(
              'Belajar terarah. Melangkah lebih yakin.',
              style: DS.heading.copyWith(fontSize: 20, height: 1.35),
            ),
            Text(
              _aboutText ?? ProfileContentService.aboutQuote,
              style: DS.body,
            ),
          ],
        ),
        AppSectionCard(
          title: 'Cara Sahabat Alfary mendukungmu',
          children: [
            const _AboutPoint(
              icon: Icons.menu_book_outlined,
              title: 'Materi terstruktur',
              description: 'Pelajari topik secara bertahap sesuai kebutuhan persiapanmu.',
            ),
            const Divider(height: 18),
            const _AboutPoint(
              icon: Icons.quiz_outlined,
              title: 'Latihan dan tryout',
              description: 'Biasakan diri dengan soal dan suasana ujian melalui latihan terarah.',
            ),
            const Divider(height: 18),
            const _AboutPoint(
              icon: Icons.insights_outlined,
              title: 'Evaluasi progres',
              description:
                  'Kenali kekuatan dan bagian yang masih perlu ditingkatkan.',
            ),
          ],
        ),
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: DS.primarySoft,
            borderRadius: BorderRadius.circular(16),
          ),
          child: Text(
            'Setiap siswa punya perjalanan yang berbeda. Gunakan materi, latihan, dan hasil evaluasi sebagai panduan untuk menyusun langkah belajar berikutnya.',
            style: DS.body.copyWith(color: DS.primary),
          ),
        ),
      ],
    );
  }
}

class _AboutPoint extends StatelessWidget {
  const _AboutPoint({
    required this.icon,
    required this.title,
    required this.description,
  });

  final IconData icon;
  final String title;
  final String description;

  @override
  Widget build(BuildContext context) => Row(
    crossAxisAlignment: CrossAxisAlignment.start,
    spacing: 12,
    children: [
      Icon(icon, color: DS.primary, size: 22),
      Expanded(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          spacing: 4,
          children: [
            Text(title, style: DS.cardTitle),
            Text(description, style: DS.caption),
          ],
        ),
      ),
    ],
  );
}
