# 🎯 KẾ HOẠCH 3 BOT — VLHT Trần Hữu Minh

## 💰 TẾT KIỆM API

| Giải pháp | Mô tả | Tiết kiệm |
|-----------|-------|:----------:|
| **Dùng Ollama local** | Model nhỏ chạy local (miễn phí) cho tác vụ đơn giản | 100% |
| **Cache kết quả** | Lưu kết quả API vào file, nếu cùng câu hỏi → lấy từ cache | 30-50% |
| **Model nhỏ cho việc nhỏ** | Dùng DeepSeek nhỏ hoặc Ollama khi không cần suy luận sâu | 40-60% |
| **Batch request** | Gộp nhiều câu hỏi vào 1 lần gọi | 20-30% |
| **Giới hạn context** | Chỉ giữ lại lịch sử cần thiết | 30% |

**Cách dùng kết hợp:**
- Bot tư vấn web (Bot 3): Dùng Ollama local + cache → 0đ API
- Bot hoạt hình (Bot 1): Ollama local cho kịch bản + Blender local
- Bot bản vẽ (Bot 2): Chạy hoàn toàn local (Blender + Python)

---

## 🤖 BOT 1 — PHIM HOẠT HÌNH 3D QUẢNG CÁO

### Công cụ
- **Blender 5.0.1** (local, free) — dựng 3D, render
- **Ollama + LLaVA** (local) — viết kịch bản, mô tả cảnh
- **ffmpeg** (local) — ghép video
- **Whisper** (local) — text-to-speech

### Kế hoạch học & làm
| Ngày | Học | Làm |
|:----:|-----|-----|
| Đêm nay | Setup scene Blender cơ bản | Dựng mô hình nhà 3D có sẵn |
| Sáng mai | Học animate camera + vật liệu | Render video 15s quay quanh nhà |
| Trưa mai | Học thêm nhân vật hoạt hình | Thêm nhân vật stickman vào cảnh |
| Tối mai | Học render animation | Xuất video hoàn chỉnh đầu tiên |

### Quy trình tạo video
```
Kịch bản (Ollama local)
    → Dựng cảnh (Blender Python)
    → Render từng frame (Blender Cycles)
    → Ghép video (ffmpeg)
    → Thêm giọng (Whisper TTS)
    → Xuất MP4
```

---

## 🤖 BOT 2 — BẢN VẼ KỸ THUẬT

### Công cụ
- **Blender 5.0.1** (local) — render 3D
- **matplotlib** (local) — vẽ mặt bằng 2D
- **ezdxf** (local) — xuất file AutoCAD
- **Ollama** (local) — gợi ý bố trí phòng

### Kế hoạch học & làm
| Ngày | Học | Làm |
|:----:|-----|-----|
| Đêm nay | Cấu trúc bản vẽ mặt bằng + ký hiệu | Vẽ lại mặt bằng 6x16 đẹp hơn |
| Sáng mai | Tỷ lệ, kích thước, ký hiệu TCVN | Thêm kích thước đầy đủ |
| Trưa mai | Vẽ mặt cắt, mặt đứng | Vẽ mặt cắt A-A, mặt đứng |
| Tối mai | Xuất file DXF hoàn chỉnh | File AutoCAD mở được |

### Quy trình vẽ
```
Thông số khách → Ollama gợi ý bố trí
    → Vẽ mặt bằng (matplotlib/ezdxf)
    → Vẽ mặt đứng + mặt cắt
    → Render 3D phối cảnh (Blender)
    → Xuất bộ hồ sơ (DXF + PNG + PDF)
```

---

## 🤖 BOT 3 — TƯ VẤN SẢN PHẨM & KHÁCH HÀNG

### Công cụ
- **Ollama local** (chạy 24/7, 0đ) — xử lý câu hỏi
- **Database kiến thức** (file JSON) — giá sản phẩm, thông số
- **Web widget** — chat trên website

### Kế hoạch học & làm
| Ngày | Học | Làm |
|:----:|-----|-----|
| Đêm nay | Thu thập database sản phẩm + giá | File JSON 200+ sản phẩm |
| Sáng mai | Lập trình bot chat | Widget chat trên web |
| Trưa mai | Học xử lý từ chối, khiếu nại | Script xử lý tình huống |
| Tối mai | Hoàn thiện + test | Bot chạy thử trên web |

### Database sản phẩm mẫu
```json
{
  "munich_luxury_5l": {
    "ten": "Sơn Munich Luxury Siêu bóng 5L",
    "gia": "983.333đ",
    "hang": "Munich",
    "dung_tich": "5 lít",
    "dung_cho": "Nội thất, siêu bóng, lau chùi được",
    "bao_hanh": "5 năm",
    "key": ["munich", "luxury", "siêu bóng", "5 lít"]
  }
}
```

### Xử lý từ chối & khiếu nại
- **Từ chối giá:** "Em hiểu, giá đó hơi cao. Anh xem dòng Action siêu mịn chỉ 466k/5L, chất lượng vẫn tốt"
- **Khiếu nại sơn bong:** "Anh cho em xin ảnh hiện trạng, em kiểm tra nguyên nhân và có hướng xử lý ngay"
- **So sánh:** "Munich Luxury 5L giá 983k, Jotun Essence 5L giá 1.815k. Munich chất lượng tốt, giá mềm hơn"

---

## 📊 PHÂN BỔ THỜI GIAN ĐÊM NAY

| Giờ | Bot 1 (3D) | Bot 2 (Bản vẽ) | Bot 3 (Tư vấn) |
|:---:|:----------:|:--------------:|:--------------:|
| 23h30 | Setup Blender scene | — | — |
| 00h00 | — | Vẽ mặt bằng 2D đẹp | — |
| 00h30 | Render 3D | — | — |
| 01h00 | — | Thêm kích thước | — |
| 01h30 | — | — | Database sản phẩm |
| 02h00 | — | — | Script tư vấn |
| ... | (làm đến khi mệt) | | |

---

**⚠️ KHÔNG hỏi "có được không" — LÀM và SỬA**
