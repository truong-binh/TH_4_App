// Thời khóa biểu: chọn ngày bằng DaySelector, danh sách buổi học trong ngày.
import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import ScreenContainer from '../../components/common/ScreenContainer';
import LoadingView from '../../components/common/LoadingView';
import ErrorView from '../../components/common/ErrorView';
import EmptyState from '../../components/common/EmptyState';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import DaySelector from '../../components/schedule/DaySelector';
import SessionCard from '../../components/schedule/SessionCard';
import useCachedQuery from '../../hooks/useCachedQuery';
import sessionService from '../../api/sessionService';
import { CACHE_KEYS } from '../../storage/keys';
import { useSync } from '../../context/SyncContext';
import routes from '../../navigation/routes';
import { todayDayOfWeek } from '../../utils/date';
import spacing from '../../theme/spacing';

export default function ScheduleScreen({ navigation }) {
  const sessionsQuery = useCachedQuery(CACHE_KEYS.SESSIONS, sessionService.getAll);
  const { isOnline } = useSync();
  const [selectedDay, setSelectedDay] = useState(todayDayOfWeek());

  const daySessions = useMemo(
    () =>
      (sessionsQuery.data || [])
        .filter((s) => s.dayOfWeek === selectedDay)
        .sort((a, b) => a.startTime.localeCompare(b.startTime)),
    [sessionsQuery.data, selectedDay]
  );

  if (sessionsQuery.loading) {
    return (
      <ScreenContainer>
        <LoadingView message="Đang tải thời khóa biểu…" />
      </ScreenContainer>
    );
  }

  if (sessionsQuery.error) {
    return (
      <ScreenContainer>
        <ErrorView message={sessionsQuery.error.message} onRetry={sessionsQuery.refresh} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <View style={styles.toolbar}>
        <DaySelector selectedDay={selectedDay} onSelectDay={setSelectedDay} />
        {!isOnline ? <LastUpdatedText timestamp={sessionsQuery.lastUpdated} /> : null}
      </View>
      <FlatList
        data={daySessions}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <SessionCard
            session={item}
            onPress={() => navigation.navigate(routes.SESSION_DETAIL, { id: item.id })}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            title="Không có buổi học"
            description="Ngày này không có buổi học nào trong thời khóa biểu."
          />
        }
        refreshing={sessionsQuery.refreshing}
        onRefresh={sessionsQuery.refresh}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  toolbar: { padding: spacing.lg, paddingBottom: spacing.sm },
  listContent: { padding: spacing.lg, paddingTop: spacing.sm, flexGrow: 1 },
});
