import { useState, useEffect } from 'react';
import api from '../../services/api';
import Layout from '../common/Layout';
import { SkeletonBlock, SummaryCardSkeleton, ChartSkeleton } from '../common/Skeleton';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  LineChart, Line
} from 'recharts';

const COLORS = ['#D8BFD8', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

const AdminDashboard = () => {
  const [summary,      setSummary]      = useState(null);
  const [weeklySales,  setWeeklySales]  = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [orderVolume,  setOrderVolume]  = useState([]);
  const [bestSellers,  setBestSellers]  = useState([]);
  const [loading,      setLoading]      = useState(true);

  const today         = new Date().toISOString().split('T')[0];
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(thirtyDaysAgo);
  const [endDate,   setEndDate]   = useState(today);

  const fetchAll = async (start, end) => {
    setLoading(true);
    try {
      const params = `?start_date=${start}&end_date=${end}`;
      const [summaryRes, weeklyRes, categoryRes, volumeRes, bestRes] = await Promise.allSettled([
        api.get(`/reports/summary${params}`),
        api.get(`/reports/weekly-sales${params}`),
        api.get(`/reports/category-breakdown${params}`),
        api.get(`/reports/order-volume${params}`),
        api.get(`/reports/best-sellers${params}`),
      ]);

      if (summaryRes.status  === 'fulfilled') setSummary(summaryRes.value.data);
      if (weeklyRes.status   === 'fulfilled') setWeeklySales(weeklyRes.value.data);
      if (categoryRes.status === 'fulfilled') setCategoryData(
        categoryRes.value.data.map((item) => ({
          ...item,
          total_revenue: parseFloat(item.total_revenue),
        }))
      );
      if (volumeRes.status === 'fulfilled') setOrderVolume(volumeRes.value.data);
      if (bestRes.status   === 'fulfilled') setBestSellers(bestRes.value.data);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll(startDate, endDate);
  }, []);

  const handleApplyFilter = () => fetchAll(startDate, endDate);

  const handleExportCSV = () => {
    const rows = [
      ['Date', 'Total Sales (₱)'],
      ...weeklySales.map((row) => [row.date, row.total]),
      [],
      ['Summary'],
      ['Total Sales', summary?.total_sales],
      ['Total Orders', summary?.total_orders],
      ['Average Order Value', summary?.average_order],
      [],
      ['Best Sellers'],
      ['Item', 'Qty Sold', 'Revenue (₱)'],
      ...bestSellers.slice(0, 5).map((item) => [
        item.menu_item?.name,
        item.total_qty,
        item.total_revenue,
      ]),
      [],
      ['Category Breakdown'],
      ['Category', 'Revenue (₱)'],
      ...categoryData.map((cat) => [cat.category, cat.total_revenue]),
    ];

    const csvContent = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `canteen-report-${startDate}-to-${endDate}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const topbarActions = (
    <button
      onClick={handleExportCSV}
      className="bg-[#D8BFD8] text-gray-700 text-sm px-4 py-2 rounded-xl hover:bg-[#cbaecb] font-medium">
      Export CSV
    </button>
  );

  const FilterBar = () => (
    <div className="bg-white rounded-2xl shadow p-4 mb-6 flex flex-wrap gap-3 items-center">
      <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-1.5">
        <label className="text-sm text-gray-500">From</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="text-sm border-none outline-none bg-transparent text-gray-700"
        />
        <label className="text-sm text-gray-500">To</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="text-sm border-none outline-none bg-transparent text-gray-700"
        />
      </div>
      <button
        onClick={handleApplyFilter}
        className="bg-[#D8BFD8] text-gray-700 text-sm px-3 py-1.5 rounded-lg hover:bg-[#cbaecb] font-medium">
        Apply Filter
      </button>
    </div>
  );

  if (loading) {
    return (
      <Layout title="Sales Dashboard" actions={topbarActions}>
        <div className="p-4 md:p-6">
          <div className="bg-white rounded-2xl shadow p-4 mb-6 flex flex-wrap gap-3 items-center">
            <SkeletonBlock className="h-9 w-64" />
            <SkeletonBlock className="h-9 w-24" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
            <SummaryCardSkeleton />
            <SummaryCardSkeleton />
            <SummaryCardSkeleton />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
            <ChartSkeleton />
            <ChartSkeleton />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <ChartSkeleton />
            <ChartSkeleton />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Sales Dashboard" actions={topbarActions}>
      <div className="p-4 md:p-6">

        <FilterBar />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="bg-white rounded-2xl shadow p-5 md:p-6">
            <p className="text-sm text-gray-500">Total Sales</p>
            <p className="text-2xl md:text-3xl font-bold text-gray-800 mt-1">
              ₱{Number(summary?.total_sales || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-gray-400 mt-1">{startDate} to {endDate}</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-5 md:p-6">
            <p className="text-sm text-gray-500">Total Orders</p>
            <p className="text-2xl md:text-3xl font-bold text-gray-800 mt-1">
              {summary?.total_orders || 0}
            </p>
            <p className="text-xs text-gray-400 mt-1">{startDate} to {endDate}</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-5 md:p-6">
            <p className="text-sm text-gray-500">Average Order Value</p>
            <p className="text-2xl md:text-3xl font-bold text-gray-800 mt-1">
              ₱{Number(summary?.average_order || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-gray-400 mt-1">{startDate} to {endDate}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
          <div className="bg-white rounded-2xl shadow p-5 md:p-6">
            <h2 className="text-sm md:text-base font-semibold text-gray-700 mb-4">Sales Revenue</h2>
            {weeklySales.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={weeklySales}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(val) => `₱${val}`} />
                  <Bar dataKey="total" fill="#D8BFD8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
                No completed orders in this period
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow p-5 md:p-6">
            <h2 className="text-sm md:text-base font-semibold text-gray-700 mb-4">Sales by Category</h2>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="total_revenue"
                    nameKey="category"
                    cx="50%" cy="50%"
                    outerRadius={75}
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
              <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
                No data available
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="bg-white rounded-2xl shadow p-5 md:p-6">
            <h2 className="text-sm md:text-base font-semibold text-gray-700 mb-4">Order Volume Trend</h2>
            {orderVolume.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={orderVolume}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="total_orders" stroke="#D8BFD8" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
                No data available
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow p-5 md:p-6">
            <h2 className="text-sm md:text-base font-semibold text-gray-700 mb-4">🏆 Top 5 Best Sellers</h2>
            {bestSellers.length > 0 ? (
              <div className="space-y-3">
                {bestSellers.slice(0, 5).map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-base font-bold text-gray-300">#{index + 1}</span>
                      <span className="text-sm text-gray-700">{item.menu_item?.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-700">{item.total_qty} sold</p>
                      <p className="text-xs text-gray-400">₱{Number(item.total_revenue).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
                No data available
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;