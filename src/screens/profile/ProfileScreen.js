// Cá nhân: thông tin sinh viên, GPA tóm tắt, lối vào Chỉnh sửa và Kết quả học tập.
import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import ScreenContainer from '../../components/common/ScreenContainer';
import LoadingView from '../../components/common/LoadingView';
import ErrorView from '../../components/common/ErrorView';
import InfoRow from '../../components/profile/InfoRow';
import GpaSummary from '../../components/grade/GpaSummary';
import SyncBadge from '../../components/common/SyncBadge';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import AppButton from '../../components/common/AppButton';
import { useAppData } from '../../context/AppDataContext';
import { useSync } from '../../context/SyncContext';
import routes from '../../navigation/routes';
import { calcGpa } from '../../utils/gpa';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function ProfileScreen({ navigation }) {
  const { student, courses, grades, studentQuery, profilePending } = useAppData();
  const { isOnline } = useSync();

  const { gpa, totalCredits } = useMemo(
    () => calcGpa(grades, courses),
    [grades, courses]
  );

  if (studentQuery.loading && !student) {
    return (
      <ScreenContainer>
        <LoadingView />
      </ScreenContainer>
    );
  }

  if (!student) {
    return (
      <ScreenContainer>
        <ErrorView
          message={studentQuery.error?.message || 'Không tải được thông tin sinh viên.'}
          onRetry={studentQuery.refresh}
        />
      </ScreenContainer>
    );
  }

  const initial = student.fullName ? student.fullName.trim().slice(-1) : '?';

  return (
    <ScreenContainer scroll>
      <View style={styles.heroCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>
        <Text style={styles.heroName}>{student.fullName}</Text>
        <Text style={styles.heroCode}>MSV: {student.studentCode}</Text>
        <View style={styles.heroPill}>
          <Text style={styles.heroPillText}>{student.className}</Text>
        </View>
        <View style={styles.badgeRow}>
          <SyncBadge pending={profilePending} />
        </View>
      </View>

      <GpaSummary gpa={gpa} totalCredits={totalCredits} />

      <View style={styles.card}>
        <InfoRow label="Ngành" value={student.major} />
        <InfoRow label="Email" value={student.email} />
        <InfoRow label="Số điện thoại" value={student.phone} />
      </View>

      {!isOnline ? <LastUpdatedText timestamp={studentQuery.lastUpdated} /> : null}

      <AppButton
        title="Chỉnh sửa thông tin"
        onPress={() => navigation.navigate(routes.EDIT_PROFILE)}
      />
      <View style={styles.spacer} />
      <AppButton
        title="Kết quả học tập"
        variant="outline"
        onPress={() => navigation.navigate(routes.GRADE_LIST)}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: spacing.radius,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    shadowColor: colors.shadow,
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  avatarText: { ...typography.h1, color: colors.primary },
  heroName: { ...typography.h2, color: colors.text },
  heroCode: { ...typography.caption, color: colors.textMuted, marginTop: spacing.xs },
  heroPill: {
    backgroundColor: colors.navySoft,
    borderRadius: spacing.radiusLg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    marginTop: spacing.sm,
  },
  heroPillText: { ...typography.caption, color: colors.navy, fontWeight: '600' },
  badgeRow: { marginTop: spacing.sm },
  card: {
    backgroundColor: colors.card,
    borderRadius: spacing.radius,
    overflow: 'hidden',
    marginBottom: spacing.lg,
    shadowColor: colors.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  spacer: { height: spacing.md },
});
