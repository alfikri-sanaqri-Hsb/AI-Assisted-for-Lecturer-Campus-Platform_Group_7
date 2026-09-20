import 'package:flutter/material.dart';

class DailyMissionCard extends StatelessWidget {
  const DailyMissionCard({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
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
            title: 'Kerjakan 10 Soal Latihan',
            progressText: '3/10',
            progressValue: 0.3,
          ),
          
          const Padding(
            padding: EdgeInsets.symmetric(vertical: 12),
            child: Divider(height: 1, color: Colors.black12),
          ),
          
          _buildMissionItem(
            icon: Icons.play_circle_fill,
            iconColor: Colors.redAccent,
            borderColor: Colors.red.shade300, 
            title: 'Tonton 3 Video Materi',
            progressText: '0/3',
            progressValue: 0.0,
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