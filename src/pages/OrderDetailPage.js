import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ProductImage } from '../utils/imageUpload';
import ProductImageModal from '../components/ProductImageModal';

export default function OrderDetailPage() {
  const { id } = useParams();
  const order = useSelector(state => state.order.orders.find(o => String(o.id) === String(id)));
  const navigate = useNavigate();
  const [imageModal, setImageModal] = useState({ open: false, image: '', name: '' });

  if (!order) return <div className="container mt-5">Không tìm thấy đơn hàng! <button className="btn btn-secondary ms-2" onClick={() => navigate(-1)}>Quay lại</button></div>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Chi tiết đơn hàng <span className="text-primary">#{order.id}</span></h2>
      <div className="mb-3">
        <strong>Ngày tạo:</strong> {order.createdAt}
      </div>
      <div className="mb-3">
        <strong>Trạng thái:</strong> <span className={`badge bg-${order.status === 'pending' ? 'warning' : order.status === 'paid' ? 'success' : 'secondary'}`}>{order.status}</span>
      </div>
      <div className="mb-3">
        <strong>Tổng tiền:</strong> <span className="text-danger fw-bold">{order.total ? order.total.toLocaleString() : 0} VNĐ</span>
      </div>
      <div className="mb-3">
        <strong>Khách hàng:</strong> {order.user}
      </div>
      {order.shipping && (
        <div className="mb-3">
          <strong>Vận chuyển:</strong> {order.shipping.vehicleType} - {order.shipping.km} km - Phí: {order.shipping.shippingFee.toLocaleString()} VNĐ
        </div>
      )}
      <div className="mb-4">
        <h5>Danh sách sản phẩm</h5>
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>Ảnh</th>
              <th>Tên sản phẩm</th>
              <th>ĐVT</th>
              <th>Số lượng</th>
              <th>Đơn giá</th>
              <th>Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {order.items && order.items.map((item, idx) => (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>
                  {item.image ? (
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="rounded cursor-pointer"
                      style={{ width: 50, height: 50, objectFit: 'cover', cursor: 'pointer' }}
                      onClick={() => setImageModal({ open: true, image: item.image, name: item.name })}
                    />
                  ) : (
                    <div className="d-flex align-items-center justify-content-center bg-light rounded" style={{ width: 50, height: 50 }}>
                      <i className="bi bi-image text-muted"></i>
                    </div>
                  )}
                </td>
                <td>{item.name}</td>
                <td>{item.unit}</td>
                <td>{item.quantity}</td>
                <td>{item.price ? item.price.toLocaleString() : 0}</td>
                <td>{(item.price * item.quantity).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Link to="/orders" className="btn btn-secondary">Quay lại lịch sử đơn hàng</Link>

      {/* Image Modal */}
      <ProductImageModal
        image={imageModal.image}
        name={imageModal.name}
        isOpen={imageModal.open}
        onClose={() => setImageModal({ open: false, image: '', name: '' })}
      />
    </div>
  );
} 