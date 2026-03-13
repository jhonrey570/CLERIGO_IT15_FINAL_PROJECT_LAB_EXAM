 import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import api from '../../services/api';

const CustomerMenu = () => {
  const { user, logout } = useAuth();
  const { cartItems, addToCart, removeFromCart, updateQuantity, clearCart, total } = useCart();
  const navigate = useNavigate();

  const [items,          setItems]          = useState([]);
  const [categories,     setCategories]     = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [search,         setSearch]         = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [submitting,     setSubmitting]     = useState(false);
  const [error,          setError]          = useState('');
  const [success,        setSuccess]        = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemsRes, catsRes] = await Promise.all([
          api.get('/menu-items'),
          api.get('/categories'),
        ]);
        setItems(itemsRes.data.filter((i) => i.is_available));
        setCategories(catsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) return;
    setSubmitting(true);
    setError('');
    try {
      const orderItems = cartItems.map((i) => ({
        menu_item_id: i.id,
        quantity:     i.quantity,
      }));
      await api.post('/orders', { items: orderItems });
      clearCart();
      setSuccess('Order placed successfully! Redirecting to your orders...');
      setTimeout(() => navigate('/my-orders'), 2000);
    } catch (err) {
      setError('Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const filtered = items.filter((item) => {
    const matchSearch   = item.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = activeCategory === 'all' || item.category_id === Number(activeCategory);
    return matchSearch && matchCategory;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-500">Loading menu...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🍽️</span>
          <span className="text-xl font-bold text-gray-800">Canteen System</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">👤 {user?.name}</span>
          <button onClick={() => navigate('/my-orders')}
            className="text-sm bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100">
            My Orders
          </button>
          <button onClick={handleLogout}
            className="text-sm bg-red-50 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-100">
            Logout
          </button>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 p-6 overflow-y-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-5">Browse Menu</h1>

          <div className="flex flex-wrap gap-3 mb-5">
            <input
              type="text"
              placeholder="Search items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-56"
            />
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium ${activeCategory === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>
                All
              </button>
              {categories.map((cat) => (
                <button key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium ${activeCategory === cat.id ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-400">No items found.</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filtered.map((item) => (
                <button
                  key={item.id}
                  onClick={() => addToCart(item)}
                  disabled={item.stock_qty === 0}
                  className="bg-white rounded-2xl shadow p-4 text-left hover:shadow-md transition disabled:opacity-40 disabled:cursor-not-allowed">
                  <div className="bg-gray-100 rounded-xl h-24 flex items-center justify-center text-3xl mb-3">
                    🍴
                  </div>
                  <p className="text-sm font-semibold text-gray-800 line-clamp-1">{item.name}</p>
                  <p className="text-xs text-gray-400 mb-1">{item.category?.name}</p>
                  <p className="text-blue-600 font-bold text-sm">₱{Number(item.price).toFixed(2)}</p>
                  <p className="text-xs text-gray-400">Stock: {item.stock_qty}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="w-80 bg-white shadow-lg flex flex-col">
          <div className="p-5 border-b">
            <h2 className="text-lg font-bold text-gray-800">🛒 My Cart</h2>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cartItems.length === 0 ? (
              <div className="text-center text-gray-400 mt-10 text-sm">
                No items added yet. Click items to add them.
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{item.name}</p>
                    <p className="text-xs text-blue-600">₱{Number(item.price).toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-6 h-6 bg-gray-200 rounded-full text-sm font-bold hover:bg-gray-300">
                      -
                    </button>
                    <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-6 h-6 bg-gray-200 rounded-full text-sm font-bold hover:bg-gray-300">
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-400 hover:text-red-600 text-lg">
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="p-5 border-t">
            {error && (
              <div className="bg-red-50 text-red-600 text-xs rounded-lg px-3 py-2 mb-3">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-50 text-green-600 text-xs rounded-lg px-3 py-2 mb-3">
                ✅ {success}
              </div>
            )}
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600 font-medium">Total</span>
              <span className="text-2xl font-bold text-blue-600">
                ₱{total.toFixed(2)}
              </span>
            </div>
            <button
              onClick={handlePlaceOrder}
              disabled={cartItems.length === 0 || submitting}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
              {submitting ? 'Placing Order...' : 'Place Order'}
            </button>
            {cartItems.length > 0 && (
              <button
                onClick={clearCart}
                className="w-full mt-2 text-sm text-red-400 hover:text-red-600">
                Clear Cart
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerMenu;
