// Trang chủ theo phong cách PTIT S-Link: card hồ sơ (avatar, họ tên, MSV, GPA),
// banner "Xem điểm thi", tab Hôm nay / Sắp tới, số thay đổi chưa đồng bộ.
import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import ScreenContainer from '../../components/common/ScreenContainer';
import LoadingView from '../../components/common/LoadingView';
import ErrorView from '../../components/common/ErrorView';
import EmptyState from '../../components/common/EmptyState';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import AssignmentItem from '../../components/assignment/AssignmentItem';
import SessionCard from '../../components/schedule/SessionCard';
import useCachedQuery from '../../hooks/useCachedQuery';
import sessionService from '../../api/sessionService';
import { CACHE_KEYS } from '../../storage/keys';
import { useAppData } from '../../context/AppDataContext';
import { useSync } from '../../context/SyncContext';
import routes from '../../navigation/routes';
import { daysLeft, todayDayOfWeek } from '../../utils/date';
import { calcGpa } from '../../utils/gpa';
import { CURRENT_SEMESTER } from '../../config';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

const TAB_TODAY = 'today';
const TAB_UPCOMING = 'upcoming';

export default function HomeScreen({ navigation }) {
  const {
    student,
    courses,
    grades,
    assignments,
    studentQuery,
    coursesQuery,
    assignmentsQuery,
    pendingAssignmentIds,
    toggleAssignment,
  } = useAppData();
  const { isOnline, pendingCount, syncing, syncNow } = useSync();
  const sessionsQuery = useCachedQuery(CACHE_KEYS.SESSIONS, sessionService.getAll);
  const [activeTab, setActiveTab] = useState(TAB_TODAY);

  const { gpa } = useMemo(() => calcGpa(grades, courses), [grades, courses]);

  const todaySessions = useMemo(
    () =>
      (sessionsQuery.data || [])
        .filter((s) => s.dayOfWeek === todayDayOfWeek())
        .sort((a, b) => a.startTime.localeCompare(b.startTime)),
    [sessionsQuery.data]
  );

  const dueSoon = useMemo(
    () =>
      assignments
        .filter((a) => {
          if (a.status !== 'todo') return false;
          const left = daysLeft(a.dueDate);
          return left >= 0 && left <= 7;
        })
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)),
    [assignments]
  );

  const refreshing =
    studentQuery.refreshing || assignmentsQuery.refreshing || sessionsQuery.refreshing;

  const onRefresh = useCallback(() => {
    studentQuery.refresh();
    coursesQuery.refresh();
    assignmentsQuery.refresh();
    sessionsQuery.refresh();
  }, [studentQuery, coursesQuery, assignmentsQuery, sessionsQuery]);

  const loading = studentQuery.loading || assignmentsQuery.loading;
  const error = studentQuery.error || assignmentsQuery.error;

  if (loading) {
    return (
      <ScreenContainer>
        <LoadingView />
      </ScreenContainer>
    );
  }

  if (error && !student) {
    return (
      <ScreenContainer>
        <ErrorView message={error.message} onRetry={onRefresh} />
      </ScreenContainer>
    );
  }

  const initial = student && student.fullName ? student.fullName.trim().slice(-1) : '?';

  const renderHeader = () => (
    <View>
      {/* Nền đỏ phía sau card hồ sơ */}
      <View style={styles.redBackdrop} />

      {/* Card hồ sơ: avatar + họ tên + MSV + GPA */}
      <TouchableOpacity
        style={styles.profileCard}
        onPress={() => navigation.navigate(routes.PROFILE_TAB)}
        accessibilityLabel="Mở trang cá nhân"
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName} numberOfLines={1}>
            {student ? student.fullName : ''}
          </Text>
          <Text style={styles.profileCode}>
            MSV: {student ? student.studentCode : ''}
          </Text>
        </View>
        <View style={styles.gpaBox}>
          <Text style={styles.gpaValue}>
            {(Number(gpa) || 0).toFixed(2)}
            <Text style={styles.gpaMax}>/4</Text>
          </Text>
          <View style={styles.gpaBadge}>
            <Text style={styles.gpaBadgeText}>GPA</Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Banner Xem điểm thi */}
      <View style={styles.promoCard}>
        <View style={styles.promoInfo}>
          <Text style={styles.promoTitle}>Xem điểm thi</Text>
          <View style={styles.promoSemesterPill}>
            <Text style={styles.promoSemesterText}>Học kỳ: {CURRENT_SEMESTER}</Text>
          </View>
          <TouchableOpacity
            style={styles.promoButton}
            onPress={() =>
              navigation.navigate(routes.PROFILE_TAB, { screen: routes.GRADE_LIST })
            }
            accessibilityLabel="Xem kết quả học tập ngay"
          >
            <Text style={styles.promoButtonText}>Xem ngay</Text>
            <Ionicons name="arrow-forward-circle" size={18} color={colors.primary} />
          </TouchableOpacity>
        </View>
        <Ionicons name="ribbon" size={64} color={colors.white} style={styles.promoIcon} />
      </View>

      {/* Thông báo chưa đồng bộ */}
      {pendingCount > 0 ? (
        <TouchableOpacity
          style={styles.syncCard}
          onPress={syncNow}
          disabled={!isOnline || syncing}
          accessibilityLabel="Đồng bộ các thay đổi đang chờ"
        >
          <Ionicons name="cloud-upload-outline" size={18} color={colors.warningText} />
          <Text style={styles.syncText}>
            {pendingCount} thay đổi chưa đồng bộ
            {isOnline ? ' - bấm để đồng bộ ngay' : ''}
          </Text>
        </TouchableOpacity>
      ) : null}

      {!isOnline ? <LastUpdatedText timestamp={assignmentsQuery.lastUpdated} /> : null}

      {/* Tab Hôm nay / Sắp tới */}
      <View style={styles.tabRow}>
        <View style={styles.segment}>
          <TouchableOpacity
            style={[styles.segmentItem, activeTab === TAB_TODAY && styles.segmentActive]}
            onPress={() => setActiveTab(TAB_TODAY)}
            accessibilityLabel="Xem lịch học hôm nay"
          >
            <Text
              style={[
                styles.segmentText,
                activeTab === TAB_TODAY && styles.segmentTextActive,
              ]}
            >
              Hôm nay
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.segmentItem,
              activeTab === TAB_UPCOMING && styles.segmentActive,
            ]}
            onPress={() => setActiveTab(TAB_UPCOMING)}
            accessibilityLabel="Xem bài tập sắp đến hạn"
          >
            <Text
              style={[
                styles.segmentText,
                activeTab === TAB_UPCOMING && styles.segmentTextActive,
              ]}
            >
              Sắp tới
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.detailLink}
          onPress={() =>
            navigation.navigate(
              activeTab === TAB_TODAY ? routes.SCHEDULE_TAB : routes.ASSIGNMENT_TAB
            )
          }
          accessibilityLabel="Xem chi tiết"
        >
          <Text style={styles.detailLinkText}>Xem chi tiết</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const listData = activeTab === TAB_TODAY ? todaySessions : dueSoon;

  return (
    <ScreenContainer>
      <FlatList
        data={listData}
        keyExtractor={(item) => `${activeTab}_${item.id}`}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          activeTab === TAB_TODAY ? (
            <EmptyState
              title="Hôm nay không có buổi học"
              description="Bạn được nghỉ, hãy tranh thủ làm bài tập nhé."
            />
          ) : (
            <EmptyState
              title="Không có bài tập nào đến hạn"
              description="Bạn đã hoàn thành hết bài tập trong 7 ngày tới."
            />
          )
        }
        renderItem={({ item }) => (
          <View style={styles.itemWrapper}>
            {activeTab === TAB_TODAY ? (
              <SessionCard
              session={item}
                onPress={() =>
                  navigation.navigate(routes.SCHEDULE_TAB, {
                    screen: routes.SESSION_DETAIL,
                    params: { id: item.id },
                  })
                }
              />
            ) : (
              <AssignmentItem
                assignment={item}
                pending={pendingAssignmentIds.has(String(item.id))}
                onPress={() =>
                  navigation.navigate(routes.ASSIGNMENT_DETAIL, { id: item.id })
                }
                onToggleStatus={() => toggleAssignment(item)}
              />
            )}
          </View>
        )}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  listContent: { paddingBottom: spacing.xxl },
  itemWrapper: { paddingHorizontal: spacing.lg },
  redBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 64,
    backgroundColor: colors.primary,
    borderBottomLeftRadius: spacing.radiusLg,
    borderBottomRightRadius: spacing.radiusLg,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: spacing.radius,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    padding: spacing.lg,
    shadowColor: colors.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  avatarText: { ...typography.h2, color: colors.primary },
  profileInfo: { flex: 1 },
  profileName: { ...typography.h3, color: colors.primary },
  profileCode: { ...typography.caption, color: colors.textMuted, marginTop: spacing.xs },
  gpaBox: { alignItems: 'center' },
  gpaValue: { ...typography.h2, color: colors.primary },
  gpaMax: { ...typography.caption, color: colors.textMuted },
  gpaBadge: {
    backgroundColor: colors.navy,
    borderRadius: spacing.radiusSm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    marginTop: spacing.xs,
  },
  gpaBadgeText: { ...typography.small, color: colors.white },
  promoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: spacing.radius,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    padding: spacing.lg,
    overflow: 'hidden',
  },
  promoInfo: { flex: 1, gap: spacing.sm },
  promoTitle: { ...typography.h2, color: colors.white },
  promoSemesterPill: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primaryDark,
    borderRadius: spacing.radiusLg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  promoSemesterText: { ...typography.caption, color: colors.white },
  promoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    alignSelf: 'flex-start',
    backgroundColor: colors.white,
    borderRadius: spacing.radiusSm,
    paddingHorizontal: spacing.md,
    minHeight: 36,
  },
  promoButtonText: { ...typography.button, color: colors.primary },
  promoIcon: { opacity: 0.9, marginLeft: spacing.md },
  syncCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.warningSoft,
    borderRadius: spacing.radius,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    padding: spacing.md,
    minHeight: spacing.touchTarget,
  },
  syncText: { ...typography.caption, color: colors.warningText, flex: 1 },
  tabRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  segment: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: spacing.radiusLg,
    padding: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  segmentItem: {
    minHeight: 36,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    borderRadius: spacing.radiusLg,
  },
  segmentActive: { backgroundColor: colors.navy },
  segmentText: { ...typography.caption, color: colors.textMuted, fontWeight: '600' },
  segmentTextActive: { color: colors.white },
  detailLink: { minHeight: spacing.touchTarget, justifyContent: 'center' },
  detailLinkText: { ...typography.caption, color: colors.link, fontWeight: '600' },
});
