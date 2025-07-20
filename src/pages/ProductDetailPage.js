import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import { ProductImage } from '../utils/imageUpload';

export default function ProductDetailPage() {
  const { id } = useParams();
  const product = useSelector(state => state.product.products.find(p => p.id === id));
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!product) return <div className="container mt-5">Không tìm thấy sản phẩm!</div>;

  const handleAddToCart = () => {
    const qty = Number(prompt('Nhập số lượng muốn mua:', 1));
    if (qty > 0) {
      dispatch(addToCart({ ...product, quantity: qty, unit: product.unit, category: product.category, image: product.image }));
      navigate('/cart');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6">
          <ProductImage 
            image={product.image} 
            name={product.name}
            className="img-fluid rounded-4 shadow"
            style={{ height: 400 }}
          />
        </div>
        <div className="col-md-6">
          <h2 className="fw-bold text-primary mb-3">{product.name}</h2>
          <div className="mb-3">
            <span className="badge bg-secondary px-3 py-2 rounded-pill fs-6">{product.category}</span>
          </div>
          <div className="mb-3">
            <h4 className="text-success fw-bold">{product.price.toLocaleString()} VNĐ</h4>
          </div>
          <div className="mb-3">
            <p className="text-muted">{product.description}</p>
          </div>
          <div className="mb-3">
            <span className={`badge px-3 py-2 ${product.stock <= product.minStock ? 'bg-danger' : 'bg-success'}`}>
              <i className="bi bi-archive me-1"></i>
              Tồn kho: {product.stock} {product.unit}
              {product.stock <= product.minStock && <span className="ms-2"><i className="bi bi-exclamation-triangle"></i> Sắp hết!</span>}
            </span>
          </div>
          <div className="mb-4">
            <small className="text-muted">Ngưỡng cảnh báo tồn kho thấp: {product.minStock} {product.unit}</small>
          </div>
          <div className="d-flex gap-2">
            <button className="btn btn-success px-4 py-2 rounded-pill fw-bold" onClick={handleAddToCart}>
              <i className="bi bi-cart-plus me-2"></i>Thêm vào giỏ
            </button>
            <Link to="/" className="btn btn-outline-secondary px-4 py-2 rounded-pill">
              <i className="bi bi-arrow-left me-2"></i>Quay lại danh sách
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
