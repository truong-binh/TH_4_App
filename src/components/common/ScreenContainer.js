/**
 * Khung bọc chung cho mọi screen: SafeAreaView + nền theme + OfflineBanner ở đầu.
 * @param {React.ReactNode} children - Bắt buộc
 * @param {boolean} [scroll] - true thì bọc nội dung trong ScrollView
 */
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import OfflineBanner from './OfflineBanner';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';

export default function ScreenContainer({ children, scroll = false }) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
      <OfflineBanner />
      {scroll ? (
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      ) : (
        <View style={styles.flex}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  scrollContent: { padding: spacing.lg, paddingBottom: spacing.xxl },
});
