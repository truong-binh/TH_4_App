// Hàm gọi API dùng chung cho toàn bộ tầng service.
// Khi lỗi sẽ throw đối tượng chuẩn hóa { type, status, message }
// với type là 'network' | 'timeout' | 'http'.
import { BASE_URL, TIMEOUT } from '../config';

export async function request(method, url, body) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT);
  let response;

  try {
    response = await fetch(`${BASE_URL}${url}`, {
      method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: body !== undefined && body !== null ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
  } catch (err) {
    if (err && err.name === 'AbortError') {
      throw {
        type: 'timeout',
        status: 0,
        message: 'Máy chủ phản hồi quá chậm (quá 10 giây). Vui lòng thử lại.',
      };
    }
    throw {
      type: 'network',
      status: 0,
      message: 'Không thể kết nối máy chủ. Kiểm tra mạng và địa chỉ server.',
    };
  } finally {
    clearTimeout(timer);
  }

  if (!response.ok) {
    throw {
      type: 'http',
      status: response.status,
      message: `Máy chủ trả về lỗi (mã ${response.status}).`,
    };
  }

  if (response.status === 204) return null;
  return response.json();
}

export default request;
