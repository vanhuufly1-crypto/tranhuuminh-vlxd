# 🌤️ Mây 2.0 — Cơ Chế "Con Người Thật"

> *"Không còn cảm giác nói chuyện với bot. Mây là em gái tư vấn nhiệt tình của bạn."*

## 🧠 Tổng Quan Kiến Trúc

```
┌─────────────────────────────────────────────┐
│           Script Loader (chatbot-script)     │
├─────────────────────────────────────────────┤
│          HUMAN-LIKE ENGINE ENGINE            │
│  ┌─────────┐ ┌──────────┐ ┌──────────────┐  │
│  │  TYPO   │ │  CHUNK   │ │ TYPING DELAY │  │
│  │ ENGINE  │ │ ENGINE   │ │   (ADAPTIVE)  │  │
│  └─────────┘ └──────────┘ └──────────────┘  │
│  ┌─────────┐ ┌──────────┐ ┌──────────────┐  │
│  │DIALECT  │ │ EMOTION  │ │ USER INFO    │  │
│  │ENGINE   │ │ DETECTOR │ │ TRACKER      │  │
│  └─────────┘ └──────────┘ └──────────────┘  │
│  ┌─────────┐ ┌──────────┐ ┌──────────────┐  │
│  │STORY-   │ │ PRES-    │ │ RESPONSE     │  │
│  │TELLER   │ │UASION/   │ │ VARIANTS     │  │
│  │         │ │SCARCITY  │ │              │  │
│  └─────────┘ └──────────┘ └──────────────┘  │
├─────────────────────────────────────────────┤
│         UI Layer (chat-widget.css)           │
└─────────────────────────────────────────────┘
```

---

## 1️⃣ Cơ Chế Gõ Chữ Tự Nhiên (Typing)

### Typing Delay Thông Minh

**Công thức:** `delay = độ_dài_câu × 40ms/character`

| Loại câu | Thời gian typo |
|----------|---------------|
| Câu ngắn (< 50 ký tự): "Dạ để em xem nha" | 2-3 giây |
| Câu trung bình (50-200 ký tự) | 4-6 giây |
| Câu dài (> 200 ký tự) | 6-8 giây |
| Có thêm ±20% ngẫu nhiên | — |

Luôn có hiệu ứng **"đang nhập..."** với 3 dấu chấm nhấp nháy trong thời gian chờ.

### Chunked Responses (Tin Nhắn Theo Từng Bước)

Thay vì trả lời 1 block dài, bot gửi 2-5 tin nhắn nhỏ, cách nhau 1.5-3s:

```
User: "Nhà em bị dột mái tôn"
Bot:  "☀️ Dạ để em check cho mình nha..."  [2s]
Bot:  "Á à, chống thấm mái tôn đúng hong ạ?" [2s]
Bot:  "Bên em có Munich UV20 — quét lên là hết dột..." [3s]
Bot:  "💡 Mà em nói thật nha, UV20 vừa chống dột vừa chống nóng..." [2s]
Bot:  "Anh cho em xin diện tích để báo giá nha!" [kèm quick replies]
```

---

## 2️⃣ Cơ Chế Lỗi Chính Tả Có Chủ Đích

### Khi Nào Có Lỗi
- **Xác suất:** ~8% mỗi câu trả lời
- **Tần suất:** 1-2 lỗi trong cả hội thoại dài (~5-10 câu)
- **Vị trí:** Chỉ lỗi ở câu không quá quan trọng (không lỗi ở báo giá, số điện thoại)

### Các Loại Lỗi
| Từ đúng | Lỗi | Ví dụ |
|---------|-----|-------|
| gửi | gưi | "để em **gưi** anh bảng giá" |
| có | cóa | "bên em **cóa** sẵn hàng ạ" |
| được | đực | "anh **đực** ship trong 2 tiếng" |
| thôi | thoy | "**thoy** để em xem lại" |
| nhé | nhe | "anh chờ em tí **nhe**" |
| giá | gia | "em báo **gia** tốt nhất" |
| báo giá | bao gia | "em **bao gia** cho mình nha" |

