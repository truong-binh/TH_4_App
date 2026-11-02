// Chi tiết bài tập: chỉ nhận { id } qua route.params rồi tự gọi API;
// ưu tiên dữ liệu trong Context để trạng thái luôn đồng nhất giữa các tab.
import React, { useEffect, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import ScreenContainer from '../../components/common/ScreenContainer';
import LoadingView from '../../components/common/LoadingView';
import ErrorView from '../../components/common/ErrorView';
import InfoRow from '../../components/profile/InfoRow';
import SyncBadge from '../../components/common/SyncBadge';
import StatusToggle from '../../components/assignment/StatusToggle';
import AppButton from '../../components/common/AppButton';
import useCachedQuery from '../../hooks/useCachedQuery';
import assignmentService from '../../api/assignmentService';
import { CACHE_KEYS } from '../../storage/keys';
import { useAppData } from '../../context/AppDataContext';
import { formatDateTime, isOverdue } from '../../utils/date';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function AssignmentDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const { assignments, pendingAssignmentIds, toggleAssignment } = useAppData();

  const assignmentQuery = useCachedQuery(CACHE_KEYS.assignment(id), () =>
    assignmentService.getById(id)
  );

  // Trạng thái trong Context là mới nhất (optimistic update), ưu tiên trước
  const assignment = useMemo(() => {
    const fromContext = assignments.find((a) => String(a.id) === String(id));
    return fromContext || assignmentQuery.data || null;
  }, [assignments, assignmentQuery.data, id]);

  useEffect(() => {
    if (assignment) navigation.setOptions({ title: assignment.title });
  }, [navigation, assignment]);

  if (!assignment && assignmentQuery.loading) {
    return (
      <ScreenContainer>
        <LoadingView />
      </ScreenContainer>
    );
  }

  if (!assignment) {
    return (
      <ScreenContainer>
        <ErrorView
          message={assignmentQuery.error?.message || 'Không tải được thông tin bài tập.'}
          onRetry={assignmentQuery.refresh}
        />
      </ScreenContainer>
    );
  }

  const overdue = assignment.status === 'todo' && isOverdue(assignment.dueDate);
  const pending = pendingAssignmentIds.has(String(assignment.id));

  return (
    <ScreenContainer scroll>
      <View style={styles.statusRow}>
        <StatusToggle
          status={assignment.status}
          onToggle={() => toggleAssignment(assignment)}
        />
        <Text style={styles.statusText}>
          {assignment.status === 'done' ? 'Đã hoàn thành' : 'Chưa hoàn thành'}
        </Text>
        <SyncBadge pending={pending} />
      </View>

      <View style={styles.card}>
        <InfoRow
          label="Môn học"
          value={assignment.course ? assignment.course.name : ''}
        />
        <InfoRow label="Hạn nộp" value={formatDateTime(assignment.dueDate)} />
        <InfoRow label="Trạng thái" value={overdue ? 'Quá hạn' : assignment.status === 'done' ? 'Đã xong' : 'Chưa xong'} />
        <InfoRow label="Cập nhật lúc" value={formatDateTime(assignment.updatedAt)} />
      </View>

      <Text style={styles.sectionTitle}>Mô tả</Text>
      <Text style={styles.description}>
        {assignment.description || 'Không có mô tả.'}
      </Text>

      <AppButton title="Quay lại" variant="outline" onPress={() => navigation.goBack()} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  statusText: { ...typography.bodyBold, color: colors.text, flex: 1 },
  card: {
    backgroundColor: colors.card,
    borderRadius: spacing.radius,
    overflow: 'hidden',
    marginBottom: spacing.md,
    shadowColor: colors.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  sectionTitle: { ...typography.h3, color: colors.text, marginBottom: spacing.sm },
  description: { ...typography.body, color: colors.textMuted, marginBottom: spacing.xl },
});
