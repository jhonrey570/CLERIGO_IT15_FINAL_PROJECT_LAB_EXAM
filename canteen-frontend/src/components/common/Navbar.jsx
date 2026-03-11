 import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <span className="text-2xl">🍽️</span>
        <span className="text-xl font-bold text-gray-800">Canteen System</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">
          {user?.role === 'admin' ? '👑' : '💳'} {user?.name}
        </span>
        {user?.role === 'admin' && (
          <>
            <button onClick={() => navigate('/dashboard')}
              className="text-sm bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100">
              Dashboard
            </button>
            <button onClick={() => navigate('/menu')}
              className="text-sm bg-gray-50 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-100">
              Menu
            </button>
            <button onClick={() => navigate('/inventory')}
              className="text-sm bg-green-50 text-green-600 px-3 py-1.5 rounded-lg hover:bg-green-100">
              Inventory
            </button>
          </>
        )}
        <button onClick={() => navigate('/pos')}
          className="text-sm bg-purple-50 text-purple-600 px-3 py-1.5 rounded-lg hover:bg-purple-100">
          POS
        </button>
        <button onClick={() => navigate('/orders')}
          className="text-sm bg-yellow-50 text-yellow-600 px-3 py-1.5 rounded-lg hover:bg-yellow-100">
          Orders
        </button>
        <button onClick={handleLogout}
          className="text-sm bg-red-50 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-100">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
