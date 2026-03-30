import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, Users, Truck, Settings, LogOut } from 'lucide-react';
import { cn } from '../lib/utils';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

export default function Layout() {
  const location = useLocation();

  const navigation = [
    { name: 'Beranda', href: '/', icon: LayoutDashboard },
    { name: 'Faktur', href: '/invoices', icon: FileText },
    { name: 'Klien', href: '/clients', icon: Users },
    { name: 'Pemasok', href: '/suppliers', icon: Truck },
    { name: 'Pengaturan', href: '/settings', icon: Settings },
  ];

  const handleSignOut = () => {
    signOut(auth);
  };

  return (
    <div className="flex h-screen bg-gray-50 print:h-auto print:bg-white">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col print:hidden">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-indigo-600">Invoice Koperasi Garuda Merah Putih</h1>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href || (item.href !== '/' && location.pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  isActive
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                  'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                )}
              >
                <item.icon
                  className={cn(
                    isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-500',
                    'mr-3 flex-shrink-0 h-5 w-5'
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleSignOut}
            className="group flex w-full items-center px-2 py-2 text-sm font-medium rounded-md text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <LogOut className="mr-3 flex-shrink-0 h-5 w-5 text-red-500 group-hover:text-red-600" aria-hidden="true" />
            Keluar
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden print:overflow-visible">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 print:hidden">
          <h2 className="text-lg font-medium text-gray-900">
            {navigation.find((n) => location.pathname === n.href || (n.href !== '/' && location.pathname.startsWith(n.href)))?.name || 'Beranda'}
          </h2>
        </header>
        <main className="flex-1 overflow-y-auto p-6 print:overflow-visible print:p-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
