// Quản lý hàng đợi offline và tự đồng bộ khi có mạng trở lại.
// - Gửi lần lượt các thao tác theo đúng thứ tự thêm vào
// - Thành công: xóa khỏi hàng đợi; lỗi mạng: dừng lại, thử lại sau
// - Xung đột (B5): trước khi PATCH, so sánh updatedAt với dữ liệu trên server;
//   nếu server mới hơn thì bỏ qua thao tác offline và báo cho người dùng
import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';

import { request } from '../api/client';
import outbox from '../storage/outbox';
import useNetworkStatus from './useNetworkStatus';

export default function useOutboxSync() {
  const { isOnline } = useNetworkStatus();
  const [items, setItems] = useState([]);
  const [syncing, setSyncing] = useState(false);
  const [lastSyncAt, setLastSyncAt] = useState(null);

  const syncingRef = useRef(false);
  const wasOnlineRef = useRef(false);

  const enqueueAction = useCallback(async (action) => {
    const next = await outbox.enqueue(action);
    setItems(next);
  }, []);

  const syncNow = useCallback(async () => {
    if (syncingRef.current) return;
    const queue = await outbox.getAll();
    if (queue.length === 0) return;

    syncingRef.current = true;
    setSyncing(true);
    let synced = 0;
    let conflicted = 0;

    for (const action of queue) {
      try {
        // Kiểm tra xung đột cho các thao tác cập nhật
        if (action.method === 'PATCH' && action.body && action.body.updatedAt) {
          let current = null;
          try {
            current = await request('GET', action.url);
          } catch (err) {
            if (err && err.type !== 'http') throw err; // lỗi mạng -> dừng đồng bộ
          }
          if (
            current &&
            current.updatedAt &&
            new Date(current.updatedAt).getTime() >
              new Date(action.body.updatedAt).getTime()
          ) {
            await outbox.remove(action.id);
            conflicted += 1;
            continue;
          }
        }

        await request(action.method, action.url, action.body);
        await outbox.remove(action.id);
        synced += 1;
      } catch (err) {
        if (err && err.type === 'http') {
          // Server từ chối thao tác này: giữ lại để thử lại sau, tiếp tục mục kế
          continue;
        }
        // Mất mạng / timeout: dừng, giữ nguyên phần còn lại của hàng đợi
        break;
      }
    }

    const remaining = await outbox.getAll();
    setItems(remaining);
    setSyncing(false);
    syncingRef.current = false;

    if (synced > 0 || conflicted > 0) {
      setLastSyncAt(new Date().toISOString());
    }
    if (synced > 0) {
      Alert.alert('Đồng bộ', `Đã đồng bộ ${synced} thay đổi.`);
    }
    if (conflicted > 0) {
      Alert.alert(
        'Xung đột dữ liệu',
        `${conflicted} thay đổi offline bị bỏ qua vì dữ liệu trên máy chủ mới hơn.`
      );
    }
  }, []);

  // Đọc hàng đợi còn dang dở khi mở lại ứng dụng
  useEffect(() => {
    (async () => {
      const saved = await outbox.getAll();
      setItems(saved);
    })();
  }, []);

  // Mạng chuyển từ offline -> online (hoặc mở app khi online mà còn hàng đợi) thì tự đồng bộ
  useEffect(() => {
    if (isOnline && !wasOnlineRef.current) syncNow();
    wasOnlineRef.current = isOnline;
  }, [isOnline, syncNow]);

  return { pendingCount: items.length, items, syncing, syncNow, lastSyncAt, enqueueAction };
}
