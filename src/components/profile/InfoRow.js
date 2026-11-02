/**
 * Một dòng nhãn - giá trị trong màn hình Cá nhân / chi tiết.
 * @param {string} label - Bắt buộc
 * @param {string|number} value - Bắt buộc
 */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function InfoRow({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value === null || value === undefined ? '' : String(value)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minHeight: spacing.touchTarget,
  },
  label: { ...typography.caption, color: colors.textMuted, marginRight: spacing.md },
  value: { ...typography.body, color: colors.text, flexShrink: 1, textAlign: 'right' },
});
