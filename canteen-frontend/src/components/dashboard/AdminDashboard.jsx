import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  LineChart, Line
} from 'recharts';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [summary,       setSummary]       = useState(null);
  const [weeklySales,   setWeeklySales]   = useState([]);
  const [categoryData,  setCategoryData]  = useState([]);
  const [orderVolume,   setOrderVolume]   = useState([]);
  const [bestSellers,   setBestSellers]   = useState([]);
  const [loading,       setLoading]       = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [summaryRes, weeklyRes, categoryRes, volumeRes, bestRes] = await Promise.all([
          api.get('/reports/summary'),
          api.get('/reports/weekly-sales'),
          api.get('/reports/category-breakdown'),
          api.get('/reports/order-volume'),
          api.get('/reports/best-sellers'),
        ]);
        setSummary(summaryRes.data);
        setWeeklySales(weeklyRes.data);
        setCategoryData(categoryRes.data);
        setOrderVolume(volumeRes.data);
        setBestSellers(bestRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Navbar */}
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🍽️</span>
          <span className="text-xl font-bold text-gray-800">Canteen System</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">👑 {user?.name}</span>
          <button
            onClick={() => navigate('/menu')}
            className="text-sm bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100"
          >
            Menu
          </button>
          <button
            onClick={() => navigate('/inventory')}
            className="text-sm bg-green-50 text-green-600 px-3 py-1.5 rounded-lg hover:bg-green-100"
          >
            Inventory
          </button>
          <button
            onClick={() => navigate('/pos')}
            className="text-sm bg-purple-50 text-purple-600 px-3 py-1.5 rounded-lg hover:bg-purple-100"
          >
            POS
          </button>
          <button
            onClick={handleLogout}
            className="text-sm bg-red-50 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-100"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Sales Dashboard</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-sm text-gray-500">Total Sales</p>
            <p className="text-3xl font-bold text-blue-600 mt-1">
              ₱{Number(summary?.total_sales || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-sm text-gray-500">Total Orders</p>
            <p className="text-3xl font-bold text-green-600 mt-1">
              {summary?.total_orders || 0}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-sm text-gray-500">Average Order Value</p>
            <p className="text-3xl font-bold text-purple-600 mt-1">
              ₱{Number(summary?.average_order || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

          {/* Weekly Sales Bar Chart */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Weekly Sales Revenue</h2>
            {weeklySales.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={weeklySales}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(val) => `₱${val}`} />
                  <Bar dataKey="total" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-48 text-gray-400">
                No completed orders yet
              </div>
            )}
          </div>

          {/* Category Pie Chart */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Sales by Category</h2>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="total_revenue"
                    nameKey="category"
                    cx="50%" cy="50%"
                    outerRadius={80}
                    label={({ category, percent }) =>
                      `${category} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {categoryData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val) => `₱${val}`} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-48 text-gray-400">
                No data available
              </div>
            )}
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Order Volume Line Chart */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Order Volume (Last 30 Days)</h2>
            {orderVolume.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={orderVolume}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="total_orders" stroke="#10B981" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-48 text-gray-400">
                No data available
              </div>
            )}
          </div>

          {/* Best Sellers */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">🏆 Top 5 Best Sellers</h2>
            {bestSellers.length > 0 ? (
              <div className="space-y-3">
                {bestSellers.slice(0, 5).map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                      <span className="text-sm text-gray-700">{item.menu_item?.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-blue-600">{item.total_qty} sold</p>
                      <p className="text-xs text-gray-400">₱{Number(item.total_revenue).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-48 text-gray-400">
                No data available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

