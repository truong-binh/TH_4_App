// Chi tiết kết quả học tập: điểm chuyên cần, giữa kỳ, cuối kỳ, tổng kết, điểm chữ.
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import ScreenContainer from '../../components/common/ScreenContainer';
import LoadingView from '../../components/common/LoadingView';
import ErrorView from '../../components/common/ErrorView';
import InfoRow from '../../components/profile/InfoRow';
import AppButton from '../../components/common/AppButton';
import useCachedQuery from '../../hooks/useCachedQuery';
import gradeService from '../../api/gradeService';
import { CACHE_KEYS } from '../../storage/keys';
import { useAppData } from '../../context/AppDataContext';
import { toScale4 } from '../../utils/gpa';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';

export default function GradeDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const { grades } = useAppData();

  const gradeQuery = useCachedQuery(CACHE_KEYS.grade(id), () => gradeService.getById(id));
  const grade =
    gradeQuery.data || grades.find((g) => String(g.id) === String(id)) || null;

  useEffect(() => {
    if (grade && grade.course) navigation.setOptions({ title: grade.course.name });
  }, [navigation, grade]);

  if (!grade && gradeQuery.loading) {
    return (
      <ScreenContainer>
        <LoadingView />
      </ScreenContainer>
    );
  }

  if (!grade) {
    return (
      <ScreenContainer>
        <ErrorView
          message={gradeQuery.error?.message || 'Không tải được kết quả học tập.'}
          onRetry={gradeQuery.refresh}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scroll>
      <View style={styles.card}>
        <InfoRow label="Môn học" value={grade.course ? grade.course.name : ''} />
        <InfoRow
          label="Số tín chỉ"
          value={grade.course ? grade.course.credits : ''}
        />
        <InfoRow label="Học kỳ" value={grade.semester} />
        <InfoRow label="Chuyên cần (10%)" value={grade.attendance} />
        <InfoRow label="Giữa kỳ (30%)" value={grade.midterm} />
        <InfoRow label="Cuối kỳ (60%)" value={grade.final} />
        <InfoRow label="Tổng kết (hệ 10)" value={grade.total} />
        <InfoRow label="Điểm chữ" value={grade.letter} />
        <InfoRow label="Điểm hệ 4" value={toScale4(grade.total).toFixed(1)} />
      </View>
      <AppButton title="Quay lại" variant="outline" onPress={() => navigation.goBack()} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
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
});
