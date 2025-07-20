import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addDebt, updateDebt, addPayment, deleteDebt } from '../redux/debtSlice';

export default function DebtPage() {
  const debts = useSelector(state => state.debt.debts);
  const users = useSelector(state => state.user.users);
  const dispatch = useDispatch();
  const [form, setForm] = useState({ id: '', customer: '', totalAmount: 0, note: '' });
  const [editing, setEditing] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [payAmount, setPayAmount] = useState(0);
  const [payDebtId, setPayDebtId] = useState(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedDebt, setSelectedDebt] = useState(null);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.customer || form.totalAmount <= 0) return alert('Chọn khách hàng và nhập số tổng hóa đơn > 0!');
    if (editing) {
      dispatch(updateDebt({ ...form, totalAmount: Number(form.totalAmount) }));
      setEditing(false);
    } else {
      dispatch(addDebt({ ...form, id: Date.now().toString(), totalAmount: Number(form.totalAmount) }));
    }
    setForm({ id: '', customer: '', totalAmount: 0, note: '' });
  };

  const handleEdit = d => {
    setForm({ id: d.id, customer: d.customer, totalAmount: d.totalAmount, note: d.note });
    setEditing(true);
  };

  const handleDelete = id => {
    if (window.confirm('Chuyển trạng thái đã thanh toán?')) dispatch(deleteDebt(id));
  };

  const handleOpenPayModal = (debt) => {
    setPayDebtId(debt.id);
    setPayAmount('');
    setShowPayModal(true);
  };

  const handlePay = () => {
    if (!payAmount || isNaN(payAmount) || Number(payAmount) <= 0) return alert('Nhập số tiền trả hợp lệ!');
    dispatch(addPayment({ id: payDebtId, amount: Number(payAmount) }));
    setShowPayModal(false);
  };

  const handleShowHistory = (debt) => {
    setSelectedDebt(debt);
    setShowHistoryModal(true);
  };

  const getPaid = (d) => d.paidHistory?.reduce((sum, p) => sum + p.amount, 0) || 0;
  const getUnpaid = (d) => d.totalAmount - getPaid(d);

  const total = debts.reduce((sum, d) => sum + d.totalAmount, 0);
  const paid = debts.filter(d => d.isPaid).reduce((sum, d) => sum + d.totalAmount, 0);
  const unpaid = debts.filter(d => !d.isPaid).reduce((sum, d) => sum + d.totalAmount, 0);

  return (
    <div className="container py-4">
      <div className="row justify-content-center mb-4">
        <div className="col-lg-10">
          <div className="card shadow-lg border-0" style={{ borderRadius: '1.25rem' }}>
            <div className="card-body p-4">
              <h2 className="fw-bold mb-2 text-primary">
                <i className="bi bi-cash-coin me-2"></i>Quản lý nợ khách hàng
              </h2>
              <div className="mb-3">
                <strong>Tổng nợ: {total.toLocaleString()} | Đã thanh toán: {paid.toLocaleString()} | Chưa thanh toán: {unpaid.toLocaleString()}</strong>
              </div>
              <form onSubmit={handleSubmit} className="row g-3 align-items-end mb-4">
                <div className="col-md-3">
                  <label className="form-label fw-semibold">Khách hàng</label>
                  <select name="customer" className="form-select" value={form.customer} onChange={handleChange} required>
                    <option value="">Chọn khách hàng</option>
                    {users.filter(u => u.role === 'customer').map(u => (
                      <option key={u.email} value={u.email}>{u.email}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label fw-semibold">Số tổng hóa đơn</label>
                  <input name="totalAmount" type="number" placeholder="Tổng hóa đơn" className="form-control" value={form.totalAmount} onChange={handleChange} required min={1} />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-semibold">Ghi chú</label>
                  <input name="note" placeholder="Ghi chú" className="form-control" value={form.note} onChange={handleChange} />
                </div>
                <div className="col-2 text-end">
                  <button className={`btn btn-${editing ? 'warning' : 'success'} px-4 fw-semibold`} type="submit">
                    <i className={`bi bi-${editing ? 'pencil-square' : 'plus-circle'} me-1`}></i>{editing ? 'Cập nhật' : 'Thêm mới'}
                  </button>
                  {editing && (
                    <button className="btn btn-secondary ms-2 px-4" type="button" onClick={() => { setEditing(false); setForm({ id: '', customer: '', totalAmount: 0, note: '' }); }}>
                      <i className="bi bi-x-lg me-1"></i>Hủy
                    </button>
                  )}
                </div>
              </form>
              <div className="table-responsive">
                <table className="table table-bordered align-middle shadow-sm" style={{ borderRadius: '1rem', overflow: 'hidden' }}>
                  <thead className="table-primary text-center align-middle">
                    <tr>
                      <th className="fw-bold">Khách hàng</th>
                      <th className="fw-bold">Tổng hóa đơn</th>
                      <th className="fw-bold">Đã trả</th>
                      <th className="fw-bold">Còn nợ</th>
                      <th className="fw-bold">Ghi chú</th>
                      <th className="fw-bold">Trạng thái</th>
                      <th className="fw-bold">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {debts.length === 0 && (
                      <tr>
                        <td colSpan={7} className="text-center text-muted">Chưa có khoản nợ nào.</td>
                      </tr>
                    )}
                    {debts.map(d => (
                      <React.Fragment key={d.id}>
                        <tr style={{ opacity: d.isPaid ? 0.5 : 1 }}>
                          <td>{d.customer}</td>
                          <td>{d.totalAmount?.toLocaleString()}</td>
                          <td>{getPaid(d).toLocaleString()}</td>
                          <td>{getUnpaid(d) > 0 ? getUnpaid(d).toLocaleString() : 0}</td>
                          <td>{d.note}</td>
                          <td className="text-center">
                            {d.isPaid ? <span className="badge bg-success"><i className="bi bi-check-circle me-1"></i>Đã thanh toán</span> : <span className="badge bg-danger"><i className="bi bi-exclamation-circle me-1"></i>Còn nợ</span>}
                          </td>
                          <td className="text-center">
                            <button className="btn btn-info btn-sm me-2" onClick={() => handleShowHistory(d)} title="Xem lịch sử trả nợ"><i className="bi bi-clock-history"></i></button>
                            {!d.isPaid && <button className="btn btn-success btn-sm me-2" onClick={() => handleOpenPayModal(d)} title="Trả nợ"><i className="bi bi-cash-stack"></i></button>}
                            <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(d)} title="Sửa"><i className="bi bi-pencil-square"></i></button>
                            <button className={`btn btn-${d.isPaid ? 'secondary' : 'danger'} btn-sm`} onClick={() => handleDelete(d.id)} title={d.isPaid ? 'Đã thanh toán' : 'Chuyển đã thanh toán'}>
                              <i className={`bi bi-${d.isPaid ? 'check-circle' : 'slash-circle'}`}></i>
                            </button>
                          </td>
                        </tr>
                        {/* Lịch sử trả nợ */}
                        {d.paidHistory && d.paidHistory.length > 0 && (
                          <tr style={{ background: '#f8f9fa' }}>
                            <td colSpan={7}>
                              <div className="small text-muted">
                                <strong>Lịch sử trả nợ:</strong>
                                <ul className="mb-0">
                                  {d.paidHistory.map((p, idx) => (
                                    <li key={idx}>Trả {p.amount.toLocaleString()} vào {new Date(p.date).toLocaleString('vi-VN')}</li>
                                  ))}
                                </ul>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Modal trả nợ */}
      {showPayModal && (
        <div className="modal fade show" style={{ display: 'block', background: 'rgba(0,0,0,0.2)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Trả nợ</h5>
                <button type="button" className="btn-close" onClick={() => setShowPayModal(false)}></button>
              </div>
              <div className="modal-body">
                <label className="form-label">Số tiền trả</label>
                <input type="number" className="form-control" value={payAmount} onChange={e => setPayAmount(e.target.value)} min={1} />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowPayModal(false)}>Hủy</button>
                <button className="btn btn-success" onClick={handlePay}>Xác nhận trả</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Modal lịch sử trả nợ */}
      {showHistoryModal && selectedDebt && (
        <div className="modal fade show" style={{ display: 'block', background: 'rgba(0,0,0,0.2)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Lịch sử trả nợ - {selectedDebt.customer}</h5>
                <button type="button" className="btn-close" onClick={() => setShowHistoryModal(false)}></button>
              </div>
              <div className="modal-body">
                <ul className="list-group">
                  {selectedDebt.paidHistory && selectedDebt.paidHistory.length > 0 ? (
                    selectedDebt.paidHistory.map((p, idx) => (
                      <li key={idx} className="list-group-item">
                        Trả {p.amount.toLocaleString()} vào {new Date(p.date).toLocaleString('vi-VN')} {p.orderId && (<span>(Hóa đơn: {p.orderId})</span>)}
                      </li>
                    ))
                  ) : (
                    <li className="list-group-item text-muted">Chưa có lịch sử trả nợ.</li>
                  )}
                </ul>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowHistoryModal(false)}>Đóng</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
