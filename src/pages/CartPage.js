import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateCartItem, removeCartItem, clearCart, applyDiscount } from '../redux/cartSlice';
import { createOrder } from '../redux/orderSlice';
import { calculateShipping } from '../utils/shipping';
import { addCoupon, updateCoupon, markUsed } from '../redux/couponSlice';
import { createPayOSPayment } from '../utils/payos';
import { sendUserOrderSuccessEmail } from '../utils/email';
import { ProductImage } from '../utils/imageUpload';
import ProductImageModal from '../components/ProductImageModal';

export default function CartPage() {
  const cart = useSelector(state => state.cart.cart);
  const discount = useSelector(state => state.cart.discount);
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.user.currentUser);
  const coupons = useSelector(state => state.coupon.coupons);

  const [vehicleType, setVehicleType] = useState('small');
  const [km, setKm] = useState(1);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [partialAmount, setPartialAmount] = useState('');
  const [paymentType, setPaymentType] = useState('full'); // 'full' hoặc 'partial'
  const [imageModal, setImageModal] = useState({ open: false, image: '', name: '' });

  const handleChange = (id, field, value) => {
    if (value <= 0) return alert('Số lượng và giá phải > 0');
    dispatch(updateCartItem({ id, [field]: Number(value) }));
  };

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const discountAmount = discount ? total * (discount.percent / 100) : 0;
  const finalTotal = total - discountAmount;

  const shippingFee = calculateShipping(vehicleType, km);
  const grandTotal = finalTotal + shippingFee;

  const [code, setCode] = React.useState('');
  const handleDiscount = () => {
    const coupon = coupons.find(c => c.code === code);
    if (!coupon) return alert('Mã không tồn tại!');
    if (coupon.expired && new Date(coupon.expired) < new Date()) return alert('Mã đã hết hạn!');
    if (coupon.usedBy?.includes(currentUser.email)) return alert('Bạn đã dùng mã này!');
    if (coupon.assignedOrderId && coupon.assignedOrderId !== '') return alert('Mã này đã được gán cho hóa đơn khác!');
    dispatch(applyDiscount({ code: coupon.code, percent: coupon.percent }));
    dispatch(markUsed({ code: coupon.code, user: currentUser.email }));
    alert('Áp dụng mã thành công!');
  };

  const handleOrder = async () => {
    if (!currentUser) return alert('Bạn cần đăng nhập!');
    if (cart.length === 0) return alert('Giỏ hàng rỗng!');
    const orderId = Date.now().toString();
    dispatch(createOrder({
      id: orderId,
      user: currentUser.email,
      items: cart,
      total: grandTotal, // tổng đã gồm shipping
      shipping: { vehicleType, km, shippingFee },
      status: 'pending',
      createdAt: new Date().toISOString(),
    }));
    dispatch(clearCart());
    try {
      if (!currentUser.email) {
        alert('Không có địa chỉ email để gửi!');
        return;
      }
      await sendUserOrderSuccessEmail({
        email: currentUser.email,
        order_id: orderId,
        name: currentUser.name, // hoặc currentUser.fullName nếu có
        orders: cart.map(item => ({
          name: item.name,
          units: item.quantity,
          unit: item.unit,
          price: item.price
        })),
        shipping: shippingFee,
        coupon: discountAmount,
        total: grandTotal
      });
      alert('Đặt hàng thành công! Đã gửi email xác nhận.');
    } catch (e) {
      alert('Đặt hàng thành công! (Gửi email thất bại)');
    }
  };

  const handlePayment = async () => {
    if (!currentUser) return alert('Bạn cần đăng nhập!');
    if (cart.length === 0) return alert('Giỏ hàng rỗng!');
    const orderId = Date.now().toString();
    dispatch(createOrder({
      id: orderId,
      user: currentUser.email,
      items: cart,
      total: grandTotal, // tổng đã gồm shipping
      shipping: { vehicleType, km, shippingFee },
      status: 'pending',
      createdAt: new Date().toISOString(),
    }));
    dispatch(clearCart());
    try {
      const checkoutUrl = await createPayOSPayment({
        id: orderId,
        total: grandTotal,
        user: currentUser.name || currentUser.email,
        email: currentUser.email,
        phone: currentUser.phone || '',
      });
      window.location.href = checkoutUrl; // Redirect sang PayOS
    } catch (err) {
      alert('Không tạo được link thanh toán!');
    }
  };

  const handleFakePayment = () => {
    if (!currentUser) return alert('Bạn cần đăng nhập!');
    if (cart.length === 0) return alert('Giỏ hàng rỗng!');
    const orderId = Date.now().toString();
    dispatch(createOrder({
      id: orderId,
      user: currentUser.email,
      items: cart,
      total: grandTotal,
      shipping: { vehicleType, km, shippingFee },
      status: 'paid',
      createdAt: new Date().toISOString(),
    }));
    dispatch(clearCart());
    alert('Thanh toán ảo thành công! Đơn hàng đã được ghi nhận là đã thanh toán.');
  };

  const openPaymentModal = () => {
    setPaymentType('full');
    setPartialAmount('');
    setShowPaymentModal(true);
  };

  const handleConfirmPayment = () => {
    let paid = grandTotal;
    let debt = 0;
    if (paymentType === 'partial') {
      paid = Number(partialAmount);
      debt = grandTotal - paid;
      if (paid <= 0 || paid >= grandTotal) {
        alert('Số tiền trả phải lớn hơn 0 và nhỏ hơn tổng đơn!');
        return;
      }
    }
    const orderId = Date.now().toString();
    dispatch(createOrder({
      id: orderId,
      user: currentUser.email,
      items: cart,
      total: grandTotal,
      paid,
      debt,
      shipping: { vehicleType, km, shippingFee },
      status: debt > 0 ? 'debt' : 'paid',
      createdAt: new Date().toISOString(),
    }));
    if (debt > 0) {
      dispatch({
        type: 'debt/addDebt',
        payload: {
          id: 'debt-' + orderId,
          customer: currentUser.email,
          totalAmount: debt,
          note: `Nợ từ đơn hàng #${orderId}`,
        }
      });
    }
    dispatch(clearCart());
    setShowPaymentModal(false);
    alert(debt > 0 ? 'Thanh toán một phần thành công! Số còn lại đã ghi vào danh sách nợ.' : 'Thanh toán thành công!');
  };

  return (
    <div className="container mt-5">
      <h2>Giỏ hàng</h2>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Ảnh</th>
            <th>Tên</th>
            <th>Giá</th>
            <th>Số lượng</th>
            <th>Thành tiền</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {cart.map(i => (
            <tr key={i.id}>
              <td>
                {i.image ? (
                  <img 
                    src={i.image} 
                    alt={i.name} 
                    className="rounded cursor-pointer"
                    style={{ width: 50, height: 50, objectFit: 'cover', cursor: 'pointer' }}
                    onClick={() => setImageModal({ open: true, image: i.image, name: i.name })}
                  />
                ) : (
                  <div className="d-flex align-items-center justify-content-center bg-light rounded" style={{ width: 50, height: 50 }}>
                    <i className="bi bi-image text-muted"></i>
                  </div>
                )}
              </td>
              <td>{i.name}</td>
              <td>{i.price.toLocaleString()}</td>
              <td>
                <input type="number" value={i.quantity} min={1}
                  onChange={e => handleChange(i.id, 'quantity', e.target.value)} />
              </td>
              <td>{i.price * i.quantity}</td>
              <td>
                <button className="btn btn-danger btn-sm"
                  onClick={() => dispatch(removeCartItem(i.id))}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mb-3">
        <label>Chọn loại xe vận chuyển:</label>
        <select className="form-select mb-2" value={vehicleType} onChange={e => setVehicleType(e.target.value)}>
          <option value="small">Xe nhỏ (1–2 t): 10–20 k/km</option>
          <option value="medium">Xe vừa (3–5 t): 20–30 k/km</option>
          <option value="large">Xe lớn (8–15 t): 30–50 k/km</option>
        </select>
        <input
          type="number"
          min={1}
          className="form-control mb-2"
          placeholder="Nhập số km"
          value={km}
          onChange={e => {
            let val = parseInt(e.target.value.replace(/[^0-9]/g, ''));
            if (isNaN(val) || val < 1) val = 1;
            setKm(val);
          }}
        />
      </div>

      <div>
        <strong>Tổng tiền: {total}</strong><br />
        {discount && <span>Giảm giá: {discount.percent}% (-{discountAmount})</span>}<br />
        <strong>Phí vận chuyển: {shippingFee}</strong><br />
        <strong>Thành tiền: {grandTotal}</strong>
      </div>
      <div className="mb-2">
        <input placeholder="Nhập mã giảm giá" value={code} onChange={e => setCode(e.target.value)} />
        <button className="btn btn-info btn-sm ms-2" onClick={handleDiscount}>Áp dụng</button>
      </div>
      <button className="btn btn-warning mt-2" onClick={() => dispatch(clearCart())}>Xóa toàn bộ</button>
      {showPaymentModal && (
        <div className="modal fade show" style={{ display: 'block', background: 'rgba(0,0,0,0.2)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Chọn phương thức thanh toán</h5>
                <button type="button" className="btn-close" onClick={() => setShowPaymentModal(false)}></button>
              </div>
              <div className="modal-body">
                <div>
                  <label>
                    <input
                      type="radio"
                      checked={paymentType === 'full'}
                      onChange={() => setPaymentType('full')}
                    /> Trả hết ({grandTotal.toLocaleString()}₫)
                  </label>
                </div>
                <div className="mt-2">
                  <label>
                    <input
                      type="radio"
                      checked={paymentType === 'partial'}
                      onChange={() => setPaymentType('partial')}
                    /> Trả một phần
                  </label>
                  {paymentType === 'partial' && (
                    <input
                      type="number"
                      className="form-control mt-2"
                      placeholder="Nhập số tiền muốn trả"
                      min={1}
                      max={grandTotal - 1}
                      value={partialAmount}
                      onChange={e => setPartialAmount(e.target.value)}
                    />
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowPaymentModal(false)}>Hủy</button>
                <button className="btn btn-success" onClick={handleConfirmPayment}>Xác nhận thanh toán</button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="mt-3">
        <button className="btn btn-success me-2" onClick={handleOrder}>Đặt hàng (COD)</button>
        <button className="btn btn-primary me-2" onClick={openPaymentModal}>Thanh toán (Chọn trả hết/1 phần)</button>
        <button className="btn btn-warning" onClick={handleFakePayment}>Thanh toán ảo (Fake)</button>
      </div>

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
