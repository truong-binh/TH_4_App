// Bottom Tab 5 tab, mỗi tab là một Native Stack riêng.
// Tab Bài tập có tabBarBadge = số bài chưa hoàn thành.
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import routes from './routes';
import HomeStack from './HomeStack';
import CourseStack from './CourseStack';
import ScheduleStack from './ScheduleStack';
import AssignmentStack from './AssignmentStack';
import ProfileStack from './ProfileStack';
import { useAppData } from '../context/AppDataContext';
import colors from '../theme/colors';

const Tab = createBottomTabNavigator();

const TAB_ICONS = {
  [routes.HOME_TAB]: { active: 'home', inactive: 'home-outline' },
  [routes.COURSE_TAB]: { active: 'book', inactive: 'book-outline' },
  [routes.SCHEDULE_TAB]: { active: 'calendar', inactive: 'calendar-outline' },
  [routes.ASSIGNMENT_TAB]: { active: 'checkbox', inactive: 'checkbox-outline' },
  [routes.PROFILE_TAB]: { active: 'person', inactive: 'person-outline' },
};

export default function AppNavigator() {
  const { assignments } = useAppData();
  const todoCount = assignments.filter((a) => a.status === 'todo').length;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarActiveBackgroundColor: colors.primarySoft,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          height: 64,
          paddingBottom: 4,
          paddingTop: 2,
        },
        tabBarItemStyle: {
          borderRadius: 18,
          marginHorizontal: 3,
          marginVertical: 4,
          overflow: 'hidden',
        },
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600' },
        tabBarAllowFontScaling: false,
        tabBarIcon: ({ focused, color, size }) => (
          <Ionicons
            name={focused ? TAB_ICONS[route.name].active : TAB_ICONS[route.name].inactive}
            size={size}
            color={color}
          />
        ),
      })}
    >
      <Tab.Screen
        name={routes.HOME_TAB}
        component={HomeStack}
        options={{ title: 'Trang chủ' }}
      />
      <Tab.Screen
        name={routes.COURSE_TAB}
        component={CourseStack}
        options={{ title: 'Môn học' }}
      />
      <Tab.Screen
        name={routes.SCHEDULE_TAB}
        component={ScheduleStack}
        options={{ title: 'Lịch học' }}
      />
      <Tab.Screen
        name={routes.ASSIGNMENT_TAB}
        component={AssignmentStack}
        options={{
          title: 'Bài tập',
          tabBarBadge: todoCount > 0 ? todoCount : undefined,
        }}
      />
      <Tab.Screen
        name={routes.PROFILE_TAB}
        component={ProfileStack}
        options={{ title: 'Cá nhân' }}
      />
    </Tab.Navigator>
  );
}
