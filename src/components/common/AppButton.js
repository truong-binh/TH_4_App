/**
 * Nút bấm chuẩn của ứng dụng.
 * @param {string} title - Bắt buộc
 * @param {() => void} onPress - Bắt buộc
 * @param {'primary'|'outline'} [variant] - Mặc định 'primary'
 * @param {boolean} [loading] - true thì hiện spinner và không cho bấm
 * @param {boolean} [disabled]
 */
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';

import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function AppButton({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
}) {
  const isOutline = variant === 'outline';
  const blocked = loading || disabled;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isOutline ? styles.outline : styles.primary,
        blocked && styles.disabled,
      ]}
      onPress={onPress}
      disabled={blocked}
      accessibilityLabel={title}
      accessibilityRole="button"
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={isOutline ? colors.primary : colors.white}
        />
      ) : (
        <Text style={[styles.title, isOutline ? styles.titleOutline : styles.titlePrimary]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: spacing.touchTarget,
    borderRadius: spacing.radius,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
  },
  primary: { backgroundColor: colors.primary },
  outline: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  disabled: { opacity: 0.6 },
  title: { ...typography.button },
  titlePrimary: { color: colors.white },
  titleOutline: { color: colors.primary },
});
