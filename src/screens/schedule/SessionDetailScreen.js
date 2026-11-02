// Chi tiết buổi học: chỉ nhận { id } qua route.params rồi tự gọi API.
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import ScreenContainer from '../../components/common/ScreenContainer';
import LoadingView from '../../components/common/LoadingView';
import ErrorView from '../../components/common/ErrorView';
import InfoRow from '../../components/profile/InfoRow';
import AppButton from '../../components/common/AppButton';
import useCachedQuery from '../../hooks/useCachedQuery';
import sessionService from '../../api/sessionService';
import { CACHE_KEYS } from '../../storage/keys';
import { DAY_LABELS } from '../../utils/date';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';

export default function SessionDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const sessionQuery = useCachedQuery(CACHE_KEYS.session(id), () =>
    sessionService.getById(id)
  );
  // Offline chưa có cache chi tiết thì tìm trong danh sách buổi học đã cache
  const sessionsQuery = useCachedQuery(CACHE_KEYS.SESSIONS, sessionService.getAll);
  const session =
    sessionQuery.data ||
    (sessionsQuery.data || []).find((s) => String(s.id) === String(id)) ||
    null;

  useEffect(() => {
    if (session && session.course) {
      navigation.setOptions({ title: session.course.name });
    }
  }, [navigation, session]);

  if (!session && sessionQuery.loading) {
    return (
      <ScreenContainer>
        <LoadingView />
      </ScreenContainer>
    );
  }

  if (!session) {
    return (
      <ScreenContainer>
        <ErrorView
          message={sessionQuery.error?.message || 'Không tải được thông tin buổi học.'}
          onRetry={sessionQuery.refresh}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scroll>
      <View style={styles.card}>
        <InfoRow label="Môn học" value={session.course ? session.course.name : ''} />
        <InfoRow label="Thứ" value={DAY_LABELS[session.dayOfWeek]} />
        <InfoRow label="Thời gian" value={`${session.startTime} - ${session.endTime}`} />
        <InfoRow label="Phòng" value={session.room} />
        <InfoRow label="Ghi chú" value={session.note || 'Không có'} />
      </View>
      <AppButton title="Quay lại" variant="outline" onPress={() => navigation.goBack()} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: spacing.radius,
    overflow: 'hidden',
    marginBottom: spacing.lg,
    shadowColor: colors.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
});
