# Hướng dẫn tích hợp Chatbot Mây ☁️ — Trần Hữu Minh

> **Phiên bản:** 1.0.0  
> **Ngày cập nhật:** 02/05/2026  
> **Liên hệ:** 0378.679.633

---

## Mục lục

1. [Cấu trúc thư mục](#1-cấu-trúc-thư-mục)
2. [Tích hợp nhanh (2 phút)](#2-tích-hợp-nhanh-2-phút)
3. [Tích hợp nâng cao](#3-tích-hợp-nâng-cao)
4. [Tuỳ chỉnh giao diện](#4-tuỳ-chỉnh-giao-diện)
5. [Tuỳ chỉnh kịch bản](#5-tuỳ-chỉnh-kịch-bản)
6. [Public API](#6-public-api)
7. [Xử lý sự cố](#7-xử-lý-sự-cố)
8. [Ghi chú kỹ thuật](#8-ghi-chú-kỹ-thuật)

---

## 1. Cấu trúc thư mục

Sau khi copy toàn bộ thư mục `chatbot/` vào website, cấu trúc sẽ như sau:

```
your-website/
├── chatbot/
│   ├── chatbot-script.json     # Kịch bản decision tree (có thể sửa)
│   ├── chat-widget.css         # Giao diện chat widget
│   ├── chat-widget.js          # Engine chat (không cần sửa)
│   ├── chat-widget.html        # Trang demo (không bắt buộc)
│   └── INTEGRATION.md          # File này
├── index.html                  # Trang web của bạn
└── ...
```

---

## 2. Tích hợp nhanh (2 phút)

### Bước 1: Thêm CSS & JS

Thêm vào cuối thẻ `<body>` của trang web (trước thẻ `</body>`):

```html
<!-- Chatbot Mây - VLXD Trần Hữu Minh -->
<link rel="stylesheet" href="/chatbot/chat-widget.css">
<script src="/chatbot/chat-widget.js"></script>
```

### Bước 2: Kiểm tra

- Mở trang web, bạn sẽ thấy **nút tròn màu xanh** xuất hiện ở góc dưới bên phải sau 3 giây.
- Click vào nút để mở chat widget.
- Nếu không thấy, kiểm tra console trình duyệt (F12 → Console) xem có lỗi không.

### Tuỳ chọn: Gắn kịch bản inline (nếu không muốn load JSON riêng)

```html
<link rel="stylesheet" href="/chatbot/chat-widget.css">
<script>
  window.__THM_CHATBOT_SCRIPT = { /* nội dung file chatbot-script.json */ };
</script>
<script src="/chatbot/chat-widget.js"></script>
```

---

## 3. Tích hợp nâng cao

### 3.1 Tự động mở chat khi khách hàng vào trang

```html
<script>
  window.addEventListener('load', function() {
    // Mở chat sau 5 giây
    setTimeout(function() {
      if (window.THM_Chat) {
        window.THM_Chat.open();
      }
    }, 5000);
  });
</script>
```

### 3.2 Gửi thông báo có tin nhắn mới từ admin

```javascript
// Hiện badge trên nút launcher
window.THM_Chat.showBadge('Bạn có tin nhắn mới!');
```

### 3.3 Reset chat về đầu

```javascript
window.THM_Chat.reset();
```

### 3.4 Theo dõi lịch sử hội thoại (tích hợp CRM)

```javascript
// Lấy lịch sử chat
const history = window.THM_Chat.getState().history;
// Gửi về server của bạn
fetch('/api/save-chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    sessionId: '...',
    history: history,
    user: { name, phone }
  })
});
```

---

## 4. Tuỳ chỉnh giao diện

### 4.1 Biến CSS (không cần sửa file CSS gốc)

Thêm vào CSS của bạn **SAU** khi load `chat-widget.css`:

```css
:root {
  /* Màu chủ đạo */
  --thm-primary: #1a73e8;       /* Màu xanh chính */
  --thm-accent: #ff6b35;        /* Màu cam cho user */
  --thm-green: #34a853;         /* Màu nút gọi */
  --thm-zalo: #0068ff;          /* Màu nút Zalo */

  /* Kích thước */
  --thm-width: 380px;           /* Chiều rộng widget */
  --thm-height: 600px;          /* Chiều cao widget */
}
```

### 4.2 Theme tối

Thêm class `thm-dark` vào widget:

```css
.thm-chat-widget.thm-dark {
  --thm-bg: #1c1e21;
  --thm-chat-bg: #242526;
  --thm-text: #e4e6eb;
  --thm-text-muted: #b0b3b8;
  --thm-border: #3e4042;
  --thm-bubble-bot: #3e4042;
}
```

### 4.3 Thay đổi thông tin cửa hàng

Trong file `chat-widget.js`, sửa phần `CONFIG`:

```javascript
const CONFIG = {
  phone: '0378.679.633',          // Số điện thoại
  zalo: '0378.679.633',           // Zalo ID
  storeName: 'VLXD Trần Hữu Minh', // Tên cửa hàng
  agentName: 'Mây',               // Tên bot
  typingMin: 2000,                // Delay tối thiểu (ms)
  typingMax: 4000,                // Delay tối đa (ms)
};
```

---

## 5. Tuỳ chỉnh kịch bản

### 5.1 Cấu trúc file JSON

File `chatbot-script.json` chứa toàn bộ kịch bản tư vấn dạng cây.

```json
{
  "nodes": {
    "root": {
      "id": "root",
      "type": "question",          // question | answer | input | info
      "question": "Nội dung câu hỏi...",
      "options": [                  // Dùng cho type=question
        { "text": "Nút chọn", "next": "node-id", "keywords": ["từ khóa"] }
      ],
      "answer": "Nội dung trả lời...",
      "nextOptions": [              // Dùng cho type=answer
        { "text": "Nút tiếp theo", "next": "node-id" }
      ]
    }
  },
  "fallback": { /* node mặc định khi không hiểu */ },
  "scriptTemplates": {
    "welcome": [ "..." ],
    "reassurance": [ "..." ],
    "priceObjection": [ "..." ],
    "closing": [ "..." ]
  }
}
```

### 5.2 Thêm node mới

Ví dụ thêm node tư vấn sơn chống nóng:

```json
{
  "nodes": {
    "root": {
      ...
      "options": [
        ...
        { "text": "☀️ Sơn chống nóng", "next": "chong-nong", "keywords": ["chống nóng", "nóng", "cách nhiệt"] }
      ]
    },
    "chong-nong": {
      "id": "chong-nong",
      "type": "answer",
      "answer": "☀️ **Sơn chống nóng:**\n\nMunich UV20 — giảm 5-28°C, phù hợp mái tôn.\nBảo hành 5 năm. Định mức 8-10m²/lít.\n\nAnh/chị cần cho mái diện tích bao nhiêu ạ?",
      "nextOptions": [
        { "text": "📄 Báo giá", "next": "bao-gia" },
        { "text": "🏠 Về menu", "next": "root" }
      ]
    }
  }
}
```

### 5.3 Sử dụng Markdown trong nội dung

Bot message hỗ trợ các định dạng:

- `**Bold**` → **Bold**
- `*Italic*` → *Italic*
- `Dòng\nDòng` → Xuống dòng
- `Dòng trống\n\nDòng mới` → Paragraph mới
- `• Item 1\n• Item 2` → Danh sách
- `1. Mục 1\n2. Mục 2` → Danh sách đánh số

---

## 6. Public API

Sau khi widget được tải, bạn có thể điều khiển qua `window.THM_Chat`:

| Method | Mô tả |
|--------|-------|
| `THM_Chat.open()` | Mở chat widget |
| `THM_Chat.close()` | Đóng chat widget |
| `THM_Chat.toggle()` | Bật/tắt chat widget |
| `THM_Chat.sendMessage(text)` | Gửi tin nhắn từ code |
| `THM_Chat.navigate(nodeId)` | Điều hướng đến node cụ thể |
| `THM_Chat.getState()` | Lấy trạng thái hiện tại (node, lịch sử) |
| `THM_Chat.reset()` | Reset chat về đầu |

---

## 7. Xử lý sự cố

### Không thấy nút chat
- **Nguyên nhân:** Widget chưa được kích hoạt hoặc có lỗi JS.
- **Kiểm tra:** Mở F12 → Console, xem có thông báo `[Mây] Chatbot ready ☁️` không.
- **Giải pháp:** Đảm bảo bạn đã thêm cả CSS và JS, và đường dẫn đúng.

### Không load được kịch bản
- **Nguyên nhân:** File `chatbot-script.json` không tồn tại hoặc sai đường dẫn.
- **Kiểm tra:** F12 → Network → tìm `chatbot-script.json`, xem có 404 không.
- **Giải pháp:** 
  - Kiểm tra đường dẫn file (đang mặc định là `/chatbot/chatbot-script.json`)
  - Hoặc dùng `window.__THM_CHATBOT_SCRIPT` để inline script.

### Nút gọi Zalo không hoạt động
- **Nguyên nhân:** Zalo chặn popup hoặc sai số điện thoại.
- **Kiểm tra:** Sửa `CONFIG.zalo` trong `chat-widget.js`.
- **Giải pháp:** Dùng link `https://zalo.me/{SĐT}`.

### Widget hiển thị sai trên mobile
- **Nguyên nhân:** Thiếu viewport meta.
- **Giải pháp:** Đảm bảo trang của bạn có `<meta name="viewport" content="width=device-width, initial-scale=1">`.

---

## 8. Ghi chú kỹ thuật

### Tương thích
- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+
- ✅ Opera 67+
- ✅ iOS Safari 12+
- ✅ Android Chrome 80+

### Dung lượng
- `chat-widget.css`: ~10KB
- `chat-widget.js`: ~22KB
- `chatbot-script.json`: ~33KB (có thể nén)
- **Tổng:** ~65KB

### Performance
- Widget sử dụng CSS animations nhẹ, không ảnh hưởng đến FPS.
- Không có dependency bên ngoài (không jQuery, không thư viện).
- Lazy load: chỉ tải khi DOM sẵn sàng.

### Bảo mật
- Widget không thu thập dữ liệu cá nhân nếu không được cung cấp.
- Lịch sử chat được lưu trong session của trình duyệt, không có backend.
- Có thể tích hợp gửi dữ liệu về CRM riêng qua Public API.

---

*Cần hỗ trợ tích hợp? Gọi ngay **0378.679.633** hoặc nhắn tin qua website!* ☁️
