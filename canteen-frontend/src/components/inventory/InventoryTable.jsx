import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import Layout from '../common/Layout';
import { SkeletonBlock, TableRowSkeleton } from '../common/Skeleton';
import { AlertTriangle, CheckCircle } from 'lucide-react';

const InventoryTable = () => {
  const { user } = useAuth();

  const [items,        setItems]        = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [search,       setSearch]       = useState('');
  const [adjustItem,   setAdjustItem]   = useState(null);
  const [adjustQty,    setAdjustQty]    = useState('');
  const [adjustReason, setAdjustReason] = useState('');
  const [adjusting,    setAdjusting]    = useState(false);
  const [error,        setError]        = useState('');
  const [success,      setSuccess]      = useState('');

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await api.get('/inventory');
      setItems(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdjust = async (e) => {
    e.preventDefault();
    setAdjusting(true);
    setError('');
    try {
      const res = await api.patch(`/inventory/${adjustItem.id}/adjust`, {
        change_qty: Number(adjustQty),
        reason:     adjustReason,
      });
      setItems((prev) => prev.map((i) => i.id === adjustItem.id ? { ...i, stock_qty: res.data.stock_qty } : i));
      setSuccess(`Stock updated for ${adjustItem.name}!`);
      setAdjustItem(null);
      setAdjustQty('');
      setAdjustReason('');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to adjust stock. Please try again.');
    } finally {
      setAdjusting(false);
    }
  };

  const filtered = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const lowStockItems = items.filter((i) => i.stock_qty <= i.low_stock_threshold);

  const FilterBar = () => (
    <div className="bg-white rounded-2xl shadow p-4 mb-6 flex flex-wrap gap-3 items-center">
      <input
        type="text"
        placeholder="Search items..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="flex-1 min-w-[160px] border border-gray-200 rounded-lg px-4 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D8BFD8]"
      />
      <span className="ml-auto text-sm text-gray-400 whitespace-nowrap">{filtered.length} items</span>
    </div>
  );

  const FilterBarSkeleton = () => (
    <div className="bg-white rounded-2xl shadow p-4 mb-6 flex flex-wrap gap-3 items-center">
      <SkeletonBlock className="h-9 flex-1 min-w-[160px]" />
      <SkeletonBlock className="h-9 w-20" />
    </div>
  );

  if (loading) {
    return (
      <Layout title="Inventory Management">
        <div className="p-4 md:p-6">
          <FilterBarSkeleton />
          <div className="bg-white rounded-2xl shadow overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Item Name', 'Category', 'Stock Qty', 'Threshold', 'Status', 'Action'].map((h) => (
                    <th key={h} className="px-6 py-4 text-left text-sm font-semibold text-gray-600">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {Array.from({ length: 8 }).map((_, i) => <TableRowSkeleton key={i} cols={6} />)}
              </tbody>
            </table>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Inventory Management">
      <div className="p-4 md:p-6">

        {success && (
          <div className="bg-green-50 text-green-600 border border-green-200 rounded-xl px-4 py-3 mb-5 text-sm flex items-center gap-2">
            <CheckCircle size={16} color="#16a34a" />
            {success}
          </div>
        )}

        {lowStockItems.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
            <p className="text-red-600 font-semibold mb-2 text-sm md:text-base flex items-center gap-2">
              <AlertTriangle size={18} color="#dc2626" />
              Low Stock Alert — {lowStockItems.length} item(s) need restocking
            </p>
            <div className="flex flex-wrap gap-2">
              {lowStockItems.map((item) => (
                <span key={item.id} className="bg-red-100 text-red-600 text-xs px-3 py-1 rounded-full font-medium">
                  {item.name} ({item.stock_qty} left)
                </span>
              ))}
            </div>
          </div>
        )}

        <FilterBar />

        <div className="bg-white rounded-2xl shadow overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-gray-600 font-semibold">Item Name</th>
                <th className="text-left px-6 py-4 text-gray-600 font-semibold">Category</th>
                <th className="text-center px-6 py-4 text-gray-600 font-semibold">Stock Qty</th>
                <th className="text-center px-6 py-4 text-gray-600 font-semibold">Threshold</th>
                <th className="text-center px-6 py-4 text-gray-600 font-semibold">Status</th>
                <th className="text-center px-6 py-4 text-gray-600 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((item) => {
                const isLow = item.stock_qty <= item.low_stock_threshold;
                return (
                  <tr key={item.id} className={isLow ? 'bg-red-50' : 'hover:bg-gray-50'}>
                    <td className="px-6 py-4 font-medium text-gray-800">{item.name}</td>
                    <td className="px-6 py-4 text-gray-500">{item.category?.name}</td>
                    <td className="px-6 py-4 text-center font-bold text-gray-800">{item.stock_qty}</td>
                    <td className="px-6 py-4 text-center text-gray-500">{item.low_stock_threshold}</td>
                    <td className="px-6 py-4 text-center">
                      {isLow ? (
                        <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full font-medium">
                          Low Stock
                        </span>
                      ) : (
                        <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full font-medium">
                          OK
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => { setAdjustItem(item); setError(''); }}
                        className="bg-[#D8BFD8] text-gray-700 text-xs px-3 py-1.5 rounded-lg hover:bg-[#cbaecb] font-medium">
                        Adjust Stock
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {adjustItem && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-bold text-gray-800">Adjust Stock</h2>
              <button onClick={() => setAdjustItem(null)}
                className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-5">
              <p className="font-semibold text-gray-800">{adjustItem.name}</p>
              <p className="text-sm text-gray-500">Current Stock: <span className="font-bold text-gray-700">{adjustItem.stock_qty}</span></p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 border border-red-200 rounded-lg px-4 py-2 mb-4 text-sm flex items-center gap-2">
                <AlertTriangle size={15} color="#dc2626" />
                {error}
              </div>
            )}

            <form onSubmit={handleAdjust} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity Change
                </label>
                <input
                  type="number"
                  value={adjustQty}
                  onChange={(e) => setAdjustQty(e.target.value)}
                  required
                  placeholder="Use positive to add, negative to deduct"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D8BFD8]"
                />
                <p className="text-xs text-gray-400 mt-1">e.g. +10 to restock, -5 to deduct</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                <input
                  type="text"
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  required
                  placeholder="e.g. Manual restock, Damaged goods"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D8BFD8]"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setAdjustItem(null)}
                  className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-lg hover:bg-gray-50 text-sm font-medium">
                  Cancel
                </button>
                <button type="submit" disabled={adjusting}
                  className="flex-1 bg-[#D8BFD8] text-gray-700 py-2 rounded-lg hover:bg-[#cbaecb] text-sm font-medium disabled:opacity-50">
                  {adjusting ? 'Saving...' : 'Update Stock'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default InventoryTable;