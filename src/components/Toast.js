import React from 'react';

export default function Toast({ show, message, onClose }) {
  if (!show) return null;
  return (
    <div className="toast show position-fixed bottom-0 end-0 m-3" style={{ zIndex: 9999 }}>
      <div className="toast-header">
        <strong className="me-auto">Thông báo</strong>
        <button type="button" className="btn-close" onClick={onClose}></button>
      </div>
      <div className="toast-body">{message}</div>
    </div>
  );
}
