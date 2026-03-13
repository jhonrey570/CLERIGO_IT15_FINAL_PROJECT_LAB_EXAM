import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import Layout from '../common/Layout';

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

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-xl text-gray-500">Loading users...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
          <button
            onClick={() => { setEditUser(null); setForm({ name: '', email: '', password: '', role: 'customer' }); setShowForm(true); setError(''); }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-semibold text-sm">
            + Add User
          </button>
        </div>

        {success && (
          <div className="bg-green-50 text-green-600 border border-green-200 rounded-xl px-4 py-3 mb-5 text-sm">
            ✅ {success}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <table className="w-full text-sm">
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
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {u.name} {u.id === user.id && <span className="text-xs text-blue-500">(you)</span>}
                  </td>
                  <td className="px-6 py-4 text-gray-500">{u.email}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold capitalize ${ROLE_COLORS[u.role]}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-gray-400">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => handleEdit(u)}
                        className="bg-blue-50 text-blue-600 text-xs px-3 py-1.5 rounded-lg hover:bg-blue-100 font-medium">
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
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-bold text-gray-800">
                {editUser ? 'Edit User' : 'Add User'}
              </h2>
              <button onClick={() => { setShowForm(false); setEditUser(null); }}
                className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 border border-red-200 rounded-lg px-4 py-2 mb-4 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input name="name" value={form.name} onChange={handleChange} required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password {editUser && <span className="text-gray-400 font-normal">(leave blank to keep current)</span>}
                </label>
                <input name="password" type="password" value={form.password} onChange={handleChange}
                  required={!editUser}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select name="role" value={form.role} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="customer">Customer</option>
                  <option value="cashier">Cashier</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setShowForm(false); setEditUser(null); }}
                  className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-lg hover:bg-gray-50 text-sm font-medium">
                  Cancel
                </button>
                <button type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 text-sm font-medium">
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