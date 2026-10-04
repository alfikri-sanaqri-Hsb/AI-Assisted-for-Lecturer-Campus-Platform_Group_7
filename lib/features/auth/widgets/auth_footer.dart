import 'package:flutter/material.dart';

class AuthFooter extends StatelessWidget {
  const AuthFooter({super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 40, vertical: 20),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: const [
          Text(
            'Ketentuan Layanan',
            style: TextStyle(fontWeight: FontWeight.bold, decoration: TextDecoration.underline, fontSize: 13),
          ),
          Text(
            'Kebijakan Privasi',
            style: TextStyle(fontWeight: FontWeight.bold, decoration: TextDecoration.underline, fontSize: 13),
          ),
        ],
      ),
    );
  }
}