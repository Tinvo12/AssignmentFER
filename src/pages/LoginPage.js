import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../redux/userSlice';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const users = useSelector(state => state.user.users);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    console.log('Attempting login with:', form);
    console.log('Available users:', users);
    
    const user = users.find(u => u.email === form.email && u.password === form.password);
    console.log('Found user:', user);
    
    if (!user) {
      alert('Sai email hoặc mật khẩu!');
      return;
    }
    
    dispatch(login(user));
    alert('Đăng nhập thành công!');
    navigate('/');
  };

  return (
    <div className="container mt-5">
      <h2>Đăng nhập</h2>
      <form onSubmit={handleSubmit}>
        <input name="email" type="email" placeholder="Email" className="form-control mb-2" value={form.email} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Mật khẩu" className="form-control mb-2" value={form.password} onChange={handleChange} required />
        <button className="btn btn-primary" type="submit">Đăng nhập</button>
      </form>
      <div className="mt-3">
        <small className="text-muted">
          Tài khoản mẫu: admin@gmail.com / admin123 (Admin) hoặc user1@gmail.com / 123456 (Customer)
        </small>
      </div>
    </div>
  );
}
