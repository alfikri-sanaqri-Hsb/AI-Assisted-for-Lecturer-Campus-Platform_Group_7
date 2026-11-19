import 'package:flutter/material.dart';
import '../../../app/app_nav.dart';

class DailyMissionCard extends StatelessWidget {
  const DailyMissionCard({super.key, this.onTap, this.missions = const []});
  final VoidCallback? onTap;
  final List<Map<String, dynamic>> missions;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap ?? () => AppNav.practice(context, topic: 'Penalaran Umum'),
      borderRadius: BorderRadius.circular(16),
      child: Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        children: [
          _buildMissionItem(
            icon: Icons.menu_book,
            iconColor: Colors.blue,
            borderColor: Colors.blue.shade300, 
            title: missions.isNotEmpty ? '${missions[0]['title'] ?? 'Kerjakan 10 Soal Latihan'}' : 'Kerjakan 10 Soal Latihan',
            progressText: missions.isNotEmpty ? '${missions[0]['progress'] ?? 0}/${missions[0]['target'] ?? 10}' : '3/10',
            progressValue: missions.isNotEmpty ? ((missions[0]['progress'] as num? ?? 0) / ((missions[0]['target'] as num? ?? 10))).clamp(0, 1).toDouble() : .3,
          ),
          
          const Padding(
            padding: EdgeInsets.symmetric(vertical: 12),
            child: Divider(height: 1, color: Colors.black12),
          ),
          
          _buildMissionItem(
            icon: Icons.play_circle_fill,
            iconColor: Colors.redAccent,
            borderColor: Colors.red.shade300, 
            title: missions.length > 1 ? '${missions[1]['title'] ?? 'Tonton 3 Video Materi'}' : 'Tonton 3 Video Materi',
            progressText: missions.length > 1 ? '${missions[1]['progress'] ?? 0}/${missions[1]['target'] ?? 3}' : '0/3',
            progressValue: missions.length > 1 ? ((missions[1]['progress'] as num? ?? 0) / ((missions[1]['target'] as num? ?? 3))).clamp(0, 1).toDouble() : 0,
          ),
          
          const SizedBox(height: 16),
          
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: const [
              Text(
                'Selesaikan Misi Untuk Tingkatkan Streak-mu! ',
                style: TextStyle(fontSize: 12, color: Colors.black54),
              ),
              Icon(Icons.local_fire_department, color: Colors.orange, size: 16),
            ],
          )
        ],
      ),
      ),
    );
  }

  Widget _buildMissionItem({
    required IconData icon,
    required Color iconColor,
    Color? borderColor, 
    required String title,
    required String progressText,
    required double progressValue,
  }) {
    return Row(
      children: [
        Container(
          width: 20,
          height: 20,
          decoration: BoxDecoration(
            border: Border.all(color: Colors.grey, width: 1.5),
            borderRadius: BorderRadius.circular(4),
          ),
        ),
        const SizedBox(width: 12),
        
        Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: iconColor.withOpacity(0.1),
            borderRadius: BorderRadius.circular(8),
            border: Border.all(color: borderColor ?? Colors.transparent, width: 1.5), 
          ),
          child: Icon(icon, color: iconColor, size: 24),
        ),
        const SizedBox(width: 12),
        
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                      color: Colors.black87,
                    ),
                  ),
                  Text(
                    progressText,
                    style: const TextStyle(
                      fontSize: 12,
                      color: Colors.grey,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 6),
              LinearProgressIndicator(
                value: progressValue,
                backgroundColor: Colors.grey[200],
                color: const Color(0xFF38A3FF),
                minHeight: 4,
                borderRadius: BorderRadius.circular(2),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
