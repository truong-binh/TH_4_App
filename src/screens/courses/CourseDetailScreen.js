// Chi tiết môn học: chỉ nhận { id } qua route.params rồi tự gọi API;
// kèm lịch học và bài tập của môn (lấy từ cache/context khi offline).
import React, { useEffect, useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import ScreenContainer from '../../components/common/ScreenContainer';
import LoadingView from '../../components/common/LoadingView';
import ErrorView from '../../components/common/ErrorView';
import InfoRow from '../../components/profile/InfoRow';
import SessionCard from '../../components/schedule/SessionCard';
import AssignmentItem from '../../components/assignment/AssignmentItem';
import useCachedQuery from '../../hooks/useCachedQuery';
import courseService from '../../api/courseService';
import sessionService from '../../api/sessionService';
import { CACHE_KEYS } from '../../storage/keys';
import { useAppData } from '../../context/AppDataContext';
import routes from '../../navigation/routes';
import { DAY_LABELS } from '../../utils/date';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function CourseDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const { courses, assignments, pendingAssignmentIds, toggleAssignment } = useAppData();

  const courseQuery = useCachedQuery(CACHE_KEYS.course(id), () =>
    courseService.getById(id)
  );
  const sessionsQuery = useCachedQuery(CACHE_KEYS.SESSIONS, sessionService.getAll);

  // Offline chưa có cache chi tiết thì dùng bản ghi trong danh sách đã cache
  const course =
    courseQuery.data || courses.find((c) => String(c.id) === String(id)) || null;

  const courseSessions = useMemo(
    () =>
      (sessionsQuery.data || []).filter(
        (s) => String(s.courseId) === String(id)
      ),
    [sessionsQuery.data, id]
  );

  const courseAssignments = useMemo(
    () => assignments.filter((a) => String(a.courseId) === String(id)),
    [assignments, id]
  );

  // Tiêu đề header là tên môn được chọn
  useEffect(() => {
    if (course) navigation.setOptions({ title: course.name });
  }, [navigation, course]);

  if (!course && courseQuery.loading) {
    return (
      <ScreenContainer>
        <LoadingView />
      </ScreenContainer>
    );
  }

  if (!course) {
    return (
      <ScreenContainer>
        <ErrorView
          message={courseQuery.error?.message || 'Không tải được thông tin môn học.'}
          onRetry={courseQuery.refresh}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scroll>
      <View style={styles.card}>
        <InfoRow label="Mã môn" value={course.code} />
        <InfoRow label="Số tín chỉ" value={course.credits} />
        <InfoRow label="Giảng viên" value={course.lecturer} />
        <InfoRow label="Học kỳ" value={course.semester} />
      </View>
      <Text style={styles.description}>{course.description}</Text>

      <Text style={styles.sectionTitle}>Lịch học</Text>
      {courseSessions.length === 0 ? (
        <Text style={styles.emptyText}>Chưa có lịch học cho môn này.</Text>
      ) : (
        courseSessions.map((session) => (
          <View key={session.id}>
            <Text style={styles.dayLabel}>{DAY_LABELS[session.dayOfWeek]}</Text>
            <SessionCard
              session={{ ...session, course }}
              onPress={() =>
                navigation.navigate(routes.SESSION_DETAIL, { id: session.id })
              }
            />
          </View>
        ))
      )}

      <Text style={styles.sectionTitle}>Bài tập của môn</Text>
      {courseAssignments.length === 0 ? (
        <Text style={styles.emptyText}>Chưa có bài tập cho môn này.</Text>
      ) : (
        courseAssignments.map((assignment) => (
          <AssignmentItem
            key={assignment.id}
            assignment={assignment}
            pending={pendingAssignmentIds.has(String(assignment.id))}
            onPress={() =>
              navigation.navigate(routes.ASSIGNMENT_DETAIL, { id: assignment.id })
            }
            onToggleStatus={() => toggleAssignment(assignment)}
          />
        ))
      )}

      <TouchableOpacity
        style={styles.backRow}
        onPress={() => navigation.goBack()}
        accessibilityLabel="Quay lại màn hình trước"
      >
        <Ionicons name="arrow-back" size={16} color={colors.primary} />
        <Text style={styles.backText}>Quay lại</Text>
      </TouchableOpacity>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: spacing.radius,
    overflow: 'hidden',
    marginBottom: spacing.md,
    shadowColor: colors.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  description: { ...typography.body, color: colors.textMuted, marginBottom: spacing.md },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  dayLabel: { ...typography.caption, color: colors.textMuted, marginBottom: spacing.xs },
  emptyText: { ...typography.caption, color: colors.textMuted },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    marginTop: spacing.xl,
    minHeight: spacing.touchTarget,
  },
  backText: { ...typography.button, color: colors.primary },
});
