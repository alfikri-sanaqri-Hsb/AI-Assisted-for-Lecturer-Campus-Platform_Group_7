import 'package:flutter/material.dart';

class AppGreetingHeader extends StatelessWidget {
  const AppGreetingHeader({
    super.key,
    required this.name,
    required this.subtitle,
    required this.points,
    required this.streak,
    this.avatar,
    this.onAvatarTap,
    this.onUpgradeTap,
  });

  final String name;
  final String subtitle;
  final String points; // contoh: "9.230"
  final int streak; // contoh: 12
  final ImageProvider? avatar; // kosong = ikon orang (seperti Home)
  final VoidCallback? onAvatarTap;
  final VoidCallback? onUpgradeTap;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Expanded(
          child: Row(
            children: [
              GestureDetector(
                onTap: onAvatarTap,
                child: Container(
                  padding: const EdgeInsets.all(2),
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    border: Border.all(color: Colors.white, width: 2),
                  ),
                  child: CircleAvatar(
                    radius: 20,
                    backgroundColor: Colors.transparent,
                    backgroundImage: avatar,
                    child: avatar == null
                        ? const Icon(
                            Icons.person_outline,
                            color: Colors.white,
                            size: 28,
                          )
                        : null,
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Flexible(
                          child: Text(
                            name,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: const TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                            ),
                          ),
                        ),
                        const SizedBox(width: 4),
                        Image.asset(
                          'assets/images/wave_hand.png',
                          height: 16,
                          errorBuilder: (c, e, s) =>
                              const Text('👋', style: TextStyle(fontSize: 14)),
                        ),
                        const SizedBox(width: 4),
                        GestureDetector(
                          onTap: onUpgradeTap,
                          behavior: HitTestBehavior.opaque,
                          child: const Padding(
                            padding: EdgeInsets.all(3),
                            child: Icon(
                              Icons.diamond_outlined,
                              color: Colors.white70,
                              size: 16,
                            ),
                          ),
                        ),
                      ],
                    ),
                    Text(
                      subtitle,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(fontSize: 11, color: Colors.white),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
        Row(
          children: [
            _Badge(
              child: Row(
                children: [
                  const Icon(Icons.bolt, color: Colors.white, size: 14),
                  Text(
                    ' $points',
                    style: const TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                      fontSize: 11,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(width: 6),
            _Badge(
              child: Row(
                children: [
                  Container(
                    decoration: const BoxDecoration(
                      color: Colors.orange,
                      shape: BoxShape.circle,
                    ),
                    padding: const EdgeInsets.all(2),
                    child: const Icon(
                      Icons.local_fire_department,
                      color: Colors.white,
                      size: 10,
                    ),
                  ),
                  Text(
                    ' $streak',
                    style: const TextStyle(
                      color: Colors.orange,
                      fontWeight: FontWeight.bold,
                      fontSize: 11,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ],
    );
  }
}

class _Badge extends StatelessWidget {
  const _Badge({required this.child});

  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.2),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.white.withValues(alpha: 0.3)),
      ),
      child: child,
    );
  }
}
