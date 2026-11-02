// Quy đổi điểm và tính GPA hệ 4 (có trọng số theo số tín chỉ)

// Bảng quy đổi điểm hệ 10 -> hệ 4 theo đề bài
export function toScale4(score10) {
  const s = Number(score10);
  if (Number.isNaN(s)) return 0;
  if (s >= 8.5) return 4.0;
  if (s >= 8.0) return 3.5;
  if (s >= 7.0) return 3.0;
  if (s >= 6.5) return 2.5;
  if (s >= 5.5) return 2.0;
  if (s >= 5.0) return 1.5;
  if (s >= 4.0) return 1.0;
  return 0;
}

// Điểm hệ 10 -> điểm chữ
export function toLetter(score10) {
  const s = Number(score10);
  if (Number.isNaN(s)) return 'F';
  if (s >= 8.5) return 'A';
  if (s >= 8.0) return 'B+';
  if (s >= 7.0) return 'B';
  if (s >= 6.5) return 'C+';
  if (s >= 5.5) return 'C';
  if (s >= 5.0) return 'D+';
  if (s >= 4.0) return 'D';
  return 'F';
}

/**
 * GPA = tổng (điểm hệ 4 × số tín chỉ) / tổng số tín chỉ.
 * Môn điểm F (hệ 4 = 0) không được tính vào số tín chỉ tích lũy.
 * @param {Array} grades - danh sách điểm, mỗi phần tử có courseId, total (và có thể có course)
 * @param {Array} courses - danh sách môn học để tra số tín chỉ
 * @returns {{ gpa: number, totalCredits: number }}
 */
export function calcGpa(grades, courses) {
  const list = Array.isArray(grades) ? grades : [];
  const courseList = Array.isArray(courses) ? courses : [];
  let weighted = 0;
  let credits = 0;
  let earnedCredits = 0;

  list.forEach((grade) => {
    const course =
      grade.course || courseList.find((c) => String(c.id) === String(grade.courseId));
    const credit = course ? Number(course.credits) || 0 : 0;
    if (credit <= 0) return;
    const point = toScale4(grade.total);
    weighted += point * credit;
    credits += credit;
    if (point > 0) earnedCredits += credit;
  });

  return {
    gpa: credits > 0 ? weighted / credits : 0,
    totalCredits: earnedCredits,
  };
}
