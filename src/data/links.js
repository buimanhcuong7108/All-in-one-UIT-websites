// Danh sách liên kết hiển thị trên trang chủ.
// Muốn thêm / sửa / xoá link: chỉ cần chỉnh file này, không cần đụng vào code giao diện.
//
// Mỗi mục gồm:
//   id          – mã duy nhất (dùng để lưu mục đã ghim)
//   title       – tên hiển thị
//   description – mô tả ngắn
//   url         – địa chỉ trang
//   category    – nhóm (phải khớp với một id trong CATEGORIES)
//   word        – chữ lớn in trên thẻ, nên ngắn (tối đa khoảng 10 ký tự)
//   color       – màu thẻ dạng #RRGGBB (chữ trắng/đen tự chọn theo độ sáng)
//   size        – (tuỳ chọn) 'lg' = thẻ lớn, 'md' = thẻ thường (mặc định)
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
    word: 'portal',
    color: '#2347D9',
    size: 'lg',
    keywords: ['cổng thông tin', 'portal', 'đăng nhập'],
  },
  {
    id: 'student',
    title: 'Trang sinh viên',
    description: 'Trang dành cho sinh viên UIT.',
    url: 'https://portal.uit.edu.vn/trang-chu',
    category: 'main',
    word: 'student',
    color: '#08876A',
    keywords: ['sinh viên', 'student'],
  },
  {
    id: 'khtc',
    title: 'Phòng Kế hoạch - Tài chính',
    description: 'Trang của phòng KHTC.',
    url: 'https://khtc.uit.edu.vn/',
    category: 'office',
    word: 'khtc',
    color: '#F5B700',
    keywords: ['khtc', 'học phí', 'tài chính', 'kế hoạch'],
  },
  {
    id: 'ctsv',
    title: 'Công tác sinh viên',
    description: 'Trang của phòng CTSV.',
    url: 'https://ctsv.uit.edu.vn/',
    category: 'office',
    word: 'ctsv',
    color: '#D9432A',
    keywords: ['ctsv', 'công tác sinh viên', 'rèn luyện'],
  },
  {
    id: 'fanpage',
    title: 'Fanpage UIT',
    description: 'Fanpage Facebook chính thức của trường.',
    url: 'https://www.facebook.com/UIT.Fanpage',
    category: 'community',
    word: 'fanpage',
    color: '#7A4FE0',
    keywords: ['facebook', 'fb', 'fanpage', 'tin tức'],
  },
  {
    id: 'community',
    title: 'Cộng đồng sinh viên',
    description: 'Nhóm Facebook của sinh viên UIT.',
    url: 'https://www.facebook.com/share/g/1K6MtN9NEf/',
    category: 'community',
    word: 'cộng đồng',
    color: '#CC2F78',
    keywords: ['facebook', 'fb', 'group', 'nhóm', 'cộng đồng'],
  },
];
