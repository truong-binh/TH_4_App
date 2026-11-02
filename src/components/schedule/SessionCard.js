/**
 * Thẻ buổi học: tên môn, giờ bắt đầu - kết thúc (đồng hồ đỏ), phòng học (vị trí xanh).
 * @param {Object} session - Bắt buộc (có thể kèm session.course nhờ _expand)
 * @param {() => void} onPress - Bắt buộc
 */
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

function SessionCard({ session, onPress }) {
  const courseName = session.course ? session.course.name : 'Môn học';

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      accessibilityLabel={`Xem chi tiết buổi học ${courseName}`}
    >
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {courseName}
        </Text>
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={15} color={colors.primary} />
            <Text style={styles.metaText}>
              {session.startTime} - {session.endTime}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="location" size={15} color={colors.link} />
            <Text style={styles.metaText}>{session.room}</Text>
          </View>
        </View>
        {session.note ? <Text style={styles.note}>{session.note}</Text> : null}
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
    </TouchableOpacity>
  );
}

export default React.memo(SessionCard);

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
  info: { flex: 1, marginRight: spacing.sm },
  name: { ...typography.bodyBold, color: colors.text, marginBottom: spacing.sm },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  metaText: { ...typography.caption, color: colors.textMuted },
  note: { ...typography.caption, color: colors.warning, marginTop: spacing.xs },
});
