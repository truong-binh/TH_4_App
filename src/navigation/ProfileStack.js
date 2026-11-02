import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import routes from './routes';
import stackOptions from './stackOptions';
import ProfileScreen from '../screens/profile/ProfileScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import GradeListScreen from '../screens/profile/GradeListScreen';
import GradeDetailScreen from '../screens/profile/GradeDetailScreen';

const Stack = createNativeStackNavigator();

export default function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={stackOptions}>
      <Stack.Screen
        name={routes.PROFILE}
        component={ProfileScreen}
        options={{ title: 'Cá nhân' }}
      />
      <Stack.Screen
        name={routes.EDIT_PROFILE}
        component={EditProfileScreen}
        options={{ title: 'Chỉnh sửa thông tin' }}
      />
      <Stack.Screen
        name={routes.GRADE_LIST}
        component={GradeListScreen}
        options={{ title: 'Kết quả học tập' }}
      />
      <Stack.Screen
        name={routes.GRADE_DETAIL}
        component={GradeDetailScreen}
        options={{ title: 'Chi tiết kết quả' }}
      />
    </Stack.Navigator>
  );
}
