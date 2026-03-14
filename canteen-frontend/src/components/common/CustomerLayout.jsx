import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UtensilsCrossed, ShoppingBag, LogOut, Menu, X } from 'lucide-react';

const CustomerLayout = ({ children, title, actions }) => {
  const { user, logout } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;
  const iconColor = '#8A8B8E';

  const navLinks = [
    { path: '/customer-menu', icon: <UtensilsCrossed size={18} color={iconColor} />, label: 'Browse Menu' },
    { path: '/my-orders',     icon: <ShoppingBag     size={18} color={iconColor} />, label: 'My Orders'   },
  ];

  const linkClass = (path) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
      isActive(path)
        ? 'bg-[#D8BFD8] text-gray-700 shadow-sm'
        : 'text-gray-500 hover:bg-[#f3eaf3] hover:text-gray-700'
    }`;

  const SidebarContent = ({ onNavigate }) => (
    <div className="w-full h-full bg-white flex flex-col">
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#D8BFD8] flex items-center justify-center font-bold text-sm text-gray-700">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
            <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 px-4 py-4 space-y-1">
        {navLinks.map((link) => (
          <button
            key={link.path}
            onClick={() => { navigate(link.path); if (onNavigate) onNavigate(); }}
            className={`w-full ${linkClass(link.path)}`}>
            {link.icon}
            <span>{link.label}</span>
          </button>
        ))}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all mt-1">
          <LogOut size={18} color={iconColor} />
          <span>Logout</span>
        </button>
      </nav>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-gray-100">

      {/* Full Width Sticky Top Bar */}
      <div className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100 px-4 md:px-6 h-16 flex justify-between items-center w-full shrink-0">
        <div className="flex items-center gap-3">
          <button
            className="md:hidden text-gray-500 hover:text-gray-700"
            onClick={() => setSidebarOpen(true)}>
            <Menu size={22} />
          </button>
          <UtensilsCrossed size={20} color="#D8BFD8" />
          <span className="text-base md:text-lg font-bold text-gray-800">Canteen System</span>
          {title && (
            <div className="hidden md:flex items-center gap-3">
              <span className="text-gray-300">|</span>
              <span className="text-base font-semibold text-gray-600">{title}</span>
            </div>
          )}
        </div>
        {actions && (
          <div className="hidden md:flex items-center gap-3">
            {actions}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">

        {/* Desktop Sidebar */}
        <div className="hidden md:block w-60 shrink-0 overflow-y-auto">
          <SidebarContent />
        </div>

        {/* Mobile Overlay */}
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
          <SidebarContent onNavigate={() => setSidebarOpen(false)} />
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto">
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

export default CustomerLayout;