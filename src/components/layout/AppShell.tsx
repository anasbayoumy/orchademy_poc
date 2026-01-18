import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { User, Menu, X } from 'lucide-react';
import SidebarItem from './SidebarItem';
import { DASHBOARD_CONFIG } from '../../config/dashboardStructure';

interface AppShellProps {
  children: ReactNode;
}

const AppShell = ({ children }: AppShellProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden animate-fade-in"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-white border-r border-gray-200 flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          shadow-lg lg:shadow-none
        `}
        aria-label="Main navigation"
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Dashboard POC</h1>
            <p className="text-xs text-gray-500 mt-1">Data-Driven Analytics</p>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Navigation */}
        <nav 
          className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
          aria-label="Navigation menu"
        >
          {DASHBOARD_CONFIG.navigation.map((item, index) => (
            <div key={item.id} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
              <SidebarItem item={item} />
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <header 
          className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 shadow-sm"
          role="banner"
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              aria-label="Open menu"
              aria-expanded={isMobileMenuOpen}
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Dashboard</h2>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div 
              className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              role="button"
              tabIndex={0}
              aria-label="User profile"
            >
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" aria-hidden="true" />
              </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:inline">Admin User</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main 
          className="flex-1 overflow-y-auto p-4 lg:p-6 animate-fade-in"
          role="main"
          id="main-content"
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppShell;
