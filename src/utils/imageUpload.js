// Utility để xử lý upload và hiển thị ảnh sản phẩm
export const handleImageUpload = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve(null);
      return;
    }

    // Kiểm tra loại file
    if (!file.type.startsWith('image/')) {
      reject(new Error('File phải là ảnh'));
      return;
    }

    // Kiểm tra kích thước file (tối đa 5MB)
    if (file.size > 5 * 1024 * 1024) {
      reject(new Error('Kích thước ảnh không được vượt quá 5MB'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      resolve(e.target.result);
    };
    reader.onerror = () => {
      reject(new Error('Không thể đọc file'));
    };
    reader.readAsDataURL(file);
  });
};

// Component để hiển thị ảnh sản phẩm
export const ProductImage = ({ image, name, className = "", style = {} }) => {
  if (!image) {
    return (
      <div 
        className={`d-flex align-items-center justify-content-center bg-light ${className}`}
        style={{ 
          minHeight: 200, 
          background: 'linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0f0f0 75%), linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)',
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
          ...style 
        }}
      >
        <div className="text-center text-muted">
          <i className="bi bi-image" style={{ fontSize: '3rem' }}></i>
          <div className="mt-2 small">No image</div>
        </div>
      </div>
    );
  }

  return (
    <img 
      src={image} 
      alt={name || 'Product image'} 
      className={`img-fluid ${className}`}
      style={{ 
        objectFit: 'cover',
        minHeight: 200,
        ...style 
      }}
      onError={(e) => {
        e.target.style.display = 'none';
        e.target.nextSibling.style.display = 'flex';
      }}
    />
  );
};

// Component để upload ảnh
export const ImageUploadInput = ({ value, onChange, name, label, required = false }) => {
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const imageData = await handleImageUpload(file);
        onChange({ target: { name, value: imageData } });
      } catch (error) {
        alert(error.message);
        e.target.value = '';
      }
    }
  };

  return (
    <div className="mb-3">
      <label className="form-label fw-semibold">
        {label} {required && <span className="text-danger">*</span>}
      </label>
      <div className="d-flex gap-3 align-items-start">
        <div className="flex-grow-1">
          <input
            type="file"
            name={name}
            className="form-control rounded-pill"
            accept="image/*"
            onChange={handleFileChange}
            required={required}
          />
          <div className="form-text">
            Chọn ảnh (JPG, PNG, GIF) - Tối đa 5MB
          </div>
        </div>
        {value && (
          <div className="flex-shrink-0">
            <img 
              src={value} 
              alt="Preview" 
              className="rounded"
              style={{ width: 80, height: 80, objectFit: 'cover' }}
            />
          </div>
        )}
      </div>
    </div>
  );
}; 