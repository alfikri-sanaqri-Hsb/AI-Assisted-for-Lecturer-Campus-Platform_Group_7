import Link from 'next/link'; // Opsional: Gunakan heroicons jika ada

export default function Sidebar() {
  const menuItems = [
    { name: 'Home', href: '/', icon: '🏠' },
    { name: 'Study', href: '/study', icon: '📚' },
    { name: 'Predict', href: '/predict', icon: '🎯' },
    { name: 'Progress', href: '/progress', icon: '📈' },
    { name: 'Mentor', href: '/mentor', icon: '👨‍🏫' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 text-gray-800 min-h-screen flex flex-col shadow-sm">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-2xl font-extrabold text-blue-600 tracking-tight">Sahabat Belajar</h2>
        <p className="text-xs text-gray-500 mt-1">Fokus PTN & UTBK</p>
      </div>
      <nav className="flex flex-col gap-2 p-4 flex-1">
        {menuItems.map((item) => (
          <Link 
            key={item.name} 
            href={item.href} 
            className="flex items-center gap-3 hover:bg-blue-50 hover:text-blue-600 p-3 rounded-xl transition-all font-medium text-gray-600"
          >
            <span className="text-xl">{item.icon}</span>
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}