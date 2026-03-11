 import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const adminLinks = [
    { label: 'Dashboard',  path: '/dashboard',  icon: '📊' },
    { label: 'Menu',       path: '/menu',        icon: '🍴' },
    { label: 'Inventory',  path: '/inventory',   icon: '📦' },
    { label: 'POS',        path: '/pos',         icon: '💳' },
    { label: 'Orders',     path: '/orders',      icon: '🧾' },
  ];

  const cashierLinks = [
    { label: 'POS',    path: '/pos',    icon: '💳' },
    { label: 'Orders', path: '/orders', icon: '🧾' },
  ];

  const links = user?.role === 'admin' ? adminLinks : cashierLinks;

  return (
    <div className="w-56 min-h-screen bg-white shadow-lg flex flex-col">
      <div className="p-6 border-b">
        <div className="text-2xl mb-1">🍽️</div>
        <p className="font-bold text-gray-800">Canteen System</p>
        <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => (
          <button
            key={link.path}
            onClick={() => navigate(link.path)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
              location.pathname === link.path
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}>
            <span>{link.icon}</span>
            <span>{link.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t">
        <div className="px-4 py-2 mb-2">
          <p className="text-xs text-gray-500">Logged in as</p>
          <p className="text-sm font-semibold text-gray-700">{user?.name}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition">
          <span>🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
