/**
 * Một dòng bài tập trong danh sách: tiêu đề, tên môn, hạn nộp (tô đỏ khi quá hạn),
 * kèm StatusToggle và SyncBadge.
 * @param {Object} assignment - Bắt buộc
 * @param {boolean} [pending] - true khi đang nằm trong hàng đợi "Chưa đồng bộ"
 * @param {() => void} onPress - Bắt buộc
 * @param {() => void} onToggleStatus - Bắt buộc
 */
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import StatusToggle from './StatusToggle';
import SyncBadge from '../common/SyncBadge';
import { formatDateTime, isOverdue } from '../../utils/date';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

function AssignmentItem({ assignment, pending = false, onPress, onToggleStatus }) {
  const done = assignment.status === 'done';
  const overdue = !done && isOverdue(assignment.dueDate);
  const courseName = assignment.course ? assignment.course.name : '';

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      accessibilityLabel={`Xem chi tiết bài tập ${assignment.title}`}
    >
      <StatusToggle status={assignment.status} onToggle={onToggleStatus} />
      <View style={styles.info}>
        <Text style={[styles.title, done && styles.titleDone]} numberOfLines={2}>
          {assignment.title}
        </Text>
        {courseName ? (
          <Text style={styles.course} numberOfLines={1}>
            {courseName}
          </Text>
        ) : null}
        <View style={styles.pillRow}>
          <View style={[styles.duePill, overdue && styles.duePillOverdue]}>
            <Ionicons
              name="time-outline"
              size={13}
              color={overdue ? colors.danger : colors.textMuted}
            />
            <Text style={[styles.dueText, overdue && styles.dueTextOverdue]}>
              {formatDateTime(assignment.dueDate)}
              {overdue ? ' · Quá hạn' : ''}
            </Text>
          </View>
          {done ? (
            <View style={styles.donePill}>
              <Text style={styles.doneText}>Đã xong</Text>
            </View>
          ) : null}
          <SyncBadge pending={pending} />
        </View>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
    </TouchableOpacity>
  );
}

export default React.memo(AssignmentItem);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: spacing.radius,
    padding: spacing.md,
    marginBottom: spacing.md,
    minHeight: spacing.touchTarget,
    shadowColor: colors.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  info: { flex: 1, marginHorizontal: spacing.sm, gap: spacing.xs },
  title: { ...typography.bodyBold, color: colors.text },
  titleDone: { color: colors.textMuted, textDecorationLine: 'line-through' },
  course: { ...typography.caption, color: colors.primary, fontWeight: '600' },
  pillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  duePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.background,
    borderRadius: spacing.radiusLg,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  duePillOverdue: { backgroundColor: colors.dangerSoft },
  dueText: { ...typography.small, color: colors.textMuted },
  dueTextOverdue: { color: colors.danger, fontWeight: '700' },
  donePill: {
    backgroundColor: colors.successSoft,
    borderRadius: spacing.radiusLg,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  doneText: { ...typography.small, color: colors.success },
});
