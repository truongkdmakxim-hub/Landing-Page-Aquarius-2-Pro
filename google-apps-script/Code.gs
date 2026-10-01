/**
 * Nhận đăng ký tư vấn từ Landing Page Aquarius 2 PRO và ghi vào Google Sheet.
 *
 * Cách dùng: mở Google Sheet → Tiện ích mở rộng → Apps Script → dán toàn bộ file này
 * → chạy hàm setup() một lần → Triển khai (Deploy) dạng Ứng dụng web.
 * Xem hướng dẫn chi tiết trong HUONG-DAN.md.
 */

const SHEET_NAME = 'Đăng ký tư vấn';

// Email nhận thông báo khi có đăng ký mới. Để trống '' nếu không cần.
const NOTIFY_EMAIL = '';

const HEADERS = [
  'Thời gian', 'Họ và tên', 'Số điện thoại', 'Tỉnh / Thành phố',
  'Nguồn nước', 'Sản phẩm', 'Trang gửi', 'UTM Source', 'UTM Campaign', 'Trạng thái'
];

/** Chạy một lần để tạo trang tính và dòng tiêu đề. */
function setup() {
  const sheet = getSheet_();
  SpreadsheetApp.getActive().setActiveSheet(sheet);
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const p = (e && e.parameter) || {};

    // Bẫy spam: trường ẩn "website" phải để trống
    if (p.website) return json_({ ok: true });

    const name = clean_(p.name, 100);
    const phone = clean_(p.phone, 20).replace(/\s/g, '');
    if (!name || !/^0\d{9,10}$/.test(phone)) {
      return json_({ ok: false, error: 'invalid' });
    }

    const row = [
      new Date(), name, "'" + phone, clean_(p.area, 100), clean_(p.source, 50),
      clean_(p.product, 100), clean_(p.page, 300), clean_(p.utm_source, 100),
      clean_(p.utm_campaign, 100), 'Mới'
    ];
    getSheet_().appendRow(row);

    if (NOTIFY_EMAIL) {
      MailApp.sendEmail(
        NOTIFY_EMAIL,
        '[Aquarius 2 PRO] Đăng ký mới: ' + name + ' – ' + phone,
        HEADERS.slice(1, 6).map((h, i) => h + ': ' + String(row[i + 1]).replace(/^'/, '')).join('\n')
      );
    }
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return json_({ ok: true, message: 'Aquarius lead endpoint đang hoạt động' });
}

function getSheet_() {
  const ss = SpreadsheetApp.getActive();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length)
      .setFontWeight('bold').setBackground('#003f87').setFontColor('#ffffff');
    sheet.setFrozenRows(1);
    sheet.getRange('A:A').setNumberFormat('dd/MM/yyyy HH:mm:ss');
    sheet.setColumnWidths(1, HEADERS.length, 160);
  }
  return sheet;
}

// Cắt độ dài và chặn công thức (=, +, -, @) để tránh chèn công thức vào Sheet
function clean_(v, max) {
  let s = String(v || '').trim().slice(0, max);
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return s;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
