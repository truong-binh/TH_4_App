/**
 * Nút chuyển trạng thái bài tập todo ↔ done.
 * @param {'todo'|'done'} status - Bắt buộc
 * @param {() => void} onToggle - Bắt buộc
 */
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import colors from '../../theme/colors';
import spacing from '../../theme/spacing';

export default function StatusToggle({ status, onToggle }) {
  const isDone = status === 'done';

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onToggle}
      accessibilityLabel={isDone ? 'Đánh dấu chưa hoàn thành' : 'Đánh dấu đã hoàn thành'}
      accessibilityRole="button"
    >
      <Ionicons
        name={isDone ? 'checkmark-circle' : 'ellipse-outline'}
        size={28}
        color={isDone ? colors.success : colors.textMuted}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    minWidth: spacing.touchTarget,
    minHeight: spacing.touchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
