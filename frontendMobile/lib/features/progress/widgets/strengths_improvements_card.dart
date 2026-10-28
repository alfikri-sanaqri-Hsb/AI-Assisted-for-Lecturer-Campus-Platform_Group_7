import 'package:flutter/material.dart';

class StrengthsImprovementsCard extends StatelessWidget {
  const StrengthsImprovementsCard({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 8,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: IntrinsicHeight(
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Kekuatan:',
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 15,
                      color: Colors.black87,
                    ),
                  ),
                  const SizedBox(height: 16),
                  _buildStrengthItem('PK: Operasi Bilangan'),
                  const SizedBox(height: 12),
                  _buildStrengthItem('PU: Penalaran induktif'),
                ],
              ),
            ),
            
            const VerticalDivider(
              color: Color(0xFFE0E0E0),
              thickness: 1,
              width: 24,
            ),
            
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Perlu ditingkatkan:',
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 14,
                      color: Colors.black87,
                    ),
                  ),
                  const SizedBox(height: 16),
                  _buildImprovementItem('LBI: Kalimat Baku dan Nonbaku'),
                  const SizedBox(height: 12),
                  _buildImprovementItem('PBM: PUEBI / EYD V'),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  // Widget baris untuk Kekuatan
  Widget _buildStrengthItem(String text) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Expanded(
          child: Text(
            text,
            style: const TextStyle(
              fontSize: 12.5,
              color: Colors.black87,
              fontWeight: FontWeight.w500,
              height: 1.3,
            ),
          ),
        ),
        const SizedBox(width: 6),
        Container(
          padding: const EdgeInsets.all(2),
          decoration: BoxDecoration(
            color: Colors.green.shade50,
            borderRadius: BorderRadius.circular(4),
            border: Border.all(color: Colors.green, width: 1),
          ),
          child: const Icon(
            Icons.check,
            size: 12,
            color: Colors.green,
          ),
        ),
      ],
    );
  }

  // Widget baris untuk Perlu Ditingkatkan
  Widget _buildImprovementItem(String text) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Expanded(
          child: Text(
            text,
            style: const TextStyle(
              fontSize: 12.5,
              color: Colors.black87,
              fontWeight: FontWeight.w500,
              height: 1.3,
            ),
          ),
        ),
        const SizedBox(width: 6),
        const Padding(
          padding: EdgeInsets.only(top: 2.0),
          child: Icon(
            Icons.arrow_forward_ios,
            size: 12,
            color: Colors.black54,
          ),
        ),
      ],
    );
  }
}