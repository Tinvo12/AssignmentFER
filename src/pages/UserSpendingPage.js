import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { ProductImage } from '../utils/imageUpload';

export default function UserSpendingPage() {
  const orders = useSelector(state => state.order.orders);
  const debts = useSelector(state => state.debt.debts);
  const currentUser = useSelector(state => state.user.currentUser);
  const myOrders = orders.filter(o => o.user === currentUser.email);
  const myDebts = debts.filter(d => d.customer === currentUser.email && !d.isPaid);

  // Tổng chi tiêu
  const totalSpending = myOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  // Tổng số lượng sản phẩm đã đặt
  const totalProducts = myOrders.reduce((sum, o) => sum + (o.items ? o.items.reduce((s, i) => s + i.quantity, 0) : 0), 0);

  // Thống kê các khoảng giá
  const ranges = [
    { label: '< 1 triệu', min: 0, max: 1000000 },
    { label: '1 - 5 triệu', min: 1000000, max: 5000000 },
    { label: '> 5 triệu', min: 5000000, max: Infinity },
  ];
  const rangeStats = ranges.map(r => ({
    ...r,
    count: myOrders.filter(o => o.total >= r.min && o.total < r.max).length,
    spending: myOrders.filter(o => o.total >= r.min && o.total < r.max).reduce((sum, o) => sum + o.total, 0),
  }));

  // Thống kê sản phẩm đã mua
  const productStats = {};
  myOrders.forEach(o => {
    (o.items || []).forEach(item => {
      if (!productStats[item.name]) productStats[item.name] = { name: item.name, quantity: 0, total: 0, image: item.image };
      productStats[item.name].quantity += item.quantity;
      productStats[item.name].total += (item.price || 0) * item.quantity;
    });
  });
  const productStatsArr = Object.values(productStats);

  // Tổng số tiền đang nợ
  const totalDebt = myDebts.reduce((sum, d) => sum + (d.totalAmount - (d.paidHistory?.reduce((s, p) => s + p.amount, 0) || 0)), 0);

  // Modal chi tiết nợ
  const [showDebtDetail, setShowDebtDetail] = useState(false);

  const formatMoney = n => n ? n.toLocaleString('vi-VN') + ' ₫' : '0 ₫';

  return (
    <div className="container py-5">
      <div className="d-flex align-items-center mb-4 justify-content-center">
        <i className="bi bi-wallet2 text-primary fs-1 me-3"></i>
        <h2 className="fw-bold mb-0" style={{letterSpacing:1}}>Quản lý chi tiêu cá nhân</h2>
      </div>
      <div className="row g-4 mb-4 justify-content-center">
        <div className="col-12 col-md-6 col-lg-3">
          <div className="card shadow border-0 text-center p-3 rounded-4 h-100">
            <i className="bi bi-list-ul text-info fs-1 mb-2"></i>
            <div className="fw-bold fs-6 text-muted">Số đơn hàng</div>
            <div className="fs-2 text-primary fw-bold">{myOrders.length}</div>
          </div>
        </div>
        <div className="col-12 col-md-6 col-lg-3">
          <div className="card shadow border-0 text-center p-3 rounded-4 h-100">
            <i className="bi bi-cash-coin text-success fs-1 mb-2"></i>
            <div className="fw-bold fs-6 text-muted">Tổng chi tiêu</div>
            <div className="fs-2 text-success fw-bold">{formatMoney(totalSpending)}</div>
          </div>
        </div>
        <div className="col-12 col-md-6 col-lg-3">
          <div className="card shadow border-0 text-center p-3 rounded-4 h-100">
            <i className="bi bi-box-seam text-warning fs-1 mb-2"></i>
            <div className="fw-bold fs-6 text-muted">Tổng sản phẩm đã đặt</div>
            <div className="fs-2 text-warning fw-bold">{totalProducts}</div>
          </div>
        </div>
        <div className="col-12 col-md-6 col-lg-3">
          <div className="card shadow border-0 text-center p-3 rounded-4 h-100">
            <i className="bi bi-exclamation-circle text-danger fs-1 mb-2"></i>
            <div className="fw-bold fs-6 text-muted">Số tiền đang nợ</div>
            <div className="fs-2 fw-bold">
              <span className={totalDebt > 0 ? 'badge bg-danger bg-opacity-75 px-3 py-2 fs-6' : 'badge bg-success bg-opacity-75 px-3 py-2 fs-6'}>
                {formatMoney(totalDebt)}
              </span>
            </div>
            {totalDebt > 0 && (
              <button className="btn btn-outline-danger btn-sm mt-3 rounded-pill px-3" onClick={() => setShowDebtDetail(true)}>
                <i className="bi bi-search me-1"></i> Xem chi tiết
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="card shadow-sm border-0 p-4 mb-4 rounded-4">
        <h5 className="fw-bold mb-3 text-primary"><i className="bi bi-bar-chart-steps me-2"></i>Thống kê các khoảng giá đơn hàng</h5>
        <div className="table-responsive">
          <table className="table table-bordered align-middle mb-0 rounded-3 overflow-hidden">
            <thead className="table-light">
              <tr>
                <th>Khoảng giá</th>
                <th>Số đơn</th>
                <th>Tổng chi tiêu</th>
              </tr>
            </thead>
            <tbody>
              {rangeStats.map(r => (
                <tr key={r.label}>
                  <td>{r.label}</td>
                  <td>{r.count}</td>
                  <td>{formatMoney(r.spending)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="card shadow-sm border-0 p-4 mb-4 rounded-4">
        <h5 className="fw-bold mb-3 text-success"><i className="bi bi-bag-check me-2"></i>Sản phẩm đã mua</h5>
        <div className="table-responsive">
          <table className="table table-bordered align-middle mb-0 rounded-3 overflow-hidden">
            <thead className="table-light">
              <tr>
                <th>Ảnh</th>
                <th>Tên sản phẩm</th>
                <th>Số lượng</th>
                <th>Tổng tiền</th>
              </tr>
            </thead>
            <tbody>
              {productStatsArr.length === 0 ? (
                <tr><td colSpan={3} className="text-center text-muted">Chưa có sản phẩm nào.</td></tr>
              ) : productStatsArr.map(p => (
                <tr key={p.name}>
                  <td>
                    <ProductImage 
                      image={p.image} 
                      name={p.name}
                      style={{ width: 40, height: 40 }}
                    />
                  </td>
                  <td>{p.name}</td>
                  <td>{p.quantity}</td>
                  <td>{formatMoney(p.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Modal chi tiết nợ */}
      {showDebtDetail && (
        <div className="modal fade show" style={{ display: 'block', background: 'rgba(0,0,0,0.2)' }} tabIndex={-1}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content rounded-4 shadow-lg">
              <div className="modal-header bg-danger bg-opacity-10 border-0 rounded-top-4">
                <h5 className="modal-title text-danger fw-bold"><i className="bi bi-exclamation-circle me-2"></i>Chi tiết các khoản nợ</h5>
                <button type="button" className="btn-close" onClick={() => setShowDebtDetail(false)}></button>
              </div>
              <div className="modal-body">
                <div className="table-responsive">
                  <table className="table table-bordered align-middle mb-0 rounded-3 overflow-hidden">
                    <thead className="table-light">
                      <tr>
                        <th>Hóa đơn</th>
                        <th>Tổng nợ</th>
                        <th>Đã trả</th>
                        <th>Còn nợ</th>
                        <th>Ghi chú</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myDebts.length === 0 ? (
                        <tr><td colSpan={5} className="text-center text-muted">Không có khoản nợ nào.</td></tr>
                      ) : myDebts.map(d => {
                        const paid = d.paidHistory?.reduce((s, p) => s + p.amount, 0) || 0;
                        const unpaid = d.totalAmount - paid;
                        return (
                          <tr key={d.id}>
                            <td>{d.id}</td>
                            <td>{formatMoney(d.totalAmount)}</td>
                            <td>{formatMoney(paid)}</td>
                            <td><span className="badge bg-danger bg-opacity-75 px-3 py-2 fs-6">{formatMoney(unpaid)}</span></td>
                            <td>{d.note}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="modal-footer border-0">
                <button className="btn btn-secondary rounded-pill px-4" onClick={() => setShowDebtDetail(false)}>Đóng</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 