// Danh sách bài tập: lọc Tất cả / Chưa xong / Đã xong / Quá hạn, nút Thêm,
// optimistic update khi đổi trạng thái, nhãn "Chưa đồng bộ" khi offline.
import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import ScreenContainer from '../../components/common/ScreenContainer';
import LoadingView from '../../components/common/LoadingView';
import ErrorView from '../../components/common/ErrorView';
import EmptyState from '../../components/common/EmptyState';
import FilterChips from '../../components/common/FilterChips';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import AssignmentItem from '../../components/assignment/AssignmentItem';
import { useAppData } from '../../context/AppDataContext';
import { useSync } from '../../context/SyncContext';
import routes from '../../navigation/routes';
import { isOverdue } from '../../utils/date';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';

const FILTERS = [
  { value: 'all', label: 'Tất cả' },
  { value: 'todo', label: 'Chưa xong' },
  { value: 'done', label: 'Đã xong' },
  { value: 'overdue', label: 'Quá hạn' },
];

export default function AssignmentListScreen({ navigation }) {
  const { assignments, assignmentsQuery, pendingAssignmentIds, toggleAssignment } =
    useAppData();
  const { isOnline } = useSync();
  const [filter, setFilter] = useState('all');

  // Nút Thêm trên header
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate(routes.ASSIGNMENT_FORM)}
          accessibilityLabel="Thêm bài tập mới"
        >
          <Ionicons name="add" size={26} color={colors.white} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const filtered = useMemo(() => {
    switch (filter) {
      case 'todo':
        return assignments.filter((a) => a.status === 'todo');
      case 'done':
        return assignments.filter((a) => a.status === 'done');
      case 'overdue':
        return assignments.filter((a) => a.status === 'todo' && isOverdue(a.dueDate));
      default:
        return assignments;
    }
  }, [assignments, filter]);

  if (assignmentsQuery.loading) {
    return (
      <ScreenContainer>
        <LoadingView message="Đang tải danh sách bài tập…" />
      </ScreenContainer>
    );
  }

  if (assignmentsQuery.error) {
    return (
      <ScreenContainer>
        <ErrorView
          message={assignmentsQuery.error.message}
          onRetry={assignmentsQuery.refresh}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <View style={styles.toolbar}>
        <FilterChips options={FILTERS} selected={filter} onSelect={setFilter} />
        {!isOnline ? <LastUpdatedText timestamp={assignmentsQuery.lastUpdated} /> : null}
      </View>
      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <AssignmentItem
            assignment={item}
            pending={pendingAssignmentIds.has(String(item.id))}
            onPress={() =>
              navigation.navigate(routes.ASSIGNMENT_DETAIL, { id: item.id })
            }
            onToggleStatus={() => toggleAssignment(item)}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            title="Không có bài tập"
            description="Không có bài tập nào khớp với bộ lọc hiện tại."
            actionLabel="Thêm bài tập"
            onAction={() => navigation.navigate(routes.ASSIGNMENT_FORM)}
          />
        }
        refreshing={assignmentsQuery.refreshing}
        onRefresh={assignmentsQuery.refresh}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  toolbar: { padding: spacing.lg, paddingBottom: spacing.sm },
  listContent: { padding: spacing.lg, paddingTop: spacing.sm, flexGrow: 1 },
  addButton: {
    minWidth: spacing.touchTarget,
    minHeight: spacing.touchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
