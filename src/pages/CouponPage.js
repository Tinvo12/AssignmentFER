import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addCoupon, updateCoupon, toggleActiveCoupon } from '../redux/couponSlice';

export default function CouponPage() {
  const coupons = useSelector(state => state.coupon.coupons);
  const dispatch = useDispatch();
  const [form, setForm] = useState({ code: '', percent: 0, condition: '', startDate: '', endDate: '', usedBy: [] });
  const [editing, setEditing] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.code || form.percent <= 0) return alert('Mã và phần trăm giảm giá phải hợp lệ!');
    if (editing) {
      dispatch(updateCoupon({ ...form, percent: Number(form.percent) }));
      setEditing(false);
    } else {
      if (coupons.find(c => c.code === form.code)) return alert('Mã đã tồn tại!');
      dispatch(addCoupon({ ...form, percent: Number(form.percent), usedBy: [] }));
    }
    setForm({ code: '', percent: 0, condition: '', startDate: '', endDate: '', usedBy: [] });
  };

  const handleEdit = c => {
    setForm({ ...c });
    setEditing(true);
  };

  const handleToggleActive = code => {
    dispatch(toggleActiveCoupon(code));
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center mb-4">
        <div className="col-lg-8">
          <div className="card shadow-lg border-0" style={{ borderRadius: '1.25rem' }}>
            <div className="card-body p-4">
              <h2 className="fw-bold mb-2 text-primary">
                <i className="bi bi-ticket-perforated me-2"></i>Quản lý mã giảm giá
              </h2>
              <p className="text-muted mb-4">Tạo, chỉnh sửa và quản lý các mã khuyến mãi cho khách hàng.</p>
              <form onSubmit={handleSubmit} className="row g-3 align-items-end mb-4">
                <div className="col-md-3">
                  <label className="form-label fw-semibold">Mã giảm giá</label>
                  <input name="code" placeholder="Nhập mã" className="form-control" value={form.code} onChange={handleChange} required disabled={editing} />
                </div>
                <div className="col-md-2">
                  <label className="form-label fw-semibold">Phần trăm</label>
                  <input name="percent" type="number" placeholder="%" className="form-control" value={form.percent} onChange={handleChange} required min={1} max={100} />
                </div>
                <div className="col-md-3">
                  <label className="form-label fw-semibold">Điều kiện</label>
                  <input name="condition" placeholder="Điều kiện (tùy chọn)" className="form-control" value={form.condition} onChange={handleChange} />
                </div>
                <div className="col-md-2">
                  <label className="form-label fw-semibold">Bắt đầu</label>
                  <input name="startDate" type="date" className="form-control" value={form.startDate} onChange={handleChange} />
                </div>
                <div className="col-md-2">
                  <label className="form-label fw-semibold">Kết thúc</label>
                  <input name="endDate" type="date" className="form-control" value={form.endDate} onChange={handleChange} />
                </div>
                <div className="col-12 text-end">
                  <button className={`btn btn-${editing ? 'warning' : 'success'} px-4 fw-semibold`} type="submit">
                    <i className={`bi bi-${editing ? 'pencil-square' : 'plus-circle'} me-1`}></i>{editing ? 'Cập nhật' : 'Thêm mới'}
                  </button>
                  {editing && (
                    <button className="btn btn-secondary ms-2 px-4" type="button" onClick={() => { setEditing(false); setForm({ code: '', percent: 0, condition: '', startDate: '', endDate: '', usedBy: [] }); }}>
                      <i className="bi bi-x-lg me-1"></i>Hủy
                    </button>
                  )}
                </div>
              </form>
              <div className="table-responsive">
                <table className="table table-bordered align-middle shadow-sm" style={{ borderRadius: '1rem', overflow: 'hidden' }}>
                  <thead className="table-primary text-center align-middle">
                    <tr>
                      <th className="fw-bold">Mã</th>
                      <th className="fw-bold">Phần trăm</th>
                      <th className="fw-bold">Điều kiện</th>
                      <th className="fw-bold">Bắt đầu</th>
                      <th className="fw-bold">Kết thúc</th>
                      <th className="fw-bold">Đã dùng</th>
                      <th className="fw-bold">Trạng thái</th>
                      <th className="fw-bold">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {coupons.length === 0 && (
                      <tr>
                        <td colSpan={8} className="text-center text-muted">Chưa có mã giảm giá nào.</td>
                      </tr>
                    )}
                    {coupons.map(c => (
                      <tr key={c.code} style={{ opacity: c.isActive === false ? 0.5 : 1 }}>
                        <td className="fw-semibold">{c.code}</td>
                        <td>{c.percent}%</td>
                        <td>{c.condition}</td>
                        <td>{c.startDate || ''}</td>
                        <td>{c.endDate || ''}</td>
                        <td className="text-center">{c.usedBy?.length || 0}</td>
                        <td className="text-center">
                          {c.isActive === false ? <span className="badge bg-danger"><i className="bi bi-x-circle me-1"></i>Ngưng hoạt động</span> : <span className="badge bg-success"><i className="bi bi-check-circle me-1"></i>Hoạt động</span>}
                        </td>
                        <td className="text-center">
                          <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(c)} disabled={c.isActive === false} title="Sửa">
                            <i className="bi bi-pencil-square"></i>
                          </button>
                          <button className={`btn btn-${c.isActive === false ? 'success' : 'danger'} btn-sm`} onClick={() => handleToggleActive(c.code)} title={c.isActive === false ? 'Kích hoạt lại' : 'Ngưng hoạt động'}>
                            <i className={`bi bi-${c.isActive === false ? 'arrow-repeat' : 'slash-circle'}`}></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
