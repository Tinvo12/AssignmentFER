// Kiểm tra định dạng email
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Kiểm tra số điện thoại Việt Nam
export function isValidPhone(phone) {
  return /^(0|\+84)[0-9]{9,10}$/.test(phone);
}

// Kiểm tra số dương
export function isPositiveNumber(value) {
  return typeof value === 'number' && value > 0;
}

// Kiểm tra password tối thiểu 6 ký tự
export function isValidPassword(pw) {
  return typeof pw === 'string' && pw.length >= 6;
}
