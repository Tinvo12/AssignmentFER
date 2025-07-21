import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, role }) {
  const currentUser = useSelector(state => state.user.currentUser);

  if (!currentUser) {
    // Nếu chưa đăng nhập, chuyển về trang đăng nhập
    return <Navigate to="/login" />;
  }

  if (role && currentUser.role !== role) {
    // Nếu có yêu cầu quyền (role) mà user không đủ quyền, chuyển về trang chủ
    return <Navigate to="/" />;
  }

  // Nếu hợp lệ, render children (trang được bảo vệ)
  return children;
}
