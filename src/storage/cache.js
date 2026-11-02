// Bộ nhớ đệm: lưu { data, savedAt } cho từng khóa
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getCache(key) {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.data === undefined) return null;
    return parsed; // { data, savedAt }
  } catch (err) {
    return null;
  }
}

export async function setCache(key, data, savedAt = new Date().toISOString()) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify({ data, savedAt }));
  } catch (err) {
    // Lỗi ghi cache không được làm hỏng luồng chính
  }
}

export default { getCache, setCache };
