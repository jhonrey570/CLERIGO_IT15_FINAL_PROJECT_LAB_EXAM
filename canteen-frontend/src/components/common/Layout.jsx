import { useState } from 'react';
import Sidebar from './Sidebar';
import { Menu, X } from 'lucide-react';

const Layout = ({ children, title, actions }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-gray-100">

      {/* Full Width Sticky Top Bar */}
      <div className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100 px-4 md:px-6 h-auto md:h-16 flex flex-col md:flex-row md:justify-between md:items-center w-full shrink-0">

        {/* Top row: burger + logo + title */}
        <div className="flex items-center gap-3 h-16">
          <button
            className="md:hidden text-gray-500 hover:text-gray-700"
            onClick={() => setSidebarOpen(true)}>
            <Menu size={22} />
          </button>
          <span className="text-base md:text-lg font-bold text-gray-800">🍽️ Canteen System</span>
          {title && (
            <div className="hidden md:flex items-center gap-3">
              <span className="text-gray-300">|</span>
              <span className="text-base font-semibold text-gray-600">{title}</span>
            </div>
          )}
        </div>

        {/* Actions — desktop: inline in topbar, mobile: below logo row */}
        {actions && (
          <div className="flex flex-wrap items-center gap-2 pb-3 md:pb-0 md:gap-3">
            {actions}
          </div>
        )}
      </div>

      {/* Body: Sidebar + Content */}
      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar — desktop only */}
        <div className="hidden md:block w-60 shrink-0 overflow-y-auto">
          <Sidebar />
        </div>

        {/* Mobile Drawer Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Mobile Drawer */}
        <div className={`fixed top-0 left-0 h-full w-64 bg-white z-50 shadow-xl transform transition-transform duration-300 md:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100">
            <span className="text-base font-bold text-gray-800">🍽️ Canteen System</span>
            <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>
          <Sidebar onNavigate={() => setSidebarOpen(false)} />
        </div>

        {/* Page Content — scrollable */}
        <div className="flex-1 overflow-y-auto">
          {/* Mobile: show title below topbar */}
          {title && (
            <div className="md:hidden bg-white border-b border-gray-100 px-4 py-3">
              <span className="text-sm font-semibold text-gray-700">{title}</span>
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;