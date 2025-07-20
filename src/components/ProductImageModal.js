import React from 'react';

export default function ProductImageModal({ image, name, isOpen, onClose }) {
  if (!isOpen || !image) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.8)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content bg-transparent border-0">
          <div className="modal-header border-0">
            <h5 className="modal-title text-white">{name}</h5>
            <button 
              type="button" 
              className="btn-close btn-close-white" 
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body text-center p-0">
            <img 
              src={image} 
              alt={name} 
              className="img-fluid rounded"
              style={{ maxHeight: '70vh', objectFit: 'contain' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 