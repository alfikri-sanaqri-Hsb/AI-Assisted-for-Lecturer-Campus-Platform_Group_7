import 'package:flutter/material.dart';

class ContinueLearningCard extends StatelessWidget {
  const ContinueLearningCard({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white, 
        borderRadius: BorderRadius.circular(12), 
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.08), blurRadius: 15, offset: const Offset(0, 4))],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Lanjutkan Belajar', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
          const SizedBox(height: 12),
          Row(
            children: [
              Container(
                width: 70, height: 45,
                decoration: BoxDecoration(color: Colors.grey.shade300, borderRadius: BorderRadius.circular(4)),
                child: const Icon(Icons.play_circle_outline, color: Colors.white, size: 28),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Materi Eksponen: Sifat Dasar', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600)),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        Expanded(
                          child: LinearProgressIndicator(value: 0.6, backgroundColor: Colors.grey.shade300, color: Colors.blue, minHeight: 4, borderRadius: BorderRadius.circular(2)),
                        ),
                        const SizedBox(width: 8),
                        const Text('60%', style: TextStyle(fontSize: 10, color: Colors.grey)),
                      ],
                    )
                  ],
                ),
              )
            ],
          )
        ],
      ),
    );
  }
}

class StudyMissionCard extends StatelessWidget {
  const StudyMissionCard({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white, 
        borderRadius: BorderRadius.circular(12), 
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.08), blurRadius: 15, offset: const Offset(0, 4))],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Misi harian', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
          const SizedBox(height: 12),
          Row(
            children: [
              Icon(Icons.check_box_outline_blank, color: Colors.grey.shade300, size: 20),
              const SizedBox(width: 8),
              const Text('Selesaikan 10 Soal Pengetahuan Kuantitatif', style: TextStyle(fontSize: 12)),
            ],
          ),
          const SizedBox(height: 10),
          Row(
            children: const [
              SizedBox(width: 28), 
              Text('Selesaikan 5 Flashcard', style: TextStyle(fontSize: 12)),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Container(
                decoration: BoxDecoration(
                  border: Border.all(color: Colors.green),
                  borderRadius: BorderRadius.circular(4),
                ),
                child: const Icon(Icons.check, color: Colors.green, size: 16),
              ),
              const SizedBox(width: 8),
              Expanded(child: LinearProgressIndicator(value: 0.4, backgroundColor: Colors.grey.shade300, color: Colors.blue, minHeight: 4, borderRadius: BorderRadius.circular(2))),
            ],
          )
        ],
      ),
    );
  }
}

class TopicRecommendationList extends StatelessWidget {
  const TopicRecommendationList({super.key});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 90,
      child: ListView(
        scrollDirection: Axis.horizontal,
        physics: const BouncingScrollPhysics(),
        clipBehavior: Clip.none,
        children: [
          _buildTopicCard('Perkuat\nkelemahan:\nPenalaran\nMatematika', Icons.grid_view, Colors.blue),
          _buildTopicCard('Target Ulang:\nPenalaran\nUmum', Icons.lightbulb_outline, Colors.blue),
          _buildTopicCard('Tinjau\nKembali:\nLogika Dasar', Icons.refresh, Colors.orange),
        ],
      ),
    );
  }

  Widget _buildTopicCard(String title, IconData icon, Color iconColor) {
    return Container(
      width: 130,
      margin: const EdgeInsets.only(right: 12),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white, 
        borderRadius: BorderRadius.circular(16), 
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10)],
      ),
      child: Stack(
        children: [
          Text(title, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w800, height: 1.2)),
          Positioned(
            right: 0, 
            bottom: 0,
            child: Icon(icon, color: iconColor.withOpacity(0.6), size: 18),
          )
        ],
      ),
    );
  }
}

class UpcomingScheduleCard extends StatelessWidget {
  const UpcomingScheduleCard({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF75C7FF),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(color: Colors.orange, borderRadius: BorderRadius.circular(6)),
            child: const Text('Jadwal Terdekat', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13)),
          ),
          const SizedBox(height: 12),
          const Text('24 Jan: TryOut Akbar UTBK', style: TextStyle(fontSize: 13, color: Colors.black87)),
          const SizedBox(height: 4),
          const Text('26 Jan: Join Live Class (PM)', style: TextStyle(fontSize: 13, color: Colors.black87)),
          const SizedBox(height: 12),
          SizedBox(
            width: double.infinity,
            height: 35,
            child: ElevatedButton(
              onPressed: () {},
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.white.withOpacity(0.4),
                elevation: 0,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
              ),
              child: const Text('Daftar/Reminder', style: TextStyle(color: Colors.black87, fontWeight: FontWeight.bold, fontSize: 12)),
            ),
          )
        ],
      ),
    );
  }
}

class StudyTipsCard extends StatelessWidget {
  const StudyTipsCard({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white, 
        borderRadius: BorderRadius.circular(16), 
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10)],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Tips Belajar Hari Ini', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
          const SizedBox(height: 12),
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(color: Colors.blue.shade50, borderRadius: BorderRadius.circular(12)),
                child: const Icon(Icons.menu_book, color: Colors.blue, size: 28),
              ),
              const SizedBox(width: 12),
              const Expanded(
                child: Text(
                  'Gunakan Teknik Pomodoro:\nBelajar 25 Menit, Istirahat 5\nMenit', 
                  style: TextStyle(fontSize: 12, height: 1.3),
                ),
              )
            ],
          )
        ],
      ),
    );
  }
}

class ActionMenuCard extends StatelessWidget {
  final String title;
  final IconData icon;

  const ActionMenuCard({super.key, required this.title, required this.icon});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: Colors.white, 
        borderRadius: BorderRadius.circular(16), 
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 8)],
      ),
      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 2),
        leading: Icon(icon, color: Colors.blue, size: 26),
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
        trailing: const Icon(Icons.arrow_forward_ios, size: 14, color: Colors.black),
        onTap: () {},
      ),
    );
  }
}