/**
 * Chọn thứ trong tuần: 7 nút Thứ 2 → Chủ nhật.
 * @param {number} selectedDay - Bắt buộc (2..8 theo quy ước đề bài)
 * @param {(day: number) => void} onSelectDay - Bắt buộc
 */
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';

import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

const DAYS = [
  { value: 2, label: 'T2' },
  { value: 3, label: 'T3' },
  { value: 4, label: 'T4' },
  { value: 5, label: 'T5' },
  { value: 6, label: 'T6' },
  { value: 7, label: 'T7' },
  { value: 8, label: 'CN' },
];

export default function DaySelector({ selectedDay, onSelectDay }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {DAYS.map((day) => {
        const isActive = day.value === selectedDay;
        return (
          <TouchableOpacity
            key={day.value}
            style={[styles.day, isActive && styles.dayActive]}
            onPress={() => onSelectDay(day.value)}
            accessibilityLabel={`Chọn ${day.label === 'CN' ? 'Chủ nhật' : `Thứ ${day.value}`}`}
          >
            <Text style={[styles.label, isActive && styles.labelActive]}>{day.label}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.sm, paddingVertical: spacing.xs },
  day: {
    minWidth: spacing.touchTarget,
    minHeight: spacing.touchTarget,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: spacing.radius,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    paddingHorizontal: spacing.sm,
  },
  dayActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  label: { ...typography.caption, color: colors.text, fontWeight: '600' },
  labelActive: { color: colors.white },
});
