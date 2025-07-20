import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import OrderDetailPage from './pages/OrderDetailPage';
import CouponPage from './pages/CouponPage';
import DebtPage from './pages/DebtPage';
import CustomerDebtPage from './pages/CustomerDebtPage';
import DashboardPage from './pages/DashboardPage';
import PaymentPage from './pages/PaymentPage';
import ProtectedRoute from './routes/ProtectedRoute';
import ProductDetailPage from './pages/ProductDetailPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import DataInitializer from './components/DataInitializer';
import UserSpendingPage from './pages/UserSpendingPage';

function App() {
  return (
    <BrowserRouter>
      <DataInitializer />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/products" element={
          <ProtectedRoute role="admin">
            <ProductPage />
          </ProtectedRoute>
        } />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={
          <ProtectedRoute>
            <CartPage />
          </ProtectedRoute>
        } />
        <Route path="/orders" element={
          <ProtectedRoute>
            <OrderHistoryPage />
          </ProtectedRoute>
        } />
        <Route path="/orders/:id" element={
          <ProtectedRoute>
            <OrderDetailPage />
          </ProtectedRoute>
        } />
        <Route path="/coupons" element={
          <ProtectedRoute role="admin">
            <CouponPage />
          </ProtectedRoute>
        } />
        <Route path="/debts" element={
          <ProtectedRoute role="admin">
            <DebtPage />
          </ProtectedRoute>
        } />
        <Route path="/my-debts" element={
          <ProtectedRoute>
            <CustomerDebtPage />
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute role="admin">
            <DashboardPage />
          </ProtectedRoute>
        } />
        <Route path="/payment/:orderId" element={
          <ProtectedRoute>
            <PaymentPage />
          </ProtectedRoute>
        } />
        <Route path="/spending" element={
          <ProtectedRoute>
            <UserSpendingPage />
          </ProtectedRoute>
        } />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