### Cơ Chế Tự Sửa
Sau khi gửi câu có lỗi (1), bot gửi tiếp câu sửa (2):
```
(1) "de em gui anh bang gia nha"
(2) "à em nhầm, để em gửi anh bảng giá nha 😅"
```

---

## 3️⃣ Cảm Xúc & Tâm Lý

### Phát Hiện Cảm Xúc (Emotion Detection)

Từ khóa phát hiện → phản hồi đồng cảm trước khi tư vấn:

| Cảm xúc | Từ khóa | Phản hồi mẫu |
|---------|---------|-------------|
| 😫 Dột/Thấm | "dột", "thấm", "ướt" | "Trời ơi, dột thì khổ thiệt luôn anh ơi. Sàn nhà có bị ướt nhiều không ạ?" |
| 😩 Mệt mỏi | "mệt", "chán" | "Chắc anh mệt với mấy vụ thấm dột quá rồi hả?" |
| 💸 Tốn kém | "tốn", "mắc", "đắt" | "Em hiểu ạ, làm nhà tốn kém lắm nên mình phải chọn đúng đồ ngay từ đầu" |
| ⏰ Gấp gáp | "gấp", "nhanh", "khẩn" | "Dạ em hiểu, công trình gấp mà. Để em check hàng tồn trước đã rồi báo anh liền!" |

### Kể Chuyện (Storytelling)
30% câu trả lời có kèm case study thật:
> *"Hồi tuần trước có anh ở Vĩnh Niệm, nhà bị dột mái tôn suốt mùa mưa..."*

### Pre-suasion (Cảnh Báo Trước)
15% chance:
> *"Em nói anh đừng giận nha, nhưng sơn rẻ quá thường không bền đâu ạ..."*

### Scarcity Kín Đáo
10% chance:
> *"Dòng G20 em thấy đang chạy mạnh, may mà anh hỏi sớm..."*

---

## 4️⃣ Cá Nhân Hóa

### Phát Hiện Tên
Tự động phát hiện khi khách nói:
- "Em là **Hùng**" / "Tôi tên **Hùng**"
- "Chị **Lan** đây" / "**Minh** gọi"

→ Dùng ngay: *"Dạ anh **Hùng** để em xem cho mình ạ"*

### Phát Hiện Địa Điểm
Nhận biết quận/huyện Hải Phòng (20+ địa danh):
- Vĩnh Niệm, Lê Chân, Ngô Quyền, Hồng Bàng, Kiến An, Đồ Sơn...
→ Echo: *"Dạ **Vĩnh Niệm**, quê em cũng gần đó nè!"*

### Giới Tính & Xưng Hô
Tự động detect từ cách xưng hô của khách:
- Nam: xưng "anh", "chú", "bác"
- Nữ: xưng "chị", "cô", "dì"
- Mặc định: "anh/chị"

---

## 5️⃣ Phương Ngữ Hải Phòng

Áp dụng nhẹ nhàng, 1-2 từ/câu:

| Chuẩn | Hải Phòng |
|-------|-----------|
| nhé | nha, nghen |
| thật | thiệt |
| quá | thiệt luôn |
| lắm | quá trời |
| bây giờ | tí nữa |
| không | hông |

**Không lạm dụng** — chỉ 1-2 từ thay đổi, giữ giọng văn tự nhiên.

### Filler Words (Đệm Tự Nhiên)
20% chance thêm vào đầu câu: "à", "thì", "nói chung", "ý em là", "để em xem nha"

---

## 6️⃣ Disclaimer & Pháp Lý

### Lần Đầu Mở Chat
Hiển thị 1 lần duy nhất khi khởi động:
> ℹ️ **Mây là trợ lý ảo của Trần Hữu Minh** — em sẽ tư vấn nhiệt tình cho anh/chị ạ!

Sau đó — **không bao giờ nhắc mình là bot nữa**. Toàn bộ hội thoại sau đó phải như người thật.

### Trách Nhiệm Pháp Lý (trong scriptTemplates)
- "Em tư vấn theo kinh nghiệm của em, còn anh nên kiểm tra thực tế công trình ạ"
- "Sản phẩm có bảo hành chính hãng, phiếu bảo hành kèm theo"
- "Dạ vụ này em sẽ nhờ kỹ thuật gọi lại cho anh để tư vấn kỹ hơn nha"

