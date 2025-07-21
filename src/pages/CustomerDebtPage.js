import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addPayment } from '../redux/debtSlice';

export default function CustomerDebtPage() {
  const debts = useSelector(state => state.debt.debts);
  const currentUser = useSelector(state => state.user.currentUser);
  const myDebts = debts.filter(d => d.customer === currentUser.email);

  const [showPayModal, setShowPayModal] = useState(false);
  const [payAmount, setPayAmount] = useState('');
  const [payDebtId, setPayDebtId] = useState(null);
  const dispatch = useDispatch();

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

  return (
    <div className="container mt-5">
      <h2>Công nợ của bạn</h2>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Số tiền</th>
            <th>Ghi chú</th>
            <th>Trạng thái</th>
            <th>Lịch sử trả nợ</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {myDebts.map(d => (
            <tr key={d.id}>
              <td>{d.totalAmount}</td>
              <td>{d.note}</td>
              <td>
                {d.isPaid ? (
                  <span className="text-success">Đã thanh toán</span>
                ) : (
                  <span className="text-danger">Chưa thanh toán</span>
                )}
              </td>
              <td>
                <ul className="mb-0">
                  {d.paidHistory && d.paidHistory.length > 0 ? (
                    d.paidHistory.map((p, idx) => (
                      <li key={idx}>Trả {p.amount.toLocaleString()} vào {new Date(p.date).toLocaleString('vi-VN')}</li>
                    ))
                  ) : (
                    <li className="text-muted">Chưa có lịch sử trả nợ.</li>
                  )}
                </ul>
              </td>
              <td>
                {!d.isPaid && <button className="btn btn-success btn-sm" onClick={() => handleOpenPayModal(d)}>Trả nợ</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
    </div>
  );
}
