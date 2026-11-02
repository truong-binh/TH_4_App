// Hàng đợi thao tác offline, giữ đúng thứ tự thêm vào.
// Mỗi phần tử: { id, method, url, body, createdAt, tempId? }
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OUTBOX_KEY } from './keys';

async function save(items) {
  await AsyncStorage.setItem(OUTBOX_KEY, JSON.stringify(items));
}

export async function getAll() {
  try {
    const raw = await AsyncStorage.getItem(OUTBOX_KEY);
    const items = raw ? JSON.parse(raw) : [];
    return Array.isArray(items) ? items : [];
  } catch (err) {
    return [];
  }
}

export async function enqueue(action) {
  const items = await getAll();

  // PATCH trùng url thì gộp body vào thao tác cũ để không tạo bản ghi thừa
  if (action.method === 'PATCH') {
    const existing = items.find(
      (item) => item.method === 'PATCH' && item.url === action.url
    );
    if (existing) {
      existing.body = { ...existing.body, ...action.body };
      await save(items);
      return items;
    }
  }

  items.push({
    id: `act_${Date.now()}_${Math.floor(Math.random() * 1000000)}`,
    createdAt: new Date().toISOString(),
    ...action,
  });
  await save(items);
  return items;
}

export async function remove(id) {
  const items = (await getAll()).filter((item) => item.id !== id);
  await save(items);
  return items;
}

export default { enqueue, getAll, remove };
