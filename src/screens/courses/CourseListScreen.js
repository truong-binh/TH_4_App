// Danh sách môn học: tìm theo tên, lọc theo học kỳ, kéo để làm mới, đủ 4 trạng thái.
import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import ScreenContainer from '../../components/common/ScreenContainer';
import LoadingView from '../../components/common/LoadingView';
import ErrorView from '../../components/common/ErrorView';
import EmptyState from '../../components/common/EmptyState';
import SearchBar from '../../components/common/SearchBar';
import FilterChips from '../../components/common/FilterChips';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import CourseCard from '../../components/course/CourseCard';
import { useAppData } from '../../context/AppDataContext';
import { useSync } from '../../context/SyncContext';
import routes from '../../navigation/routes';
import spacing from '../../theme/spacing';

const ALL = 'all';

export default function CourseListScreen({ navigation }) {
  const { courses, coursesQuery } = useAppData();
  const { isOnline } = useSync();
  const [search, setSearch] = useState('');
  const [semester, setSemester] = useState(ALL);

  const semesterOptions = useMemo(() => {
    const unique = [...new Set(courses.map((c) => c.semester))];
    return [
      { value: ALL, label: 'Tất cả' },
      ...unique.map((s) => ({ value: s, label: s })),
    ];
  }, [courses]);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return courses.filter((course) => {
      const matchSearch =
        !keyword || course.name.toLowerCase().includes(keyword);
      const matchSemester = semester === ALL || course.semester === semester;
      return matchSearch && matchSemester;
    });
  }, [courses, search, semester]);

  if (coursesQuery.loading) {
    return (
      <ScreenContainer>
        <LoadingView message="Đang tải danh sách môn học…" />
      </ScreenContainer>
    );
  }

  if (coursesQuery.error) {
    return (
      <ScreenContainer>
        <ErrorView message={coursesQuery.error.message} onRetry={coursesQuery.refresh} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <View style={styles.toolbar}>
        <SearchBar
          value={search}
          onChangeText={setSearch}
          placeholder="Tìm theo tên môn học…"
        />
        <FilterChips
          options={semesterOptions}
          selected={semester}
          onSelect={setSemester}
        />
        {!isOnline ? <LastUpdatedText timestamp={coursesQuery.lastUpdated} /> : null}
      </View>
      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <CourseCard
            course={item}
            onPress={() => navigation.navigate(routes.COURSE_DETAIL, { id: item.id })}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            title="Không tìm thấy môn học"
            description="Thử từ khóa khác hoặc chọn học kỳ khác."
          />
        }
        refreshing={coursesQuery.refreshing}
        onRefresh={coursesQuery.refresh}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  toolbar: { padding: spacing.lg, paddingBottom: spacing.sm, gap: spacing.sm },
  listContent: { padding: spacing.lg, paddingTop: spacing.sm, flexGrow: 1 },
});
