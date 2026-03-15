import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Layout from '../common/Layout';
import { SkeletonBlock, TableRowSkeleton } from '../common/Skeleton';

const FilterBar = ({ search, setSearch, filtered }) => (
  <div className="bg-white rounded-2xl shadow p-4 mb-6 flex flex-wrap gap-3 items-center">
    <input
      type="text"
      placeholder="Search by item, reason or user..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="flex-1 min-w-[160px] border border-gray-200 rounded-lg px-4 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D8BFD8]"
    />
    <span className="ml-auto text-sm text-gray-400 whitespace-nowrap">{filtered.length} logs</span>
  </div>
);

const FilterBarSkeleton = () => (
  <div className="bg-white rounded-2xl shadow p-4 mb-6 flex flex-wrap gap-3 items-center">
    <SkeletonBlock className="h-9 flex-1 min-w-[160px]" />
    <SkeletonBlock className="h-9 w-20" />
  </div>
);

const InventoryLogs = () => {
  const navigate = useNavigate();

  const [logs,    setLogs]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await api.get('/inventory/logs');
      setLogs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = logs.filter((log) =>
    log.menu_item?.name.toLowerCase().includes(search.toLowerCase()) ||
    log.reason?.toLowerCase().includes(search.toLowerCase()) ||
    log.user?.name.toLowerCase().includes(search.toLowerCase())
  );

  const topbarActions = (
    <button
      onClick={() => navigate('/inventory')}
      className="bg-[#D8BFD8] text-gray-700 text-sm px-4 py-2 rounded-xl hover:bg-[#cbaecb] font-medium whitespace-nowrap">
      ← Back to Inventory
    </button>
  );

  if (loading) {
    return (
      <Layout title="Inventory Logs" actions={topbarActions}>
        <div className="p-4 md:p-6">
          <FilterBarSkeleton />
          <div className="bg-white rounded-2xl shadow overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Item', 'Change', 'Reason', 'By', 'Date & Time'].map((h) => (
                    <th key={h} className="px-6 py-4 text-left text-sm font-semibold text-gray-600">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {Array.from({ length: 8 }).map((_, i) => <TableRowSkeleton key={i} cols={5} />)}
              </tbody>
            </table>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Inventory Logs" actions={topbarActions}>
      <div className="p-4 md:p-6">

        <FilterBar
          search={search}
          setSearch={setSearch}
          filtered={filtered}
        />

        <div className="bg-white rounded-2xl shadow overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-gray-600 font-semibold">Item</th>
                <th className="text-center px-6 py-4 text-gray-600 font-semibold">Change</th>
                <th className="text-left px-6 py-4 text-gray-600 font-semibold">Reason</th>
                <th className="text-left px-6 py-4 text-gray-600 font-semibold">By</th>
                <th className="text-left px-6 py-4 text-gray-600 font-semibold">Date & Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-20 text-gray-400">
                    No logs found.
                  </td>
                </tr>
              ) : (
                filtered.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {log.menu_item?.name}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                        log.change_qty > 0
                          ? 'bg-green-100 text-green-600'
                          : 'bg-red-100 text-red-500'
                      }`}>
                        {log.change_qty > 0 ? `+${log.change_qty}` : log.change_qty}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{log.reason}</td>
                    <td className="px-6 py-4 text-gray-500">{log.user?.name}</td>
                    <td className="px-6 py-4 text-gray-400 whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default InventoryLogs;