// Chỉnh sửa thông tin cá nhân: PATCH /students/1 khi online,
// đưa vào hàng đợi khi offline. Lưu thành công thì tự quay về.
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import ScreenContainer from '../../components/common/ScreenContainer';
import FormInput from '../../components/common/FormInput';
import AppButton from '../../components/common/AppButton';
import { useAppData } from '../../context/AppDataContext';
import { validateProfile } from '../../utils/validators';
import spacing from '../../theme/spacing';

export default function EditProfileScreen({ navigation }) {
  const { student, updateProfile } = useAppData();
  const [fullName, setFullName] = useState(student?.fullName || '');
  const [className, setClassName] = useState(student?.className || '');
  const [major, setMajor] = useState(student?.major || '');
  const [email, setEmail] = useState(student?.email || '');
  const [phone, setPhone] = useState(student?.phone || '');
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const onSave = async () => {
    const values = { fullName, className, major, email, phone };
    const nextErrors = validateProfile(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSaving(true);
    const success = await updateProfile({
      fullName: fullName.trim(),
      className: className.trim(),
      major: major.trim(),
      email: email.trim(),
      phone: phone.trim(),
    });
    setSaving(false);
    if (success) navigation.goBack();
  };

  return (
    <ScreenContainer scroll>
      <FormInput
        label="Họ tên"
        value={fullName}
        onChangeText={setFullName}
        error={errors.fullName}
      />
      <FormInput
        label="Lớp"
        value={className}
        onChangeText={setClassName}
        error={errors.className}
      />
      <FormInput label="Ngành" value={major} onChangeText={setMajor} error={errors.major} />
      <FormInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        error={errors.email}
        keyboardType="email-address"
      />
      <FormInput
        label="Số điện thoại"
        value={phone}
        onChangeText={setPhone}
        error={errors.phone}
        keyboardType="phone-pad"
      />

      <AppButton title="Lưu thay đổi" onPress={onSave} loading={saving} />
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
  spacer: { height: spacing.md },
});
