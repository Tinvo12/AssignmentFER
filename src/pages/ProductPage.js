import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addProduct, updateProduct, deleteProduct, importStock } from '../redux/productSlice';
import { ImageUploadInput } from '../utils/imageUpload';
import ProductImageModal from '../components/ProductImageModal';

export default function ProductPage() {
  const products = useSelector(state => state.product.products);
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    id: '',
    name: '',
    category: '',
    importPrice: 0,
    price: 0,
    stock: 0,
    unit: '',
    description: '',
    minStock: 5,
    isActive: true,
    image: '',
  });
  const [editing, setEditing] = useState(false);
  const [importModal, setImportModal] = useState({ open: false, id: '', importPrice: 0, price: 0, quantity: 0 });
  const [imageModal, setImageModal] = useState({ open: false, image: '', name: '' });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    if (editing) {
      dispatch(updateProduct({
        ...form,
        importPrice: Number(form.importPrice),
        price: Number(form.price),
        stock: Number(form.stock),
        minStock: Number(form.minStock),
        unit: form.unit,
        isActive: form.isActive !== false,
      }));
      setEditing(false);
    } else {
      dispatch(addProduct({
        ...form,
        id: Date.now().toString(),
        importPrice: Number(form.importPrice),
        price: Number(form.price),
        stock: Number(form.stock),
        minStock: Number(form.minStock),
        unit: form.unit,
        isActive: true,
      }));
    }
    setForm({ id: '', name: '', category: '', importPrice: 0, price: 0, stock: 0, unit: '', description: '', minStock: 5, isActive: true, image: '' });
  };

  const handleEdit = p => {
    setForm({ ...p });
    setEditing(true);
  };

  const handleToggleActive = p => {
    dispatch(updateProduct({ ...p, isActive: !p.isActive }));
  };

  const handleImport = p => {
    setImportModal({ open: true, id: p.id, importPrice: p.importPrice || 0, price: p.price || 0, quantity: 0 });
  };
  const handleImportSubmit = e => {
    e.preventDefault();
    const { id, importPrice, price, quantity } = importModal;
    if (quantity > 0) {
      const product = products.find(p => p.id === id);
      dispatch(updateProduct({ ...product, importPrice: Number(importPrice), price: Number(price), stock: product.stock + Number(quantity), isActive: true }));
      dispatch(importStock({ id, quantity: Number(quantity), note: `Import: price ${importPrice}, sell ${price}` }));
      setImportModal({ open: false, id: '', importPrice: 0, price: 0, quantity: 0 });
    }
  };

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) &&
    (filter ? p.category === filter : true)
  );

  return (
    <div className="container py-4" style={{ background: '#f6f8fa', minHeight: '100vh' }}>
      <div className="row justify-content-center mb-4">
        <div className="col-lg-8">
          <div className="p-4 rounded-4 shadow-sm bg-white mb-4">
            <h2 className="fw-bold mb-4 text-center"><i className="bi bi-box-seam me-2 text-primary"></i>Product Management</h2>
            <form onSubmit={handleSubmit} className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold">Product name</label>
                <input name="name" placeholder="Product name" className="form-control rounded-pill" value={form.name} onChange={handleChange} required />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Category</label>
                <input name="category" placeholder="Category (e.g. Cement, Brick, ...)" className="form-control rounded-pill" value={form.category} onChange={handleChange} required />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-semibold">Import price (VND)</label>
                <input name="importPrice" type="number" className="form-control rounded-pill" value={form.importPrice} onChange={handleChange} required min={0} />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-semibold">Sell price (VND)</label>
                <input name="price" type="number" className="form-control rounded-pill" value={form.price} onChange={handleChange} required min={0} />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-semibold">Stock</label>
                <input name="stock" type="number" className="form-control rounded-pill" value={form.stock} onChange={handleChange} required min={0} />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-semibold">Unit</label>
                <input name="unit" placeholder="Unit (e.g. bag, kg, m3, piece...)" className="form-control rounded-pill" value={form.unit} onChange={handleChange} required />
              </div>
              <div className="col-md-8">
                <label className="form-label fw-semibold">Description (optional)</label>
                <input name="description" placeholder="Description" className="form-control rounded-pill" value={form.description} onChange={handleChange} />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-semibold">Low stock alert</label>
                <input name="minStock" type="number" className="form-control rounded-pill" value={form.minStock} onChange={handleChange} min={1} />
              </div>
              <div className="col-12">
                <ImageUploadInput
                  name="image"
                  label="Product Image"
                  value={form.image}
                  onChange={handleChange}
                />
              </div>
              <div className="col-12 text-center">
                <button className="btn btn-success px-5 py-2 rounded-pill fw-bold shadow" type="submit">{editing ? 'Update' : 'Add new'}</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="row mb-3 g-2 justify-content-center">
        <div className="col-md-4">
          <input placeholder="Search product name" className="form-control rounded-pill" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="col-md-4">
          <input placeholder="Filter by category" className="form-control rounded-pill" value={filter} onChange={e => setFilter(e.target.value)} />
        </div>
      </div>

      <div className="table-responsive rounded-4 shadow-sm bg-white p-3">
        <table className="table table-bordered table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Import price</th>
              <th>Sell price</th>
              <th>Stock</th>
              <th>Unit</th>
              <th>Description</th>
              <th>Low stock alert</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(p => (
              <tr key={p.id} style={{ opacity: p.isActive === false ? 0.5 : 1 }}>
                <td>
                  {p.image ? (
                    <img 
                      src={p.image} 
                      alt={p.name} 
                      className="rounded cursor-pointer"
                      style={{ width: 50, height: 50, objectFit: 'cover', cursor: 'pointer' }}
                      onClick={() => setImageModal({ open: true, image: p.image, name: p.name })}
                    />
                  ) : (
                    <div className="d-flex align-items-center justify-content-center bg-light rounded" style={{ width: 50, height: 50 }}>
                      <i className="bi bi-image text-muted"></i>
                    </div>
                  )}
                </td>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>{p.importPrice ? Number(p.importPrice).toLocaleString() : 0}</td>
                <td>{p.price ? Number(p.price).toLocaleString() : 0}</td>
                <td>
                  <span className={`badge px-3 py-2 ${p.stock < p.minStock ? 'bg-danger' : 'bg-success'}`}>{p.stock}</span>
                  {p.stock < p.minStock && <span className="ms-2 badge bg-danger"><i className="bi bi-exclamation-triangle"></i> Low!</span>}
                </td>
                <td>{p.unit}</td>
                <td>{p.description}</td>
                <td>{p.minStock}</td>
                <td>{p.isActive === false ? <span className="badge bg-danger">Inactive</span> : <span className="badge bg-success">Active</span>}</td>
                <td>
                  <button className="btn btn-warning btn-sm rounded-pill me-2 mb-1" onClick={() => handleEdit(p)}><i className="bi bi-pencil-square"></i> Edit</button>
                  <button className={`btn btn-${p.isActive === false ? 'success' : 'danger'} btn-sm rounded-pill me-2 mb-1`} onClick={() => handleToggleActive(p)}>
                    {p.isActive === false ? <><i className="bi bi-check-circle"></i> Activate</> : <><i className="bi bi-x-circle"></i> Inactive</>}
                  </button>
                  <button className="btn btn-info btn-sm rounded-pill mb-1" onClick={() => handleImport(p)}><i className="bi bi-box-arrow-in-down"></i> Import</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal nhập kho */}
      {importModal.open && (
        <div className="modal show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.2)' }}>
          <div className="modal-dialog">
            <form className="modal-content rounded-4" onSubmit={handleImportSubmit}>
              <div className="modal-header">
                <h5 className="modal-title">Import product stock</h5>
                <button type="button" className="btn-close" onClick={() => setImportModal({ open: false, id: '', importPrice: 0, price: 0, quantity: 0 })}></button>
              </div>
              <div className="modal-body">
                <div className="mb-2">
                  <label className="form-label">Import price</label>
                  <input type="number" className="form-control rounded-pill" value={importModal.importPrice} min={0} required onChange={e => setImportModal(im => ({ ...im, importPrice: e.target.value }))} />
                </div>
                <div className="mb-2">
                  <label className="form-label">Sell price</label>
                  <input type="number" className="form-control rounded-pill" value={importModal.price} min={0} required onChange={e => setImportModal(im => ({ ...im, price: e.target.value }))} />
                </div>
                <div className="mb-2">
                  <label className="form-label">Quantity</label>
                  <input type="number" className="form-control rounded-pill" value={importModal.quantity} min={1} required onChange={e => setImportModal(im => ({ ...im, quantity: e.target.value }))} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary rounded-pill" onClick={() => setImportModal({ open: false, id: '', importPrice: 0, price: 0, quantity: 0 })}>Cancel</button>
                <button type="submit" className="btn btn-primary rounded-pill">Import</button>
              </div>
            </form>
          </div>
        </div>
      )}

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
