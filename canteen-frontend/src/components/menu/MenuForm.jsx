import { useState, useEffect } from 'react';
import api from '../../services/api';
import { AlertTriangle } from 'lucide-react';

const MenuForm = ({ item, categories, onSaved, onClose }) => {
  const isEdit = !!item;

  const [form, setForm] = useState({
    name:                '',
    description:         '',
    price:               '',
    stock_qty:           '',
    low_stock_threshold: '5',
    category_id:         '',
    is_available:        true,
  });
  const [image,   setImage]   = useState(null);
  const [preview, setPreview] = useState(null);
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (item) {
      setForm({
        name:                item.name,
        description:         item.description || '',
        price:               item.price,
        stock_qty:           item.stock_qty,
        low_stock_threshold: item.low_stock_threshold,
        category_id:         item.category_id,
        is_available:        item.is_available,
      });
      if (item.image_url) {
        setPreview(item.image_url);
      }
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });
      if (image) {
        formData.append('image', image);
      }
      if (isEdit) {
        formData.append('_method', 'PUT');
      }

      let res;
      if (isEdit) {
        res = await api.post(`/menu-items/${item.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        res = await api.post('/menu-items', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      onSaved(res.data, isEdit);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">

        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-bold text-gray-800">
            {isEdit ? 'Edit Menu Item' : 'Add Menu Item'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 border border-red-200 rounded-xl px-4 py-2 mb-4 text-sm flex items-center gap-2">
            <AlertTriangle size={15} color="#dc2626" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
            <input name="name" value={form.name} onChange={handleChange} required
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D8BFD8]" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select name="category_id" value={form.category_id} onChange={handleChange} required
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D8BFD8]">
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={2}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D8BFD8]" />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (₱)</label>
              <input name="price" type="number" value={form.price} onChange={handleChange} required min="0" step="0.01"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D8BFD8]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock Qty</label>
              <input name="stock_qty" type="number" value={form.stock_qty} onChange={handleChange} required min="0"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D8BFD8]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Low Stock Alert</label>
              <input name="low_stock_threshold" type="number" value={form.low_stock_threshold} onChange={handleChange} min="0"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D8BFD8]" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Item Image</label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden border border-gray-200 shrink-0">
                {preview ? (
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl">🍴</span>
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/jpg,image/gif"
                  onChange={handleImageChange}
                  className="w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#D8BFD8] file:text-gray-700 hover:file:bg-[#cbaecb]"
                />
                <p className="text-xs text-gray-400 mt-1">JPEG, PNG, JPG or GIF — max 2MB</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" name="is_available" checked={form.is_available} onChange={handleChange}
              className="w-4 h-4 accent-[#D8BFD8]" />
            <label className="text-sm text-gray-700">Available for ordering</label>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-xl hover:bg-gray-50 text-sm font-medium">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 bg-[#D8BFD8] text-gray-700 py-2 rounded-xl hover:bg-[#cbaecb] text-sm font-medium disabled:opacity-50">
              {loading ? 'Saving...' : isEdit ? 'Update Item' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MenuForm;