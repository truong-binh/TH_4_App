// Form thêm bài tập mới: kiểm tra tiêu đề không rỗng, hạn nộp không ở quá khứ.
// Online: POST ngay; Offline: đưa vào hàng đợi. Lưu thành công thì tự quay về.
import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import ScreenContainer from '../../components/common/ScreenContainer';
import FormInput from '../../components/common/FormInput';
import FilterChips from '../../components/common/FilterChips';
import AppButton from '../../components/common/AppButton';
import { useAppData } from '../../context/AppDataContext';
import { validateAssignment } from '../../utils/validators';
import { parseDateTimeInput } from '../../utils/date';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function AssignmentFormScreen({ navigation }) {
  const { courses, addAssignment } = useAppData();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDateText, setDueDateText] = useState('');
  const [courseId, setCourseId] = useState(courses.length > 0 ? courses[0].id : '');
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const courseOptions = useMemo(
    () => courses.map((c) => ({ value: c.id, label: c.code })),
    [courses]
  );

  const onSave = async () => {
    const values = { title, dueDateText, courseId };
    const nextErrors = validateAssignment(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSaving(true);
    const due = parseDateTimeInput(dueDateText);
    const success = await addAssignment({
      courseId,
      title: title.trim(),
      description: description.trim(),
      dueDate: due.toISOString(),
    });
    setSaving(false);
    if (success) navigation.goBack(); // lưu thành công thì tự quay về
  };

  return (
    <ScreenContainer scroll>
      <FormInput
        label="Tiêu đề"
        value={title}
        onChangeText={setTitle}
        error={errors.title}
        placeholder="Ví dụ: Bài tập tuần 10"
      />
      <FormInput
        label="Mô tả"
        value={description}
        onChangeText={setDescription}
        placeholder="Mô tả ngắn về bài tập"
        multiline
      />
      <FormInput
        label="Hạn nộp (dd/MM/yyyy HH:mm)"
        value={dueDateText}
        onChangeText={setDueDateText}
        error={errors.dueDateText}
        placeholder="09/11/2026 23:59"
      />

      <View style={styles.courseSection}>
        <Text style={styles.label}>Môn học</Text>
        <FilterChips
          options={courseOptions}
          selected={courseId}
          onSelect={setCourseId}
        />
        {errors.courseId ? <Text style={styles.error}>{errors.courseId}</Text> : null}
      </View>

      <AppButton title="Lưu bài tập" onPress={onSave} loading={saving} />
      <View style={styles.spacer} />
      <AppButton
        title="Hủy"
        variant="outline"
        onPress={() => navigation.goBack()}
        disabled={saving}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  courseSection: { marginBottom: spacing.xl },
  label: { ...typography.caption, color: colors.textMuted, marginBottom: spacing.xs },
  error: { ...typography.caption, color: colors.danger, marginTop: spacing.xs },
  spacer: { height: spacing.md },
});
