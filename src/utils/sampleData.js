import { store } from '../redux/store';
import { addProduct } from '../redux/productSlice';
import { addCoupon } from '../redux/couponSlice';
import { addDebt } from '../redux/debtSlice';
import { register } from '../redux/userSlice';

// Tạo sản phẩm mẫu
export function createSampleProducts() {
    const products = [
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
    products.forEach(p => store.dispatch(addProduct(p)));
  }

// Tạo mã giảm giá mẫu
export function createSampleCoupons() {
  const coupons = [
    { code: 'SALE10', percent: 10, condition: '', expired: '', usedBy: [] },
    { code: 'VIP20', percent: 20, condition: 'Đơn > 1tr', expired: '', usedBy: [] },
  ];
  coupons.forEach(c => store.dispatch(addCoupon(c)));
}

// Tạo nợ mẫu
export function createSampleDebts() {
  const debts = [
    { id: 'd1', customer: 'user1@gmail.com', amount: 500000, note: 'Nợ vật tư', paid: false },
    { id: 'd2', customer: 'user2@gmail.com', amount: 200000, note: 'Nợ xi măng', paid: true },
  ];
  debts.forEach(d => store.dispatch(addDebt(d)));
}

// Tạo tài khoản mẫu
export function createSampleUsers() {
  const currentState = store.getState();
  const existingUsers = currentState.user.users;
  
  const users = [
    { email: 'admin@gmail.com', password: 'admin123', role: 'admin' },
    { email: 'user1@gmail.com', password: '123456', role: 'customer' }
  ];
  
  users.forEach(user => {
    const exists = existingUsers.find(u => u.email === user.email);
    if (!exists) {
      store.dispatch(register(user));
    }
  });
}

// Khởi tạo tất cả dữ liệu mẫu
export function initializeSampleData() {
  createSampleUsers();
  createSampleProducts();
  createSampleCoupons();
  createSampleDebts();
}