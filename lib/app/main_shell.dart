import 'package:flutter/material.dart';
import '../features/home/screens/home_screen.dart';

class MainShell extends StatefulWidget {
  const MainShell({super.key});

  @override
  State<MainShell> createState() => _MainShellState();
}

class _MainShellState extends State<MainShell> {
  int _selectedIndex = 2; // Default di halaman Home

  final List<Widget> _pages = [
    const Center(child: Text('Halaman Study')),
    const Center(child: Text('Halaman Progress')),
    const HomeScreen(),
    const Center(child: Text('Halaman Ranking')),
    const Center(child: Text('Halaman Mentor')),
  ];

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    const Color primaryBlue = Color(0xFF4A90E2); 
    const Color unselectedGrey = Color(0xFFAAAAAA);

    return Scaffold(
      body: _pages[_selectedIndex],
      
      bottomNavigationBar: Container(
        decoration: const BoxDecoration(
          border: Border(
            top: BorderSide(color: Color(0xFFE0E0E0), width: 1.0),
          ),
        ),
        child: BottomNavigationBar(
          type: BottomNavigationBarType.fixed,
          backgroundColor: Colors.white,
          elevation: 0, 
          
          selectedItemColor: primaryBlue,
          unselectedItemColor: unselectedGrey,
          showUnselectedLabels: true,
          selectedLabelStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
          unselectedLabelStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
          
          currentIndex: _selectedIndex,
          onTap: _onItemTapped,
          
          items: [
            const BottomNavigationBarItem(
              icon: Padding(
                padding: EdgeInsets.only(bottom: 4.0),
                child: Icon(Icons.menu_book, size: 26), 
              ),
              label: 'Study',
            ),
            const BottomNavigationBarItem(
              icon: Padding(
                padding: EdgeInsets.only(bottom: 4.0),
                child: Icon(Icons.bar_chart_outlined, size: 26),
              ),
              label: 'Progress',
            ),
            BottomNavigationBarItem(
              icon: Container(
                margin: const EdgeInsets.only(bottom: 4.0),
                padding: const EdgeInsets.all(6), 
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  border: Border.all(
                    color: _selectedIndex == 2 ? primaryBlue : unselectedGrey,
                    width: 3.5, 
                  ),
                ),
                child: Icon(
                  Icons.home_outlined, 
                  size: 28,
                  color: _selectedIndex == 2 ? primaryBlue : unselectedGrey,
                ),
              ),
              label: 'Home',
            ),
            const BottomNavigationBarItem(
              icon: Padding(
                padding: EdgeInsets.only(bottom: 4.0),
                child: Icon(Icons.leaderboard_outlined, size: 26),
              ),
              label: 'Ranking',
            ),
            const BottomNavigationBarItem(
              icon: Padding(
                padding: EdgeInsets.only(bottom: 4.0),
                child: Icon(Icons.school_outlined, size: 26),
              ),
              label: 'Mentor',
            ),
          ],
        ),
      ),
    );
  }
}