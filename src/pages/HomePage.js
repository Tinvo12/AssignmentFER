import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import { Link } from 'react-router-dom';
import { ProductImage } from '../utils/imageUpload';
import ProductModal from '../components/ProductModal';

export default function HomePage() {
  const products = useSelector(state => state.product.products);
  const currentUser = useSelector(state => state.user.currentUser);
  const dispatch = useDispatch();
  const [quantities, setQuantities] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);

  const handleQuantityChange = (productId, value) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, parseInt(value) || 1)
    }));
  };

  const handleAddToCart = (product) => {
    const quantity = quantities[product.id] || 1;
    if (quantity > product.stock) {
      alert(`Only ${product.stock} ${product.unit} left in stock!`);
      return;
    }
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      unit: product.unit,
      image: product.image
    }));
    alert(`Added ${quantity} ${product.unit} ${product.name} to cart!`);
  };

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Unique categories
  const categories = ['all', ...new Set(products.map(p => p.category))];
  // Filtered products
  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const isAdmin = currentUser && currentUser.role === 'admin';

  return (
    <div className="container py-4" style={{ background: '#f6f8fa', minHeight: '100vh' }}>
      <div className="row mb-4">
        <div className="col">
          <h2 className="text-center mb-2 fw-bold" style={{ letterSpacing: 1 }}>
            <i className="bi bi-shop text-primary me-2"></i>
            Construction Materials Store
          </h2>
          <p className="text-center text-muted mb-0">Welcome to our high-quality construction materials store!</p>
        </div>
      </div>

      {/* Category filter */}
      <div className="row mb-4">
        <div className="col">
          <div className="d-flex flex-wrap gap-2 justify-content-center">
            {categories.map((category, idx) => (
              <button
                key={category || idx}
                className={`btn ${selectedCategory === category ? 'btn-primary' : 'btn-outline-primary'} px-3 py-1 rounded-pill fw-semibold`}
                style={{ minWidth: 90 }}
                onClick={() => setSelectedCategory(category)}
              >
                {category === 'all' ? 'All' : category}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="row g-4">
        {filteredProducts.length === 0 ? (
          <div className="col-12 text-center">
            <div className="alert alert-info">
              <i className="bi bi-info-circle me-2"></i>
              <h4>No products available</h4>
              <p>Please wait for admin to add products or login as admin to add products.</p>
            </div>
          </div>
        ) : (
          filteredProducts.map(product => (
            <div key={product.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
              <div className="card h-100 shadow-sm border-0 rounded-4 product-card position-relative" style={{ transition: 'transform 0.2s', background: '#fff' }}>
                <ProductImage 
                  image={product.image} 
                  name={product.name}
                  className="card-img-top rounded-top-4"
                  style={{ height: 200 }}
                />
                <div className="card-header bg-white border-0 pb-0 text-center">
                  <span className="badge bg-secondary mb-2 px-3 py-1 rounded-pill">{product.category}</span>
                </div>
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title text-primary fw-bold mb-1" style={{ fontSize: 20 }}>{product.name}</h5>
                  <p className="card-text text-muted small mb-2" style={{ minHeight: 36 }}>{product.description}</p>
                  <div className="mb-2">
                    <span className="badge bg-light text-dark me-2"><i className="bi bi-currency-dollar me-1"></i>{formatPrice(product.price)}</span>
                    <span className="badge bg-light text-dark"><i className="bi bi-box-seam me-1"></i>{product.unit}</span>
                  </div>
                  <div className="mb-2">
                    <span className={`badge px-3 py-2 ${product.stock <= product.minStock ? 'bg-danger' : 'bg-success'}`}
                      style={{ fontSize: 15 }}>
                      <i className="bi bi-archive me-1"></i>
                      {product.stock} {product.unit}
                      {product.stock <= product.minStock && <span className="ms-2"><i className="bi bi-exclamation-triangle"></i> Low stock!</span>}
                    </span>
                  </div>
                  <div className="mb-3">
                    <label className="form-label mb-1 fw-semibold">Quantity:</label>
                    <input
                      type="number"
                      className="form-control form-control-sm d-inline-block w-auto ms-2"
                      min="1"
                      max={product.stock}
                      value={quantities[product.id] || 1}
                      onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                      style={{ width: 70, display: 'inline-block' }}
                      disabled={isAdmin}
                    />
                  </div>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-primary flex-grow-1 fw-bold py-2 rounded-pill"
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock === 0 || isAdmin}
                      style={{ fontSize: 16 }}
                    >
                      <i className="bi bi-cart-plus me-2"></i>
                      {isAdmin ? 'Admin cannot buy' : 'Add to cart'}
                    </button>
                    <button 
                      onClick={() => handleViewProduct(product)}
                      className="btn btn-outline-info fw-bold py-2 rounded-pill"
                      style={{ fontSize: 16 }}
                    >
                      <i className="bi bi-eye"></i>
                    </button>
                  </div>
                  {product.stock === 0 && (
                    <div className="alert alert-warning text-center mt-2 mb-0 py-1 rounded-pill">
                      <small>Out of stock</small>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="row mt-5">
        <div className="col text-center">
          <Link to="/cart" className="btn btn-success btn-lg px-4 py-2 rounded-pill fw-bold shadow">
            <i className="bi bi-cart3 me-2"></i>
            View cart
          </Link>
          {currentUser && currentUser.role === 'customer' && (
            <div className="mt-3">
              <Link to="/spending" className="btn btn-outline-primary px-4 py-2 rounded-pill fw-bold">
                <i className="bi bi-wallet2 me-2"></i>
                Xem quản lý chi tiêu
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={showProductModal}
        onClose={() => {
          setShowProductModal(false);
          setSelectedProduct(null);
        }}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}
