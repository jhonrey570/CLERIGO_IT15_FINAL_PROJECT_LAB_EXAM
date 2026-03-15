import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import Layout from '../common/Layout';
import { SkeletonBlock, MenuCardSkeleton } from '../common/Skeleton';
import MenuItemCard from './MenuItemCard';
import MenuForm from './MenuForm';

const FilterBar = ({ search, setSearch, activeCategory, setActiveCategory, categories, filtered }) => (
  <div className="bg-white rounded-2xl shadow p-4 mb-6 flex flex-wrap gap-3 items-center">
    <input
      type="text"
      placeholder="Search menu items..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="flex-1 min-w-[160px] border border-gray-200 rounded-lg px-4 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D8BFD8]"
    />
    <div className="flex gap-2 flex-wrap items-center">
      <button
        onClick={() => setActiveCategory('all')}
        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
          activeCategory === 'all'
            ? 'bg-[#D8BFD8] text-gray-700'
            : 'bg-gray-100 text-gray-600 hover:bg-[#f3eaf3]'
        }`}>
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => setActiveCategory(cat.id)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
            activeCategory === cat.id
              ? 'bg-[#D8BFD8] text-gray-700'
              : 'bg-gray-100 text-gray-600 hover:bg-[#f3eaf3]'
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
      {Array.from({ length: 6 }).map((_, i) => (
        <SkeletonBlock key={i} className="h-9 w-20" />
      ))}
    </div>
  </div>
);

const MenuList = () => {
  const { user } = useAuth();

  const isAdmin = user?.role === 'admin';

  const [items,          setItems]          = useState([]);
  const [categories,     setCategories]     = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [search,         setSearch]         = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [showForm,       setShowForm]       = useState(false);
  const [editItem,       setEditItem]       = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [itemsRes, catsRes] = await Promise.all([
        api.get('/menu-items'),
        api.get('/categories'),
      ]);
      setItems(itemsRes.data);
      setCategories(catsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await api.delete(`/menu-items/${id}`);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggle = async (id) => {
    try {
      const res = await api.patch(`/menu-items/${id}/toggle`);
      setItems((prev) => prev.map((i) => i.id === id ? res.data : i));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaved = (savedItem, isEdit) => {
    if (isEdit) {
      setItems((prev) => prev.map((i) => i.id === savedItem.id ? savedItem : i));
    } else {
      setItems((prev) => [...prev, savedItem]);
    }
    setShowForm(false);
    setEditItem(null);
  };

  const filtered = items.filter((item) => {
    const matchSearch   = item.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = activeCategory === 'all' || item.category_id === Number(activeCategory);
    return matchSearch && matchCategory;
  });

  const topbarActions = (
    <>
      {isAdmin && (
        <button
          onClick={() => { setEditItem(null); setShowForm(true); }}
          className="bg-[#D8BFD8] text-gray-700 px-4 py-2 rounded-xl hover:bg-[#cbaecb] font-medium text-sm">
          + Add Item
        </button>
      )}
    </>
  );

  if (loading) {
    return (
      <Layout title="Menu Management" actions={topbarActions}>
        <div className="p-4 md:p-6">
          <FilterBarSkeleton />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => <MenuCardSkeleton key={i} />)}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Menu Management" actions={topbarActions}>
      <div className="p-4 md:p-6">
        <FilterBar
          search={search}
          setSearch={setSearch}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          categories={categories}
          filtered={filtered}
        />
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">No menu items found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filtered.map((item) => (
              <MenuItemCard
                key={item.id}
                item={item}
                onEdit={isAdmin ? () => { setEditItem(item); setShowForm(true); } : null}
                onDelete={isAdmin ? () => handleDelete(item.id) : null}
                onToggle={isAdmin ? () => handleToggle(item.id) : null}
              />
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <MenuForm
          item={editItem}
          categories={categories}
          onSaved={handleSaved}
          onClose={() => { setShowForm(false); setEditItem(null); }}
        />
      )}
    </Layout>
  );
};

export default MenuList;