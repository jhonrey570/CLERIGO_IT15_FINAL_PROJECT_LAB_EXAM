import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Login from './components/auth/Login';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminDashboard from './components/dashboard/AdminDashboard';
import MenuList from './components/menu/MenuList';
import POSInterface from './components/orders/POSInterface';
import OrderQueue from './components/orders/OrderQueue';
import InventoryTable from './components/inventory/InventoryTable';
import MyOrders from './components/orders/MyOrders';
import UserManagement from './components/users/UserManagement';
import CustomerMenu from './components/customer/CustomerMenu';

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold text-gray-500">Loading...</div>
      </div>
    );
  }

  const defaultRedirect = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/dashboard';
    if (user.role === 'cashier') return '/pos';
    if (user.role === 'customer') return '/my-orders';
    return '/login';
  };

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to={defaultRedirect()} />} />

      <Route path="/dashboard" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/menu" element={
        <ProtectedRoute allowedRoles={['admin', 'cashier']}>
          <MenuList />
        </ProtectedRoute>
      } />
      <Route path="/inventory" element={
        <ProtectedRoute allowedRoles={['admin', 'cashier']}>
          <InventoryTable />
        </ProtectedRoute>
      } />
      <Route path="/users" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <UserManagement />
        </ProtectedRoute>
      } />

      <Route path="/pos" element={
        <ProtectedRoute allowedRoles={['cashier', 'admin']}>
          <POSInterface />
        </ProtectedRoute>
      } />
      <Route path="/orders" element={
        <ProtectedRoute allowedRoles={['cashier', 'admin']}>
          <OrderQueue />
        </ProtectedRoute>
      } />

      <Route path="/my-orders" element={
        <ProtectedRoute allowedRoles={['customer']}>
          <MyOrders />
        </ProtectedRoute>
      } />
      <Route path="/customer-menu" element={
        <ProtectedRoute allowedRoles={['customer']}>
          <CustomerMenu />
        </ProtectedRoute>
      } />

      <Route path="/" element={<Navigate to={defaultRedirect()} />} />
      <Route path="*" element={<Navigate to={defaultRedirect()} />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;