import 'package:flutter/material.dart';

import '../../../app/app_nav.dart';

class LiveScheduleList extends StatelessWidget {
  const LiveScheduleList({
    super.key,
    this.onMentoringTap,
    this.onTryoutTap,
    this.schedules = const [],
  });
  final VoidCallback? onMentoringTap;
  final VoidCallback? onTryoutTap;
  final List<Map<String, dynamic>> schedules;

  @override
  Widget build(BuildContext context) {
    final rows = schedules;
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        children: rows.isEmpty
            ? [
                _buildScheduleCard(
                  onTap: onMentoringTap ?? () => AppNav.liveClasses(context),
                  backgroundColor: const Color(0xFF90CAF9),
                  icon: Icons.mic,
                  iconColor: const Color(0xFF2196F3),
                  timeText: 'Hari ini, 19:00 WIB',
                  titleText: 'Live Mentoring:\nPenalaran Umum',
                ),
                const SizedBox(width: 16),

                _buildScheduleCard(
                  onTap: onTryoutTap ?? () => AppNav.tryouts(context),
                  backgroundColor: const Color(0xFFFFCC80),
                  icon: Icons.hourglass_bottom,
                  iconColor: const Color(0xFFFF9800),
                  timeText: 'Sisa 3 Hari Lagi',
                  titleText: 'Tryout Akbar\nSNBT Vol. 5',
                ),
              ]
            : [
                for (final (index, schedule) in rows.indexed)
                  Padding(
                    padding: EdgeInsets.only(
                      right: index == rows.length - 1 ? 0 : 16,
                    ),
                    child: _buildScheduleCard(
                      onTap: '${schedule['type']}' == 'tryout'
                          ? (onTryoutTap ?? () => AppNav.tryouts(context))
                          : (onMentoringTap ?? () => AppNav.mentor(context)),
                      backgroundColor: '${schedule['type']}' == 'tryout'
                          ? const Color(0xFFFFCC80)
                          : const Color(0xFF90CAF9),
                      icon: '${schedule['type']}' == 'tryout'
                          ? Icons.hourglass_bottom
                          : Icons.mic,
                      iconColor: '${schedule['type']}' == 'tryout'
                          ? const Color(0xFFFF9800)
                          : const Color(0xFF2196F3),
                      timeText: schedule['label']?.toString() ?? '',
                      titleText:
                          schedule['title']?.toString() ?? 'Jadwal belajar',
                    ),
                  ),
              ],
      ),
    );
  }

  Widget _buildScheduleCard({
    required VoidCallback onTap,
    required Color backgroundColor,
    required IconData icon,
    required Color iconColor,
    required String timeText,
    required String titleText,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Container(
        width: 200,
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: backgroundColor,
          borderRadius: BorderRadius.circular(16),
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: iconColor,
                shape: BoxShape.circle,
              ),
              child: Icon(icon, color: Colors.white, size: 24),
            ),
            const SizedBox(width: 12),

            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    timeText,
                    style: const TextStyle(fontSize: 12, color: Colors.black87),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    titleText,
                    style: const TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                      color: Colors.black,
                      height: 1.2,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
