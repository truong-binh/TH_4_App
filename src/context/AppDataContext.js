// Chia sẻ dữ liệu student, courses, assignments, grades giữa các tab.
// Mọi thao tác ghi (đổi trạng thái bài tập, thêm bài tập, sửa hồ sơ)
// đều đi qua đây: optimistic update + gọi API khi online / đưa vào outbox khi offline.
import React, { createContext, useContext, useEffect, useMemo, useCallback } from 'react';
import { Alert } from 'react-native';

import studentService from '../api/studentService';
import courseService from '../api/courseService';
import assignmentService from '../api/assignmentService';
import gradeService from '../api/gradeService';
import { CACHE_KEYS } from '../storage/keys';
import useCachedQuery from '../hooks/useCachedQuery';
import { useSync } from './SyncContext';
import { STUDENT_ID } from '../config';

const AppDataContext = createContext(null);

export function AppDataProvider({ children }) {
  const { isOnline, enqueueAction, lastSyncAt, items } = useSync();

  const studentQuery = useCachedQuery(CACHE_KEYS.STUDENT, () =>
    studentService.getById(STUDENT_ID)
  );
  const coursesQuery = useCachedQuery(CACHE_KEYS.COURSES, courseService.getAll);
  const assignmentsQuery = useCachedQuery(CACHE_KEYS.ASSIGNMENTS, assignmentService.getAll);
  const gradesQuery = useCachedQuery(CACHE_KEYS.GRADES, gradeService.getAll);

  const student = studentQuery.data;
  const courses = useMemo(() => coursesQuery.data || [], [coursesQuery.data]);
  const grades = useMemo(() => gradesQuery.data || [], [gradesQuery.data]);

  // Gắn thông tin môn học cho bài tập (phòng khi bản ghi chưa có _expand)
  const assignments = useMemo(
    () =>
      (assignmentsQuery.data || []).map((assignment) => ({
        ...assignment,
        course:
          assignment.course ||
          courses.find((c) => String(c.id) === String(assignment.courseId)) ||
          null,
      })),
    [assignmentsQuery.data, courses]
  );

  // Các mục đang nằm trong hàng đợi -> hiển thị nhãn "Chưa đồng bộ"
  const pendingAssignmentIds = useMemo(() => {
    const ids = new Set();
    items.forEach((action) => {
      const match = /^\/assignments\/(.+)$/.exec(action.url || '');
      if (match) ids.add(String(match[1]));
      if (action.tempId) ids.add(String(action.tempId));
    });
    return ids;
  }, [items]);

  const profilePending = useMemo(
    () => items.some((action) => (action.url || '').startsWith('/students/')),
    [items]
  );

  // Sau mỗi lần đồng bộ thành công thì tải lại dữ liệu từ server
  useEffect(() => {
    if (!lastSyncAt) return;
    studentQuery.refresh();
    assignmentsQuery.refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastSyncAt]);

  // A6. Optimistic update khi đổi trạng thái bài tập
  const toggleAssignment = useCallback(
    async (assignment) => {
      if (String(assignment.id).startsWith('tmp_')) {
        Alert.alert(
          'Chưa đồng bộ',
          'Bài tập này chưa được đưa lên máy chủ. Vui lòng đồng bộ trước khi đổi trạng thái.'
        );
        return;
      }

      const nextStatus = assignment.status === 'done' ? 'todo' : 'done';
      const updatedAt = new Date().toISOString();
      const apply = (status) =>
        assignmentsQuery.mutate((list) =>
          (list || []).map((item) =>
            String(item.id) === String(assignment.id)
              ? { ...item, status, updatedAt }
              : item
          )
        );

      apply(nextStatus); // giao diện đổi ngay khi bấm

      if (!isOnline) {
        await enqueueAction({
          method: 'PATCH',
          url: `/assignments/${assignment.id}`,
          body: { status: nextStatus, updatedAt },
        });
        return;
      }

      try {
        await assignmentService.update(assignment.id, { status: nextStatus, updatedAt });
      } catch (err) {
        apply(assignment.status); // hoàn tác khi API báo lỗi
        Alert.alert('Lỗi', err?.message || 'Không thể cập nhật trạng thái bài tập.');
      }
    },
    [assignmentsQuery, isOnline, enqueueAction]
  );

  // A5 + B3. Thêm bài tập mới (POST khi online, vào hàng đợi khi offline)
  const addAssignment = useCallback(
    async (formData) => {
      const updatedAt = new Date().toISOString();
      const payload = { ...formData, status: 'todo', updatedAt };

      if (isOnline) {
        try {
          const created = await assignmentService.create(payload);
          assignmentsQuery.mutate((list) => [...(list || []), created]);
          return true;
        } catch (err) {
          Alert.alert('Lỗi', err?.message || 'Không thể thêm bài tập.');
          return false;
        }
      }

      const tempId = `tmp_${Date.now()}`;
      assignmentsQuery.mutate((list) => [...(list || []), { id: tempId, ...payload }]);
      await enqueueAction({
        method: 'POST',
        url: '/assignments',
        body: payload,
        tempId,
      });
      return true;
    },
    [assignmentsQuery, isOnline, enqueueAction]
  );

  // Sửa thông tin cá nhân (PATCH khi online, vào hàng đợi khi offline)
  const updateProfile = useCallback(
    async (formData) => {
      const previous = studentQuery.data;
      const updatedAt = new Date().toISOString();
      studentQuery.mutate((prev) => ({ ...(prev || {}), ...formData, updatedAt }));

      if (!isOnline) {
        await enqueueAction({
          method: 'PATCH',
          url: `/students/${STUDENT_ID}`,
          body: { ...formData, updatedAt },
        });
        return true;
      }

      try {
        await studentService.update(STUDENT_ID, { ...formData, updatedAt });
        return true;
      } catch (err) {
        studentQuery.mutate(previous); // hoàn tác
        Alert.alert('Lỗi', err?.message || 'Không thể cập nhật thông tin cá nhân.');
        return false;
      }
    },
    [studentQuery, isOnline, enqueueAction]
  );

  const value = useMemo(
    () => ({
      student,
      courses,
      assignments,
      grades,
      studentQuery,
      coursesQuery,
      assignmentsQuery,
      gradesQuery,
      pendingAssignmentIds,
      profilePending,
      toggleAssignment,
      addAssignment,
      updateProfile,
    }),
    [
      student,
      courses,
      assignments,
      grades,
      studentQuery,
      coursesQuery,
      assignmentsQuery,
      gradesQuery,
      pendingAssignmentIds,
      profilePending,
      toggleAssignment,
      addAssignment,
      updateProfile,
    ]
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData phải được dùng bên trong AppDataProvider');
  }
  return context;
}

export default AppDataContext;
