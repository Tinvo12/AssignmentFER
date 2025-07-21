import React from 'react';

export default function ModalForm({ show, onClose, onSubmit, children, title }) {
  if (!show) return null;
  return (
    <div className="modal show d-block" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={onSubmit}>
            <div className="modal-body">{children}</div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Đóng</button>
              <button type="submit" className="btn btn-primary">Lưu</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
