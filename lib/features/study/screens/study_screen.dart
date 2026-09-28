import 'package:flutter/material.dart';

import '../widgets/study_header.dart';
import '../widgets/study_components.dart';

class StudyScreen extends StatelessWidget {
  const StudyScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8F9FA),
      body: CustomScrollView(
        physics: const BouncingScrollPhysics(),
        slivers: [

          SliverAppBar(
            pinned: true,
            stretch: true,
            elevation: 0,
            backgroundColor: const Color(0xFF48B5FF),
            toolbarHeight: 95,
            
            expandedHeight: 400, 
            
            shape: const RoundedRectangleBorder(
              borderRadius: BorderRadius.only(
                bottomLeft: Radius.circular(30),
                bottomRight: Radius.circular(30),
              ),
            ),
            
            title: const Padding(
              padding: EdgeInsets.only(top: 8.0),
              child: StudyHeader(),
            ),
            centerTitle: false,
            
            flexibleSpace: FlexibleSpaceBar(
              stretchModes: const [
                StretchMode.zoomBackground,
              ],
              background: ClipRRect(
                borderRadius: const BorderRadius.only(
                  bottomLeft: Radius.circular(30),
                  bottomRight: Radius.circular(30),
                ),
                child: Container(
                  decoration: const BoxDecoration(
                    image: DecorationImage(
                      image: AssetImage('assets/images/header_bg.jpeg'), 
                      fit: BoxFit.cover,
                      alignment: Alignment.topCenter, 
                    ),
                  ),
                  child: const Padding(
                    padding: EdgeInsets.symmetric(horizontal: 20.0),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.end,
                      children: [
                        ContinueLearningCard(),
                        SizedBox(height: 16),
                        StudyMissionCard(),
                        SizedBox(height: 30),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),

          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 24.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildSectionTitleWithAction('Rekomendasi Topik'),
                  const SizedBox(height: 12),
                  const TopicRecommendationList(),
                  const SizedBox(height: 24),

                  const UpcomingScheduleCard(),
                  const SizedBox(height: 24),

                  const StudyTipsCard(),
                  const SizedBox(height: 24),

                  const ActionMenuCard(title: 'Latihan Soal UTBK', icon: Icons.menu_book),
                  const ActionMenuCard(title: 'TryOut Online', icon: Icons.emoji_events),
                  const ActionMenuCard(title: 'Flashcard', icon: Icons.style_outlined),
                  const ActionMenuCard(title: 'Bank Soal Lengkap', icon: Icons.bar_chart),
                  
                  const SizedBox(height: 80), 
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionTitleWithAction(String title) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
        Row(
          children: [
            Icon(Icons.arrow_back_ios, size: 12, color: Colors.grey.shade500),
            const SizedBox(width: 12),
            const Icon(Icons.arrow_forward_ios, size: 12, color: Colors.black87),
          ],
        )
      ],
    );
  }
}