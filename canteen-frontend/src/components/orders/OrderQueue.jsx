import { useState, useEffect } from 'react';
import api from '../../services/api';
import Layout from '../common/Layout';
import { SkeletonBlock, OrderCardSkeleton } from '../common/Skeleton';

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
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState('all');

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

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  const FilterBar = () => (
    <div className="bg-white rounded-2xl shadow p-4 mb-6 flex flex-wrap gap-2 items-center">
      {['all', 'pending', 'preparing', 'ready', 'completed', 'cancelled'].map((s) => (
        <button key={s}
          onClick={() => setFilter(s)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${
            filter === s
              ? 'bg-[#D8BFD8] text-gray-700'
              : 'bg-gray-100 text-gray-600 hover:bg-[#f3eaf3]'
          }`}>
          {s} ({s === 'all' ? orders.length : orders.filter((o) => o.status === s).length})
        </button>
      ))}
      <span className="ml-auto text-sm text-gray-400 whitespace-nowrap">{filtered.length} orders</span>
    </div>
  );

  const FilterBarSkeleton = () => (
    <div className="bg-white rounded-2xl shadow p-4 mb-6 flex flex-wrap gap-2 items-center">
      {Array.from({ length: 6 }).map((_, i) => (
        <SkeletonBlock key={i} className="h-9 w-24" />
      ))}
    </div>
  );

  if (loading) {
    return (
      <Layout title="Order Queue">
        <div className="p-4 md:p-6">
          <FilterBarSkeleton />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => <OrderCardSkeleton key={i} />)}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Order Queue">
      <div className="p-4 md:p-6">

        <FilterBar />

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
                  <span className="font-bold text-gray-800">
                    ₱{Number(order.total_amount).toFixed(2)}
                  </span>
                </div>

                <div className="flex gap-2">
                  {NEXT_STATUS[order.status] && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, NEXT_STATUS[order.status])}
                      className="flex-1 bg-[#D8BFD8] text-gray-700 text-xs py-2 rounded-lg hover:bg-[#cbaecb] font-medium capitalize">
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
    </Layout>
  );
};

export default OrderQueue;