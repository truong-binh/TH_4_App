/**
 * Danh sách chip lọc cuộn ngang, chip đang chọn có màu nhấn.
 * @param {Array<{ value: string|number, label: string }>} options - Bắt buộc
 * @param {string|number} selected - Bắt buộc (value của chip đang chọn)
 * @param {(value: string|number) => void} onSelect - Bắt buộc
 */
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';

import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function FilterChips({ options, selected, onSelect }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {options.map((option) => {
        const isActive = option.value === selected;
        return (
          <TouchableOpacity
            key={String(option.value)}
            style={[styles.chip, isActive && styles.chipActive]}
            onPress={() => onSelect(option.value)}
            accessibilityLabel={`Lọc theo ${option.label}`}
          >
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.sm, paddingVertical: spacing.xs },
  chip: {
    minHeight: spacing.touchTarget,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    borderRadius: spacing.touchTarget / 2,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  chipActive: {
    backgroundColor: colors.navy,
    borderColor: colors.navy,
  },
  label: { ...typography.caption, color: colors.text, fontWeight: '600' },
  labelActive: { color: colors.white },
});
