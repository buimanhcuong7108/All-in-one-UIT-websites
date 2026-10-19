// Danh sách liên kết hiển thị trên trang chủ.
// Muốn thêm / sửa / xoá link: chỉ cần chỉnh file này, không cần đụng vào code giao diện.
//
// Mỗi mục gồm:
//   id          – mã duy nhất (dùng để lưu mục yêu thích)
//   title       – tên hiển thị
//   description – mô tả ngắn
//   url         – địa chỉ trang
//   category    – nhóm hiển thị (phải khớp với một id trong CATEGORIES)
//   icon        – emoji làm biểu tượng
//   keywords    – (tuỳ chọn) từ khoá phụ để tìm kiếm

export const CATEGORIES = [
  { id: 'main', label: 'Cổng chính' },
  { id: 'office', label: 'Phòng ban' },
  { id: 'community', label: 'Cộng đồng' },
];

export const LINKS = [
  {
    id: 'portal',
    title: 'Portal UIT',
    description: 'Cổng thông tin chính của trường.',
    url: 'https://portal.uit.edu.vn/',
    category: 'main',
    icon: '🏫',
    keywords: ['cổng thông tin', 'portal', 'đăng nhập'],
  },
  {
    id: 'student',
    title: 'Trang sinh viên',
    description: 'Trang dành cho sinh viên UIT.',
    url: 'https://student.uit.edu.vn/',
    category: 'main',
    icon: '🎓',
    keywords: ['sinh viên', 'student'],
  },
  {
    id: 'khtc',
    title: 'Phòng Kế hoạch - Tài chính',
    description: 'Trang của Phòng Kế hoạch - Tài chính (KHTC).',
    url: 'https://khtc.uit.edu.vn/',
    category: 'office',
    icon: '💰',
    keywords: ['khtc', 'học phí', 'tài chính', 'kế hoạch'],
  },
  {
    id: 'ctsv',
    title: 'Công tác sinh viên',
    description: 'Trang của Phòng Công tác sinh viên (CTSV).',
    url: 'https://ctsv.uit.edu.vn/',
    category: 'office',
    icon: '📋',
    keywords: ['ctsv', 'công tác sinh viên', 'rèn luyện'],
  },
  {
    id: 'fanpage',
    title: 'Fanpage UIT',
    description: 'Fanpage Facebook chính thức của trường.',
    url: 'https://www.facebook.com/UIT.Fanpage',
    category: 'community',
    icon: '📣',
    keywords: ['facebook', 'fb', 'fanpage', 'tin tức'],
  },
  {
    id: 'community',
    title: 'Cộng đồng sinh viên',
    description: 'Nhóm Facebook cộng đồng sinh viên UIT.',
    url: 'https://www.facebook.com/share/g/1K6MtN9NEf/',
    category: 'community',
    icon: '👥',
    keywords: ['facebook', 'fb', 'group', 'nhóm', 'cộng đồng'],
  },
];
