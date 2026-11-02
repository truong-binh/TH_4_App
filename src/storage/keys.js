// Tên các khóa AsyncStorage dùng trong ứng dụng

export const CACHE_KEYS = {
  STUDENT: 'cache:student',
  COURSES: 'cache:courses',
  SESSIONS: 'cache:sessions',
  ASSIGNMENTS: 'cache:assignments',
  GRADES: 'cache:grades',
  course: (id) => `cache:courses:${id}`,
  session: (id) => `cache:sessions:${id}`,
  assignment: (id) => `cache:assignments:${id}`,
  grade: (id) => `cache:grades:${id}`,
};

export const OUTBOX_KEY = 'outbox:actions';
