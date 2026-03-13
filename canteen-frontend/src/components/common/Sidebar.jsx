import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  UtensilsCrossed,
  Package,
  ClipboardList,
  ShoppingCart,
  Receipt,
  Users,
  LogOut,
} from 'lucide-react';

const Sidebar = ({ onNavigate }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isAdmin   = user?.role === 'admin';
  const isCashier = user?.role === 'cashier';

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleNav = (path) => {
    navigate(path);
    if (onNavigate) onNavigate();
  };

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
      isActive(path)
        ? 'bg-[#D8BFD8] text-gray-700 shadow-sm'
        : 'text-gray-500 hover:bg-[#f3eaf3] hover:text-gray-700'
    }`;

  const iconColor = '#8A8B8E';

  const adminLinks = [
    { path: '/dashboard',      icon: <LayoutDashboard size={18} color={iconColor} />, label: 'Dashboard'      },
    { path: '/menu',           icon: <UtensilsCrossed size={18} color={iconColor} />, label: 'Menu'           },
    { path: '/inventory',      icon: <Package         size={18} color={iconColor} />, label: 'Inventory'      },
    { path: '/inventory/logs', icon: <ClipboardList   size={18} color={iconColor} />, label: 'Inventory Logs' },
    { path: '/pos',            icon: <ShoppingCart    size={18} color={iconColor} />, label: 'POS'            },
    { path: '/orders',         icon: <Receipt         size={18} color={iconColor} />, label: 'Orders'         },
    { path: '/users',          icon: <Users           size={18} color={iconColor} />, label: 'Users'          },
  ];

  const cashierLinks = [
    { path: '/pos',            icon: <ShoppingCart    size={18} color={iconColor} />, label: 'POS'            },
    { path: '/menu',           icon: <UtensilsCrossed size={18} color={iconColor} />, label: 'Menu'           },
    { path: '/inventory',      icon: <Package         size={18} color={iconColor} />, label: 'Inventory'      },
    { path: '/inventory/logs', icon: <ClipboardList   size={18} color={iconColor} />, label: 'Inventory Logs' },
    { path: '/orders',         icon: <Receipt         size={18} color={iconColor} />, label: 'Order Queue'    },
  ];

  const links = isAdmin ? adminLinks : isCashier ? cashierLinks : [];

  return (
    <div className="w-full h-full bg-white flex flex-col">

      {/* User Info */}
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

      {/* Nav Links + Logout */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {links.map((link) => (
          <button
            key={link.path}
            onClick={() => handleNav(link.path)}
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
};

export default Sidebar;