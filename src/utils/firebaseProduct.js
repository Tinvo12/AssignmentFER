import { db } from './firebase';
import { ref, set, push, onValue, remove, update } from "firebase/database";

// Thêm sản phẩm
export function addProductRealtime(product) {
  const newRef = push(ref(db, 'products'));
  return set(newRef, product);
}

// Lấy danh sách sản phẩm realtime
export function listenProducts(callback) {
  const productsRef = ref(db, 'products');
  onValue(productsRef, (snapshot) => {
    const data = snapshot.val();
    const list = data ? Object.entries(data).map(([id, value]) => ({ id, ...value })) : [];
    callback(list);
  });
}

// Xóa sản phẩm
export function deleteProductRealtime(id) {
  return remove(ref(db, `products/${id}`));
}

// Cập nhật sản phẩm
export function updateProductRealtime(id, product) {
  return update(ref(db, `products/${id}`), product);
}
