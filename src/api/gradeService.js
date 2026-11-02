// Service cho tài nguyên /grades - chỉ gọi request, không xử lý cache
import { request } from './client';

export function getAll() {
  return request('GET', '/grades?_expand=course');
}

export function getById(id) {
  return request('GET', `/grades/${id}?_expand=course`);
}

export default { getAll, getById };
