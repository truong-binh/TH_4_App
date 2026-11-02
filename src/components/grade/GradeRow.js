/**
 * Một dòng kết quả học tập: tên môn, số tín chỉ, điểm tổng kết, điểm chữ.
 * @param {Object} grade - Bắt buộc (có thể kèm grade.course nhờ _expand)
 * @param {() => void} onPress - Bắt buộc
 */
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

function GradeRow({ grade, onPress }) {
  const course = grade.course || {};

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      accessibilityLabel={`Xem chi tiết điểm môn ${course.name || ''}`}
    >
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {course.name || 'Môn học'}
        </Text>
        <Text style={styles.meta}>
          {course.credits ? `${course.credits} tín chỉ` : ''} · {grade.semester}
        </Text>
      </View>
      <View style={styles.scoreBox}>
        <View style={styles.letterBadge}>
          <Text style={styles.letterText}>{grade.letter}</Text>
        </View>
        <Text style={styles.total}>{grade.total}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default React.memo(GradeRow);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: spacing.radius,
    padding: spacing.lg,
    marginBottom: spacing.md,
    minHeight: spacing.touchTarget,
    shadowColor: colors.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  info: { flex: 1, marginRight: spacing.md },
  name: { ...typography.bodyBold, color: colors.text },
  meta: { ...typography.caption, color: colors.textMuted, marginTop: spacing.xs },
  scoreBox: { alignItems: 'center', gap: spacing.xs },
  letterBadge: {
    minWidth: 40,
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: spacing.radiusLg,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  letterText: { ...typography.bodyBold, color: colors.primary },
  total: { ...typography.caption, color: colors.textMuted },
});
