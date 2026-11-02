// Chiến lược "cache trước, mạng sau":
// 1. Mở màn hình -> hiển thị ngay dữ liệu trong cache (nếu có)
// 2. Gọi API -> thành công thì cập nhật dữ liệu + ghi lại cache kèm savedAt
// 3. Lỗi mạng mà đã có cache -> giữ nguyên dữ liệu cũ, không báo lỗi
import { useCallback, useEffect, useRef, useState } from 'react';

import { getCache, setCache } from '../storage/cache';
import useNetworkStatus from './useNetworkStatus';

export default function useCachedQuery(key, fetcher) {
  const { isOnline } = useNetworkStatus();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;
  const dataRef = useRef(null);
  dataRef.current = data;
  const lastUpdatedRef = useRef(null);
  lastUpdatedRef.current = lastUpdated;
  const mountedRef = useRef(true);
  const wasOnlineRef = useRef(true);

  const load = useCallback(
    async ({ asRefresh = false } = {}) => {
      if (asRefresh) {
        setRefreshing(true);
        setError(null);
      }
      try {
        const fresh = await fetcherRef.current();
        const savedAt = new Date().toISOString();
        await setCache(key, fresh, savedAt);
        if (!mountedRef.current) return;
        setData(fresh);
        setLastUpdated(savedAt);
        setError(null);
      } catch (err) {
        if (!mountedRef.current) return;
        // Đã có dữ liệu (từ cache) thì không chuyển sang màn hình lỗi
        if (dataRef.current === null) setError(err);
      } finally {
        if (mountedRef.current) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    },
    [key]
  );

  // Lần đầu: đọc cache rồi mới gọi API
  useEffect(() => {
    mountedRef.current = true;
    (async () => {
      const cached = await getCache(key);
      if (!mountedRef.current) return;
      if (cached) {
        setData(cached.data);
        setLastUpdated(cached.savedAt || null);
        setLoading(false);
      }
      await load();
    })();
    return () => {
      mountedRef.current = false;
    };
  }, [key, load]);

  // Có mạng trở lại -> tự làm mới dữ liệu
  useEffect(() => {
    if (isOnline && !wasOnlineRef.current) load();
    wasOnlineRef.current = isOnline;
  }, [isOnline, load]);

  const refresh = useCallback(() => load({ asRefresh: true }), [load]);

  // Cập nhật dữ liệu cục bộ (optimistic update) và ghi đè cache,
  // giữ nguyên savedAt vì đây không phải dữ liệu mới từ server
  const mutate = useCallback(
    (updater) => {
      setData((prev) => {
        const next = typeof updater === 'function' ? updater(prev) : updater;
        setCache(key, next, lastUpdatedRef.current || new Date().toISOString());
        return next;
      });
    },
    [key]
  );

  return { data, loading, error, refreshing, lastUpdated, refresh, mutate };
}
