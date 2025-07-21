import React from 'react';
import { useSelector } from 'react-redux';
import { exportInvoicePDF } from '../utils/pdf';
import { Link } from 'react-router-dom';
import { ProductImage } from '../utils/imageUpload';

export default function OrderHistoryPage() {
  const orders = useSelector(state => state.order.orders);
  const currentUser = useSelector(state => state.user.currentUser);
  const myOrders = currentUser && currentUser.role === 'admin' ? orders : orders.filter(o => o.user === currentUser.email);

  // Helper: format date
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleString('vi-VN', { hour12: false });
  };
  // Helper: format money
  const formatMoney = (n) => (n ? n.toLocaleString('vi-VN') + ' ₫' : '0 ₫');
  // Helper: badge for status
  const statusBadge = (status) => {
    if (status === 'pending') return <span className="badge bg-warning text-dark">Chờ xử lý</span>;
    if (status === 'paid' || status === 'completed') return <span className="badge bg-success">Đã thanh toán</span>;
    if (status === 'cancelled') return <span className="badge bg-danger">Đã hủy</span>;
    return <span className="badge bg-secondary">{status}</span>;
  };

  return (
    <div className="container mt-5">
      <div className="d-flex align-items-center mb-4">
        <i className="bi bi-list-ul text-primary fs-2 me-2"></i>
        <h2 className="fw-bold mb-0">Lịch sử đơn hàng</h2>
      </div>
      <div className="card shadow-sm rounded-4 p-3 border-0 mb-4">
        {myOrders.length === 0 ? (
          <div className="text-center p-5 text-muted">
            <i className="bi bi-emoji-frown fs-1 mb-3"></i>
            <div className="fs-5">Bạn chưa có đơn hàng nào.</div>
            <Link to="/" className="btn btn-primary mt-3">
              <i className="bi bi-house me-1"></i> Về trang chủ
            </Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th style={{minWidth: 120}}>Mã đơn</th>
                  <th style={{minWidth: 160}}>Ngày tạo</th>
                  <th style={{minWidth: 120}}>Tổng tiền</th>
                  <th style={{minWidth: 120}}>Trạng thái</th>
                  <th style={{minWidth: 140}}></th>
                  <th style={{minWidth: 120}}></th>
                </tr>
              </thead>
              <tbody>
                {myOrders.map(o => (
                  <tr key={o.id} className="bg-white">
                    <td className="fw-bold">#{o.id}</td>
                    <td>{formatDate(o.createdAt)}</td>
                    <td className="text-danger fw-bold">{formatMoney(o.total)}</td>
                    <td>{statusBadge(o.status)}</td>
                    <td>
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => exportInvoicePDF(o, { name: currentUser.email })}
                      >
                        <i className="bi bi-file-earmark-pdf me-1"></i> Xuất hóa đơn PDF
                      </button>
                    </td>
                    <td>
                      <Link to={`/orders/${o.id}`} className="btn btn-info btn-sm">
                        <i className="bi bi-eye me-1"></i> Xem chi tiết
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
