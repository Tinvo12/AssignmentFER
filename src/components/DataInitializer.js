import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../redux/userSlice';
import { addProduct } from '../redux/productSlice';
import { addCoupon } from '../redux/couponSlice';
import { addDebt } from '../redux/debtSlice';

export default function DataInitializer() {
  const dispatch = useDispatch();
  const users = useSelector(state => state.user.users);
  const products = useSelector(state => state.product.products);
  const coupons = useSelector(state => state.coupon.coupons);
  const debts = useSelector(state => state.debt.debts);

  useEffect(() => {
    console.log('DataInitializer: Checking data...');
    console.log('Current users:', users.length);
    console.log('Current products:', products.length);
    console.log('Current coupons:', coupons.length);
    console.log('Current debts:', debts.length);

    // Chỉ khởi tạo nếu chưa có dữ liệu
    if (users.length === 0) {
      const sampleUsers = [
        { email: 'admin@gmail.com', password: 'admin123', role: 'admin' },
        { email: 'user1@gmail.com', password: '123456', role: 'customer' }
      ];
      sampleUsers.forEach(user => dispatch(register(user)));
      console.log('Sample users created');
    }

    if (products.length === 0) {
      const sampleProducts = [
        { 
          id: '1', 
          name: 'Xi măng', 
          category: 'Xi măng', 
          price: 100000, 
          stock: 50, 
          unit: 'bao', 
          description: 'Xi măng Hà Tiên chất lượng cao', 
          minStock: 5,
          image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop'
        },
        { 
          id: '2', 
          name: 'Gạch đỏ', 
          category: 'Gạch', 
          price: 1200, 
          stock: 1000, 
          unit: 'viên', 
          description: 'Gạch đặc chất lượng tốt', 
          minStock: 100,
          image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=300&fit=crop'
        },
        { 
          id: '3', 
          name: 'Cát xây', 
          category: 'Cát', 
          price: 50000, 
          stock: 200, 
          unit: 'm3', 
          description: 'Cát xây dựng sạch', 
          minStock: 10,
          image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'
        },
        { 
          id: '4', 
          name: 'Thép xây dựng', 
          category: 'Thép', 
          price: 15000, 
          stock: 500, 
          unit: 'kg', 
          description: 'Thép xây dựng chất lượng cao', 
          minStock: 50,
          image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop'
        },
        { 
          id: '5', 
          name: 'Gạch ốp tường', 
          category: 'Gạch', 
          price: 25000, 
          stock: 300, 
          unit: 'm2', 
          description: 'Gạch ốp tường đẹp', 
          minStock: 20,
          image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=300&fit=crop'
        },
      ];
      sampleProducts.forEach(product => dispatch(addProduct(product)));
      console.log('Sample products created');
    }

    if (coupons.length === 0) {
      const sampleCoupons = [
        { code: 'SALE10', percent: 10, condition: '', expired: '', usedBy: [] },
        { code: 'VIP20', percent: 20, condition: 'Đơn > 1tr', expired: '', usedBy: [] },
      ];
      sampleCoupons.forEach(coupon => dispatch(addCoupon(coupon)));
      console.log('Sample coupons created');
    }

    if (debts.length === 0) {
      const sampleDebts = [
        { id: 'd1', customer: 'user1@gmail.com', amount: 500000, note: 'Nợ vật tư', paid: false },
        { id: 'd2', customer: 'user2@gmail.com', amount: 200000, note: 'Nợ xi măng', paid: true },
      ];
      sampleDebts.forEach(debt => dispatch(addDebt(debt)));
      console.log('Sample debts created');
    }
  }, [dispatch, users.length, products.length, coupons.length, debts.length]);

  return null; // Component này không render gì
} 