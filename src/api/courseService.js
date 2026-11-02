// Service cho tài nguyên /courses - chỉ gọi request, không xử lý cache
import { request } from './client';

export function getAll() {
  return request('GET', '/courses');
}

export function getById(id) {
  return request('GET', `/courses/${id}`);
}

export default { getAll, getById };
