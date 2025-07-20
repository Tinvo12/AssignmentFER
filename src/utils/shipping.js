// Tính phí vận chuyển dựa trên loại xe và số km
export function calculateShipping(vehicleType, km) {
  if (!vehicleType || !km || km <= 0) return 0;
  switch (vehicleType) {
    case 'small': // Xe nhỏ (1–2 t): 10–20 k/km
      return km * 15000; // Trung bình 15k/km
    case 'medium': // Xe vừa (3–5 t): 20–30 k/km
      return km * 25000; // Trung bình 25k/km
    case 'large': // Xe lớn (8–15 t): 30–50 k/km
      return km * 40000; // Trung bình 40k/km
    default:
      return 0;
  }
}
