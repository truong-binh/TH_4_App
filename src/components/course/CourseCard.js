/**
 * Thẻ môn học trong danh sách: mã môn, tên môn, số tín chỉ, giảng viên.
 * @param {Object} course - Bắt buộc
 * @param {() => void} onPress - Bắt buộc
 */
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

function CourseCard({ course, onPress }) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      accessibilityLabel={`Xem chi tiết môn ${course.name}`}
    >
      <View style={styles.iconTile}>
        <Ionicons name="book" size={22} color={colors.primary} />
      </View>
      <View style={styles.info}>
        <View style={styles.topRow}>
          <Text style={styles.code}>{course.code}</Text>
          <View style={styles.creditsPill}>
            <Text style={styles.creditsText}>{course.credits} TC</Text>
          </View>
        </View>
        <Text style={styles.name} numberOfLines={2}>
          {course.name}
        </Text>
        <View style={styles.lecturerRow}>
          <Ionicons name="person-outline" size={13} color={colors.textMuted} />
          <Text style={styles.lecturer} numberOfLines={1}>
            {course.lecturer}
          </Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
    </TouchableOpacity>
  );
}

export default React.memo(CourseCard);

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
  iconTile: {
    width: 46,
    height: 46,
    borderRadius: spacing.radiusSm,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  info: { flex: 1, marginRight: spacing.sm },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  code: { ...typography.caption, color: colors.primary, fontWeight: '700' },
  creditsPill: {
    backgroundColor: colors.navySoft,
    borderRadius: spacing.radiusLg,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  creditsText: { ...typography.small, color: colors.navy },
  name: { ...typography.bodyBold, color: colors.text, marginBottom: spacing.xs },
  lecturerRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  lecturer: { ...typography.caption, color: colors.textMuted, flexShrink: 1 },
});
