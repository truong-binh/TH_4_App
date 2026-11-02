/**
 * Trạng thái lỗi: biểu tượng, thông báo và nút "Thử lại".
 * @param {string} message - Bắt buộc
 * @param {() => void} onRetry - Bắt buộc
 */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import AppButton from './AppButton';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function ErrorView({ message, onRetry }) {
  return (
    <View style={styles.container}>
      <Ionicons name="alert-circle-outline" size={48} color={colors.danger} />
      <Text style={styles.message}>{message}</Text>
      <AppButton title="Thử lại" onPress={onRetry} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  message: {
    ...typography.body,
    color: colors.text,
    textAlign: 'center',
    marginVertical: spacing.lg,
  },
});
