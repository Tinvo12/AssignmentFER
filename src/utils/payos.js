import axios from 'axios';

export async function createPayOSPayment(order) {
  const payload = {
    orderCode: order.id,
    amount: order.total,
    description: `Thanh toán đơn hàng #${order.id}`,
    returnUrl: 'http://localhost:3000/payment-success',
    cancelUrl: 'http://localhost:3000/payment-cancel',
    buyerName: order.user,
    buyerEmail: order.email,
    buyerPhone: order.phone,
  };

  try {
    const response = await axios.post('http://localhost:5000/api/payos', payload);
    return response.data.checkoutUrl;
  } catch (err) {
    console.error('PayOS error:', err.response ? err.response.data : err);
    throw err;
  }
}
