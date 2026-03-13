import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const STATUS_COLORS = {
  pending:   'bg-yellow-100 text-yellow-700',
  preparing: 'bg-blue-100 text-blue-700',
  ready:     'bg-green-100 text-green-700',
  completed: 'bg-gray-100 text-gray-500',
  cancelled: 'bg-red-100 text-red-500',
};

const NEXT_STATUS = {
  pending:   'preparing',
  preparing: 'ready',
  ready:     'completed',
};

const OrderQueue = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState('all');

  const isAdmin = user?.role === 'admin';

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders');
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdateStatus = async (orderId, status) => {
    try {
      const res = await api.patch(`/orders/${orderId}/status`, { status });
      setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status: res.data.status } : o));
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-500">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🍽️</span>
          <span className="text-xl font-bold text-gray-800">Order Queue</span>
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
          <button onClick={() => navigate('/pos')}
            className="text-sm bg-purple-50 text-purple-600 px-3 py-1.5 rounded-lg hover:bg-purple-100">
            POS
          </button>
          <button onClick={() => navigate('/menu')}
            className="text-sm bg-gray-50 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-100">
            Menu
          </button>
          <button onClick={() => navigate('/inventory')}
            className="text-sm bg-green-50 text-green-600 px-3 py-1.5 rounded-lg hover:bg-green-100">
            Inventory
          </button>
          <button onClick={handleLogout}
            className="text-sm bg-red-50 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-100">
            Logout
          </button>
        </div>
      </nav>

      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Order Queue</h1>
        </div>

        <div className="bg-white rounded-2xl shadow p-4 mb-6 flex gap-2 flex-wrap">
          {['all', 'pending', 'preparing', 'ready', 'completed', 'cancelled'].map((s) => (
            <button key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize ${filter === s ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {s} {s === 'all' ? `(${orders.length})` : `(${orders.filter((o) => o.status === s).length})`}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">No orders found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl shadow p-5">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-bold text-gray-800">{order.order_number}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(order.created_at).toLocaleString()}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold capitalize ${STATUS_COLORS[order.status]}`}>
                    {order.status}
                  </span>
                </div>

                <div className="border-t border-b border-gray-100 py-3 mb-3 space-y-1">
                  {order.order_items?.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.menu_item?.name} x{item.quantity}
                      </span>
                      <span className="text-gray-700 font-medium">
                        ₱{Number(item.subtotal).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-500">Total</span>
                  <span className="font-bold text-blue-600">
                    ₱{Number(order.total_amount).toFixed(2)}
                  </span>
                </div>

                <div className="flex gap-2">
                  {NEXT_STATUS[order.status] && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, NEXT_STATUS[order.status])}
                      className="flex-1 bg-blue-600 text-white text-xs py-2 rounded-lg hover:bg-blue-700 font-medium capitalize">
                      Mark as {NEXT_STATUS[order.status]}
                    </button>
                  )}
                  {order.status !== 'completed' && order.status !== 'cancelled' && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, 'cancelled')}
                      className="flex-1 bg-red-50 text-red-500 text-xs py-2 rounded-lg hover:bg-red-100 font-medium">
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderQueue;