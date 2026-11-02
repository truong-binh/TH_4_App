/**
 * Dòng "Cập nhật lần cuối: HH:mm, dd/MM/yyyy"; không hiện khi timestamp rỗng.
 * @param {string} timestamp - Bắt buộc (chuỗi ISO 8601, có thể rỗng)
 */
import React from 'react';
import { StyleSheet, Text } from 'react-native';

import { formatDateTime } from '../../utils/date';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function LastUpdatedText({ timestamp }) {
  if (!timestamp) return null;

  return (
    <Text style={styles.text}>Cập nhật lần cuối: {formatDateTime(timestamp)}</Text>
  );
}

const styles = StyleSheet.create({
  text: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
    paddingVertical: spacing.sm,
  },
});
