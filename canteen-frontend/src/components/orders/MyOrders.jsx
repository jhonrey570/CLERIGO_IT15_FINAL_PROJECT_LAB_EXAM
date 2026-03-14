import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import CustomerLayout from '../common/CustomerLayout';
import { OrderCardSkeleton } from '../common/Skeleton';

const STATUS_COLORS = {
  pending:   'bg-yellow-100 text-yellow-700',
  preparing: 'bg-blue-100 text-blue-700',
  ready:     'bg-green-100 text-green-700',
  completed: 'bg-gray-100 text-gray-500',
  cancelled: 'bg-red-100 text-red-500',
};

const MyOrders = () => {
  const navigate = useNavigate();

  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const res = await api.get('/orders/my-orders');
        setOrders(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyOrders();
  }, []);

  const topbarActions = (
    <button
      onClick={() => navigate('/customer-menu')}
      className="bg-[#D8BFD8] text-gray-700 px-4 py-2 rounded-xl hover:bg-[#cbaecb] font-medium text-sm">
      + Place New Order
    </button>
  );

  return (
    <CustomerLayout title="My Orders" actions={topbarActions}>
      <div className="p-4 md:p-6">

        <div className="bg-white rounded-2xl shadow p-4 mb-6 flex items-center">
          <span className="text-sm text-gray-400">{orders.length} orders</span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => <OrderCardSkeleton key={i} />)}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-4">🧾</div>
            <p className="mb-4">You have no orders yet.</p>
            <button
              onClick={() => navigate('/customer-menu')}
              className="bg-[#D8BFD8] text-gray-700 px-6 py-2 rounded-xl hover:bg-[#cbaecb] font-medium text-sm">
              Browse Menu & Order
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {orders.map((order) => (
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

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Total</span>
                  <span className="font-bold text-gray-800">
                    ₱{Number(order.total_amount).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </CustomerLayout>
  );
};

export default MyOrders;