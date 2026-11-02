// Service cho tài nguyên /sessions - chỉ gọi request, không xử lý cache
import { request } from './client';

export function getAll() {
  return request('GET', '/sessions?_expand=course');
}

export function getById(id) {
  return request('GET', `/sessions/${id}?_expand=course`);
}

export default { getAll, getById };
