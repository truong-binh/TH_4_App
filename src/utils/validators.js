// Kiểm tra dữ liệu đầu vào cho các form
import { parseDateTimeInput } from './date';

export function isRequired(value) {
  return value !== null && value !== undefined && String(value).trim().length > 0;
}

export function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());
}

export function isPhone(value) {
  return /^0\d{9,10}$/.test(String(value || '').trim());
}

/**
 * Kiểm tra form thêm bài tập.
 * @param {{ title: string, dueDateText: string, courseId: number|string }} values
 * @returns {Object} errors - rỗng nếu hợp lệ
 */
export function validateAssignment(values) {
  const errors = {};
  if (!isRequired(values.title)) {
    errors.title = 'Tiêu đề không được để trống';
  }
  if (!isRequired(values.courseId)) {
    errors.courseId = 'Vui lòng chọn môn học';
  }
  const due = parseDateTimeInput(values.dueDateText);
  if (!due) {
    errors.dueDateText = 'Hạn nộp phải theo định dạng dd/MM/yyyy HH:mm';
  } else if (due.getTime() < Date.now()) {
    errors.dueDateText = 'Hạn nộp không được ở quá khứ';
  }
  return errors;
}

/**
 * Kiểm tra form sửa thông tin cá nhân.
 * @param {{ fullName: string, className: string, major: string, email: string, phone: string }} values
 * @returns {Object} errors - rỗng nếu hợp lệ
 */
export function validateProfile(values) {
  const errors = {};
  if (!isRequired(values.fullName)) errors.fullName = 'Họ tên không được để trống';
  if (!isRequired(values.className)) errors.className = 'Lớp không được để trống';
  if (!isRequired(values.major)) errors.major = 'Ngành không được để trống';
  if (!isEmail(values.email)) errors.email = 'Email không hợp lệ';
  if (!isPhone(values.phone)) errors.phone = 'Số điện thoại không hợp lệ (10-11 số, bắt đầu bằng 0)';
  return errors;
}
