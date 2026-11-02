// Tiện ích xử lý và định dạng ngày giờ (dd/MM/yyyy, HH:mm)

const pad = (n) => String(n).padStart(2, '0');

// '2026-11-09T23:59:00Z' -> '09/11/2026'
export function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}

// '2026-11-09T23:59:00Z' -> '23:59'
export function formatTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// '2026-11-09T23:59:00Z' -> '23:59, 09/11/2026'
export function formatDateTime(iso) {
  if (!iso) return '';
  const date = formatDate(iso);
  if (!date) return '';
  return `${formatTime(iso)}, ${date}`;
}

// Hạn nộp đã qua hay chưa
export function isOverdue(iso) {
  if (!iso) return false;
  return new Date(iso).getTime() < Date.now();
}

// Số ngày còn lại tới hạn (âm nếu đã quá hạn)
export function daysLeft(iso) {
  if (!iso) return 0;
  return Math.ceil((new Date(iso).getTime() - Date.now()) / (24 * 60 * 60 * 1000));
}

// 'dd/MM/yyyy HH:mm' -> Date | null (dùng cho form nhập hạn nộp)
export function parseDateTimeInput(text) {
  if (!text) return null;
  const match = /^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2})$/.exec(text.trim());
  if (!match) return null;
  const [, dd, MM, yyyy, HH, mm] = match.map(Number);
  const d = new Date(yyyy, MM - 1, dd, HH, mm, 0, 0);
  if (
    d.getDate() !== dd ||
    d.getMonth() !== MM - 1 ||
    d.getFullYear() !== yyyy ||
    d.getHours() !== HH ||
    d.getMinutes() !== mm
  ) {
    return null;
  }
  return d;
}

// Thứ trong tuần theo quy ước đề bài: 2 (Thứ 2) ... 8 (Chủ nhật)
export function todayDayOfWeek() {
  const jsDay = new Date().getDay(); // 0 = CN, 1 = T2 ...
  return jsDay === 0 ? 8 : jsDay + 1;
}

export const DAY_LABELS = {
  2: 'Thứ 2',
  3: 'Thứ 3',
  4: 'Thứ 4',
  5: 'Thứ 5',
  6: 'Thứ 6',
  7: 'Thứ 7',
  8: 'Chủ nhật',
};
