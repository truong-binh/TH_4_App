/**
 * Trạng thái đang tải: ActivityIndicator căn giữa kèm dòng chữ.
 * @param {string} [message] - Mặc định "Đang tải…"
 */
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function LoadingView({ message = 'Đang tải…' }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  message: { ...typography.body, color: colors.textMuted, marginTop: spacing.md },
});
