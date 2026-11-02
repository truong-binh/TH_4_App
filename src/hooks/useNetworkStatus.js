// Theo dõi trạng thái mạng bằng @react-native-community/netinfo
import { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';

export default function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Chỉ dựa vào isConnected để server LAN (không có internet) vẫn được coi là online
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(Boolean(state.isConnected));
    });
    return unsubscribe;
  }, []);

  return { isOnline };
}
