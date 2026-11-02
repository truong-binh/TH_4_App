// Chia sẻ trạng thái mạng và hàng đợi đồng bộ cho toàn ứng dụng:
// { isOnline, pendingCount, syncNow, syncing, items, lastSyncAt, enqueueAction }
import React, { createContext, useContext, useMemo } from 'react';

import useNetworkStatus from '../hooks/useNetworkStatus';
import useOutboxSync from '../hooks/useOutboxSync';

const SyncContext = createContext(null);

export function SyncProvider({ children }) {
  const { isOnline } = useNetworkStatus();
  const { pendingCount, items, syncing, syncNow, lastSyncAt, enqueueAction } =
    useOutboxSync();

  const value = useMemo(
    () => ({ isOnline, pendingCount, items, syncing, syncNow, lastSyncAt, enqueueAction }),
    [isOnline, pendingCount, items, syncing, syncNow, lastSyncAt, enqueueAction]
  );

  return <SyncContext.Provider value={value}>{children}</SyncContext.Provider>;
}

export function useSync() {
  const context = useContext(SyncContext);
  if (!context) {
    throw new Error('useSync phải được dùng bên trong SyncProvider');
  }
  return context;
}

export default SyncContext;
