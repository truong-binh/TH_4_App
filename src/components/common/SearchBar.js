/**
 * Ô tìm kiếm có nút xóa nhanh khi có nội dung.
 * @param {string} value - Bắt buộc
 * @param {(text: string) => void} onChangeText - Bắt buộc
 * @param {string} [placeholder]
 */
import React from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function SearchBar({ value, onChangeText, placeholder = 'Tìm kiếm…' }) {
  return (
    <View style={styles.container}>
      <Ionicons name="search-outline" size={18} color={colors.textMuted} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        autoCorrect={false}
        accessibilityLabel={placeholder}
      />
      {value ? (
        <TouchableOpacity
          style={styles.clearButton}
          onPress={() => onChangeText('')}
          accessibilityLabel="Xóa nội dung tìm kiếm"
        >
          <Ionicons name="close-circle" size={18} color={colors.textMuted} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: spacing.radiusLg + spacing.xs,
    paddingHorizontal: spacing.md,
    minHeight: spacing.touchTarget,
    shadowColor: colors.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  input: {
    ...typography.body,
    flex: 1,
    color: colors.text,
    marginLeft: spacing.sm,
    paddingVertical: spacing.sm,
  },
  clearButton: {
    minWidth: spacing.touchTarget,
    minHeight: spacing.touchTarget,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
});
