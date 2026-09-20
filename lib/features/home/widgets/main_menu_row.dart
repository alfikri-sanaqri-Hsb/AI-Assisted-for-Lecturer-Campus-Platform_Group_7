import 'package:flutter/material.dart';

class MainMenuRow extends StatelessWidget {
  const MainMenuRow({super.key});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildMenuItem(Icons.menu_book, 'Materi'),
        _buildMenuItem(Icons.edit_document, 'Latihan'),
        _buildMenuItem(Icons.assignment, 'TryOut'),
        _buildMenuItem(Icons.lightbulb_outline, 'Prediksi'),
        _buildMenuItem(Icons.play_circle_outline, 'Video'),
      ],
    );
  }

  Widget _buildMenuItem(IconData icon, String label) {
    return Column(
      children: [
        Container(
          width: 56,
          height: 56,
          decoration: BoxDecoration(
            color: Colors.white.withOpacity(0.2),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(
              color: Colors.white.withOpacity(0.5),
              width: 1,
            ),
          ),
          child: Icon(
            icon,
            color: Colors.white,
            size: 28,
          ),
        ),
        const SizedBox(height: 8),
        Text(
          label,
          style: const TextStyle(
            color: Colors.white,
            fontSize: 12,
            fontWeight: FontWeight.w500,
          ),
        ),
      ],
    );
  }
}