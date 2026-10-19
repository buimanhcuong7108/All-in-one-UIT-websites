# UIT Hub 🎓

Trang chủ cá nhân tổng hợp các website của **Trường Đại học Công nghệ Thông tin – ĐHQG-HCM (UIT)**, chạy trực tiếp trên máy của bạn bằng **React + Vite**.

Tác giả: **Bùi Mạnh Cường**.\
MSSV: **26520212**.\
Lớp sinh hoạt: **KHMT2026.1**.\
Liên hệ: **bomdeptrai0701@gmail.com**.

> Đây là dự án cá nhân, **không phải** trang chính thức của trường.

## Tính năng

- Gom toàn bộ link của trường vào một trang, chia nhóm rõ ràng (Cổng chính / Phòng ban / Cộng đồng)
- Tìm kiếm nhanh, **không cần gõ dấu** (gõ `hoc phi` vẫn ra "học phí")
- Đánh dấu ⭐ yêu thích, được lưu lại trong trình duyệt
- Giao diện sáng / tối, tự theo hệ thống ở lần đầu
- Phím tắt, nút "Mở tất cả", giao diện dùng tốt trên điện thoại
- Thêm / sửa / xoá link chỉ bằng cách sửa **một file dữ liệu**

## Các trang đang có

| Trang | Địa chỉ |
| --- | --- |
| Portal UIT | <https://portal.uit.edu.vn/> |
| Trang sinh viên | <https://student.uit.edu.vn/> |
| Phòng Kế hoạch - Tài chính | <https://khtc.uit.edu.vn/> |
| Công tác sinh viên | <https://ctsv.uit.edu.vn/> |
| Fanpage UIT | <https://www.facebook.com/UIT.Fanpage> |
| Cộng đồng sinh viên | <https://www.facebook.com/share/g/1K6MtN9NEf/> |

## Yêu cầu

- [Node.js](https://nodejs.org/) phiên bản **18 trở lên** (khuyến nghị bản LTS)
- Kiểm tra bằng lệnh: `node -v` và `npm -v`

## Chạy trên máy

Mở terminal (CMD / PowerShell / Terminal) tại thư mục dự án rồi chạy:

```bash
# 1. Cài thư viện (chỉ cần làm một lần)
npm install

# 2. Chạy chế độ phát triển
npm run dev
```

Trình duyệt sẽ tự mở trang <http://localhost:5173>. Nếu không tự mở, hãy truy cập địa chỉ đó thủ công. Dừng server bằng `Ctrl + C`.

### Chạy bản build (nhẹ và nhanh hơn)

```bash
npm run build     # tạo thư mục dist/
npm run preview   # chạy thử bản build tại http://localhost:4173
```

## Phím tắt

| Phím | Tác dụng |
| --- | --- |
| `/` | Chuyển con trỏ vào ô tìm kiếm |
| `1` – `6` | Mở nhanh link theo số thứ tự (hiển thị trên từng thẻ) |
| `Enter` (trong ô tìm kiếm) | Mở kết quả đầu tiên |
| `Esc` | Xoá nội dung tìm kiếm |

## Thêm / sửa / xoá link

Mở file `src/data/links.js` và chỉnh mảng `LINKS`. Ví dụ thêm một trang mới:

```js
{
  id: 'courses',                       // mã duy nhất, không trùng với mục khác
  title: 'Tên hiển thị',
  description: 'Mô tả ngắn.',
  url: 'https://example.uit.edu.vn/',
  category: 'office',                  // main | office | community
  icon: '📚',                          // một emoji bất kỳ
  keywords: ['từ khoá', 'tìm kiếm'],   // tuỳ chọn
}
```

Muốn thêm nhóm mới, thêm một mục vào mảng `CATEGORIES` trong cùng file, rồi dùng `id` của nhóm đó ở trường `category`.

Lưu file, trang sẽ tự cập nhật ngay (khi đang chạy `npm run dev`).

## Đổi màu giao diện

Mở `src/styles.css`, chỉnh các biến màu ở đầu file (`--primary`, `--bg`, …). Khối `:root` là giao diện sáng, khối `:root[data-theme='dark']` là giao diện tối.

## Đặt làm trang chủ trình duyệt

1. Chạy `npm run dev` (hoặc `npm run preview`).
2. Vào cài đặt trình duyệt → mục **Khi khởi động / Trang chủ** → nhập `http://localhost:5173`.

Lưu ý: trang chỉ hiển thị khi server đang chạy. Nếu muốn mở được mà không cần terminal, bạn có thể dùng `npm run build` rồi phục vụ thư mục `dist/` bằng bất kỳ static server nào (ví dụ `npx serve dist`).

## Cấu trúc thư mục

```
uit-hub/
├── index.html            # Trang HTML gốc
├── package.json          # Thông tin dự án và các lệnh npm
├── vite.config.js        # Cấu hình Vite
├── public/
│   └── favicon.svg       # Biểu tượng tab
└── src/
    ├── main.jsx          # Điểm khởi động React
    ├── App.jsx           # Giao diện và logic chính
    ├── styles.css        # Toàn bộ CSS
    └── data/
        └── links.js      # ✏️ Danh sách link (file bạn sẽ sửa nhiều nhất)
```

## Xử lý sự cố

| Vấn đề | Cách xử lý |
| --- | --- |
| `npm: command not found` | Chưa cài Node.js. Tải tại <https://nodejs.org> rồi mở lại terminal. |
| Cổng 5173 đã bị dùng | Vite sẽ tự chọn cổng khác và in ra trong terminal. Hãy mở đúng địa chỉ đó. |
| Nút "Mở tất cả" chỉ mở được một tab | Trình duyệt chặn pop-up. Bấm vào biểu tượng chặn trên thanh địa chỉ và chọn cho phép `localhost`. |
| Link Facebook yêu cầu đăng nhập | Bình thường, Facebook cần bạn đăng nhập (nhóm cộng đồng có thể cần được duyệt tham gia). |
| Lỗi lạ sau khi cập nhật | Xoá thư mục `node_modules` rồi chạy lại `npm install`. |

## Ý tưởng mở rộng

- Thêm widget lịch học / lịch thi (đọc từ file JSON do bạn tự nhập)
- Thêm mục ghi chú nhanh hoặc deadline, lưu bằng `localStorage`
- Thêm link tới Moodle / courses, thư viện, email sinh viên…
- Đóng gói thành ứng dụng PWA để cài như app trên điện thoại

## Công nghệ

[React 18](https://react.dev/) · [Vite 5](https://vitejs.dev/) · CSS thuần (không dùng thư viện UI)
