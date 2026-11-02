/**
 * Khối tóm tắt GPA hệ 4 (làm tròn 2 chữ số) và tổng tín chỉ tích lũy.
 * @param {number} gpa - Bắt buộc
 * @param {number} totalCredits - Bắt buộc
 */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function GpaSummary({ gpa, totalCredits }) {
  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.value}>{(Number(gpa) || 0).toFixed(2)}</Text>
        <Text style={styles.label}>GPA hệ 4</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.box}>
        <Text style={styles.value}>{totalCredits}</Text>
        <Text style={styles.label}>Tín chỉ tích lũy</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: spacing.radius,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    shadowColor: colors.shadow,
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  box: { flex: 1, alignItems: 'center' },
  divider: { width: 1, backgroundColor: colors.border },
  value: { ...typography.h1, color: colors.primary },
  label: { ...typography.caption, color: colors.textMuted, marginTop: spacing.xs },
});
