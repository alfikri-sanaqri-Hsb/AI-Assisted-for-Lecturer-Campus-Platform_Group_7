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
            color: const Color.fromARGB(255, 10, 147, 226).withOpacity(0.6),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(
              color: const Color.fromARGB(255, 32, 85, 230).withOpacity(0.6),
              width: 1,
            ),
          ),
          child: Icon(
            icon,
            color: const Color.fromARGB(255, 253, 253, 253),
            size: 28,
          ),
        ),
        const SizedBox(height: 8),
        Text(
          label,
          style: const TextStyle(
            color: Color.fromARGB(255, 0, 0, 0),
            fontSize: 12,
            fontWeight: FontWeight.w500,
          ),
        ),
      ],
    );
  }
}