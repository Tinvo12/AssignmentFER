import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/userSlice';

export default function Navbar() {
  const currentUser = useSelector(state => state.user.currentUser);
  const cart = useSelector(state => state.cart.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItemCount = cart.length;

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4 shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold text-primary" to="/">
          <i className="bi bi-shop me-2"></i>
          VLXD Shop
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="mainNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                <i className="bi bi-house me-1"></i>
                Trang chủ
              </Link>
            </li>
            {currentUser && currentUser.role === 'admin' && (
              <li className="nav-item">
                <Link className="nav-link" to="/products">
                  <i className="bi bi-box me-1"></i>
                  Quản lý sản phẩm
                </Link>
              </li>
            )}
            {currentUser && (
              <li className="nav-item">
                <Link className="nav-link" to="/orders">
                  <i className="bi bi-list-ul me-1"></i>
                  Đơn hàng
                </Link>
              </li>
            )}
            {currentUser && currentUser.role === 'admin' && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard">
                    <i className="bi bi-graph-up me-1"></i>
                    Quản trị
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/coupons">
                    <i className="bi bi-ticket-perforated me-1"></i>
                    Mã giảm giá
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/debts">
                    <i className="bi bi-credit-card me-1"></i>
                    Nợ
                  </Link>
                </li>
              </>
            )}
          </ul>
          
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link position-relative" to="/cart">
                <i className="bi bi-cart3 me-1"></i>
                Giỏ hàng
                {cartItemCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            </li>
            {!currentUser ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    <i className="bi bi-box-arrow-in-right me-1"></i>
                    Đăng nhập
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    <i className="bi bi-person-plus me-1"></i>
                    Đăng ký
                  </Link>
                </li>
              </>
            ) : (
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                  <i className="bi bi-person-circle me-1"></i>
                  {currentUser.email}
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <button className="dropdown-item" onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right me-2"></i>
                      Đăng xuất
                    </button>
                  </li>
                </ul>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
