// Cấu hình chung của ứng dụng.
// - Web (trình duyệt): http://localhost:3000
// - Máy ảo Android: http://10.0.2.2:3000
// - Điện thoại thật (Expo Go): http://<IP-LAN-của-máy-tính>:3000
//   (điện thoại và máy tính phải cùng mạng Wi-Fi)
import { Platform } from 'react-native';

export const BASE_URL = Platform.select({
  web: 'http://localhost:3000',
  android: 'http://10.0.2.2:3000',
  default: 'http://localhost:3000',
});

// Thời gian chờ tối đa cho một lần gọi API (ms)
export const TIMEOUT = 10000;

// Thời gian cache còn được coi là "mới" (ms) - 5 phút
export const CACHE_TTL = 5 * 60 * 1000;

// Id sinh viên đang đăng nhập (ứng dụng chưa có màn hình đăng nhập)
export const STUDENT_ID = 1;

// Học kỳ hiện tại, dùng cho mục "Môn đang học" ở Trang chủ
export const CURRENT_SEMESTER = 'HK1 2026-2027';
