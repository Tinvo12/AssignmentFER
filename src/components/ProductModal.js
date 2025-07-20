import React from 'react';
import { ProductImage } from '../utils/imageUpload';

export default function ProductModal({ product, isOpen, onClose, onAddToCart }) {
  if (!isOpen || !product) return null;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content rounded-4">
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title fw-bold text-primary">{product.name}</h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-md-6">
                <ProductImage 
                  image={product.image} 
                  name={product.name}
                  className="img-fluid rounded-4 shadow-sm"
                  style={{ height: 300 }}
                />
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <span className="badge bg-secondary px-3 py-2 rounded-pill fs-6">{product.category}</span>
                </div>
                <div className="mb-3">
                  <h4 className="text-success fw-bold">{formatPrice(product.price)}</h4>
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
                <button
                  className="btn btn-success w-100 py-2 rounded-pill fw-bold"
                  onClick={() => {
                    onAddToCart(product);
                    onClose();
                  }}
                  disabled={product.stock === 0}
                >
                  <i className="bi bi-cart-plus me-2"></i>
                  {product.stock === 0 ? 'Hết hàng' : 'Thêm vào giỏ hàng'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 