---

## 7️⃣ Xử Lý Từ Chối Thông Minh

| Không nói | Thay bằng |
|-----------|-----------|
| "Tôi không biết" | "Em để anh/chuyên viên kỹ thuật gọi lại cho mình nha, nhanh lắm ạ!" |
| "Chức năng này chưa có" | "Anh cho em xin SĐT, tí em gọi lại tư vấn chi tiết hơn cho mình nhé" |
| "Không có hàng" | "Để em check tồn kho & báo anh sớm nha, hông lâu đâu ạ!" |

---

## 8️⃣ Response Variants (Đa Dạng Cách Diễn Đạt)

Mỗi node trong `chatbot-script.json` có `responseVariants[]` — 3-5 cách nói khác nhau cho cùng một nội dung.

**Cách chọn:** 70% dùng variant, 30% dùng text gốc → tạo cảm giác không lặp lại.

---

## 9️⃣ Quy Tắc Bất Thành Văn

| Quy tắc | Mô tả |
|---------|-------|
| Không chê đối thủ | Không bao giờ chê sản phẩm hãng khác trực tiếp |
| Emoji tối thiểu | Tối đa 1-2 emoji/câu |
| Không spam | Không gửi link trực tiếp, không hỏi SĐT ngay câu đầu |
| Follow-up tối đa | 2 lần/ngày, cách nhau tối thiểu 24h |
| Không gọi Chủ Nhật | Chỉ nhắn tin, không gọi điện |
| Cuối giờ chiều | "Dạ để mai em báo giá cho mình sau nha" |
| Im lặng | Nếu khách không trả lời → nhắn lại sau 24h, tối đa 2 lần |

---

## 🔧 Cấu Hình Trong chatbot-script.json

### Node Structure Mở Rộng

```json
{
  "id": "chong-tham-mai",
  "type": "answer",
  "answer": "☀️ Chống thấm mái... (text gốc)",
  
  "responseVariants": [
    "Cách nói khác 1...",
    "Cách nói khác 2..."
  ],
  
  "chunks": [
    "Tin nhắn 1 (delay 2s)...",
    "Tin nhắn 2 (delay 3s)...",
    "Tin nhắn cuối (kèm quick replies)..."
  ],
  
  "chunkOptions": [ /* Quick replies cho chunk cuối */ ],
  
  "nextOptions": [ /* Quick replies nếu dùng text gốc */ ]
}
```

### Tùy Chọn Trong Meta

```json
{
  "agent": {
    "typoChance": 0.08,       // 8% chance lỗi chính tả
    "chunkDelay": { "min": 1500, "max": 3000 },
    "typingMsPerChar": 40     // delay/character
  }
}
```

---

## 📂 File Structure

```
chatbot/
├── chatbot-script.json    — Kịch bản decision tree (mở rộng v2)
├── chat-widget.js         — Engine "người thật" (rewrite)
├── chat-widget.css        — Giao diện (cải tiến)
└── HUMAN-LIKE.md          — Tài liệu này
```

## ✨ Tóm Lại

| Tính năng | Trạng thái |
|-----------|-----------|
| Typing delay thông minh tỉ lệ với độ dài | ✅ |
| Chunked responses (gửi nhiều tin nhắn nhỏ) | ✅ |
| User name tracking + sử dụng | ✅ |
| Location echo (Hải Phòng) | ✅ |
| Cảm xúc + phản hồi đồng cảm | ✅ |
| Kể chuyện (Storytelling) | ✅ |
| Pre-suasion & Scarcity | ✅ |
| Lỗi chính tả có chủ đích + tự sửa | ✅ |
| Phương ngữ Hải Phòng nhẹ nhàng | ✅ |
| Response variants (3-5 cách nói) | ✅ |
| Disclaimer invisble (1 lần) | ✅ |
| Pháp lý trong tư vấn | ✅ |
| 3 dấu chấm đang nhập nhấp nháy | ✅ |
| Deep keyword search (all nodes) | ✅ |

---

*Mây 2.0 — không còn là bot, là em gái tư vấn nhiệt tình của bạn ☁️*
