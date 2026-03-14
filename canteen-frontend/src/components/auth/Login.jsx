import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { UtensilsCrossed, AlertTriangle, ShieldCheck, CreditCard, User } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate  = useNavigate();

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.role === 'admin') {
        navigate('/dashboard');
      } else if (user.role === 'cashier') {
        navigate('/pos');
      } else {
        navigate('/customer-menu');
      }
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <UtensilsCrossed size={48} color="#D8BFD8" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Canteen System</h1>
          <p className="text-gray-500 mt-1 text-sm">Sign in to your account</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-600 border border-red-200 rounded-xl px-4 py-3 mb-5 text-sm flex items-center gap-2">
            <AlertTriangle size={15} color="#dc2626" />
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@canteen.com"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D8BFD8]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D8BFD8]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#D8BFD8] hover:bg-[#cbaecb] text-gray-700 font-semibold py-2.5 rounded-xl transition duration-200 disabled:opacity-50 text-sm">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Test Accounts */}
        <div className="mt-6 p-4 bg-gray-50 rounded-xl text-xs text-gray-500 space-y-2">
          <p className="font-semibold text-gray-600 mb-2">Test Accounts:</p>
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} color="#8A8B8E" />
            <span>Admin: admin@canteen.com / password</span>
          </div>
          <div className="flex items-center gap-2">
            <CreditCard size={14} color="#8A8B8E" />
            <span>Cashier: cashier@canteen.com / password</span>
          </div>
          <div className="flex items-center gap-2">
            <User size={14} color="#8A8B8E" />
            <span>Customer: juan@email.com / password</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;