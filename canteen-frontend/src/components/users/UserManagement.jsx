import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import Layout from '../common/Layout';
import { SkeletonBlock, TableRowSkeleton } from '../common/Skeleton';
import { CheckCircle, AlertTriangle } from 'lucide-react';

const ROLE_COLORS = {
  admin:    'bg-purple-100 text-purple-700',
  cashier:  'bg-blue-100 text-blue-700',
  customer: 'bg-green-100 text-green-700',
};

const UserManagement = () => {
  const { user } = useAuth();

  const [users,    setUsers]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [error,    setError]    = useState('');
  const [success,  setSuccess]  = useState('');
  const [search,   setSearch]   = useState('');

  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'customer',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editUser) {
        const res = await api.put(`/users/${editUser.id}`, form);
        setUsers((prev) => prev.map((u) => u.id === editUser.id ? res.data : u));
        setSuccess('User updated successfully!');
      } else {
        const res = await api.post('/users', form);
        setUsers((prev) => [...prev, res.data]);
        setSuccess('User created successfully!');
      }
      setShowForm(false);
      setEditUser(null);
      setForm({ name: '', email: '', password: '', role: 'customer' });
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
    }
  };

  const handleEdit = (u) => {
    setEditUser(u);
    setForm({ name: u.name, email: u.email, password: '', role: u.role });
    setShowForm(true);
    setError('');
  };

  const handleDelete = async (id) => {
    if (id === user.id) {
      alert('You cannot delete your own account!');
      return;
    }
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/users/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      setSuccess('User deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  );

  const topbarActions = (
    <button
      onClick={() => { setEditUser(null); setForm({ name: '', email: '', password: '', role: 'customer' }); setShowForm(true); setError(''); }}
      className="bg-[#D8BFD8] text-gray-700 px-4 py-2 rounded-xl hover:bg-[#cbaecb] font-medium text-sm">
      + Add User
    </button>
  );

  const FilterBar = () => (
    <div className="bg-white rounded-2xl shadow p-4 mb-6 flex flex-wrap gap-3 items-center">
      <input
        type="text"
        placeholder="Search by name, email or role..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="flex-1 min-w-[160px] border border-gray-200 rounded-lg px-4 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D8BFD8]"
      />
      <span className="ml-auto text-sm text-gray-400 whitespace-nowrap">{filtered.length} users</span>
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
      <Layout title="User Management" actions={topbarActions}>
        <div className="p-4 md:p-6">
          <FilterBarSkeleton />
          <div className="bg-white rounded-2xl shadow overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Name', 'Email', 'Role', 'Joined', 'Actions'].map((h) => (
                    <th key={h} className="px-6 py-4 text-left text-sm font-semibold text-gray-600">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {Array.from({ length: 6 }).map((_, i) => <TableRowSkeleton key={i} cols={5} />)}
              </tbody>
            </table>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="User Management" actions={topbarActions}>
      <div className="p-4 md:p-6">

        {success && (
          <div className="bg-green-50 text-green-600 border border-green-200 rounded-xl px-4 py-3 mb-5 text-sm flex items-center gap-2">
            <CheckCircle size={16} color="#16a34a" />
            {success}
          </div>
        )}

        <FilterBar />

        <div className="bg-white rounded-2xl shadow overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-gray-600 font-semibold">Name</th>
                <th className="text-left px-6 py-4 text-gray-600 font-semibold">Email</th>
                <th className="text-center px-6 py-4 text-gray-600 font-semibold">Role</th>
                <th className="text-center px-6 py-4 text-gray-600 font-semibold">Joined</th>
                <th className="text-center px-6 py-4 text-gray-600 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {u.name} {u.id === user.id && <span className="text-xs text-[#D8BFD8]">(you)</span>}
                  </td>
                  <td className="px-6 py-4 text-gray-500">{u.email}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold capitalize ${ROLE_COLORS[u.role]}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-gray-400 whitespace-nowrap">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => handleEdit(u)}
                        className="bg-[#D8BFD8] text-gray-700 text-xs px-3 py-1.5 rounded-lg hover:bg-[#cbaecb] font-medium">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(u.id)}
                        disabled={u.id === user.id}
                        className="bg-red-50 text-red-500 text-xs px-3 py-1.5 rounded-lg hover:bg-red-100 font-medium disabled:opacity-30">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-bold text-gray-800">
                {editUser ? 'Edit User' : 'Add User'}
              </h2>
              <button onClick={() => { setShowForm(false); setEditUser(null); }}
                className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 border border-red-200 rounded-lg px-4 py-2 mb-4 text-sm flex items-center gap-2">
                <AlertTriangle size={15} color="#dc2626" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input name="name" value={form.name} onChange={handleChange} required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D8BFD8]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D8BFD8]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password {editUser && <span className="text-gray-400 font-normal">(leave blank to keep current)</span>}
                </label>
                <input name="password" type="password" value={form.password} onChange={handleChange}
                  required={!editUser}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D8BFD8]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select name="role" value={form.role} onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D8BFD8]">
                  <option value="customer">Customer</option>
                  <option value="cashier">Cashier</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setShowForm(false); setEditUser(null); }}
                  className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-lg hover:bg-gray-50 text-sm font-medium">
                  Cancel
                </button>
                <button type="submit"
                  className="flex-1 bg-[#D8BFD8] text-gray-700 py-2 rounded-lg hover:bg-[#cbaecb] text-sm font-medium">
                  {editUser ? 'Update User' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default UserManagement;