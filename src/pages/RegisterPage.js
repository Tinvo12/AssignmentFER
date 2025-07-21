import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../redux/userSlice';
import { useNavigate } from 'react-router-dom';
import { sendUserRegisterEmail } from '../utils/email';
import { addCoupon } from '../redux/couponSlice';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'customer' });
  const users = useSelector(state => state.user.users);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (users.find(u => u.email === form.email)) {
      alert('Email đã tồn tại!');
      return;
    }
    dispatch(register(form));
    dispatch(addCoupon({
      code: 'HNCM',
      percent: 20,
      condition: 'Chào mừng khách hàng mới',
      expired: '',
      usedBy: [],
      assignedOrderId: '',
    }));
    try {
      if (!form.email) {
        alert('Không có địa chỉ email để gửi!');
        return;
      }
      await sendUserRegisterEmail({ email: form.email, user_name: form.name });
    } catch (e) {
      console.error('Lỗi gửi email xác nhận đăng ký:', e);
    }
    alert('Đăng ký thành công! Đã gửi email xác nhận.');
    navigate('/login');
  };

  const handleGoogleRegister = () => {
    alert('Tính năng đăng ký bằng Google sẽ được tích hợp sau!');
  };

  return (
    <div className="container mt-5">
      <h2>Đăng ký</h2>
      <form onSubmit={handleSubmit} className="mb-3">
        <input name="name" type="text" placeholder="Tên" className="form-control mb-2" value={form.name} onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" className="form-control mb-2" value={form.email} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Mật khẩu" className="form-control mb-2" value={form.password} onChange={handleChange} required />
        <button className="btn btn-primary w-100" type="submit">Đăng ký</button>
      </form>
      <div className="text-center mb-2 text-muted">hoặc</div>
      <button className="btn btn-outline-danger w-100" onClick={handleGoogleRegister} type="button">
        <i className="bi bi-google me-2"></i> Đăng ký bằng Google
      </button>
    </div>
  );
}
