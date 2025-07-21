import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { updateOrderStatus } from '../redux/orderSlice';
import { ProductImage } from '../utils/imageUpload';

export default function PaymentPage() {
  const { orderId } = useParams();
  const order = useSelector(state => state.order.orders.find(o => o.id === orderId));
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!order) return <div>Không tìm thấy đơn hàng!</div>;

  const handleResult = (result) => {
    dispatch(updateOrderStatus({
      id: orderId,
      paymentStatus: result,
      status: result === 'success' ? 'completed' : 'failed',
    }));
    alert(result === 'success' ? 'Thanh toán thành công!' : 'Thanh toán thất bại!');
    navigate('/orders');
  };

  return (
    <div className="container mt-5">
      <h2>Thanh toán đơn hàng #{orderId}</h2>
      <p>Tổng tiền: <strong>{order.total?.toLocaleString()} VNĐ</strong></p>
      
      {order.items && order.items.length > 0 && (
        <div className="mb-4">
          <h5>Chi tiết đơn hàng:</h5>
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Ảnh</th>
                  <th>Tên sản phẩm</th>
                  <th>Số lượng</th>
                  <th>Đơn giá</th>
                  <th>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, idx) => (
                  <tr key={idx}>
                    <td>
                      <ProductImage 
                        image={item.image} 
                        name={item.name}
                        style={{ width: 50, height: 50 }}
                      />
                    </td>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>{item.price?.toLocaleString()} VNĐ</td>
                    <td>{(item.price * item.quantity)?.toLocaleString()} VNĐ</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      <button className="btn btn-primary me-2" onClick={() => handleResult('success')}>Mô phỏng thành công</button>
      <button className="btn btn-danger" onClick={() => handleResult('failed')}>Mô phỏng thất bại</button>
    </div>
  );
}
