import './globals.css';
import Sidebar from '@/components/sidebar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="flex bg-slate-50 min-h-screen text-gray-900 font-sans">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="p-8 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}