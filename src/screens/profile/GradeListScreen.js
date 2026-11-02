// Kết quả học tập: GPA hệ 4 có trọng số, lọc theo học kỳ, bấm vào môn để xem chi tiết.
import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import ScreenContainer from '../../components/common/ScreenContainer';
import LoadingView from '../../components/common/LoadingView';
import ErrorView from '../../components/common/ErrorView';
import EmptyState from '../../components/common/EmptyState';
import FilterChips from '../../components/common/FilterChips';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import GpaSummary from '../../components/grade/GpaSummary';
import GradeRow from '../../components/grade/GradeRow';
import { useAppData } from '../../context/AppDataContext';
import { useSync } from '../../context/SyncContext';
import routes from '../../navigation/routes';
import { calcGpa } from '../../utils/gpa';
import spacing from '../../theme/spacing';

const ALL = 'all';

export default function GradeListScreen({ navigation }) {
  const { grades, courses, gradesQuery } = useAppData();
  const { isOnline } = useSync();
  const [semester, setSemester] = useState(ALL);

  const semesterOptions = useMemo(() => {
    const unique = [...new Set(grades.map((g) => g.semester))];
    return [
      { value: ALL, label: 'Tất cả' },
      ...unique.map((s) => ({ value: s, label: s })),
    ];
  }, [grades]);

  const filtered = useMemo(
    () => (semester === ALL ? grades : grades.filter((g) => g.semester === semester)),
    [grades, semester]
  );

  const { gpa, totalCredits } = useMemo(
    () => calcGpa(filtered, courses),
    [filtered, courses]
  );

  if (gradesQuery.loading) {
    return (
      <ScreenContainer>
        <LoadingView message="Đang tải kết quả học tập…" />
      </ScreenContainer>
    );
  }

  if (gradesQuery.error) {
    return (
      <ScreenContainer>
        <ErrorView message={gradesQuery.error.message} onRetry={gradesQuery.refresh} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <View style={styles.toolbar}>
        <GpaSummary gpa={gpa} totalCredits={totalCredits} />
        <FilterChips
          options={semesterOptions}
          selected={semester}
          onSelect={setSemester}
        />
        {!isOnline ? <LastUpdatedText timestamp={gradesQuery.lastUpdated} /> : null}
      </View>
      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <GradeRow
            grade={item}
            onPress={() => navigation.navigate(routes.GRADE_DETAIL, { id: item.id })}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            title="Chưa có điểm"
            description="Không có kết quả học tập nào trong học kỳ này."
          />
        }
        refreshing={gradesQuery.refreshing}
        onRefresh={gradesQuery.refresh}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  toolbar: { padding: spacing.lg, paddingBottom: spacing.sm },
  listContent: { padding: spacing.lg, paddingTop: spacing.sm, flexGrow: 1 },
});
