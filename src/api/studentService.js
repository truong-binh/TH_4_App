// Service cho tài nguyên /students - chỉ gọi request, không xử lý cache
import { request } from './client';

export function getById(id) {
  return request('GET', `/students/${id}`);
}

export function update(id, data) {
  return request('PATCH', `/students/${id}`, data);
}

export default { getById, update };
