 import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const InventoryLogs = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [logs,    setLogs]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await api.get('/inventory/logs');
      setLogs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const filtered = logs.filter((log) =>
    log.menu_item?.name.toLowerCase().includes(search.toLowerCase()) ||
    log.reason?.toLowerCase().includes(search.toLowerCase()) ||
    log.user?.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-500">Loading inventory logs...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🍽️</span>
          <span className="text-xl font-bold text-gray-800">Canteen System</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            {isAdmin ? '👑' : '💳'} {user?.name}
          </span>
          {isAdmin && (
            <button onClick={() => navigate('/dashboard')}
              className="text-sm bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100">
              Dashboard
            </button>
          )}
          <button onClick={() => navigate('/inventory')}
            className="text-sm bg-green-50 text-green-600 px-3 py-1.5 rounded-lg hover:bg-green-100">
            Inventory
          </button>
          <button onClick={() => navigate('/menu')}
            className="text-sm bg-gray-50 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-100">
            Menu
          </button>
          <button onClick={() => navigate('/pos')}
            className="text-sm bg-purple-50 text-purple-600 px-3 py-1.5 rounded-lg hover:bg-purple-100">
            POS
          </button>
          <button onClick={() => navigate('/orders')}
            className="text-sm bg-yellow-50 text-yellow-600 px-3 py-1.5 rounded-lg hover:bg-yellow-100">
            Order Queue
          </button>
          <button onClick={handleLogout}
            className="text-sm bg-red-50 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-100">
            Logout
          </button>
        </div>
      </nav>

      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Inventory Logs</h1>
          <button onClick={() => navigate('/inventory')}
            className="text-sm bg-white border border-gray-300 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50">
            ← Back to Inventory
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow p-4 mb-6">
          <input
            type="text"
            placeholder="Search by item, reason or user..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-72"
          />
        </div>

        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-gray-600 font-semibold">Item</th>
                <th className="text-center px-6 py-4 text-gray-600 font-semibold">Change</th>
                <th className="text-left px-6 py-4 text-gray-600 font-semibold">Reason</th>
                <th className="text-left px-6 py-4 text-gray-600 font-semibold">By</th>
                <th className="text-left px-6 py-4 text-gray-600 font-semibold">Date & Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-20 text-gray-400">
                    No logs found.
                  </td>
                </tr>
              ) : (
                filtered.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {log.menu_item?.name}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                        log.change_qty > 0
                          ? 'bg-green-100 text-green-600'
                          : 'bg-red-100 text-red-500'
                      }`}>
                        {log.change_qty > 0 ? `+${log.change_qty}` : log.change_qty}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{log.reason}</td>
                    <td className="px-6 py-4 text-gray-500">{log.user?.name}</td>
                    <td className="px-6 py-4 text-gray-400">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InventoryLogs;
