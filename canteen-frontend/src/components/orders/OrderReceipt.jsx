 const OrderReceipt = ({ order, onNewOrder }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">✅</div>
          <h2 className="text-2xl font-bold text-gray-800">Order Placed!</h2>
          <p className="text-gray-500 text-sm mt-1">Order #{order.order_number}</p>
        </div>

        <div className="border-t border-b border-gray-100 py-4 mb-4 space-y-2">
          {order.order_items?.map((item, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span className="text-gray-700">
                {item.menu_item?.name} x{item.quantity}
              </span>
              <span className="font-medium text-gray-800">
                ₱{Number(item.subtotal).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mb-6">
          <span className="font-semibold text-gray-700">Total</span>
          <span className="text-2xl font-bold text-blue-600">
            ₱{Number(order.total_amount).toFixed(2)}
          </span>
        </div>

        <div className="bg-blue-50 rounded-xl p-3 mb-6 text-center">
          <p className="text-sm text-blue-600 font-medium">
            Status: <span className="uppercase">{order.status}</span>
          </p>
        </div>

        <button
          onClick={onNewOrder}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700"
        >
          New Order
        </button>
      </div>
    </div>
  );
};

export default OrderReceipt;
