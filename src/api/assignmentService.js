// Service cho tài nguyên /assignments - chỉ gọi request, không xử lý cache
import { request } from './client';

export function getAll() {
  return request('GET', '/assignments?_expand=course&_sort=dueDate');
}

export function getById(id) {
  return request('GET', `/assignments/${id}?_expand=course`);
}

export function update(id, data) {
  return request('PATCH', `/assignments/${id}`, data);
}

export function create(data) {
  return request('POST', '/assignments', data);
}

export default { getAll, getById, update, create };
