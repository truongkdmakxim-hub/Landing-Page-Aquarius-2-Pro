# Kết nối form Landing Page → Google Sheet

Mất khoảng 5 phút, chỉ cần làm 1 lần.

## Bước 1 – Tạo Google Sheet
1. Vào https://sheets.new (đăng nhập tài khoản Google của Makxim).
2. Đặt tên file, ví dụ: **Lead – Aquarius 2 PRO**.

## Bước 2 – Dán Apps Script
1. Trong Sheet: **Tiện ích mở rộng → Apps Script**.
2. Xoá nội dung mặc định trong `Code.gs`, dán toàn bộ nội dung file `Code.gs` trong thư mục này.
3. (Tuỳ chọn) Muốn nhận email khi có đăng ký mới: sửa dòng
   `const NOTIFY_EMAIL = '';` thành `const NOTIFY_EMAIL = 'email@cua-ban.vn';`
4. Bấm **Lưu** (biểu tượng đĩa mềm).

## Bước 3 – Chạy setup lần đầu
1. Ở thanh trên, chọn hàm **setup** → bấm **Chạy**.
2. Google hỏi cấp quyền → **Xem xét quyền** → chọn tài khoản → **Nâng cao → Đi tới dự án (không an toàn)** → **Cho phép**.
   (Cảnh báo này xuất hiện vì script do bạn tự tạo, chưa qua xét duyệt của Google – bình thường.)
3. Quay lại Sheet: sẽ có trang tính **"Đăng ký tư vấn"** với dòng tiêu đề màu xanh.

## Bước 4 – Triển khai Web App
1. Trong Apps Script: **Triển khai → Tùy chọn triển khai mới**.
2. Bấm biểu tượng bánh răng → chọn **Ứng dụng web**.
3. Thiết lập:
   - **Thực thi dưới dạng:** Tôi (email của bạn)
   - **Người có quyền truy cập:** **Bất kỳ ai**
4. Bấm **Triển khai** → sao chép **URL ứng dụng web** (dạng `https://script.google.com/macros/s/.../exec`).

## Bước 5 – Gắn URL vào website
Mở `index.html`, tìm dòng:

```js
const SHEET_ENDPOINT='';
```

Dán URL vào giữa hai dấu nháy:

```js
const SHEET_ENDPOINT='https://script.google.com/macros/s/XXXX/exec';
```

Lưu file → điền thử form → kiểm tra dòng mới trong Sheet.

## Lưu ý
- **Sửa code Apps Script sau này:** phải vào **Triển khai → Quản lý việc triển khai → Chỉnh sửa → Phiên bản: Phiên bản mới → Triển khai** thì thay đổi mới có hiệu lực (URL giữ nguyên).
- Cột **Trạng thái** mặc định là "Mới" – đội sale có thể đổi thành "Đã gọi", "Hẹn khảo sát", "Đã chốt"…
- Form có bẫy chống spam ẩn và chặn chèn công thức vào Sheet.
- Link quảng cáo có `?utm_source=facebook&utm_campaign=...` sẽ được ghi lại để đo hiệu quả từng kênh.
