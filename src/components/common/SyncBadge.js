/**
 * Nhãn "Chưa đồng bộ" cho các mục đang nằm trong hàng đợi offline.
 * @param {boolean} pending - Bắt buộc; false thì không hiện gì
 */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function SyncBadge({ pending }) {
  if (!pending) return null;

  return (
    <View style={styles.badge}>
      <Text style={styles.text}>Chưa đồng bộ</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.warningSoft,
    borderRadius: spacing.radiusSm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  text: { ...typography.small, color: colors.warningText },
});
