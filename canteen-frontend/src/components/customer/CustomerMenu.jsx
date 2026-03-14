import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import api from '../../services/api';
import CustomerLayout from '../common/CustomerLayout';
import { ShoppingCart, X } from 'lucide-react';
import { MenuCardSkeleton, SkeletonBlock } from '../common/Skeleton';

const CustomerMenu = () => {
  const { user } = useAuth();
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
  const [cartOpen,       setCartOpen]       = useState(false);

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
      setSuccess('Order placed! Redirecting to your orders...');
      setTimeout(() => navigate('/my-orders'), 2000);
    } catch (err) {
      setError('Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = items.filter((item) => {
    const matchSearch   = item.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = activeCategory === 'all' || item.category_id === Number(activeCategory);
    return matchSearch && matchCategory;
  });

  const CartPanel = () => (
    <>
      <div className="px-5 py-4 border-b border-gray-100 shrink-0">
        <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
          <ShoppingCart size={18} color="#8A8B8E" />
          My Cart
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {cartItems.length === 0 ? (
          <div className="text-center text-gray-400 mt-10 text-sm">
            No items added yet. Click items to add them.
          </div>
        ) : (
          cartItems.map((item) => (
            <div key={item.id} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-lg">🍴</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                <p className="text-xs text-gray-500">₱{Number(item.price).toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-6 h-6 bg-[#D8BFD8] text-gray-700 rounded-full text-sm font-bold hover:bg-[#cbaecb]">-</button>
                <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-6 h-6 bg-[#D8BFD8] text-gray-700 rounded-full text-sm font-bold hover:bg-[#cbaecb]">+</button>
              </div>
              <button onClick={() => removeFromCart(item.id)}
                className="text-red-300 hover:text-red-500 text-lg shrink-0">✕</button>
            </div>
          ))
        )}
      </div>
      <div className="p-5 border-t border-gray-100 shrink-0">
        {error && <div className="bg-red-50 text-red-600 text-xs rounded-lg px-3 py-2 mb-3">{error}</div>}
        {success && <div className="bg-green-50 text-green-600 text-xs rounded-lg px-3 py-2 mb-3">{success}</div>}
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600 font-medium text-sm">Total</span>
          <span className="text-2xl font-bold text-gray-800">₱{total.toFixed(2)}</span>
        </div>
        <button
          onClick={handlePlaceOrder}
          disabled={cartItems.length === 0 || submitting}
          className="w-full bg-[#D8BFD8] text-gray-700 py-2.5 rounded-xl font-semibold hover:bg-[#cbaecb] disabled:opacity-50 disabled:cursor-not-allowed text-sm">
          {submitting ? 'Placing Order...' : 'Place Order'}
        </button>
        {cartItems.length > 0 && (
          <button onClick={clearCart} className="w-full mt-2 text-sm text-red-400 hover:text-red-600">
            Clear Cart
          </button>
        )}
      </div>
    </>
  );

  const FilterBar = () => (
    <div className="bg-white rounded-2xl shadow p-4 mb-6 flex flex-wrap gap-3 items-center">
      <input
        type="text"
        placeholder="Search items..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="flex-1 min-w-[160px] border border-gray-200 rounded-lg px-4 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D8BFD8]"
      />
      <div className="flex gap-2 flex-wrap items-center">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
            activeCategory === 'all' ? 'bg-[#D8BFD8] text-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-[#f3eaf3]'
          }`}>
          All
        </button>
        {categories.map((cat) => (
          <button key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeCategory === cat.id ? 'bg-[#D8BFD8] text-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-[#f3eaf3]'
            }`}>
            {cat.name}
          </button>
        ))}
      </div>
      <span className="ml-auto text-sm text-gray-400 whitespace-nowrap">{filtered.length} items</span>
    </div>
  );

  const FilterBarSkeleton = () => (
    <div className="bg-white rounded-2xl shadow p-4 mb-6 flex flex-wrap gap-3 items-center">
      <SkeletonBlock className="h-9 flex-1 min-w-[160px]" />
      <div className="flex gap-2 flex-wrap">
        {Array.from({ length: 6 }).map((_, i) => <SkeletonBlock key={i} className="h-9 w-20" />)}
      </div>
    </div>
  );

  return (
    <CustomerLayout title="Browse Menu">
      <div className="flex overflow-hidden" style={{ height: 'calc(100vh - 64px)' }}>

        {/* Menu Items */}
        <div className="flex-1 p-4 md:p-6 overflow-y-auto">
          {loading ? (
            <>
              <FilterBarSkeleton />
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => <MenuCardSkeleton key={i} />)}
              </div>
            </>
          ) : (
            <>
              <FilterBar />
              {filtered.length === 0 ? (
                <div className="text-center py-20 text-gray-400">No items found.</div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filtered.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => addToCart(item)}
                      disabled={item.stock_qty === 0}
                      className="bg-white rounded-2xl shadow p-4 text-left hover:shadow-md transition disabled:opacity-40 disabled:cursor-not-allowed">
                      <div className="bg-gray-100 rounded-xl h-24 flex items-center justify-center overflow-hidden mb-3">
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.name} className="w-full h-full object-cover rounded-xl" />
                        ) : (
                          <span className="text-3xl">🍴</span>
                        )}
                      </div>
                      <p className="text-sm font-semibold text-gray-800 line-clamp-1">{item.name}</p>
                      <p className="text-xs text-gray-400 mb-1">{item.category?.name}</p>
                      <p className="text-gray-700 font-bold text-sm">₱{Number(item.price).toFixed(2)}</p>
                      <p className="text-xs text-gray-400">Stock: {item.stock_qty}</p>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Desktop Cart Panel */}
        <div className="hidden md:flex w-80 bg-white shadow-lg flex-col border-l border-gray-100 shrink-0">
          <CartPanel />
        </div>

        {/* Mobile Floating Cart Button */}
        <button
          onClick={() => setCartOpen(true)}
          className="md:hidden fixed bottom-6 right-6 z-40 bg-[#D8BFD8] text-gray-700 rounded-full shadow-lg px-5 py-3 flex items-center gap-2 font-semibold text-sm hover:bg-[#cbaecb]">
          <ShoppingCart size={18} />
          {cartItems.length > 0 && (
            <span className="bg-gray-700 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cartItems.reduce((sum, i) => sum + i.quantity, 0)}
            </span>
          )}
          Cart
        </button>

        {/* Mobile Cart Overlay */}
        {cartOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black bg-opacity-40 z-40"
            onClick={() => setCartOpen(false)}
          />
        )}

        {/* Mobile Cart Drawer — slides up from bottom */}
        <div className={`md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-xl flex flex-col transform transition-transform duration-300 ${
          cartOpen ? 'translate-y-0' : 'translate-y-full'
        }`} style={{ maxHeight: '80vh' }}>
          <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100 shrink-0">
            <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
              <ShoppingCart size={18} color="#8A8B8E" />
              My Cart
            </h2>
            <button onClick={() => setCartOpen(false)} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cartItems.length === 0 ? (
              <div className="text-center text-gray-400 mt-10 text-sm">
                No items added yet. Click items to add them.
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-lg">🍴</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                    <p className="text-xs text-gray-500">₱{Number(item.price).toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-6 h-6 bg-[#D8BFD8] text-gray-700 rounded-full text-sm font-bold hover:bg-[#cbaecb]">-</button>
                    <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-6 h-6 bg-[#D8BFD8] text-gray-700 rounded-full text-sm font-bold hover:bg-[#cbaecb]">+</button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)}
                    className="text-red-300 hover:text-red-500 text-lg shrink-0">✕</button>
                </div>
              ))
            )}
          </div>
          <div className="p-5 border-t border-gray-100 shrink-0">
            {error && <div className="bg-red-50 text-red-600 text-xs rounded-lg px-3 py-2 mb-3">{error}</div>}
            {success && <div className="bg-green-50 text-green-600 text-xs rounded-lg px-3 py-2 mb-3">{success}</div>}
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600 font-medium text-sm">Total</span>
              <span className="text-2xl font-bold text-gray-800">₱{total.toFixed(2)}</span>
            </div>
            <button
              onClick={handlePlaceOrder}
              disabled={cartItems.length === 0 || submitting}
              className="w-full bg-[#D8BFD8] text-gray-700 py-2.5 rounded-xl font-semibold hover:bg-[#cbaecb] disabled:opacity-50 disabled:cursor-not-allowed text-sm">
              {submitting ? 'Placing Order...' : 'Place Order'}
            </button>
            {cartItems.length > 0 && (
              <button onClick={clearCart} className="w-full mt-2 text-sm text-red-400 hover:text-red-600">
                Clear Cart
              </button>
            )}
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default CustomerMenu;